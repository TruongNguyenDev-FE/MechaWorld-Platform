import { Card, Row, Col, Statistic } from 'antd';
import {
    FileTextOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    DollarOutlined
} from '@ant-design/icons';

const WithdrawalStatistics = ({ stats }) => {
    return (
        <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                    <Statistic
                        title="Tổng yêu cầu"
                        value={stats.totalRequests}
                        prefix={<FileTextOutlined className="text-blue-500" />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                    <Statistic
                        title="Chờ xử lý"
                        value={stats.pendingRequests}
                        prefix={<ClockCircleOutlined className="text-orange-500" />}
                        valueStyle={{ color: '#faad14' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                    <Statistic
                        title="Đã hoàn thành"
                        value={stats.completedRequests}
                        prefix={<CheckCircleOutlined className="text-green-500" />}
                        valueStyle={{ color: '#52c41a' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                    <Statistic
                        title="Tổng số tiền"
                        value={stats.totalAmount}
                        prefix={<DollarOutlined className="text-green-500" />}
                        valueStyle={{ color: '#52c41a' }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        suffix="₫"
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default WithdrawalStatistics;