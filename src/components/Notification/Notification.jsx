// components/Notification.jsx - UPDATED
import { useState } from 'react'
import {
    Badge,
    Button,
    Popover,
    List,
    Typography,
    Empty,
    Spin,
    Space,
    Divider
} from 'antd'
import {
    BellOutlined,
    EyeOutlined,
    CheckOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationContext'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

// Cấu hình dayjs
dayjs.extend(relativeTime)
dayjs.locale('vi')

const { Text, Title } = Typography

const Notification = () => {
    const navigate = useNavigate()

    // SỬA: Dùng context với limit 5 cho popover
    const {
        notifications,
        unreadCount,
        isLoading,
        markAllAsRead,
        markAsRead
    } = useNotifications(5) // Chỉ lấy 5 notifications mới nhất

    const [visible, setVisible] = useState(false)

    const handleVisibleChange = async (newVisible) => {
        setVisible(newVisible)
        // if (newVisible && unreadCount > 0) {
        //      Đánh dấu tất cả đã đọc khi mở popover
        //      await markAllAsRead()
        // }
    }

    const handleViewAll = () => {
        setVisible(false)
        navigate('/notifications')
    }

    const handleNotificationClick = async (notification) => {
        console.log('🔔 [BELL] Clicking notification:', notification.id)

        if (!notification.isRead) {
            await markAsRead(notification.id)
        }

        // Điều hướng đến trang liên quan nếu có
        if (notification.actionUrl) {
            navigate(notification.actionUrl)
        }

        setVisible(false)
    }

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return ''

        // Chuyển đổi Firebase Timestamp thành dayjs
        const date = timestamp.toDate ? dayjs(timestamp.toDate()) : dayjs(timestamp)
        return date.fromNow()
    }

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order':
                return '📦'
            case 'payment':
                return '💳'
            case 'promotion':
                return '🎉'
            case 'system':
                return '⚙️'
            default:
                return '📢'
        }
    }

    const notificationContent = (
        <div className="w-[350px] max-h-[400px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <Title level={5} className="!m-0">
                    Thông báo
                </Title>
                <Button
                    type="link"
                    size="small"
                    onClick={handleViewAll}
                    icon={<EyeOutlined />}
                    className="text-blue-500 hover:text-blue-700"
                >
                    Xem tất cả
                </Button>
            </div>

            <Divider className="!my-2" />

            {/* Notifications List */}
            <div className="max-h-[300px] overflow-y-auto">
                <Spin spinning={isLoading}>
                    {notifications.length > 0 ? (
                        <List
                            dataSource={notifications}
                            renderItem={(item) => (
                                <List.Item
                                    className={`
                                        p-3 cursor-pointer rounded-lg mb-1 transition-colors duration-200
                                        ${item.isRead
                                            ? 'bg-transparent hover:bg-gray-50'
                                            : 'bg-green-50 border border-green-200 hover:bg-green-100'
                                        }
                                    `}
                                    onClick={() => handleNotificationClick(item)}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <span className="text-xl">
                                                {getNotificationIcon(item.type)}
                                            </span>
                                        }
                                        title={
                                            <Space className="w-full justify-between">
                                                <Text strong className="text-gray-800">
                                                    {item.title}
                                                </Text>
                                                {!item.isRead && (
                                                    <Badge
                                                        color="red"
                                                        className="ml-1"
                                                    />
                                                )}
                                            </Space>
                                        }
                                        description={
                                            <div>
                                                <Text
                                                    type="secondary"
                                                    className="block mb-1 leading-relaxed text-gray-600"
                                                >
                                                    {item.message}
                                                </Text>
                                                <Text
                                                    type="secondary"
                                                    className="text-xs text-gray-400"
                                                >
                                                    {formatTimestamp(item.createdAt)}
                                                </Text>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Không có thông báo mới"
                            className="py-5"
                        />
                    )}
                </Spin>
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <>
                    <Divider className="!my-2" />
                    <div className="text-center">
                        <Button
                            type="text"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="text-gray-600 hover:text-blue-500 disabled:text-gray-400"
                        >
                            Đánh dấu tất cả đã đọc
                        </Button>
                    </div>
                </>
            )}
        </div>
    )

    return (
        <Popover
            content={notificationContent}
            title={null}
            trigger="click"
            open={visible}
            onOpenChange={handleVisibleChange}
            placement="bottomRight"
            style={{ zIndex: 1050 }}
        >
            <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                <Button
                    type="text"
                    shape="circle"
                    size="large"
                    icon={<BellOutlined />}
                    className="
                        flex items-center justify-center 
                        border-none shadow-none 
                        hover:bg-gray-100 text-2xl 
                        transition-colors duration-200
                    "
                    title="Thông báo"
                />
            </Badge>
        </Popover>
    )
}

export default Notification