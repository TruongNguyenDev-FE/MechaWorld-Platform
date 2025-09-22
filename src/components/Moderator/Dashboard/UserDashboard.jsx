import {
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    Progress,
    Space,
} from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    ShopOutlined,
    RiseOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

export default function UserDashboard({ dashboardData }) {
    return (
        <>
        
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <Statistic
                            title={
                                <Space>
                                    <TeamOutlined className="text-blue-500" />
                                    <span>Tổng người dùng</span>
                                </Space>
                            }
                            value={dashboardData.users.totalUsers}
                            valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                        <div className="mt-4">
                            <Text className="text-xs text-green-600">↗ +{dashboardData.users.newToday} hôm nay</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <Statistic
                            title={
                                <Space>
                                    <UserOutlined className="text-green-500" />
                                    <span>Thành viên</span>
                                </Space>
                            }
                            value={dashboardData.users.members}
                            valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                        <div className="mt-4">
                            <Progress
                                percent={Math.round((dashboardData.users.members / dashboardData.users.totalUsers) * 100)}
                                size="small"
                                strokeColor="#52c41a"
                                showInfo={false}
                            />
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <Statistic
                            title={
                                <Space>
                                    <ShopOutlined className="text-purple-500" />
                                    <span>Người bán</span>
                                </Space>
                            }
                            value={dashboardData.users.sellers}
                            valueStyle={{ color: '#722ed1', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                        <div className="mt-4">
                            <Progress
                                percent={Math.round((dashboardData.users.sellers / dashboardData.users.totalUsers) * 100)}
                                size="small"
                                strokeColor="#722ed1"
                                showInfo={false}
                            />
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <Statistic
                            title={
                                <Space>
                                    <RiseOutlined className="text-orange-500" />
                                    <span>Hoạt động hôm nay</span>
                                </Space>
                            }
                            value={dashboardData.users.activeToday}
                            valueStyle={{ color: '#faad14', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                        <div className="mt-4">
                            <Text className="text-xs text-gray-500">
                                {Math.round((dashboardData.users.activeToday / dashboardData.users.totalUsers) * 100)}% tổng users
                            </Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    )
}