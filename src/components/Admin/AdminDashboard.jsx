import React, { useState, useEffect, useRef } from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    Space,
    Avatar,
    Tag,
    Spin,
    Alert,
    notification
} from 'antd';
import {
    UserOutlined,
    ShoppingCartOutlined,
    SwapOutlined,
    ShopOutlined,
    DollarOutlined,
    TrophyOutlined,
    WalletOutlined,
    RocketOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    RiseOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { GetAdminDashboard } from '../../apis/Admin/APIAdmin';

const { Title, Text } = Typography;

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [isRealTimeActive, setIsRealTimeActive] = useState(true);
    const intervalRef = useRef(null);
    const wsRef = useRef(null);

    // Format số tiền VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Format thời gian cập nhật
    const formatLastUpdate = (date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // API call để lấy dữ liệu dashboard
    const fetchDashboardData = async () => {
        try {
            // Thay thế bằng API endpoint thực tế
            const response = await GetAdminDashboard();
            console.log(response);
            const dashboardData = response.data;

            // Mock data - xóa khi có API thực
            await new Promise(resolve => setTimeout(resolve, 500));

            setDashboardData(dashboardData);
            setLastUpdate(new Date());
            setError(null);
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu dashboard:', err);
            setError('Không thể tải dữ liệu dashboard');
        } finally {
            setLoading(false);
        }
    };

    // Thiết lập WebSocket cho real-time updates
    const setupWebSocket = () => {
        try {
            // Thay thế bằng WebSocket URL thực tế
            // wsRef.current = new WebSocket('ws://localhost:8080/admin/dashboard');

            // Mock WebSocket behavior
            // wsRef.current = {
            //   onmessage: (event) => {
            //     const newData = JSON.parse(event.data);
            //     setDashboardData(prev => ({ ...prev, ...newData }));
            //     setLastUpdate(new Date());
            //     
            //     notification.success({
            //       message: 'Dữ liệu đã được cập nhật',
            //       description: 'Dashboard đã nhận dữ liệu mới từ hệ thống',
            //       duration: 2,
            //       placement: 'bottomRight'
            //     });
            //   },
            //   onopen: () => {
            //     console.log('WebSocket kết nối thành công');
            //   },
            //   onerror: (error) => {
            //     console.error('Lỗi WebSocket:', error);
            //   },
            //   onclose: () => {
            //     console.log('WebSocket đã đóng');
            //   }
            // };
        } catch (error) {
            console.error('Không thể thiết lập WebSocket:', error);
        }
    };

    // Thiết lập polling cho real-time updates
    const setupPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (isRealTimeActive) {
            intervalRef.current = setInterval(() => {
                fetchDashboardData();
            }, 30000); // Cập nhật mỗi 30 giây
        }
    };

    // Khởi tạo khi component mount
    useEffect(() => {
        fetchDashboardData();
        setupWebSocket();
        setupPolling();

        // Cleanup khi component unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    // Cập nhật polling khi trạng thái real-time thay đổi
    useEffect(() => {
        setupPolling();
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRealTimeActive]);

    // Xử lý refresh thủ công
    const handleManualRefresh = () => {
        setLoading(true);
        fetchDashboardData();
    };

    // Toggle real-time updates
    const toggleRealTime = () => {
        setIsRealTimeActive(!isRealTimeActive);
        notification.info({
            message: isRealTimeActive ? 'Đã tắt cập nhật tự động' : 'Đã bật cập nhật tự động',
            description: isRealTimeActive
                ? 'Dashboard sẽ không tự động cập nhật'
                : 'Dashboard sẽ tự động cập nhật mỗi 30 giây',
            duration: 3
        });
    };

    if (loading && !dashboardData) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spin size="large" />
                <Text className="ml-4">Đang tải dữ liệu dashboard...</Text>
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Lỗi tải dữ liệu"
                description={error}
                type="error"
                showIcon
                className="mb-6"
                action={
                    <button
                        onClick={handleManualRefresh}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Thử lại
                    </button>
                }
            />
        );
    }

    const data = dashboardData;

    // Cấu hình metrics chính
    const primaryMetrics = [
        {
            title: 'Nhà bán hàng MechaWorld',
            value: data.total_business_users,
            icon: <TeamOutlined className="text-blue-500" />,
            gradient: 'from-blue-500 to-cyan-500',
            description: 'Tổng số tài khoản kinh doanh'
        },
        {
            title: 'Người dùng mới tuần này',
            value: data.new_users_this_week,
            icon: <UserOutlined className="text-green-500" />,
            gradient: 'from-green-500 to-emerald-500',
            description: 'Số người dùng đăng ký mới'
        },
        {
            title: 'Doanh thu tháng này',
            value: formatCurrency(data.total_revenue_this_month),
            icon: <DollarOutlined className="text-yellow-500" />,
            gradient: 'from-yellow-500 to-orange-500',
            description: 'Tổng doanh thu trong tháng'
        },
        {
            title: 'Khối lượng ví tuần này',
            value: formatCurrency(data.total_wallet_volume_this_week),
            icon: <WalletOutlined className="text-purple-500" />,
            gradient: 'from-purple-500 to-pink-500',
            description: 'Tổng giao dịch ví trong tuần'
        }
    ];

    // Metrics đơn hàng
    const orderMetrics = [
        {
            title: 'Đơn hàng thường',
            value: data.total_regular_orders_this_month,
            icon: <ShoppingCartOutlined />,
            color: '#1890ff',
            description: 'Đơn mua bán thường'
        },
        {
            title: 'Đơn trao đổi',
            value: data.total_exchange_orders_this_month,
            icon: <SwapOutlined />,
            color: '#52c41a',
            description: 'Đơn trao đổi sản phẩm'
        },
        {
            title: 'Đơn đấu giá',
            value: data.total_auction_orders_this_month,
            icon: <TrophyOutlined />,
            color: '#faad14',
            description: 'Đơn đấu giá'
        },
        {
            title: 'Gundam đã đăng',
            value: data.total_published_gundams,
            icon: <RocketOutlined />,
            color: '#722ed1',
            description: 'Số lượng Gundam được đăng bán'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header với điều khiển real-time */}
            <div className="flex items-center justify-between">
                <div>
                    <Title level={2} className="!mb-2 flex items-center">
                        <ThunderboltOutlined className="text-yellow-500 mr-3" />
                        Bảng Điều Khiển Admin
                    </Title>
                    <Text className="text-gray-600">
                        Tổng quan hệ thống và các chỉ số hiệu suất chính
                    </Text>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Trạng thái real-time */}
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${isRealTimeActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        <Text className="text-sm font-medium text-gray-600">
                            {isRealTimeActive ? 'Đang cập nhật tự động' : 'Cập nhật thủ công'}
                        </Text>
                    </div>

                    {/* Thời gian cập nhật cuối */}
                    <Text className="text-xs text-gray-500">
                        Cập nhật lúc: {formatLastUpdate(lastUpdate)}
                    </Text>

                    {/* Nút điều khiển */}
                    <Space>
                        <button
                            onClick={toggleRealTime}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${isRealTimeActive
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {isRealTimeActive ? 'Tắt tự động' : 'Bật tự động'}
                        </button>

                        <button
                            onClick={handleManualRefresh}
                            disabled={loading}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
                        >
                            <SyncOutlined className={loading ? 'animate-spin' : ''} />
                            <span className="ml-1">Làm mới</span>
                        </button>
                    </Space>
                </div>
            </div>

            {/* Cards metrics chính */}
            <Row gutter={[24, 24]}>
                {primaryMetrics.map((metric, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card
                            className="h-full shadow-lg border-none overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            bodyStyle={{ padding: 0 }}
                        >
                            <div className={`bg-gradient-to-br ${metric.gradient} p-6 text-white relative`}>
                                {/* Loading overlay */}
                                {loading && (
                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                        <Spin size="small" />
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-4">
                                    <Avatar
                                        size={48}
                                        icon={metric.icon}
                                        className="bg-white/20 text-white border-none"
                                    />
                                </div>
                                <div>
                                    <Text className="text-white/80 text-sm block mb-1">
                                        {metric.title}
                                    </Text>
                                    <Text className="text-white text-2xl font-bold block">
                                        {typeof metric.value === 'string' ? metric.value : metric.value.toLocaleString()}
                                    </Text>
                                    <Text className="text-white/70 text-xs">
                                        {metric.description}
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Phần thống kê đơn hàng và hoạt động */}
            <Row gutter={[24, 24]}>
                {/* Thống kê đơn hàng */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <ShopOutlined className="text-blue-500" />
                                <span>Đơn hàng tháng này</span>
                            </Space>
                        }
                        className="h-full shadow-lg border-none"
                        extra={
                            <div className="flex items-center space-x-2">
                                <Tag color="blue">Hàng tháng</Tag>
                                {loading && <Spin size="small" />}
                            </div>
                        }
                    >
                        <Row gutter={[16, 16]}>
                            {orderMetrics.map((order, index) => (
                                <Col span={12} key={index}>
                                    <Card
                                        size="small"
                                        className="border border-gray-100 hover:border-blue-300 transition-colors"
                                    >
                                        <Statistic
                                            title={order.title}
                                            value={order.value}
                                            prefix={
                                                <Avatar
                                                    size="small"
                                                    icon={order.icon}
                                                    style={{ backgroundColor: order.color }}
                                                />
                                            }
                                            suffix={
                                                <Text className="text-xs text-gray-500">
                                                    {order.description}
                                                </Text>
                                            }
                                            valueStyle={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                color: order.color
                                            }}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Tổng kết */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <Text className="font-medium text-blue-800">Tổng đơn hàng:</Text>
                                <Text className="text-2xl font-bold text-blue-600">
                                    {data.total_regular_orders_this_month +
                                        data.total_exchange_orders_this_month +
                                        data.total_auction_orders_this_month}
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Hoạt động hệ thống */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <RocketOutlined className="text-purple-500" />
                                <span>Hoạt động hệ thống</span>
                            </Space>
                        }
                        className="h-full shadow-lg border-none"
                        extra={
                            <div className="flex items-center space-x-2">
                                <Tag color="purple">Thời gian thực</Tag>
                                {loading && <Spin size="small" />}
                            </div>
                        }
                    >
                        <div className="space-y-4">
                            {/* Thống kê nhanh */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <Text className="text-3xl font-bold text-green-600 block">
                                        {data.new_users_this_week}
                                    </Text>
                                    <Text className="text-green-500 text-sm">Người dùng mới tuần này</Text>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <Text className="text-3xl font-bold text-orange-600 block">
                                        {data.total_published_gundams}
                                    </Text>
                                    <Text className="text-orange-500 text-sm">Gundam được đăng</Text>
                                </div>
                            </div>

                            {/* Thông tin hệ thống */}
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <Text className="text-gray-600">Trạng thái API:</Text>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <Text className="text-sm font-medium text-green-600">Hoạt động</Text>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text className="text-gray-600">Cơ sở dữ liệu:</Text>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <Text className="text-sm font-medium text-green-600">Ổn định</Text>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text className="text-gray-600">Tải hệ thống:</Text>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <Text className="text-sm font-medium text-yellow-600">Vừa phải</Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;