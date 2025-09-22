import {
    Table,
    Tag,
    Card,
    Space,
    Avatar,
    Button,
    Tooltip,
    Typography,
} from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    TruckOutlined,
    UserOutlined,
    ShopOutlined,
    CalendarOutlined,
    PhoneOutlined
} from "@ant-design/icons";

const { Text } = Typography;

export default function OrdersTable ({ data, onViewOrder }) {
    // Helper functions
    const formatPrice = (amount) => `${amount.toLocaleString()}₫`;

    const renderStatus = (status) => {
        const statusConfig = {
            pending: { color: 'orange', text: 'Chờ xử lý', icon: <ClockCircleOutlined /> },
            processing: { color: 'blue', text: 'Đang xử lý' },
            shipping: { color: 'purple', text: 'Đang giao hàng', icon: <TruckOutlined /> },
            completed: { color: 'green', text: 'Hoàn thành', icon: <CheckCircleOutlined /> },
            failed: { color: 'red', text: 'Thất bại', icon: <ExclamationCircleOutlined /> },
            cancelled: { color: 'volcano', text: 'Đã hủy', icon: <ExclamationCircleOutlined /> },
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <Tag color={config.color} icon={config.icon}>
                {config.text}
            </Tag>
        );
    };

    const renderPaymentStatus = (paymentStatus) => {
        const config = {
            paid: { color: 'green', text: 'Đã thanh toán' },
            pending: { color: 'orange', text: 'Chờ thanh toán' },
            failed: { color: 'red', text: 'Thanh toán thất bại' },
            refunded: { color: 'purple', text: 'Đã hoàn tiền' },
        };

        const statusConfig = config[paymentStatus] || config.pending;

        return (
            <Tag color={statusConfig.color} size="small">
                {statusConfig.text}
            </Tag>
        );
    };

    const renderPaymentMethod = (method) => {
        const methodConfig = {
            bank_transfer: { text: 'Chuyển khoản', icon: '🏦' },
            ewallet: { text: 'Ví điện tử', icon: '📱' },
            credit_card: { text: 'Thẻ tín dụng', icon: '💳' },
            cod: { text: 'COD', icon: '💰' },
        };

        const config = methodConfig[method] || { text: method, icon: '💳' };

        return (
            <span className="text-sm">
                {config.icon} {config.text}
            </span>
        );
    };

    const columns = [
        {
            title: "Mã đơn hàng",
            key: "orderInfo",
            width: 130,
            render: (_, order) => (
                <div>
                    <Text code strong className="text-blue-600">{order.id}</Text>
                    <br />
                    <Text className="text-xs text-gray-500">{order.orderNumber}</Text>
                </div>
            ),
            fixed: 'left',
        },
        {
            title: "Mã vận đơn",
            dataIndex: "trackingCode",
            key: "trackingCode",
            width: 120,
            render: (code) => code ? (
                <Tooltip title="Mã vận đơn">
                    <Text code className="text-blue-600">
                        {code}
                    </Text>
                </Tooltip>
            ) : (
                <Tag color="orange" size="small">Chưa có</Tag>
            ),
        },
        {
            title: "Khách hàng",
            key: "customer",
            width: 220,
            render: (_, order) => (
                <Space>
                    <Avatar src={order.buyer.avatar} size={40} icon={<UserOutlined />} />
                    <div>
                        <div className="font-semibold text-gray-800">{order.buyer.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                            <PhoneOutlined className="mr-1" />
                            {order.buyer.phone}
                        </div>
                        <div className="text-xs text-gray-400">{order.buyer.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: "Cửa hàng",
            key: "shop",
            width: 200,
            render: (_, order) => (
                <Space>
                    <Avatar src={order.seller.avatar} size={40} icon={<ShopOutlined />} />
                    <div>
                        <div className="font-semibold text-gray-800">{order.seller.name}</div>
                        <div className="text-sm text-gray-600 flex items-center">
                            <ShopOutlined className="mr-1" />
                            {order.seller.shop}
                        </div>
                        <div className="text-xs text-gray-400">
                            <PhoneOutlined className="mr-1" />
                            {order.seller.phone}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: "Thông tin đơn hàng",
            key: "orderDetails",
            width: 200,
            render: (_, order) => (
                <div>
                    <div className="font-bold text-green-600 text-lg">
                        {formatPrice(order.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-600">
                        {renderPaymentMethod(order.paymentMethod)}
                    </div>
                    <div className="text-sm text-gray-500">
                        {order.products.length} sản phẩm
                    </div>
                    <div className="text-xs text-gray-400">
                        <CalendarOutlined className="mr-1" />
                        {order.orderDate}
                    </div>
                </div>
            ),
        },
        {
            title: "Thanh toán",
            key: "payment",
            width: 120,
            render: (_, order) => (
                <div className="text-center">
                    {renderPaymentStatus(order.paymentStatus)}
                </div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 130,
            render: renderStatus,
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 80,
            render: (_, order) => (
                <Button
                    icon={<EyeOutlined />}
                    type="text"
                    onClick={() => onViewOrder(order)}
                    title="Xem chi tiết"
                />
            ),
            fixed: 'right',
        },
    ];

    return (
        <Card>
            <div className="mb-4">
                <Text strong>
                    Hiển thị {data.length} đơn hàng
                </Text>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    total: data.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} đơn hàng`,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
                scroll={{ x: 1400 }}
                className="overflow-hidden"
                size="middle"
            />
        </Card>
    );
  }