// pages/NotificationsPage.jsx - UPDATED
import React, { useState } from 'react'
import {
    Card,
    List,
    Typography,
    Empty,
    Spin,
    Button,
    Space,
    Tag,
    Divider,
    Row,
    Col,
    Select,
    Input
} from 'antd'
import {
    BellOutlined,
    CheckOutlined,
    SearchOutlined,
    FilterOutlined,
    DeleteOutlined
} from '@ant-design/icons'
import { useNotifications } from '../../context/NotificationContext'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Option } = Select
const { Search } = Input

const NotificationsPage = () => {
    // SỬA: Dùng context với limit 50 cho trang đầy đủ
    const {
        notifications,
        unreadCount,
        isLoading,
        markAllAsRead,
        markAsRead,
        userID
    } = useNotifications(50) // Lấy 50 notifications cho trang đầy đủ

    const [filterType, setFilterType] = useState('all')
    const [searchText, setSearchText] = useState('')

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return ''
        const date = timestamp.toDate ? dayjs(timestamp.toDate()) : dayjs(timestamp)
        return date.format('DD/MM/YYYY HH:mm')
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

    const getTypeColor = (type) => {
        switch (type) {
            case 'order':
                return 'blue'
            case 'payment':
                return 'green'
            case 'promotion':
                return 'orange'
            case 'system':
                return 'purple'
            default:
                return 'default'
        }
    }

    const getTypeName = (type) => {
        switch (type) {
            case 'order':
                return 'Đơn hàng'
            case 'payment':
                return 'Thanh toán'
            case 'promotion':
                return 'Khuyến mãi'
            case 'system':
                return 'Hệ thống'
            default:
                return 'Khác'
        }
    }

    // Filter và search notifications
    const filteredNotifications = notifications.filter(notification => {
        const matchesType = filterType === 'all' ||
            filterType === 'unread' && !notification.isRead ||
            filterType === notification.type

        const matchesSearch = !searchText ||
            notification.title.toLowerCase().includes(searchText.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchText.toLowerCase())

        return matchesType && matchesSearch
    })

    const handleNotificationClick = async (notification) => {
        console.log('📄 [PAGE] Clicking notification:', notification.id, 'isRead:', notification.isRead)
        if (!notification.isRead) {
            await markAsRead(notification.id)
        }
    }

    console.log('📄 [PAGE] Rendering with notifications:', notifications.length, 'unread:', unreadCount)

    return (
        <div className="mt-36 mx-auto p-6 max-w-6xl">

            {/* Header */}
            <Row gutter={[16, 16]} align="middle" className="mb-6">
                <Col flex="auto">
                    <Space align="center">
                        <BellOutlined className="text-2xl text-blue-500" />
                        <Title level={2} className="!m-0 text-gray-800">
                            Thông báo
                        </Title>
                        {unreadCount > 0 && (
                            <Tag color="red" className="font-medium">
                                {unreadCount} chưa đọc
                            </Tag>
                        )}
                    </Space>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                    >
                        Đánh dấu tất cả đã đọc
                    </Button>
                </Col>
            </Row>

            {/* Filters */}
            <Card className="mb-4 shadow-sm border-gray-200">
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <Space className="w-full">
                            <FilterOutlined className="text-gray-500" />
                            <Text strong className="text-gray-700">Lọc theo:</Text>
                            <Select
                                value={filterType}
                                onChange={setFilterType}
                                className="w-32"
                            >
                                <Option value="all">Tất cả</Option>
                                <Option value="unread">Chưa đọc</Option>
                                <Option value="order">Đơn hàng</Option>
                                <Option value="payment">Thanh toán</Option>
                                <Option value="promotion">Khuyến mãi</Option>
                                <Option value="system">Hệ thống</Option>
                            </Select>
                        </Space>
                    </Col>
                    <Col xs={24} sm={12} md={16}>
                        <Search
                            placeholder="Tìm kiếm thông báo..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full"
                            allowClear
                        />
                    </Col>
                </Row>
            </Card>

            {/* Notifications List */}
            <Card className="shadow-sm border-gray-200">
                <Spin spinning={isLoading}>
                    {filteredNotifications.length > 0 ? (
                        <List
                            dataSource={filteredNotifications}
                            renderItem={(item) => (
                                <List.Item
                                    className={`
                                        p-4 cursor-pointer rounded-lg mb-2 transition-all duration-200
                                        ${item.isRead
                                            ? 'bg-white hover:bg-gray-50 border border-gray-100'
                                            : 'bg-green-50 hover:bg-green-100 border border-green-200'
                                        }
                                    `}
                                    onClick={() => handleNotificationClick(item)}
                                    actions={[
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            danger
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                        />
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <div className="
                                                w-12 h-12 rounded-full bg-gray-100 
                                                flex items-center justify-center 
                                                text-xl
                                            ">
                                                {getNotificationIcon(item.type)}
                                            </div>
                                        }
                                        title={
                                            <Row justify="space-between" align="top">
                                                <Col flex="auto">
                                                    <Space>
                                                        <Text strong className="text-gray-800">
                                                            {item.title}
                                                        </Text>
                                                        {!item.isRead && (
                                                            <Tag color="red" size="small" className="text-xs">
                                                                Mới
                                                            </Tag>
                                                        )}
                                                    </Space>
                                                </Col>
                                                <Col>
                                                    <Tag
                                                        color={getTypeColor(item.type)}
                                                        size="small"
                                                        className="text-xs"
                                                    >
                                                        {getTypeName(item.type)}
                                                    </Tag>
                                                </Col>
                                            </Row>
                                        }
                                        description={
                                            <div>
                                                <Text className="
                                                    block mb-2 leading-relaxed text-gray-600
                                                ">
                                                    {item.message}
                                                </Text>
                                                <Text type="secondary" className="text-xs text-gray-400">
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
                            description={
                                <span className="text-gray-500">
                                    {searchText || filterType !== 'all'
                                        ? 'Không tìm thấy thông báo phù hợp'
                                        : 'Không có thông báo nào'
                                    }
                                </span>
                            }
                            className="py-10"
                        />
                    )}
                </Spin>
            </Card>
        </div>
    )
}

export default NotificationsPage