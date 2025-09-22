// contexts/NotificationsContext.jsx - SIMPLE OPTIMIZED
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
    collection,
    doc,
    onSnapshot,
    query,
    where,
    limit,
    updateDoc
} from 'firebase/firestore'
import { db } from '../features/notification/firebase-config'
import { notification } from 'antd'
import { useSelector } from 'react-redux'

const NotificationsContext = createContext()

export const useNotifications = (maxNotifications = 50) => {
    const context = useContext(NotificationsContext)
    if (!context) {
        throw new Error('useNotifications must be used within NotificationsProvider')
    }

    // Return subset based on maxNotifications parameter
    const { notifications, ...rest } = context
    const limitedNotifications = useMemo(() =>
        notifications.slice(0, maxNotifications),
        [notifications, maxNotifications]
    )

    return {
        ...rest,
        notifications: limitedNotifications
    }
}

export const NotificationsProvider = ({ children }) => {
    const reduxUser = useSelector((state) => state.auth.user)

    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Refs để tránh re-render và cleanup an toàn
    const unsubscribeRef = useRef(null)
    const isInitialLoadRef = useRef(true)
    const isMountedRef = useRef(true)
    const userIDRef = useRef(null)
    const cacheRef = useRef(new Map()) // Simple cache
    const lastFetchRef = useRef(0)

    const userID = reduxUser?.id

    const unreadCount = useMemo(() =>
        notifications.reduce((count, notif) =>
            notif.isRead ? count : count + 1, 0
        ), [notifications]
    )

    // Cleanup function
    const cleanupListener = useCallback(() => {
        if (unsubscribeRef.current) {
            try {
                unsubscribeRef.current()
            } catch (error) {
                console.warn('Warning during listener cleanup:', error)
            }
            unsubscribeRef.current = null
        }
    }, [])

    // Setup optimized listener
    const setupListener = useCallback(() => {
        cleanupListener()

        if (!userID) {
            setNotifications([])
            setIsLoading(false)
            return
        }

        // Check cache first (5 phút cache)
        const cacheKey = `notifications_${userID}`
        const cachedData = cacheRef.current.get(cacheKey)
        const now = Date.now()

        if (cachedData && (now - lastFetchRef.current) < 300000) { // 5 phút cache
            setNotifications(cachedData)
            setIsLoading(false)
            return
        }

        // Prevent duplicate listeners
        if (userIDRef.current === userID && unsubscribeRef.current) {
            return
        }

        userIDRef.current = userID
        setIsLoading(true)
        setError(null)
        isInitialLoadRef.current = true

        try {
            // Optimized query - smaller limit
            const notificationsQuery = query(
                collection(db, 'notifications'),
                where('recipientID', '==', userID),
                limit(15) // Giảm limit để tiết kiệm
            )

            const unsubscribe = onSnapshot(
                notificationsQuery,
                {
                    includeMetadataChanges: false // Quan trọng: giảm callbacks
                },
                (snapshot) => {
                    if (!isMountedRef.current) return

                    // Skip nếu từ cache và không phải initial load
                    if (snapshot.metadata.fromCache && !isInitialLoadRef.current) {
                        return
                    }

                    try {
                        let newNotifications = snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }))

                        // Sort client-side
                        newNotifications = newNotifications.sort((a, b) => {
                            const aTime = a.createdAt?.toDate?.() || a.createdAt || new Date(0)
                            const bTime = b.createdAt?.toDate?.() || b.createdAt || new Date(0)
                            return bTime - aTime
                        })

                        setNotifications(newNotifications)
                        setIsLoading(false)

                        // Update cache
                        cacheRef.current.set(cacheKey, newNotifications)
                        lastFetchRef.current = now

                        // Show toast chỉ cho new notifications
                        if (!isInitialLoadRef.current && !snapshot.metadata.fromCache) {
                            const addedDocs = snapshot.docChanges().filter(change =>
                                change.type === 'added' && !change.doc.metadata.hasPendingWrites
                            )

                            if (addedDocs.length > 0) {
                                // Chỉ 1 toast tổng hợp
                                notification.success({
                                    message: 'Thông báo mới!',
                                    description: addedDocs.length === 1
                                        ? addedDocs[0].doc.data().title
                                        : `Bạn có ${addedDocs.length} thông báo mới`,
                                    placement: 'topRight',
                                    duration: 3
                                })
                            }
                        }

                        if (isInitialLoadRef.current) {
                            isInitialLoadRef.current = false
                        }

                    } catch (processError) {
                        console.error('Error processing snapshot:', processError)
                        setError(processError)
                        setIsLoading(false)
                    }
                },
                (err) => {
                    if (!isMountedRef.current) return

                    console.error('Listener error:', err.code, err.message)
                    setError(err)
                    setIsLoading(false)

                    // Handle quota exceeded
                    if (err.code === 'resource-exhausted') {
                        notification.error({
                            message: 'Tạm thời không thể tải thông báo',
                            description: 'Vui lòng thử lại sau ít phút',
                            placement: 'topRight'
                        })
                        return // Không retry khi hết quota
                    }

                    // Handle other errors
                    if (err.code === 'permission-denied') {
                        notification.error({
                            message: 'Không có quyền truy cập',
                            description: 'Vui lòng đăng nhập lại',
                            placement: 'topRight'
                        })
                        return
                    }

                    // Auto-retry cho errors khác (sau 30 giây)
                    setTimeout(() => {
                        if (isMountedRef.current && userIDRef.current === userID) {
                            setupListener()
                        }
                    }, 30000)
                }
            )

            unsubscribeRef.current = unsubscribe

        } catch (setupError) {
            console.error('Error setting up listener:', setupError)
            setError(setupError)
            setIsLoading(false)
        }
    }, [userID, cleanupListener])

    // Setup listener when userID changes
    useEffect(() => {
        isMountedRef.current = true

        if (userID) {
            setupListener()
        } else {
            cleanupListener()
            setNotifications([])
            setIsLoading(false)
        }

        return () => {
            isMountedRef.current = false
            cleanupListener()
        }
    }, [userID, setupListener, cleanupListener])

    // Optimized markAsRead với optimistic update
    const markAsRead = useCallback(async (notificationId) => {
        if (!userID || !notificationId) return

        // Optimistic update ngay lập tức
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId
                    ? { ...notif, isRead: true }
                    : notif
            )
        )

        try {
            const notificationRef = doc(db, 'notifications', notificationId)
            await updateDoc(notificationRef, {
                isRead: true,
                readAt: new Date()
            })
        } catch (err) {
            console.error('Mark as read failed:', err)

            // Revert optimistic update nếu thất bại
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, isRead: false }
                        : notif
                )
            )

            notification.error({
                message: 'Không thể đánh dấu đã đọc',
                placement: 'topRight'
            })
        }
    }, [userID])

    const markAllAsRead = useCallback(async () => {
        if (!userID) return

        const unreadNotifications = notifications.filter((n) => !n.isRead)
        if (unreadNotifications.length === 0) return

        // Optimistic update
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        )

        try {
            // Batch update
            const updatePromises = unreadNotifications.map(async (notif) => {
                const notificationRef = doc(db, 'notifications', notif.id)
                await updateDoc(notificationRef, {
                    isRead: true,
                    readAt: new Date()
                })
            })

            await Promise.all(updatePromises)
        } catch (err) {
            console.error('Mark all as read failed:', err)

            // Revert nếu thất bại
            setNotifications(prev =>
                prev.map(notif =>
                    unreadNotifications.some(unread => unread.id === notif.id)
                        ? { ...notif, isRead: false }
                        : notif
                )
            )

            notification.error({
                message: 'Không thể đánh dấu tất cả đã đọc',
                placement: 'topRight'
            })
        }
    }, [userID, notifications])

    const contextValue = {
        notifications,
        unreadCount,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
        userID
    }

    return (
        <NotificationsContext.Provider value={contextValue}>
            {children}
        </NotificationsContext.Provider>
    )
}