import { useEffect, useState } from 'react';
import {
    Card,
    Row,
    Col,
    Select,
    Typography,
    Tabs,
    Space,
    Button,
    Divider
} from 'antd';
import {
    ShoppingCartOutlined,
    TrophyOutlined,
    MoneyCollectOutlined,
} from '@ant-design/icons';

// import TradingDashboard from './TradingDashboard';
// import AuctionDashboard from './AuctionDashboard';
// import ExchangeDashboard from './ExchangeDashboard';
// import UserDashboard from './UserDashboard';
import OverallDashboard from './OverallDashboard';
import { GetModeratorDashboard } from '../../../apis/Moderator/APIModerator';

const { Title } = Typography;
const { Option } = Select;

const ModeratorDashboard = () => {
    const [selectedFlow, setSelectedFlow] = useState('trading');
    const [timeRange, setTimeRange] = useState('today');
    const [dashboardMod, setDashboardMod] = useState({});

    useEffect(() => {
        const GetModDashboard = async () => {
            const fetchDashboard = await GetModeratorDashboard();
            setDashboardMod(fetchDashboard?.data)
        }

        GetModDashboard();
    }, [])

    // Mock data - thay thế bằng API calls thực tế
    const dashboardData = {
        trading: {
            todayOrders: 45,
            weekOrders: 312,
            monthOrders: 1256,
            pendingOrders: 23,
            completedOrders: 1189,
            processingOrders: 44
        },
        auction: {
            pendingApproval: 12,
            activeAuctions: 28,
            completedAuctions: 156,
            totalBids: 842
        },
        exchange: {
            newRequests: 18,
            processing: 31,
            completed: 287,
            totalUsers: 156
        },
        users: {
            totalUsers: 2847,
            members: 2156,
            sellers: 691,
            newToday: 15,
            activeToday: 324
        }
    };

    const getOrderCount = () => {
        const data = dashboardData.trading;
        switch (timeRange) {
            case 'today': return data.todayOrders;
            case 'week': return data.weekOrders;
            case 'month': return data.monthOrders;
            default: return data.todayOrders;
        }
    };

    const renderDashboardContent = () => {
        switch (selectedFlow) {
            case 'overall': return <OverallDashboard dashboardData={dashboardMod} getOrderCount={getOrderCount} />
            // case 'trading': return <TradingDashboard dashboardData={dashboardData} getOrderCount={getOrderCount} />;
            // case 'auction': return <AuctionDashboard dashboardData={dashboardData} />;
            // case 'exchange': return <ExchangeDashboard dashboardData={dashboardData} />;
            // case 'users': return <UserDashboard dashboardData={dashboardData} />;
            default: return <OverallDashboard dashboardData={dashboardMod} getOrderCount={getOrderCount} />;
        }
    };

    const tabItems = [
        {
            key: 'overall',
            label: (
                <Space>
                    <ShoppingCartOutlined />
                    <span>Tổng quát thống kê</span>
                </Space>
            ),
        },
        // {
        //     key: 'trading',
        //     label: (
        //         <Space>
        //             <ShoppingCartOutlined />
        //             <span>Mua bán</span>
        //         </Space>
        //     ),
        // },
        // {
        //     key: 'auction',
        //     label: (
        //         <Space>
        //             <TrophyOutlined />
        //             <span>Đấu giá</span>
        //         </Space>
        //     ),
        // },
        // {
        //     key: 'exchange',
        //     label: (
        //         <Space>
        //             <SwapOutlined />
        //             <span>Trao đổi</span>
        //         </Space>
        //     ),
        // },
        // {
        //     key: 'users',
        //     label: (
        //         <Space>
        //             <TeamOutlined />
        //             <span>Người dùng</span>
        //         </Space>
        //     ),
        // },
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title level={2} className="mb-2">
                        Tổng quan hoạt động hệ thống MechaWorld
                    </Title>
                </div>

                {selectedFlow === 'trading' && (
                    <Select
                        value={timeRange}
                        onChange={setTimeRange}
                        className="w-32"
                        size="large"
                    >
                        <Option value="today">Hôm nay</Option>
                        <Option value="week">Tuần này</Option>
                        <Option value="month">Tháng này</Option>
                    </Select>
                )}
            </div>

            <Divider />

            {/* Flow Selection Tabs */}
            <Tabs
                activeKey={selectedFlow}
                onChange={setSelectedFlow}
                size="large"
                className="mb-6"
                items={tabItems}
            />

            {/* Dashboard Content */}
            {renderDashboardContent()}

            {/* Quick Actions */}
            <Card className="mt-6" title="🚀 Thao tác nhanh">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Button type="default" block size="large" className="h-12">
                            <TrophyOutlined /> Quản lý đấu giá
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button type="default" block size="large" className="h-12">
                            <MoneyCollectOutlined /> Giao dịch và rút tiền
                        </Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ModeratorDashboard;