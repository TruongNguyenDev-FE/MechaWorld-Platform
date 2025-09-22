import {
    Card,
    Row,
    Col,
    Statistic,
    Space,
} from 'antd';
import {
    RiseOutlined,
    BankOutlined,
    SwapOutlined,
    FileTextOutlined,
    TrophyOutlined
} from '@ant-design/icons';


export default function OverallDashboard({ dashboardData, getOrderCount }) {


    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <Statistic
                        title={
                            <Space>
                                <TrophyOutlined className="text-orange-500" />
                                <span className='text-lg'>Đơn đấu giá đang chờ xử lý</span>
                            </Space>
                        }
                        value={dashboardData.pending_auction_requests_count}
                        valueStyle={{ color: '#faad14', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <Statistic
                        title={
                            <Space>
                                <BankOutlined className="text-green-500" />
                                <span className='text-lg'>Đơn chờ xét duyệt rút tiền</span>
                            </Space>
                        }
                        value={dashboardData.pending_withdrawal_requests_count}
                        valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <Statistic
                        title={
                            <Space>
                                <SwapOutlined className="text-blue-500" />
                                <span className='text-lg'>Tổng đơn trao đổi tháng này</span>
                            </Space>
                        }
                        value={dashboardData.total_exchanges_this_week}
                        valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
                        prefix={<RiseOutlined />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <Statistic
                        title={
                            <Space>
                                <FileTextOutlined className="text-purple-500" />
                                <span className='text-lg'>Tổng đơn hàng tháng này</span>
                            </Space>
                        }
                        value={dashboardData.total_orders_this_week}
                        valueStyle={{ color: '#722ed1', fontSize: '1.5rem', fontWeight: 'bold' }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                </Card>
            </Col>
        </Row>
    )
}