import {
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    Progress,
    Badge,
    Space,
} from 'antd';
import {
    ShoppingCartOutlined,
    DollarCircleOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    RiseOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

const { Text } = Typography;

export default function TradingDashboard({ dashboardData, getOrderCount }) {
    
        const [timeRange, setTimeRange] = useState('today');
    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <Statistic
                        title={
                            <Space>
                                <ShoppingCartOutlined className="text-blue-500" />
                                <span>Tổng đơn hàng {timeRange === 'today' ? 'hôm nay' : timeRange === 'week' ? 'tuần này' : 'tháng này'}</span>
                            </Space>
                        }
                        value={getOrderCount()}
                        valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
                        prefix={<RiseOutlined />}
                    />
                    <div className="mt-4">
                        <Progress
                            percent={75}
                            size="small"
                            strokeColor="#1890ff"
                            showInfo={false}
                        />
                        <Text className="text-xs text-gray-500">So với kỳ trước: +12%</Text>
                    </div>
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <Statistic
                        title={
                            <Space>
                                <ClockCircleOutlined className="text-orange-500" />
                                <span>Đơn hàng đang xử lý</span>
                            </Space>
                        }
                        value={dashboardData.trading.processingOrders}
                        valueStyle={{ color: '#faad14', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                    <div className="mt-4">
                        <Badge
                            count={dashboardData.trading.pendingOrders}
                            className="mr-2"
                            style={{ backgroundColor: '#ff4d4f' }}
                        />
                        <Text className="text-xs text-gray-500">Chờ duyệt: {dashboardData.trading.pendingOrders}</Text>
                    </div>
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <Statistic
                        title={
                            <Space>
                                <CheckCircleOutlined className="text-green-500" />
                                <span>Đơn hàng hoàn thành</span>
                            </Space>
                        }
                        value={dashboardData.trading.completedOrders}
                        valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                    <div className="mt-4">
                        <Progress
                            percent={92}
                            size="small"
                            strokeColor="#52c41a"
                            showInfo={false}
                        />
                        <Text className="text-xs text-gray-500">Tỷ lệ thành công: 92%</Text>
                    </div>
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <Statistic
                        title={
                            <Space>
                                <DollarCircleOutlined className="text-purple-500" />
                                <span>Doanh thu</span>
                            </Space>
                        }
                        value={15420000}
                        valueStyle={{ color: '#722ed1', fontSize: '1.5rem', fontWeight: 'bold' }}
                        suffix="₫"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                    <div className="mt-4">
                        <Text className="text-xs text-green-600">↗ +8.5% so với tuần trước</Text>
                    </div>
                </Card>
            </Col>
        </Row>
    )
}