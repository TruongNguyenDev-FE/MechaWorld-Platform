import { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Card, Timeline, Popconfirm, Tooltip, Space, message } from 'antd';
import {
    EyeOutlined,
    StopOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    BankOutlined
} from '@ant-design/icons';
import { GetWithdrawalRequest,CancelWithdrawalRequest } from '../../apis/Wallet/APIWallet';

const WithdrawalHistory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchWithdrawalHistory = async () => {
        try {
            setLoading(true);
            const response = await GetWithdrawalRequest();
            setData(response.data || []);
        } catch (error) {
            message.error('Không thể tải lịch sử rút tiền');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawalHistory();
    }, []);

    const getStatusTag = (status) => {
        switch (status) {
            case 'completed':
                return <Tag icon={<CheckCircleOutlined />} color="success">Thành công</Tag>;
            case 'pending':
                return <Tag icon={<ClockCircleOutlined />} color="processing">Đang xử lý</Tag>;
            case 'rejected':
                return <Tag icon={<StopOutlined />} color="error">Đã từ chối</Tag>;
            case 'canceled':
                return <Tag icon={<ExclamationCircleOutlined />} color="warning">Đã hủy</Tag>;
            default:
                return <Tag color="default">{status}</Tag>;
        }
    };

    const columns = [
        {
            title: 'Mã yêu cầu',
            dataIndex: 'id',
            key: 'id',
            render: (id) => <span className="font-mono">#{id.substring(0, 8)}</span>,
        },
        {
            title: 'Ngân hàng',
            dataIndex: ['bank_account', 'bank_name'],
            key: 'bank_name',
            render: (bankName, record) => (
                <div className="flex items-center">
                    <BankOutlined className="mr-2 text-blue-500" />
                    <span>{bankName} ({record.bank_account.account_number})</span>
                </div>
            ),
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => (
                <span className="font-semibold">₫{amount.toLocaleString()}</span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status),
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setSelectedRecord(record);
                                setIsModalVisible(true);
                            }}
                        />
                    </Tooltip>
                    {record.status === 'pending' && (
                        <Popconfirm
                            title="Hủy yêu cầu rút tiền?"
                            onConfirm={() => handleCancelWithdrawal(record.id)}
                            okText="Đồng ý"
                            cancelText="Hủy"
                            okButtonProps={{ type: 'default', style: { borderColor: '#1677ff', color: '#1677ff' } }}
                        >
                            <Tooltip title="Hủy yêu cầu">
                                <Button type="text" danger icon={<StopOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const handleCancelWithdrawal = async (id) => {
        try {
            await CancelWithdrawalRequest(id);
            message.success('Đã hủy yêu cầu rút tiền');
            fetchWithdrawalHistory(); // Làm mới danh sách
        } catch (error) {
            if (error?.response?.status === 422) {
                message.error('Yêu cầu không còn ở trạng thái chờ xử lý');
            } else if (error?.response?.status === 403) {
                message.error('Bạn không có quyền hủy yêu cầu này');
            } else {
                message.error('Không thể hủy yêu cầu. Vui lòng thử lại');
            }
        }
    };


    const getTimelineItems = (record) => {
        const items = [
            {
                color: 'green',
                children: (
                    <div>
                        <p className="font-medium">Tạo yêu cầu rút tiền</p>
                        <p>{new Date(record.created_at).toLocaleString()}</p>
                    </div>
                ),
            },
        ];

        if (record.processed_at) {
            items.push({
                color: record.status === 'completed' ? 'green' : 'red',
                children: (
                    <div>
                        <p className="font-medium">
                            {record.status === 'completed' ? 'Hoàn thành' : 'Từ chối'}
                        </p>
                        <p>{new Date(record.processed_at).toLocaleString()}</p>
                        {record.rejected_reason && <p>Lý do: {record.rejected_reason}</p>}
                    </div>
                ),
            });
        }

        return items;
    };

    return (
        <div>
            <Card
                title="Lịch sử rút tiền"
                extra={
                    <Button type="primary" onClick={fetchWithdrawalHistory} loading={loading}>
                        Làm mới
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: true }}
                />
            </Card>

            <Modal
                title="Chi tiết yêu cầu rút tiền"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
            >
                {selectedRecord && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Mã yêu cầu: #{selectedRecord.id.substring(0, 8)}
                                </h3>
                                <p className="text-gray-500">
                                    {new Date(selectedRecord.created_at).toLocaleString()}
                                </p>
                            </div>
                            {getStatusTag(selectedRecord.status)}
                        </div>

                        <Card title="Thông tin ngân hàng" bordered={false}>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">Ngân hàng:</span>{' '}
                                    {selectedRecord.bank_account.bank_name}
                                </p>
                                <p>
                                    <span className="font-medium">Số tài khoản:</span>{' '}
                                    {selectedRecord.bank_account.account_number}
                                </p>
                                <p>
                                    <span className="font-medium">Tên chủ tài khoản:</span>{' '}
                                    {selectedRecord.bank_account.account_name}
                                </p>
                            </div>
                        </Card>

                        <Card title="Thông tin giao dịch" bordered={false}>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">Số tiền:</span>{' '}
                                    <span className="text-lg font-bold">
                                        ₫{selectedRecord.amount.toLocaleString()}
                                    </span>
                                </p>
                                {selectedRecord.transaction_reference && (
                                    <p>
                                        <span className="font-medium">Mã giao dịch:</span>{' '}
                                        {selectedRecord.transaction_reference}
                                    </p>
                                )}
                                {selectedRecord.rejected_reason && (
                                    <p>
                                        <span className="font-medium">Lý do từ chối:</span>{' '}
                                        <span className="text-red-500">
                                            {selectedRecord.rejected_reason}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </Card>

                        <Card title="Trạng thái" bordered={false}>
                            <Timeline items={getTimelineItems(selectedRecord)} />
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default WithdrawalHistory;