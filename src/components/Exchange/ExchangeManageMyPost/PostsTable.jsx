import { Table, Badge, Button, Tag, Space, Tooltip, Modal, Image, Typography } from "antd";
import {
    MessageOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    SwapOutlined
} from "@ant-design/icons";

const { confirm } = Modal;

export default function PostsTable({ onViewOffers, onViewGunplas, onDeletePost, userPost }) {
    const statusColors = {
        open: "green",
        active: "green",
        inactive: "default",
        exchanged: "blue",
        pending: "orange"
    };
    // Delete post confirmation
    const showDeleteConfirm = (postId) => {
        confirm({
            title: 'Xóa bài viết Trao đổi?',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div className="text-red-600 space-y-2 text-base">
                    <p>
                        - Bài viết sẽ bị <strong>xóa vĩnh viễn</strong> khỏi nền tảng.
                    </p>
                    <p>
                        - Mọi đề xuất trao đổi cũng sẽ bị <strong>hủy bỏ.</strong>
                    </p>
                    <p>
                        - <strong>Hành động này không thể hoàn tác.</strong>
                    </p>
                </div>
            ),
            okText: 'Xóa bài viết',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                onDeletePost(postId);
            },
        });
    };

    // Columns for posts table
    const columns = [
        {
            title: "Ảnh",
            dataIndex: "exchange_post",
            key: "image",
            width: 120,
            align: 'center',
            render: (exchange_post) => (
                <div className="flex justify-center">
                    <Image
                        src={exchange_post?.post_image_urls[0] || "/placeholder.png"}
                        alt="Gundam image"
                        width={80}
                        height={80}
                        className="object-cover"
                        preview={false}
                    />
                </div>
            ),
        },
        {
            title: "Nội dung",
            dataIndex: "exchange_post",
            key: "content",
            align: "center",
            render: (exchange_post) => (
                <Typography.Paragraph
                    ellipsis={{ rows: 4, expandable: true, symbol: 'Xem thêm' }}
                    style={{ margin: 0, maxWidth: 400, textAlign: 'left' }} // có thể giới hạn chiều ngang nếu cần
                >
                    {exchange_post?.content}
                </Typography.Paragraph>
            ),
        },
        {
            title: "Đề xuất",
            key: "offers",
            dataIndex: "offers",
            width: 130,
            align: 'center',
            render: (offer_count) => (
                <div className="flex items-center justify-center">
                    <Badge count={offer_count.length} showZero offset={[10, 0]}>
                        <SwapOutlined className="text-base" />
                    </Badge>
                </div>
            ),
        },
        // {
        //     title: "Gundam trao đổi",
        //     dataIndex: "exchange_post_items",
        //     key: "gunplasCount",
        //     width: 140,
        //     align: 'center',
        //     render: (exchange_post_items) => (
        //         <Button
        //             icon={<EyeOutlined />}
        //             onClick={() => onViewGunplas(exchange_post_items)}
        //         >
        //             {exchange_post_items?.length} mô hình
        //         </Button>
        //     ),
        // },
        {
            title: "Trạng thái",
            dataIndex: "exchange_post",
            key: "status",
            width: 120,
            align: 'center',
            render: (exchange_post) => (
                <Tag color={statusColors[exchange_post?.status]}>
                    {exchange_post?.status === "open" ? "Đang trao đổi" :
                        exchange_post?.status === "active" ? "Đang trao đổi" :
                            exchange_post?.status === "inactive" ? "Tạm ngừng" :
                                exchange_post?.status === "exchanged" ? "Đã trao đổi" : "Đang xử lý"}
                </Tag>
            ),
        },
        {
            title: "Ngày đăng",
            dataIndex: "exchange_post",
            key: "createdAt",
            width: 120,
            align: 'center',
            render: (exchange_post) => (
                <div>{new Date(exchange_post?.created_at).toLocaleDateString()}</div>
            )
        },
        {
            title: "Hành động",
            key: "action",
            width: 180,
            align: 'center',
            render: (record) => (
                <Space>
                    <Button
                        icon={<MessageOutlined />}
                        type="primary"
                        onClick={() => onViewOffers(record)}
                        disabled={record.offers.length === 0}
                        className="bg-blue-500"
                    >
                        Xem đề xuất
                    </Button>
                    {/* <Tooltip title="Chỉnh sửa">
                        <Button icon={<EditOutlined />} />
                    </Tooltip> */}
                    <Tooltip title="Xóa">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteConfirm(record.exchange_post.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="overflow-x-auto">
            <Table
                columns={columns}
                // dataSource={posts}
                dataSource={userPost}
                rowKey="id"
                pagination={{ pageSize: 3 }}
                bordered
                className="gundam-table"
                rowClassName={(record, index) => index % 2 === 0 ? 'bg-gray-50' : ''}
            />
        </div>
    );
}