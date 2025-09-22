import {
    Table,
    Tag,
    Typography,
    Card,
    Space,
    Avatar,
    Row,
    Col,
    Button,
    Modal,
    Divider,
    Steps,
} from "antd";
import {
    ShoppingCartOutlined,
    ClockCircleOutlined,
    ShopOutlined,
    PhoneOutlined,
    EnvironmentOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Step } = Steps;

export default function OrderDetailModal ({ visible, order, onClose }) {
    const formatPrice = (amount) => `${amount.toLocaleString()}₫`;

    const renderOrderTimeline = (order) => {
        if (!order) return null;

        let current = 0;
        const steps = [
            { title: 'Đặt hàng', status: 'finish', description: order.orderDate },
            { title: 'Xác nhận', status: 'wait', description: '' },
            { title: 'Đóng gói', status: 'wait', description: '' },
            { title: 'Giao hàng', status: 'wait', description: '' },
            { title: 'Hoàn thành', status: 'wait', description: '' },
        ];

        switch (order.status) {
            case 'pending':
                current = 1;
                steps[1].status = 'process';
                break;
            case 'processing':
                current = 2;
                steps[1].status = 'finish';
                steps[2].status = 'process';
                break;
            case 'shipping':
                current = 3;
                steps[1].status = 'finish';
                steps[2].status = 'finish';
                steps[3].status = 'process';
                break;
            case 'completed':
                current = 4;
                steps[1].status = 'finish';
                steps[2].status = 'finish';
                steps[3].status = 'finish';
                steps[4].status = 'finish';
                steps[4].description = order.actualDelivery || 'Đã giao hàng';
                break;
            case 'failed':
            case 'cancelled':
                steps[current + 1] = {
                    title: order.status === 'failed' ? 'Thất bại' : 'Đã hủy',
                    status: 'error',
                    description: order.notes
                };
                break;
        }

        return (
            <Steps current={current} size="small" direction="horizontal">
                {steps.map((step, index) => (
                    <Step
                        key={index}
                        title={step.title}
                        status={step.status}
                        description={step.description}
                    />
                ))}
            </Steps>
        );
    };

    if (!order) return null;

    return (
        <Modal
            title={
                <Space>
                    <ShoppingCartOutlined className="text-blue-500" />
                    <span>Chi tiết đơn hàng</span>
                    <Text code className="text-blue-600">{order.id}</Text>
                    <Tag color="blue">{order.orderNumber}</Tag>
                </Space>
            }
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>
            ]}
            width={900}
            styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
        >
            <div>
                {/* Order Status Timeline */}
                <div className="mb-6">
                    <Title level={5} className="mb-4">
                        <ClockCircleOutlined className="mr-2" />
                        Tiến trình đơn hàng
                    </Title>
                    {renderOrderTimeline(order)}
                </div>

                <Divider />

                {/* Order Basic Info */}
                <Row gutter={[24, 16]} className="mb-6">
                    <Col span={8}>
                        <Card size="small" className="h-full">
                            <div className="text-center">
                                <Title level={5} className="mb-2">Thông tin cơ bản</Title>
                                <Space direction="vertical" size="small" className="w-full">
                                    <div>
                                        <Text strong>Mã đơn hàng:</Text>
                                        <br />
                                        <Text code className="text-blue-600">{order.id}</Text>
                                    </div>
                                    <div>
                                        <Text strong>Số đơn hàng:</Text>
                                        <br />
                                        <Text>{order.orderNumber}</Text>
                                    </div>
                                    <div>
                                        <Text strong>Ngày đặt:</Text>
                                        <br />
                                        <Text>{order.orderDate}</Text>
                                    </div>
                                    <div>
                                        <Text strong>Trạng thái:</Text>
                                        <br />
                                        <Tag color={order.status === 'completed' ? 'green' : order.status === 'failed' ? 'red' : 'blue'}>
                                            {order.status === 'pending' ? 'Chờ xử lý' :
                                                order.status === 'processing' ? 'Đang xử lý' :
                                                    order.status === 'shipping' ? 'Đang giao hàng' :
                                                        order.status === 'completed' ? 'Hoàn thành' : 'Thất bại'}
                                        </Tag>
                                    </div>
                                </Space>
                            </div>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card size="small" title="👤 Thông tin khách hàng" className="h-full">
                            <Space direction="vertical" size="small" className="w-full">
                                <div className="flex items-center">
                                    <Avatar src={order.buyer.avatar} className="mr-2" size={32} />
                                    <Text strong>{order.buyer.name}</Text>
                                </div>
                                <div>
                                    <PhoneOutlined className="mr-2 text-blue-500" />
                                    <Text>{order.buyer.phone}</Text>
                                </div>
                                <div>
                                    <Text className="text-blue-500">✉️</Text>
                                    <Text className="ml-2">{order.buyer.email}</Text>
                                </div>
                                <div>
                                    <EnvironmentOutlined className="mr-2 text-red-500" />
                                    <Text>{order.buyer.address}</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card size="small" title="🏪 Thông tin cửa hàng" className="h-full">
                            <Space direction="vertical" size="small" className="w-full">
                                <div className="flex items-center">
                                    <Avatar src={order.seller.avatar} className="mr-2" size={32} />
                                    <Text strong>{order.seller.name}</Text>
                                </div>
                                <div>
                                    <ShopOutlined className="mr-2 text-green-500" />
                                    <Text>{order.seller.shop}</Text>
                                </div>
                                <div>
                                    <PhoneOutlined className="mr-2 text-blue-500" />
                                    <Text>{order.seller.phone}</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Shipping Info */}
                <Card size="small" className="mb-4" title="🚚 Thông tin giao hàng">
                    <Row gutter={[16, 8]}>
                        <Col span={12}>
                            <Text strong>Mã vận đơn: </Text>
                            {order.trackingCode ? (
                                <Text code className="text-blue-600">{order.trackingCode}</Text>
                            ) : (
                                ""
                            )}
                        </Col>
                        <Col span={12}>
                            <Text strong>Dự kiến giao hàng: </Text>
                            <Text>{order.estimatedDelivery}</Text>
                        </Col>
                        {order.actualDelivery && (
                            <Col span={12}>
                                <Text strong>Thực tế giao hàng: </Text>
                                <Text className="text-green-600">{order.actualDelivery}</Text>
                            </Col>
                        )}
                    </Row>
                </Card>

                {/* Products Table */}
                <div className="mb-4">
                    <Title level={5} className="mb-3">
                        Sản phẩm đã đặt ({order.products.length} items)
                    </Title>
                    <Table
                        size="small"
                        dataSource={order.products.map((p, i) => ({ ...p, key: i }))}
                        columns={[
                            {
                                title: 'SKU',
                                dataIndex: 'sku',
                                key: 'sku',
                                width: 80,
                                render: (sku) => <Text code className="text-xs">{sku}</Text>
                            },
                            { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
                            {
                                title: 'Số lượng',
                                dataIndex: 'quantity',
                                key: 'quantity',
                                width: 80,
                                align: 'center'
                            },
                            {
                                title: 'Đơn giá',
                                dataIndex: 'price',
                                key: 'price',
                                width: 120,
                                align: 'right',
                                render: (price) => <Text strong>{formatPrice(price)}</Text>
                            },
                            {
                                title: 'Thành tiền',
                                key: 'total',
                                width: 120,
                                align: 'right',
                                render: (_, product) => (
                                    <Text strong className="text-green-600">
                                        {formatPrice(product.price * product.quantity)}
                                    </Text>
                                )
                            },
                        ]}
                        pagination={false}
                        bordered
                    />
                </div>

                {/* Payment & Summary */}
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card size="small" title="💳 Thông tin thanh toán">
                            <Space direction="vertical" size="small" className="w-full">
                                <div>
                                    <Text strong>Phương thức: </Text>
                                    <span className="text-sm">
                                        {order.paymentMethod === 'bank_transfer' ? '🏦 Chuyển khoản' :
                                            order.paymentMethod === 'ewallet' ? '📱 Ví điện tử' :
                                                order.paymentMethod === 'credit_card' ? '💳 Thẻ tín dụng' :
                                                    order.paymentMethod === 'cod' ? '💰 COD' : order.paymentMethod}
                                    </span>
                                </div>
                                <div>
                                    <Text strong>Trạng thái: </Text>
                                    <Tag
                                        color={
                                            order.paymentStatus === 'paid' ? 'green' :
                                                order.paymentStatus === 'pending' ? 'orange' :
                                                    order.paymentStatus === 'failed' ? 'red' : 'purple'
                                        }
                                        size="small"
                                    >
                                        {order.paymentStatus === 'paid' ? 'Đã thanh toán' :
                                            order.paymentStatus === 'pending' ? 'Chờ thanh toán' :
                                                order.paymentStatus === 'failed' ? 'Thanh toán thất bại' : 'Đã hoàn tiền'}
                                    </Tag>
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card size="small" title="💰 Tổng kết đơn hàng" className="bg-gray-50">
                            <Space direction="vertical" size="small" className="w-full">
                                <div className="flex justify-between">
                                    <Text>Tạm tính:</Text>
                                    <Text>{formatPrice(order.subtotal)}</Text>
                                </div>
                                <div className="flex justify-between">
                                    <Text>Phí vận chuyển:</Text>
                                    <Text>{formatPrice(order.shippingFee)}</Text>
                                </div>
                                <Divider className="my-2" />
                                <div className="flex justify-between">
                                    <Text strong className="text-lg">Tổng cộng:</Text>
                                    <Text strong className="text-lg text-green-600">
                                        {formatPrice(order.totalAmount)}
                                    </Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Notes */}
                {order.notes && (
                    <>
                        <Divider />
                        <Card size="small" title="📝 Ghi chú">
                            <Text italic>{order.notes}</Text>
                        </Card>
                    </>
                )}
            </div>
        </Modal>
    );
}