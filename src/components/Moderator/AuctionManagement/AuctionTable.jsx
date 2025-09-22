import {
  Card,
  Table,
  Tag,
  Typography,
  Avatar,
  Button,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  EditOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

export default function AuctionTable({
    data,
    onViewDetail,
    onApprove,
    onReject,
    onChangeTime, // Thêm prop này
    loadingAction,
    formatCurrency,
    getStatusTag
}) {
    const columns = [
        {
            title: "👤 Người bán",
            dataIndex: "sellerId",
            key: "sellerId",
            width: 150,
            render: (sellerId) => (
                <div className="flex items-center gap-3">
                    <Avatar icon={<UserOutlined />} size={40} />
                    <div>
                        <div className="font-medium">{sellerId}</div>
                        <div className="text-xs text-gray-500">ID: {sellerId}</div>
                    </div>
                </div>
            ),
        },
        {
            title: "🎯 Tên Gundam",
            dataIndex: "gundamName",
            key: "gundamName",
            width: 250,
            ellipsis: {
                showTitle: false,
            },
            render: (text) => (
                <Tooltip title={text}>
                    <div className="max-w-xs font-medium">
                        {text}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "📊 Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 130,
            render: (status) => (
                <div className="text-center">
                    {getStatusTag(status)}
                </div>
            ),
        },
        {
            title: "🕒 Thời gian",
            key: "time",
            width: 200,
            render: (_, record) => (
                <div className="text-center whitespace-nowrap">
                    <div>
                        <ClockCircleOutlined className="mr-1" />
                        {dayjs(record.startTime).format('DD/MM HH:mm')}
                    </div>
                    <div className="text-xs text-gray-500">
                        → {dayjs(record.endTime).format('DD/MM HH:mm')}
                    </div>
                </div>
            ),
        },
        {
            title: "💰 Giá khởi điểm",
            dataIndex: "startingPrice",
            key: "startingPrice",
            width: 150,
            render: (price) => (
                <div className="text-center">
                    <div className="font-bold text-green-600 text-lg">
                        {formatCurrency(price)}
                    </div>
                </div>
            ),
        },
        {
            title: "📈 Bước giá",
            dataIndex: "stepPrice",
            key: "stepPrice",
            width: 120,
            render: (price) => (
                <div className="text-center">
                    <Text className="font-medium">{formatCurrency(price)}</Text>
                </div>
            ),
        },
        {
            title: "🛠️ Thao tác",
            key: "actions",
            width: 200,
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

                    {record.status === "pending" && (
                        <>
                            <Popconfirm
                                title="Phê duyệt yêu cầu đấu giá?"
                                description="Bạn có chắc chắn muốn phê duyệt yêu cầu này?"
                                onConfirm={() => onApprove(record.id)}
                                okText="Phê duyệt"
                                cancelText="Hủy"
                            >
                                <Tooltip title="Phê duyệt">
                                    <Button
                                        size="small"
                                        icon={<CheckCircleOutlined />}
                                        loading={loadingAction}
                                        className="border-green-500 text-green-500 hover:bg-green-50"
                                    />
                                </Tooltip>
                            </Popconfirm>

                            <Tooltip title="Từ chối">
                                <Button
                                    size="small"
                                    icon={<CloseCircleOutlined />}
                                    onClick={() => onReject(record.id)}
                                    className="border-red-500 text-red-500 hover:bg-red-50"
                                />
                            </Tooltip>
                        </>
                    )}

                    {(record.status === "approved" || record.status === "rejected") && (
                        <Tag color={record.status === "approved" ? "green" : "red"}>
                            Đã xử lý
                        </Tag>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Card title="📋 Danh sách yêu cầu đấu giá" className="shadow-sm">
            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    pageSize: 8,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`
                }}
                scroll={{ x: 1500 }} // Tăng scroll để phù hợp với các cột mới
                className="auction-table"
            />
        </Card>
    );
}