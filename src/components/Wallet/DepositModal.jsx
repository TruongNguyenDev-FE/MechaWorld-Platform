import { useState } from 'react';
import { Modal, Steps, InputNumber, Button, QRCode, message } from 'antd';
import { PlusOutlined, LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { AddMoney } from '../../apis/Wallet/APIWallet';

const { Step } = Steps;

const DepositModal = ({ visible, onCancel, onSuccess }) => {
    const [depositAmount, setDepositAmount] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentData, setPaymentData] = useState(null);

    const handleClose = () => {
        if (!isProcessing) {
            setCurrentStep(0);
            setDepositAmount(null);
            setPaymentData(null);
            onCancel();
        }
    };

    const createPaymentOrder = async (amount) => {
        try {
            const response = await AddMoney(
                amount,
                "Nạp tiền vào ví MechaWorld",
                `${window.location.origin}/member/profile/wallet`
            );

            if (response.data && response.data.order_url) {
                return {
                    success: true,
                    data: {
                        order_url: response.data.order_url,
                        order_id: response.data.order_id || Date.now().toString()
                    }
                };
            }
            throw new Error(response.data?.message || 'Không nhận được link thanh toán');
        } catch (error) {
            console.error('Lỗi API:', error);
            throw new Error(`Lỗi hệ thống: ${error.message}`);
        }
    };

    const handleDeposit = async () => {
        if (!depositAmount || depositAmount < 10000) {
            message.error('Số tiền nạp tối thiểu là 10,000 VNĐ');
            return;
        }

        setIsProcessing(true);
        setCurrentStep(1);

        try {
            const result = await createPaymentOrder(depositAmount);

            if (result.success) {
                setPaymentData({
                    amount: depositAmount,
                    orderUrl: result.data.order_url,
                    orderId: result.data.order_id
                });
                setCurrentStep(2);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            message.error(error.message.replace('Lỗi hệ thống: ', ''));
            setCurrentStep(0);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentComplete = () => {
        onSuccess(depositAmount);
        handleClose();
        message.success(`Nạp tiền thành công ${depositAmount.toLocaleString()} VNĐ`);
    };

    const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

    return (
        <Modal
            title={
                <div className="flex items-center text-lg">
                    <PlusOutlined className="text-green-500 mr-2" />
                    <span>Nạp tiền vào ví</span>
                </div>
            }
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={650}
            closable={!isProcessing}
            maskClosable={!isProcessing}
            className="rounded-lg"
        >
            <div className="mt-6">
                <Steps current={currentStep} className="mb-8">
                    <Step title="Nhập số tiền" />
                    <Step
                        title="Đang xử lý"
                        icon={isProcessing && currentStep === 1 ? <LoadingOutlined /> : null}
                    />
                    <Step title="Thanh toán" />
                </Steps>

                {/* Step 1: Enter Amount */}
                {currentStep === 0 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-3">
                                Số tiền cần nạp (VNĐ)
                            </label>
                            <InputNumber
                                placeholder="Nhập số tiền..."
                                value={depositAmount}
                                onChange={setDepositAmount}
                                min={10000}
                                step={10000}
                                className="w-full"
                                size="large"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(value) => value.replace(/[^0-9]/g, "")}
                                addonAfter="VNĐ"
                                style={{ fontSize: '16px' }}
                            />
                            <p className="text-orange-600 text-sm mt-2 flex items-center">
                                <span className="mr-1">⚠️</span>
                                Số tiền nạp tối thiểu: 10,000 VNĐ
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-700 font-medium mb-3">Chọn nhanh:</p>
                            <div className="grid grid-cols-3 gap-3">
                                {quickAmounts.map(amount => (
                                    <Button
                                        key={amount}
                                        onClick={() => setDepositAmount(amount)}
                                        className={`h-12 text-center ${depositAmount === amount
                                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                                : 'border-gray-300'
                                            }`}
                                    >
                                        <div>
                                            <div className="font-semibold">{(amount / 1000)}K</div>
                                            <div className="text-xs text-gray-500">₫{amount.toLocaleString()}</div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button onClick={handleClose} size="large">
                                Hủy bỏ
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleDeposit}
                                disabled={!depositAmount || depositAmount < 10000}
                                size="large"
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                Tiếp tục
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Processing */}
                {currentStep === 1 && (
                    <div className="text-center py-12">
                        <LoadingOutlined style={{ fontSize: 48 }} className="text-blue-500 mb-4" />
                        <p className="text-lg font-medium text-gray-700">Đang tạo yêu cầu nạp tiền...</p>
                        <p className="text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
                    </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 2 && paymentData && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 text-center">
                            <CheckCircleOutlined className="text-green-500 text-2xl mb-2" />
                            <p className="text-green-800 font-semibold">Yêu cầu nạp tiền đã được tạo thành công!</p>
                            <div className="mt-3 space-y-1">
                                <p className="text-gray-700">Số tiền: <span className="font-bold text-green-600">₫{paymentData.amount.toLocaleString()}</span></p>
                                <p className="text-gray-600 text-sm">Mã giao dịch: <code className="bg-white px-2 py-1 rounded text-xs">{paymentData.orderId}</code></p>
                            </div>
                        </div>

                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Thanh toán qua ZaloPay
                            </h3>

                            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                                <QRCode
                                    value={paymentData.orderUrl}
                                    size={200}
                                    className="mx-auto mb-4"
                                    color="#1890ff"
                                />
                                <p className="text-sm text-gray-600 mb-4">Quét mã QR bằng ứng dụng ZaloPay</p>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    type="primary"
                                    size="large"
                                    className="w-full bg-blue-500 hover:bg-blue-600 h-12"
                                    onClick={() => window.open(paymentData.orderUrl, '_blank')}
                                >
                                    Mở cổng ZaloPay để thanh toán
                                </Button>

                                {/* <Button
                                    type="default"
                                    size="large"
                                    className="w-full h-12 border-green-500 text-green-600 hover:bg-green-50"
                                    onClick={handlePaymentComplete}
                                >
                                    <CheckCircleOutlined className="mr-2" />
                                    Tôi đã thanh toán thành công
                                </Button> */}
                            </div>

                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 text-sm">
                                    💡 <strong>Lưu ý:</strong> Sau khi thanh toán thành công, vui lòng nhấn "Tôi đã thanh toán thành công" để hoàn tất giao dịch.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default DepositModal;