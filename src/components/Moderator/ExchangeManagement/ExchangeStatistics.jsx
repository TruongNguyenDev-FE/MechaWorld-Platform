import {
  Card,
  Row,
  Col,
  Statistic
} from "antd";
import {
  SwapOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";


export default function ExchangeStatistics({ data }) {
    const stats = {
        total: data.length,
        pending: data.filter(item => item.exchangeStatus === 'Chờ xử lí').length,
        processing: data.filter(item => ['Đang đóng gói', 'Đang giao hàng'].includes(item.exchangeStatus)).length,
        completed: data.filter(item => item.exchangeStatus === 'Hoàn tất').length,
        failed: data.filter(item => ['Thất bại', 'Bị từ chối'].includes(item.exchangeStatus)).length
    };

    return (
        <Row gutter={16} className="mb-6">
            <Col span={6}>
                <Card className="text-center">
                    <Statistic
                        title="Tổng số trao đổi"
                        value={stats.total}
                        prefix={<SwapOutlined className="text-blue-500" />}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card className="text-center">
                    <Statistic
                        title="Chờ xử lý"
                        value={stats.pending}
                        prefix={<CloseCircleOutlined className="text-orange-500" />}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card className="text-center">
                    <Statistic
                        title="Đang xử lý"
                        value={stats.processing}
                        prefix={<TruckOutlined className="text-purple-500" />}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card className="text-center">
                    <Statistic
                        title="Hoàn thành"
                        value={stats.completed}
                        prefix={<CheckCircleOutlined className="text-green-500" />}
                    />
                </Card>
            </Col>
        </Row>
    );
  }