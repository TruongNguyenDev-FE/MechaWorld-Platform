import { Space, Avatar, Tag, Button, Typography } from 'antd';
import {
    UserOutlined,
    BankOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    CreditCardOutlined,
    CalendarOutlined
} from '@ant-design/icons';

const { Text } = Typography;

// Sửa lỗi dấu nháy và fallback giá trị
export const formatPrice = (amount) => (typeof amount === 'number' ? `${amount.toLocaleString('vi-VN')}₫` : '0₫');

export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
};

export const renderStatus = (status) => {
    const statusConfig = {
        pending: { color: 'orange', text: 'Chờ xử lý', icon: <ClockCircleOutlined /> },
        completed: { color: 'green', text: 'Đã hoàn thành', icon: <CheckCircleOutlined /> },
        rejected: { color: 'red', text: 'Đã từ chối', icon: <ExclamationCircleOutlined /> },
        canceled: { color: 'gray', text: 'Đã hủy', icon: <CreditCardOutlined /> },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
        <Tag color={config.color} icon={config.icon}>
            {config.text}
        </Tag>
    );
};

export const getWithdrawalColumns = (handleViewDetails, handleProcessRequest) => [
    {
        title: "Mã yêu cầu",
        dataIndex: "id",
        key: "id",
        render: (id) => <Text code>#{id?.slice(0, 8)}</Text>,
        fixed: 'left',
        width: 120,
    },
    {
        title: "Thông tin người dùng",
        key: "userInfo",
        width: 200,
        render: (_, record) => (
            <Space>
                <Avatar size={40} icon={<UserOutlined />} />
                <div>
                    
                    <div className="text-xs text-gray-500">
                        <BankOutlined className="mr-1" />
                        {record.bank_account.account_name}
                    </div>
                </div>
            </Space>
        ),
    },
    {
        title: "Số tiền",
        dataIndex: "amount",
        key: "amount",
        render: (amount) => <Text strong type="danger">{formatPrice(amount)}</Text>,
        width: 120,
    },
    {
        title: "Ngân hàng",
        key: "bank",
        render: (_, record) => (
            <Space direction="vertical" size={0}>
                <Text strong>{record.bank_account?.bank_name || ''}</Text>
                <Text type="secondary">{record.bank_account?.account_number || ''}</Text>
            </Space>
        ),
        width: 200,
    },
    {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: renderStatus,
        width: 150,
    },
    {
        title: "Thao tác",
        key: "actions",
        fixed: 'right',
        render: (_, record) => (
            <Space>
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(record)}
                />
                {record.status === 'pending' && (
                    <Button
                        type="primary"
                        onClick={() => handleProcessRequest(record)}
                    >
                        Xử lý
                    </Button>
                )}
            </Space>
        ),
        width: 150,
    },
];