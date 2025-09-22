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
    Image
} from "antd";
import {
    UserOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export default function AuctionDetailModal({ visible, onClose, auctionData, formatCurrency, getStatusTag }) {
    if (!auctionData) return null;

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <span>Chi tiết đấu giá</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>
            ]}
        >
            <div className="space-y-6">
                {/* Thông tin sản phẩm */}
                <Card title="🎯 Thông tin sản phẩm" size="small">
                    <Row gutter={16}>
                        <Col span={8}>
                            <div className="text-center">
                                <Image
                                    src={auctionData.gundamSnapshot?.image_url || 'https://via.placeholder.com/200'}
                                    alt={auctionData.gundamName}
                                    width={200}
                                    className="rounded-lg"
                                />
                            </div>
                        </Col>
                        <Col span={16}>
                            <Descriptions column={1}>
                                <Descriptions.Item label="Tên sản phẩm">
                                    <Text strong>{auctionData.gundamName}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Grade">
                                    <Tag color="blue">{auctionData.gundamSnapshot?.grade || 'N/A'}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Scale">
                                    <Text>{auctionData.gundamSnapshot?.scale || 'N/A'}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Số lượng">
                                    <Text>{auctionData.gundamSnapshot?.quantity || 1}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Trọng lượng">
                                    <Text>{auctionData.gundamSnapshot?.weight || 'N/A'}g</Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                </Card>

                {/* Thông tin đấu giá */}
                <Card title="💰 Thông tin đấu giá" size="small">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Descriptions column={1}>
                                <Descriptions.Item label="Mã đấu giá">
                                    <Text code>AU-{auctionData.id?.toString().padStart(6, '0')}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Giá khởi điểm">
                                    <Text strong className="text-green-600">
                                        {formatCurrency(auctionData.startingPrice)}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Bước giá">
                                    <Text>{formatCurrency(auctionData.stepPrice)}</Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col span={12}>
                            <Descriptions column={1}>
                                <Descriptions.Item label="Người bán">
                                    <div className="flex items-center gap-2">
                                        <Avatar icon={<UserOutlined />} />
                                        <Text>{auctionData.sellerId}</Text>
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Trạng thái">
                                    {getStatusTag(auctionData.status)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày tạo">
                                    <Text>15/01/2025 14:30</Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                </Card>

                {/* Timeline nếu có */}
                <Card title="⏱️ Lịch sử đấu giá" size="small">
                    <Timeline
                        items={[
                            {
                                color: 'blue',
                                children: (
                                    <div>
                                        <Text strong>Yêu cầu đấu giá được tạo</Text>
                                        <br />
                                        <Text className="text-gray-500">15/01/2025 14:30</Text>
                                    </div>
                                )
                            },
                            {
                                color: auctionData.status === 'approved' ? 'green' : 'orange',
                                children: (
                                    <div>
                                        <Text strong>
                                            {auctionData.status === 'approved' ? 'Đã phê duyệt' : 'Đang chờ duyệt'}
                                        </Text>
                                        <br />
                                        <Text className="text-gray-500">
                                            {auctionData.status === 'approved' ? '15/01/2025 16:45' : 'Chờ xử lý'}
                                        </Text>
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