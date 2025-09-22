// hooks/useNotifications.js - SAFE REAL-TIME LISTENER
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
    collection,
    doc,
    onSnapshot,
    query,
    where,
    limit,
    updateDoc
} from 'firebase/firestore'
import { db } from '../../features/notification/firebase-config'
import { notification } from 'antd'
import { useSelector } from 'react-redux'

export default function useNotifications(maxNotifications = 5) {
    const reduxUser = useSelector((state) => state.auth.user)

    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Refs để tránh re-render và cleanup an toàn
    const unsubscribeRef = useRef(null)
    const isInitialLoadRef = useRef(true)
    const isMountedRef = useRef(true)
    const userIDRef = useRef(null)

    const userID = reduxUser?.id

    // console.log('=== USER DEBUG ===')
    // console.log('Redux user:', reduxUser)
    // console.log('userID:', userID)

    const unreadCount = useMemo(() =>
        notifications.reduce((count, notif) =>
            notif.isRead ? count : count + 1, 0
        ), [notifications]
    )

    // Cleanup function an toàn
    const cleanupListener = useCallback(() => {
        if (unsubscribeRef.current) {
            // console.log('🧹 Cleaning up Firestore listener')
            try {
                unsubscribeRef.current()
            } catch (error) {
                console.warn('Warning during listener cleanup:', error)
            }
            unsubscribeRef.current = null
        }
    }, [])

    // Setup real-time listener
    const setupListener = useCallback(() => {
        // Cleanup previous listener first
        cleanupListener()

        if (!userID) {
            console.log('❌ No userID, skipping listener setup')
            setNotifications([])
            setIsLoading(false)
            return
        }

        // Prevent setup nếu userID chưa thay đổi
        if (userIDRef.current === userID && unsubscribeRef.current) {
            // console.log('ℹ️ Listener already exists for this userID')
            return
        }

        // console.log('🔔 Setting up real-time listener for userID:', userID)
        userIDRef.current = userID
        setIsLoading(true)
        setError(null)
        isInitialLoadRef.current = true

        try {
            // Query đơn giản không cần composite index
            const notificationsQuery = query(
                collection(db, 'notifications'),
                where('recipientID', '==', userID),
                limit(maxNotifications)
            )

            // console.log('🎧 Creating onSnapshot listener...')

            const unsubscribe = onSnapshot(
                notificationsQuery,
                (snapshot) => {
                    // Check nếu component đã unmount
                    if (!isMountedRef.current) {
                        console.log('⚠️ Component unmounted, ignoring snapshot')
                        return
                    }

                    console.log('📨 Snapshot received:', {
                        size: snapshot.size,
                        fromCache: snapshot.metadata.fromCache,
                        hasPendingWrites: snapshot.metadata.hasPendingWrites
                    })

                    try {
                        // Process notifications
                        let newNotifications = snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }))

                        // Sort client-side
                        newNotifications = newNotifications.sort((a, b) => {
                            const aTime = a.createdAt?.toDate?.() || a.createdAt || new Date(0)
                            const bTime = b.createdAt?.toDate?.() || b.createdAt || new Date(0)
                            return bTime - aTime // Newest first
                        })

                        setNotifications(newNotifications)
                        setIsLoading(false)

                        // Show toast cho notifications mới (chỉ sau initial load)
                        if (!isInitialLoadRef.current && !snapshot.metadata.fromCache) {
                            const addedDocs = snapshot.docChanges().filter(change =>
                                change.type === 'added' && !change.doc.metadata.hasPendingWrites
                            )

                            if (addedDocs.length > 0) {
                                console.log('🔔 New notifications detected:', addedDocs.length)

                                addedDocs.forEach((change) => {
                                    const newNotif = change.doc.data()
                                    notification.success({
                                        message: `${newNotif.title}`,
                                        description: `${newNotif.message}`,
                                        placement: 'topRight',
                                        duration: 4
                                    })
                                })
                            }
                        }

                        // Mark initial load complete
                        if (isInitialLoadRef.current) {
                            isInitialLoadRef.current = false
                            console.log('✅ Initial load completed')
                        }

                    } catch (processError) {
                        console.error('❌ Error processing snapshot:', processError)
                        setError(processError)
                        setIsLoading(false)
                    }
                },
                (err) => {
                    if (!isMountedRef.current) return

                    console.error('❌ Listener error:', {
                        code: err.code,
                        message: err.message,
                        name: err.name
                    })

                    setError(err)
                    setIsLoading(false)

                    // Handle specific error types
                    if (err.code === 'failed-precondition') {
                        notification.error({
                            message: 'Cần tạo Firestore Index',
                            description: 'Vui lòng liên hệ admin để cấu hình database',
                            duration: 0
                        })
                    } else if (err.code === 'permission-denied') {
                        notification.error({
                            message: 'Không có quyền truy cập',
                            description: 'Vui lòng đăng nhập lại',
                            placement: 'topRight'
                        })
                    } else {
                        notification.error({
                            message: 'Lỗi kết nối',
                            description: err.message || 'Không thể tải thông báo',
                            placement: 'topRight'
                        })
                    }

                    // Auto-retry sau 5 giây nếu không phải permission error
                    if (err.code !== 'permission-denied') {
                        // console.log('🔄 Will retry in 5 seconds...')
                        setTimeout(() => {
                            if (isMountedRef.current && userIDRef.current === userID) {
                                console.log('🔄 Retrying listener setup...')
                                setupListener()
                            }
                        }, 5000)
                    }
                }
            )

            unsubscribeRef.current = unsubscribe
            // console.log('✅ Listener setup successful')

        } catch (setupError) {
            console.error('❌ Error setting up listener:', setupError)
            setError(setupError)
            setIsLoading(false)
        }
    }, [userID, maxNotifications, cleanupListener])

    // Effect để setup listener khi userID thay đổi
    useEffect(() => {
        isMountedRef.current = true

        if (userID) {
            setupListener()
        } else {
            cleanupListener()
            setNotifications([])
            setIsLoading(false)
        }

        // Cleanup khi component unmount hoặc userID thay đổi
        return () => {
            isMountedRef.current = false
            cleanupListener()
        }
    }, [userID, setupListener, cleanupListener])

    const markAsRead = useCallback(async (notificationId) => {
        // console.log('=== MARK AS READ ===')
        // console.log('userID:', userID)
        // console.log('notificationId:', notificationId)

        if (!userID || !notificationId) {
            console.log('❌ Missing userID or notificationId')
            return
        }

        try {
            // console.log('🔄 Updating notification...')
            const notificationRef = doc(db, 'notifications', notificationId)

            await updateDoc(notificationRef, {
                isRead: true,
                readAt: new Date()
            })

            // console.log('✅ Update successful')
            // Real-time listener sẽ tự động update UI

        } catch (err) {
            console.error('❌ Update failed:', err)

            notification.error({
                message: 'Lỗi đánh dấu đã đọc',
                description: err.message || 'Không thể đánh dấu thông báo đã đọc',
                placement: 'topRight'
            })

            // Optimistic update nếu real-time update fail
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, isRead: true }
                        : notif
                )
            )
        }
    }, [userID])

    const markAllAsRead = useCallback(async () => {
        // console.log('=== MARK ALL AS READ ===')

        if (!userID) {
            console.log('❌ No userID')
            return
        }

        const unreadNotifications = notifications.filter((n) => !n.isRead)
        if (unreadNotifications.length === 0) {
            console.log('ℹ️ No unread notifications')
            return
        }

        // console.log('📝 Marking', unreadNotifications.length, 'notifications as read')

        try {
            // Update từng notification
            const updatePromises = unreadNotifications.map(async (notif) => {
                const notificationRef = doc(db, 'notifications', notif.id)
                await updateDoc(notificationRef, {
                    isRead: true,
                    readAt: new Date()
                })
            })

            await Promise.all(updatePromises)
            // console.log('✅ All notifications marked as read')
            // Real-time listener sẽ tự động update UI

        } catch (err) {
            console.error('❌ Mark all failed:', err)
            notification.error({
                message: 'Lỗi đánh dấu đã đọc',
                description: err.message
            })
        }
    }, [userID, notifications])

    // Manual restart listener (for debugging)
    const restartListener = useCallback(() => {
        console.log('🔄 Manual listener restart')
        setupListener()
    }, [setupListener])

    // Debug info
    useEffect(() => {
        // console.log('=== STATE SUMMARY ===')
        // console.log('userID:', userID)
        // console.log('notifications count:', notifications.length)
        // console.log('unread count:', unreadCount)
        // console.log('isLoading:', isLoading)
        // console.log('has error:', !!error)
        // console.log('has listener:', !!unsubscribeRef.current)
        // console.log('is mounted:', isMountedRef.current)
    }, [userID, notifications.length, unreadCount, isLoading, error])

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
        restartListener, // For debugging
        userID // For debugging
    }
}