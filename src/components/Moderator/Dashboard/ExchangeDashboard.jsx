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
    CheckCircleOutlined,
    SwapOutlined,
    FileTextOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

export default function ExchangeDashboard({ dashboardData }) {
    return (
        <>
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={8}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <Statistic
                            title={
                                <Space>
                                    <FileTextOutlined className="text-blue-500" />
                                    <span>Yêu cầu trao đổi mới</span>
                                </Space>
                            }
                            value={dashboardData.exchange.newRequests}
                            valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                        <div className="mt-4">
                            <Badge count="HOT" className="mr-2" style={{ backgroundColor: '#ff4d4f' }} />
                            <Text className="text-xs text-gray-500">Hôm nay: +5 yêu cầu</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <Statistic
                            title={
                                <Space>
                                    <SwapOutlined className="text-orange-500" />
                                    <span>Trao đổi đang xử lý</span>
                                </Space>
                            }
                            value={dashboardData.exchange.processing}
                            valueStyle={{ color: '#faad14', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                        <div className="mt-4">
                            <Progress
                                percent={45}
                                size="small"
                                strokeColor="#faad14"
                                showInfo={false}
                            />
                            <Text className="text-xs text-gray-500">Thời gian xử lý TB: 2.3 ngày</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <Statistic
                            title={
                                <Space>
                                    <CheckCircleOutlined className="text-green-500" />
                                    <span>Trao đổi hoàn thành</span>
                                </Space>
                            }
                            value={dashboardData.exchange.completed}
                            valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                        <div className="mt-4">
                            <Text className="text-xs text-green-600">Tỷ lệ thành công: 89%</Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    )
}