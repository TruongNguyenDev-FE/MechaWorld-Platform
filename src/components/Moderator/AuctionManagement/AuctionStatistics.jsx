import {
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";


export default function AuctionStatistics({ data }) {
    const stats = {
        total: data.length,
        pending: data.filter(item => item.status === 'pending').length,
        approved: data.filter(item => item.status === 'approved').length,
        rejected: data.filter(item => item.status === 'rejected').length,
        active: data.filter(item => item.status === 'active').length
    };

    return (
        <Row gutter={16} className="mb-6">
            <Col span={6}>
                <Card className="text-center border-l-4 border-l-blue-500">
                    <Statistic
                        title="Tổng yêu cầu đấu giá"
                        value={stats.total}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card className="text-center border-l-4 border-l-orange-500">
                    <Statistic
                        title="Chờ duyệt"
                        value={stats.pending}
                        prefix={<ClockCircleOutlined className="text-orange-500" />}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card className="text-center border-l-4 border-l-green-500">
                    <Statistic
                        title="Đã phê duyệt"
                        value={stats.approved}
                        prefix={<CheckCircleOutlined className="text-green-500" />}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card className="text-center border-l-4 border-l-red-500">
                    <Statistic
                        title="Bị từ chối"
                        value={stats.rejected}
                        prefix={<CloseCircleOutlined className="text-red-500" />}
                    />
                </Card>
            </Col>
        </Row>
    );
}