import {
  Card,
  Tag,
  Typography,
  Avatar,
  Button,
  Row,
  Col,
  Modal,
  Descriptions,
  Timeline,
} from "antd";
import {
  SwapOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

// Helper functions
const formatPrice = (amount) => Math.abs(amount).toLocaleString() + " đ";

const getStatusTag = (status, type) => {
  const exchangeStatusColors = {
    "Chờ xử lí": { color: "orange", icon: "⏳" },
    "Đang đóng gói": { color: "blue", icon: "📦" },
    "Đang giao hàng": { color: "purple", icon: "🚚" },
    "Hoàn tất": { color: "green", icon: "✅" },
    "Thất bại": { color: "red", icon: "❌" },
    "Bị từ chối": { color: "volcano", icon: "🚫" },
  };

  const postStatusColors = {
    "Đang được đăng": { color: "green", icon: "🟢" },
    "Không được đăng": { color: "red", icon: "🔴" },
    "Đã xong": { color: "blue", icon: "🔵" },
  };

  const colorMap = type === "exchange" ? exchangeStatusColors : postStatusColors;
  const config = colorMap[status] || { color: "default", icon: "" };

  return (
    <Tag color={config.color} className="px-3 py-1 rounded-full">
      {config.icon} {status}
    </Tag>
  );
};

export default function ExchangeDetailModal({ visible, onClose, exchangeData }) {
    if (!exchangeData) return null;

    const subOrders = [
        {
            id: 'A-SEND',
            type: 'Đơn gửi',
            user: exchangeData.sender.name,
            avatar: exchangeData.sender.avatar,
            item: 'Gundam MG RX-78-2 Ver.3.0',
            status: 'Đã gửi',
            trackingCode: 'VNP123456789'
        },
        {
            id: 'A-RECEIVE',
            type: 'Đơn nhận',
            user: exchangeData.sender.name,
            avatar: exchangeData.sender.avatar,
            item: 'Gundam MG Sazabi Ver.Ka',
            status: 'Đang chờ',
            trackingCode: 'Chưa có'
        },
        {
            id: 'B-SEND',
            type: 'Đơn gửi',
            user: exchangeData.postOwner,
            avatar: 'https://i.pravatar.cc/32?img=2',
            item: 'Gundam MG Sazabi Ver.Ka',
            status: 'Đang chuẩn bị',
            trackingCode: 'Chưa có'
        },
        {
            id: 'B-RECEIVE',
            type: 'Đơn nhận',
            user: exchangeData.postOwner,
            avatar: 'https://i.pravatar.cc/32?img=2',
            item: 'Gundam MG RX-78-2 Ver.3.0',
            status: 'Chưa nhận',
            trackingCode: 'VNP123456789'
        }
    ];

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <SwapOutlined className="text-blue-500" />
                    <span>Chi tiết đơn trao đổi</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            width={900}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>
            ]}
        >
            <div className="space-y-6">
                {/* Thông tin chung */}
                <Card title="📋 Thông tin chung" size="small">
                    <Descriptions column={2}>
                        <Descriptions.Item label="Mã trao đổi">EX-{exchangeData.key.padStart(6, '0')}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">{getStatusTag(exchangeData.exchangeStatus, 'exchange')}</Descriptions.Item>
                        <Descriptions.Item label="Tiền chênh lệch">
                            <Text strong className="text-green-600">{formatPrice(exchangeData.priceDifference)}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">15/01/2025</Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Chi tiết 4 đơn nhỏ */}
                <Card title="📦 Chi tiết các đơn hàng" size="small">
                    <Row gutter={16}>
                        {subOrders.map((order) => (
                            <Col span={12} key={order.id} className="mb-4">
                                <Card
                                    size="small"
                                    className={`border-2 ${order.type === 'Đơn gửi' ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'}`}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Avatar src={order.avatar} size={24} />
                                                <Text strong>{order.user}</Text>
                                            </div>
                                            <Tag color={order.type === 'Đơn gửi' ? 'blue' : 'green'}>
                                                {order.type}
                                            </Tag>
                                        </div>

                                        <div>
                                            <Text className="text-gray-500">Sản phẩm:</Text>
                                            <br />
                                            <Text>{order.item}</Text>
                                        </div>

                                        <div className="flex justify-between">
                                            <div>
                                                <Text className="text-gray-500">Trạng thái:</Text>
                                                <br />
                                                <Tag color={order.status === 'Đã gửi' ? 'green' : 'orange'}>
                                                    {order.status}
                                                </Tag>
                                            </div>
                                            <div>
                                                <Text className="text-gray-500">Mã vận đơn:</Text>
                                                <br />
                                                <Text code>{order.trackingCode}</Text>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>

                {/* Timeline tiến trình */}
                <Card title="⏱️ Tiến trình trao đổi" size="small">
                    <Timeline
                        items={[
                            {
                                color: 'green',
                                children: (
                                    <div>
                                        <Text strong>Yêu cầu trao đổi được tạo</Text>
                                        <br />
                                        <Text className="text-gray-500">15/01/2025 14:30</Text>
                                    </div>
                                )
                            },
                            {
                                color: 'blue',
                                children: (
                                    <div>
                                        <Text strong>Người đăng bài chấp nhận</Text>
                                        <br />
                                        <Text className="text-gray-500">15/01/2025 16:45</Text>
                                    </div>
                                )
                            },
                            {
                                color: 'orange',
                                children: (
                                    <div>
                                        <Text strong>Đang trong quá trình giao hàng</Text>
                                        <br />
                                        <Text className="text-gray-500">16/01/2025 09:00</Text>
                                    </div>
                                )
                            }
                        ]}
                    />
                </Card>
            </div>
        </Modal>
    );
  }