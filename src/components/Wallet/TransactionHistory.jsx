import { Table, Tag, Button, Modal, Card, Input } from 'antd';
import { SearchOutlined, FileTextOutlined } from '@ant-design/icons';

const { Search } = Input;

// Mapping các loại giao dịch
const transactionTypeMap = {
    deposit: { text: 'Nạp tiền', color: 'green', icon: '↗' },
    withdrawal: { text: 'Rút tiền', color: 'red', icon: '↙' },
    payment: { text: 'Thanh toán', color: 'orange', icon: '→' },
    payment_received: { text: 'Nhận thanh toán', color: 'blue', icon: '←' },
    refund: { text: 'Hoàn tiền', color: 'purple', icon: '↻' },
    hold_funds: { text: 'Tạm giữ tiền', color: 'gold', icon: '⏸' },
    release_funds: { text: 'Giải phóng tiền', color: 'cyan', icon: '▶' },
    exchange_compensation_hold: { text: 'Tạm giữ bồi thường', color: 'volcano', icon: '⏸' },
    exchange_compensation_transfer: { text: 'Chuyển bồi thường', color: 'magenta', icon: '→' },
    exchange_compensation_release: { text: 'Giải phóng bồi thường', color: 'lime', icon: '▶' },
    auction_deposit: { text: 'Đặt cọc đấu giá', color: 'geekblue', icon: '🔨' },
    auction_deposit_refund: { text: 'Hoàn tiền đấu giá', color: 'purple', icon: '↻' },
    auction_compensation: { text: 'Bồi thường đấu giá', color: 'volcano', icon: '⚖' },
    auction_winner_payment: { text: 'Thanh toán đấu giá', color: 'orange', icon: '🏆' },
    auction_seller_payment: { text: 'Nhận tiền đấu giá', color: 'blue', icon: '💰' },
    subscription_payment: { text: 'Thanh toán gói dịch vụ', color: 'gold', icon: '📦' }
};

// Mapping trạng thái giao dịch
const statusMap = {
    completed: { text: 'Thành công', color: 'success' },
    pending: { text: 'Đang xử lý', color: 'processing' },
    failed: { text: 'Thất bại', color: 'error' },
    canceled: { text: 'Đã hủy', color: 'warning' },
};

const isPositiveTransaction = (entryType) => {
  const positiveTypes = ['deposit', 'refund', 'release_funds', 'auction_deposit_refund', 'auction_compensation'];
  return positiveTypes.includes(entryType);
};

const TransactionHistory = ({ transactions, loading }) => {
    const showTransactionDetail = (transaction) => {
        const typeInfo = transactionTypeMap[transaction.entry_type] || {};
        const statusInfo = statusMap[transaction.status] || {};

        Modal.info({
            title: (
                <div className="flex items-center">
                    <FileTextOutlined className="mr-2 text-blue-500" />
                    Chi tiết giao dịch
                </div>
            ),
            width: 650,
            content: (
                <div className="space-y-4 mt-4">
                    <Card size="small" className="bg-gray-50">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Mã giao dịch</p>
                                <p className="font-mono text-sm bg-white px-2 py-1 rounded border">
                                    {transaction.reference_id}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Loại giao dịch</p>
                                <Tag color={typeInfo.color} className="text-sm">
                                    {typeInfo.icon} {typeInfo.text || transaction.entry_type}
                                </Tag>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Số tiền</p>
                            <p className={`text-lg font-semibold ${
                                isPositiveTransaction(transaction.entry_type) ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {isPositiveTransaction(transaction.entry_type) ? '+' : '-'}₫{transaction.amount.toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-600 text-sm mb-1">Trạng thái</p>
                            <Tag color={statusInfo.color} className="text-sm">
                                {statusInfo.text || transaction.status}
                            </Tag>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Thời gian tạo</p>
                            <p className="font-medium">{new Date(transaction.created_at).toLocaleString('vi-VN')}</p>
                        </div>

                        {transaction.completed_at && (
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Thời gian hoàn thành</p>
                                <p className="font-medium">{new Date(transaction.completed_at).toLocaleString('vi-VN')}</p>
                            </div>
                        )}

                        <div>
                            <p className="text-gray-600 text-sm mb-1">Mô tả</p>
                            <p className="bg-gray-50 p-2 rounded text-sm">{transaction.reference_type || 'Không có mô tả'}</p>
                        </div>
                    </div>
                </div>
            ),
            okText: 'Đóng',
            okButtonProps: {
                className: 'bg-blue-500 hover:bg-blue-600 border-blue-500',
            },
        });
    };

    const columns = [
        {
            title: "Thời gian",
            dataIndex: "created_at",
            key: "created_at",
            width: 180,
            render: (date) => (
                <div>
                    <div className="font-medium text-gray-900">
                        {new Date(date).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-sm text-gray-500">
                        {new Date(date).toLocaleTimeString('vi-VN')}
                    </div>
                </div>
            ),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            defaultSortOrder: 'descend'
        },
        {
            title: "Loại giao dịch",
            dataIndex: "entry_type",
            key: "entry_type",
            width: 200,
            render: (type) => {
                const typeInfo = transactionTypeMap[type] || {};
                return (
                    <Tag color={typeInfo.color} className="text-sm">
                        <span className="mr-1">{typeInfo.icon}</span>
                        {typeInfo.text || type}
                    </Tag>
                );
            },
            filters: Object.entries(transactionTypeMap).map(([key, value]) => ({
                text: value.text,
                value: key
            })),
            onFilter: (value, record) => record.entry_type === value,
        },
        {
            title: "Số tiền",
            dataIndex: "amount",
            key: "amount",
            width: 150,
            render: (amount, record) => {
  const isPositive = isPositiveTransaction(record.entry_type);
  return (
    <div className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? '+' : ''}{amount.toLocaleString()}₫
    </div>
  );
}
,
            sorter: (a, b) => a.amount - b.amount
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status) => {
                const statusInfo = statusMap[status] || {};
                return (
                    <Tag color={statusInfo.color}>
                        {statusInfo.text || status}
                    </Tag>
                );
            },
            filters: Object.entries(statusMap).map(([key, value]) => ({
                text: value.text,
                value: key
            })),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Mã giao dịch",
            dataIndex: "reference_id",
            key: "reference_id",
            width: 150,
            render: (id) => (
                <code className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                    {id}
                </code>
            )
        },
        {
            title: "Thao tác",
            key: "action",
            width: 100,
            render: (_, record) => (
                <Button
                    type="link"
                    size="small"
                    onClick={() => showTransactionDetail(record)}
                    className="text-blue-600 hover:text-blue-800"
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    return (
        <Card className="shadow-sm border-0">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Lịch sử giao dịch</h2>
                    <p className="text-gray-600 text-sm mt-1">Theo dõi tất cả các giao dịch của bạn</p>
                </div>
                <Search
                    placeholder="Tìm kiếm giao dịch..."
                    allowClear
                    style={{ width: 250 }}
                    prefix={<SearchOutlined />}
                />
            </div>

            <Table
                columns={columns}
                dataSource={transactions}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 15,
                    showSizeChanger: true,
                    pageSizeOptions: ['15', '30', '50'],
                    showTotal: (total) => `Tổng ${total} giao dịch`,
                    showQuickJumper: true
                }}
                scroll={{ x: true }}
                className="border border-gray-200 rounded-lg"
                size="middle"
            />
        </Card>
    );
};

export default TransactionHistory;