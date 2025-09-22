import {
  Card,
  Table,
  Avatar,
  Button,
  Tooltip,
  Tag,
} from "antd";
import {
  InfoCircleOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";

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


export default function ExchangeTable({ data, onViewDetail }) {
    const columns = [
        {
            title: "📜 Nội dung trao đổi",
            dataIndex: "content",
            key: "content",
            width: 300,
            ellipsis: {
                showTitle: false,
            },
            render: (text) => (
                <Tooltip title={text}>
                    <div className="max-w-xs">
                        {text.length > 60 ? `${text.substring(0, 60)}...` : text}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "👤 Người gửi yêu cầu",
            dataIndex: "sender",
            key: "sender",
            width: 200,
            render: (sender) => (
                <div className="flex items-center gap-3">
                    <Avatar src={sender.avatar} size={40} />
                    <div>
                        <div className="font-medium">{sender.name}</div>
                        <div className="text-xs text-gray-500">ID: {sender.id || 'U00001'}</div>
                    </div>
                </div>
            ),
        },
        {
            title: "🎯 Người đăng bài",
            dataIndex: "postOwner",
            key: "postOwner",
            width: 150,
            render: (name) => (
                <div className="flex items-center gap-2">
                    <Avatar size={32} icon={<UserOutlined />} />
                    <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-xs text-gray-500">Chủ bài</div>
                    </div>
                </div>
            ),
        },
        {
            title: "💰 Chênh lệch",
            dataIndex: "priceDifference",
            key: "priceDifference",
            width: 130,
            render: (amount) => (
                <div className="text-center">
                    <div className={`font-bold text-lg ${amount > 0 ? 'text-red-600' : amount < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        {amount > 0 ? '+' : ''}{formatPrice(amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                        {amount > 0 ? 'Người gửi trả thêm' : amount < 0 ? 'Người nhận trả thêm' : 'Không chênh lệch'}
                    </div>
                </div>
            ),
        },
        {
            title: "🔄 Trạng thái trao đổi",
            dataIndex: "exchangeStatus",
            key: "exchangeStatus",
            width: 150,
            render: (status) => (
                <div className="text-center">
                    {getStatusTag(status, "exchange")}
                </div>
            ),
        },
        {
            title: "📢 Trạng thái bài",
            dataIndex: "postStatus",
            key: "postStatus",
            width: 130,
            render: (status) => (
                <div className="text-center">
                    {getStatusTag(status, "post")}
                </div>
            ),
        },
        {
            title: "🛠️ Thao tác",
            key: "actions",
            width: 120,
            render: (_, record) => (
                <div className="flex gap-2 justify-center">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="primary"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => onViewDetail(record)}
                            className="bg-blue-500 hover:bg-blue-600"
                        />
                    </Tooltip>
                    <Tooltip title="Quản lý">
                        <Button
                            size="small"
                            icon={<InfoCircleOutlined />}
                            className="border-orange-500 text-orange-500 hover:bg-orange-50"
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <Card title="📋 Danh sách trao đổi" className="shadow-sm">
            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    pageSize: 8,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`
                }}
                scroll={{ x: 1200 }}
                className="exchange-table"
            />
        </Card>
    );
  };