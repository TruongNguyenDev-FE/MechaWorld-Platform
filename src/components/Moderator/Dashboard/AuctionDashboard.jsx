import {
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    Progress,
    Space,
    Button,
} from 'antd';
import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    TrophyOutlined,
    EyeOutlined
} from '@ant-design/icons';

const { Text } = Typography;

export default function AuctionDashboard({ dashboardData }) {
    return (
        <>
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={8}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <Statistic
                            title={
                                <Space>
                                    <ExclamationCircleOutlined className="text-red-500" />
                                    <span>Yêu cầu mở đấu giá chờ duyệt</span>
                                </Space>
                            }
                            value={dashboardData.auction.pendingApproval}
                            valueStyle={{ color: '#ff4d4f', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                        <div className="mt-4">
                            <Button type="primary" size="small" className="bg-red-500 border-red-500">
                                <EyeOutlined /> Xem chi tiết
                            </Button>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <Statistic
                            title={
                                <Space>
                                    <TrophyOutlined className="text-orange-500" />
                                    <span>Đấu giá đang diễn ra</span>
                                </Space>
                            }
                            value={dashboardData.auction.activeAuctions}
                            valueStyle={{ color: '#faad14', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                        <div className="mt-4">
                            <Progress
                                percent={68}
                                size="small"
                                strokeColor="#faad14"
                                showInfo={false}
                            />
                            <Text className="text-xs text-gray-500">Tổng lượt đặt giá: {dashboardData.auction.totalBids}</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <Statistic
                            title={
                                <Space>
                                    <CheckCircleOutlined className="text-green-500" />
                                    <span>Đấu giá hoàn thành</span>
                                </Space>
                            }
                            value={dashboardData.auction.completedAuctions}
                            valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                        <div className="mt-4">
                            <Text className="text-xs text-green-600">Tháng này: +23 phiên</Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    )
}