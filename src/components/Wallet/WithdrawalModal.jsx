import { useState } from 'react';
import { Modal, Steps, InputNumber, Button, Select, message, Alert, Card } from 'antd';
import { MinusOutlined, BankOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { RequestWalletWithdrawal, GetUserBankAccounts } from '../../apis/Wallet/APIWallet';

const { Step } = Steps;
const { Option } = Select;

const WithdrawalModal = ({ visible, onCancel, onSuccess, balance, bankAccounts: initialBankAccounts }) => {
    const [withdrawAmount, setWithdrawAmount] = useState(null);
    const [selectedBankAccount, setSelectedBankAccount] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [bankAccounts, setBankAccounts] = useState(initialBankAccounts || []);
    const [isLoadingBankAccounts, setIsLoadingBankAccounts] = useState(false);

    // Hàm load danh sách tài khoản ngân hàng nếu chưa có
    const loadBankAccounts = async () => {
        if (bankAccounts.length === 0) {
            try {
                setIsLoadingBankAccounts(true);
                const response = await GetUserBankAccounts();
                setBankAccounts(response.data || []);
            } catch (error) {
                message.error('Không thể tải danh sách tài khoản ngân hàng');
            } finally {
                setIsLoadingBankAccounts(false);
            }
        }
    };

    const handleClose = () => {
        if (!isProcessing) {
            setCurrentStep(0);
            setWithdrawAmount(null);
            setSelectedBankAccount(null);
            onCancel();
        }
    };

    const createWithdrawalRequest = async () => {
        try {
            const response = await RequestWalletWithdrawal(withdrawAmount, selectedBankAccount);
            return response.data;
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || 'Không thể tạo yêu cầu rút tiền';
                throw new Error(errorMessage);
            }
            throw new Error('Không thể kết nối đến server');
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || withdrawAmount < 50000 || withdrawAmount > 5000000) {
            message.error('Số tiền rút phải từ 50,000 - 5,000,000 VNĐ');
            return;
        }

        if (withdrawAmount > balance) {
            message.error('Số dư không đủ để thực hiện giao dịch');
            return;
        }

        if (!selectedBankAccount) {
            message.error('Vui lòng chọn tài khoản ngân hàng');
            return;
        }

        setIsProcessing(true);
        setCurrentStep(1);

        try {
            const result = await createWithdrawalRequest();

            if (result) {
                setCurrentStep(2);
                setTimeout(() => {
                    onSuccess(withdrawAmount);
                    handleClose();
                }, 2000);
            }
        } catch (error) {
            message.error(error.message);
            setCurrentStep(0);
        } finally {
            setIsProcessing(false);
        }
    };

    const quickAmounts = [50000, 100000, 500000, 1000000];
    const maxWithdraw = Math.min(balance, 5000000);

    return (
        <Modal
            title={
                <div className="flex items-center text-lg">
                    <MinusOutlined className="text-orange-500 mr-2" />
                    <span>Rút tiền từ ví</span>
                </div>
            }
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={650}
            closable={!isProcessing}
            maskClosable={!isProcessing}
            className="rounded-lg"
            afterOpenChange={(opened) => {
                if (opened) {
                    loadBankAccounts();
                }
            }}
        >
            <div className="mt-6">
                <Steps current={currentStep} className="mb-8">
                    <Step title="Nhập thông tin" />
                    <Step title="Xác nhận" />
                    <Step title="Hoàn thành" />
                </Steps>

                {/* Step 1: Enter withdrawal info */}
                {currentStep === 0 && (
                    <div className="space-y-6">
                        {/* Balance info */}
                        <Alert
                            message={
                                <div className="flex justify-between items-center">
                                    <span>Số dư khả dụng</span>
                                    <span className="font-bold text-lg">₫{balance.toLocaleString()}</span>
                                </div>
                            }
                            type="info"
                            showIcon
                            className="mb-4"
                        />

                        {/* Bank Account Selection */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-3">
                                Chọn tài khoản ngân hàng nhận tiền
                            </label>
                            {isLoadingBankAccounts ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                                </div>
                            ) : bankAccounts && bankAccounts.length > 0 ? (
                                <Select
                                    placeholder="Chọn tài khoản ngân hàng"
                                    value={selectedBankAccount}
                                    onChange={setSelectedBankAccount}
                                    className="w-full"
                                    size="large"
                                    loading={isLoadingBankAccounts}
                                >
                                    {bankAccounts.map(account => (
                                        <Option key={account.id} value={account.id}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-medium">{account.bank_name}</span>
                                                    <br />
                                                    <span className="text-gray-500 text-sm">
                                                        {account.account_number} - {account.account_holder}
                                                    </span>
                                                </div>
                                                <BankOutlined className="text-blue-500" />
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <BankOutlined className="text-4xl text-gray-400 mb-3" />
                                    <p className="text-gray-600 mb-3">Chưa có tài khoản ngân hàng</p>
                                    <Button type="primary" className="bg-blue-500">
                                        Thêm tài khoản ngân hàng
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-3">
                                Số tiền cần rút (VNĐ)
                            </label>
                            <InputNumber
                                placeholder="Nhập số tiền..."
                                value={withdrawAmount}
                                onChange={setWithdrawAmount}
                                min={50000}
                                max={maxWithdraw}
                                step={10000}
                                className="w-full"
                                size="large"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(value) => value.replace(/[^0-9]/g, "")}
                                addonAfter="VNĐ"
                            />
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-orange-600">
                                    ⚠️ Tối thiểu: 50,000 VNĐ
                                </span>
                                <span className="text-orange-600">
                                    Tối đa: ₫{maxWithdraw.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Quick amounts */}
                        <div>
                            <p className="text-gray-700 font-medium mb-3">Chọn nhanh:</p>
                            <div className="grid grid-cols-2 gap-3">
                                {quickAmounts.filter(amount => amount <= maxWithdraw).map(amount => (
                                    <Button
                                        key={amount}
                                        onClick={() => setWithdrawAmount(amount)}
                                        className={`h-12 ${withdrawAmount === amount
                                                ? 'bg-orange-50 border-orange-500 text-orange-600'
                                                : 'border-gray-300'
                                            }`}
                                        disabled={amount > balance}
                                    >
                                        <div>
                                            <div className="font-semibold">₫{amount.toLocaleString()}</div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Withdrawal info */}
                        <Card className="bg-blue-50 border-blue-200">
                            <div className="space-y-2 text-sm">
                                <h4 className="font-semibold text-blue-900">Thông tin rút tiền:</h4>
                                <p className="text-blue-800">• Thời gian xử lý: 1-3 ngày làm việc</p>
                                <p className="text-blue-800">• Phí rút tiền: Miễn phí</p>
                                <p className="text-blue-800">• Giờ làm việc: 8:00 - 17:00 (Thứ 2 - Thứ 6)</p>
                            </div>
                        </Card>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button onClick={handleClose} size="large">
                                Hủy bỏ
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleWithdraw}
                                disabled={!withdrawAmount || !selectedBankAccount || withdrawAmount < 50000 || withdrawAmount > maxWithdraw}
                                size="large"
                                className="bg-orange-500 hover:bg-orange-600"
                                loading={isLoadingBankAccounts}
                            >
                                Tạo yêu cầu rút tiền
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Confirmation */}
                {currentStep === 1 && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-lg font-medium text-gray-700">Đang xử lý yêu cầu rút tiền...</p>
                        <p className="text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
                    </div>
                )}

                {/* Step 3: Success */}
                {currentStep === 2 && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Yêu cầu rút tiền thành công!</h3>
                        <p className="text-gray-600 mb-4">
                            Chúng tôi sẽ xử lý yêu cầu của bạn trong vòng 1-3 ngày làm việc
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <div className="text-sm space-y-1">
                                <p><strong>Số tiền:</strong> ₫{withdrawAmount?.toLocaleString()}</p>
                                <p><strong>Tài khoản nhận:</strong> 
                                    {(() => {
                                        const account = bankAccounts.find(a => a.id === selectedBankAccount);
                                        return account ? `${account.bank_name} - ${account.account_number}` : 'Unknown';
                                    })()}
                                </p>
                                <p><strong>Thời gian:</strong> {new Date().toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default WithdrawalModal;