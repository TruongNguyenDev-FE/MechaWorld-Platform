import {
    Card,
    Row,
    Col,
    Statistic,
} from "antd";
import {
    ShoppingCartOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    TruckOutlined
} from "@ant-design/icons";


export default function OrderStatistics ({ stats }) {
    return (
        <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={4}>
                <Card className="hover:shadow-md transition-shadow">
                    <Statistic
                        title="Tổng đơn hàng"
                        value={stats.totalOrders}
                        prefix={<ShoppingCartOutlined className="text-blue-500" />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={4}>
                <Card className="hover:shadow-md transition-shadow">
                    <Statistic
                        title="Chờ xử lý"
                        value={stats.pendingOrders}
                        prefix={<ClockCircleOutlined className="text-orange-500" />}
                        valueStyle={{ color: '#faad14' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={4}>
                <Card className="hover:shadow-md transition-shadow">
                    <Statistic
                        title="Đang xử lý"
                        value={stats.processingOrders}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={4}>
                <Card className="hover:shadow-md transition-shadow">
                    <Statistic
                        title="Đang giao hàng"
                        value={stats.shippingOrders}
                        prefix={<TruckOutlined className="text-purple-500" />}
                        valueStyle={{ color: '#722ed1' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={4}>
                <Card className="hover:shadow-md transition-shadow">
                    <Statistic
                        title="Hoàn thành"
                        value={stats.completedOrders}
                        prefix={<CheckCircleOutlined className="text-green-500" />}
                        valueStyle={{ color: '#52c41a' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={4}>
                <Card className="hover:shadow-md transition-shadow">
                    <Statistic
                        title="Doanh thu"
                        value={stats.totalRevenue}
                        prefix={<DollarOutlined className="text-green-500" />}
                        valueStyle={{ color: '#52c41a', fontSize: '1.2rem' }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        suffix="₫"
                    />
                </Card>
            </Col>
        </Row>
    );
  }