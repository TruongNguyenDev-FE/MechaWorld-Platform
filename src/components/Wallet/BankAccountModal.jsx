import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Card, List, Popconfirm } from 'antd';
import { BankOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { GetUserBankAccounts, AddUserBankAccount,DeleteUserBankAccount } from '../../apis/Wallet/APIWallet'; 
const { Option } = Select;

const BankAccountModal = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState({
        fetch: false,
        add: false,
        delete: false
    });
    const [bankAccounts, setBankAccounts] = useState([]);
    const [isAddingNew, setIsAddingNew] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchBanks();
            fetchBankAccounts();
        } else {
            form.resetFields();
        }
    }, [visible]);

    const fetchBanks = async () => {
        try {
            const response = await fetch('https://api.vietqr.io/v2/banks');
            const data = await response.json();
            setBanks(data.data || []);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách ngân hàng:', error);
            message.error('Không thể tải danh sách ngân hàng');
        }
    };

    const fetchBankAccounts = async () => {
        setLoading(prev => ({...prev, fetch: true}));
        try {
            const response = await GetUserBankAccounts();
            setBankAccounts(response.data || []);
        } catch (error) {
            console.error('Lỗi khi lấy tài khoản ngân hàng:', error);
            message.error(error.message || 'Không thể tải danh sách tài khoản');
        } finally {
            setLoading(prev => ({...prev, fetch: false}));
        }
    };

    const handleAddBankAccount = async (values) => {
        setLoading(prev => ({...prev, add: true}));
        try {
            // Clear validation errors trước khi submit
            form.setFields([
                { name: 'account_name', errors: null },
                { name: 'account_number', errors: null },
                { name: 'bank_code', errors: null }
            ]);

            const selectedBank = banks.find(bank => bank.code === values.bank_code);
            
            if (!selectedBank) {
                throw new Error('Ngân hàng không hợp lệ');
            }

            const result = await AddUserBankAccount({
                account_name: values.account_name.toUpperCase(),
                account_number: values.account_number,
                bank_code: values.bank_code,
                bank_name: selectedBank.name,
                bank_short_name: selectedBank.shortName,
            });

            if (!result.success) {
                message.success('Thêm tài khoản thành công ');
                form.resetFields();
                setIsAddingNew(false);
                fetchBankAccounts();
            } 
        } catch (error) {
            console.error('Lỗi:', error);
            
            // Hiển thị lỗi cụ thể lên các field tương ứng
            if (error.message.includes('AccountName')) {
                form.setFields([{ name: 'account_name', errors: [error.message] }]);
            }
            if (error.message.includes('BankShortName')) {
                form.setFields([{ name: 'bank_code', errors: [error.message] }]);
            }
            
            message.error(error.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(prev => ({...prev, add: false}));
        }
    };

    const handleDeleteBankAccount = async (accountId) => {
    setLoading(prev => ({...prev, delete: true}));
    try {
        await DeleteUserBankAccount(accountId);
        message.success('Xóa tài khoản thành công');
        fetchBankAccounts(); // Làm mới danh sách sau khi xóa
    } catch (error) {
        console.error('Lỗi khi xóa tài khoản:', error);
        message.error(error.message || 'Xóa tài khoản thất bại');
    } finally {
        setLoading(prev => ({...prev, delete: false}));
    }
};


    const handleClose = () => {
        setIsAddingNew(false);
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={
                <div className="flex items-center text-lg">
                    <BankOutlined className="text-blue-500 mr-2" />
                    <span>Quản lý tài khoản ngân hàng</span>
                </div>
            }
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={700}
            className="rounded-lg"
            destroyOnClose
        >
            <div className="space-y-6">
                {/* Existing Bank Accounts */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Tài khoản đã lưu</h3>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsAddingNew(true)}
                            disabled={loading.fetch || loading.delete}
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Thêm tài khoản mới
                        </Button>
                    </div>

                    {loading.fetch ? (
                        <Card className="text-center py-8 bg-gray-50">
                            <p className="text-gray-600">Đang tải danh sách tài khoản...</p>
                        </Card>
                    ) : bankAccounts.length > 0 ? (
                        <List
                            dataSource={bankAccounts}
                            renderItem={(account) => (
                                <List.Item
                                    actions={[
                                        <Popconfirm
                                            title="Bạn có chắc chắn muốn xóa tài khoản này?"
                                            onConfirm={() => handleDeleteBankAccount(account.id)}
                                            okText="Xóa"
                                            cancelText="Hủy"
                                            okButtonProps={{ danger: true }}
                                            disabled={loading.delete}
                                        >
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                danger
                                                size="small"
                                                loading={loading.delete}
                                            />
                                        </Popconfirm>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <BankOutlined className="text-blue-600 text-xl" />
                                            </div>
                                        }
                                        title={
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold">{account.bank_name}</span>
                                                {account.is_default && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                        Mặc định
                                                    </span>
                                                )}
                                            </div>
                                        }
                                        description={
                                            <div className="space-y-1">
                                                <p className="text-gray-700">
                                                    <strong>Chủ tài khoản:</strong> {account.account_name}
                                                </p>
                                                <p className="text-gray-700">
                                                    <strong>Số tài khoản:</strong>
                                                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                                                        {account.account_number}
                                                    </code>
                                                </p>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Card className="text-center py-8 bg-gray-50">
                            <BankOutlined className="text-4xl text-gray-400 mb-3" />
                            <p className="text-gray-600">Chưa có tài khoản ngân hàng nào</p>
                        </Card>
                    )}
                </div>

                {/* Add New Bank Account Form */}
                {isAddingNew && (
                    <Card title="Thêm tài khoản ngân hàng mới" className="border-blue-200">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleAddBankAccount}
                            className="space-y-4"
                            validateTrigger={['onChange', 'onBlur']}
                        >
                            <Form.Item
                                label="Tên chủ tài khoản"
                                name="account_name"
                                rules={[
                                    { 
                                        required: true, 
                                        message: 'Vui lòng nhập tên chủ tài khoản',
                                        whitespace: true 
                                    },
                                    { 
                                        pattern: /^[A-Z\s]+$/, 
                                        message: 'Tên phải viết hoa không dấu' 
                                    }
                                ]}
                                normalize={value => value?.toUpperCase()}
                            >
                                <Input
                                    placeholder="NGUYEN VAN A"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Số tài khoản"
                                name="account_number"
                                rules={[
                                    { 
                                        required: true, 
                                        message: 'Vui lòng nhập số tài khoản' 
                                    },
                                    { 
                                        pattern: /^\d{6,20}$/, 
                                        message: 'Số tài khoản phải từ 6-20 chữ số' 
                                    }
                                ]}
                            >
                                <Input
                                    placeholder="1234567890"
                                    size="large"
                                    maxLength={20}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Ngân hàng"
                                name="bank_code"
                                rules={[
                                    { 
                                        required: true, 
                                        message: 'Vui lòng chọn ngân hàng' 
                                    }
                                ]}
                            >
                                <Select
                                    placeholder="Chọn ngân hàng"
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {banks.map(bank => (
                                        <Option key={bank.code} value={bank.code}>
                                            <div className="flex items-center space-x-2">
                                                <img
                                                    src={bank.logo}
                                                    alt={bank.shortName}
                                                    className="w-6 h-6 object-contain"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                                <span>{bank.shortName} - {bank.name}</span>
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    onClick={() => {
                                        setIsAddingNew(false);
                                        form.resetFields();
                                    }}
                                    size="large"
                                    disabled={loading.add}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading.add}
                                    size="large"
                                    className="bg-blue-500 hover:bg-blue-600"
                                >
                                    Thêm tài khoản
                                </Button>
                            </div>
                        </Form>
                    </Card>
                )}

                {/* Important Notes */}
                <Card className="bg-yellow-50 border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">Lưu ý quan trọng:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Tên chủ tài khoản phải khớp với tên đăng ký trên hệ thống</li>
                        <li>• Chỉ hỗ trợ tài khoản ngân hàng Việt Nam</li>
                        <li>• Kiểm tra kỹ thông tin trước khi lưu</li>
                        <li>• Tài khoản đầu tiên sẽ được đặt làm mặc định</li>
                    </ul>
                </Card>
            </div>
        </Modal>
    );
};

export default BankAccountModal;