import { useState } from 'react';
import {
    Modal,
    Space,
    Typography,
    Button,
    Card,
    Row,
    Col,
    Form,
    Input,
    Alert,
    message,
    Steps,
    Avatar,
    Tag,
    Popconfirm
} from 'antd';
import {
    BankOutlined,
    CheckCircleOutlined,
    WarningOutlined,
    SafetyOutlined,
    CreditCardOutlined,
    FileTextOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Step } = Steps;

const ProcessRequestModal = ({ visible, record, onClose, onComplete, onReject }) => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const formatPrice = (amount) => `${amount.toLocaleString()}₫`;

    const handleComplete = async (values) => {
        setLoading(true);
        try {
            await onComplete(record.id, values.transactionCode);
            message.success('✅ Đã đánh dấu hoàn thành thành công!');
            handleClose();
        } catch (error) {
            message.error('❌ Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (values) => {
        setLoading(true);
        try {
            await onReject(record.id, values.rejectReason);
            message.success('✅ Đã từ chối yêu cầu rút tiền!');
            handleClose();
        } catch (error) {
            message.error('❌ Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setCurrentStep(0);
        onClose();
    };

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    // Check validation
    const hasInsufficientBalance = record && record.amount > record.user.accountBalance;
    const isValidRequest = record && !hasInsufficientBalance;

    if (!record) return null;

    const steps = [
        {
            title: 'Xem thông tin',
            icon: <FileTextOutlined />,
            description: 'Kiểm tra thông tin yêu cầu'
        },
        {
            title: 'Chọn hành động',
            icon: <SafetyOutlined />,
            description: 'Quyết định xử lý'
        },
        {
            title: 'Xác nhận',
            icon: <CheckCircleOutlined />,
            description: 'Hoàn tất xử lý'
        }
    ];

    return (
        <Modal
            title={
                <Space>
                    <BankOutlined className="text-blue-500" />
                    <span>Xử lý yêu cầu rút tiền</span>
                    <Text code className="text-blue-600">{record.id}</Text>
                    {hasInsufficientBalance && (
                        <Tag color="red" icon={<WarningOutlined />}>
                            Không đủ số dư
                        </Tag>
                    )}
                </Space>
            }
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={700}
            destroyOnClose
        >
            <div>
                {/* Progress Steps */}
                <Steps current={currentStep} className="mb-6" size="small">
                    {steps.map((step, index) => (
                        <Step
                            key={index}
                            title={step.title}
                            icon={step.icon}
                            description={step.description}
                        />
                    ))}
                </Steps>

                {/* Step 0: Review Information */}
                {currentStep === 0 && (
                    <div>
                        <Title level={4} className="mb-4">
                            <FileTextOutlined className="mr-2 text-blue-500" />
                            Thông tin yêu cầu rút tiền
                        </Title>

                        {/* User & Amount Summary */}
                        <Row gutter={[16, 16]} className="mb-4">
                            <Col span={12}>
                                <Card size="small" className="h-full">
                                    <div className="flex items-center mb-3">
                                        <Avatar src={record.user.avatar} size={40} className="mr-3" />
                                        <div>
                                            <Text strong className="text-base">{record.user.name}</Text>
                                            <br />
                                            <Tag color={record.user.role === 'seller' ? 'green' : 'blue'}>
                                                {record.user.role === 'seller' ? '🏪 Seller' : '👤 Member'}
                                            </Tag>
                                        </div>
                                    </div>
                                    <div>
                                        <Text type="secondary">📞 {record.user.phone}</Text>
                                        <br />
                                        <Text type="secondary">✉️ {record.user.email}</Text>
                                    </div>
                                </Card>
                            </Col>

                            <Col span={12}>
                                <Card size="small" className="h-full">
                                    <div className="text-center">
                                        <Text type="secondary">Số tiền yêu cầu</Text>
                                        <div className="text-2xl font-bold text-red-600 my-2">
                                            {formatPrice(record.amount)}
                                        </div>
                                        <div className="text-sm">
                                            <Text type="secondary">Số dư hiện tại: </Text>
                                            <Text className={record.user.accountBalance >= record.amount ? "text-green-600" : "text-red-600"}>
                                                {formatPrice(record.user.accountBalance)}
                                            </Text>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        {/* Bank Information */}
                        <Card size="small" className="mb-4" title="🏦 Thông tin ngân hàng">
                            <Row gutter={[16, 8]}>
                                <Col span={12}>
                                    <Text strong>Ngân hàng:</Text>
                                    <br />
                                    <Text className="text-base">{record.bankInfo.bankName}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Số tài khoản:</Text>
                                    <br />
                                    <Text code className="text-base bg-gray-100 px-2 py-1 rounded">
                                        {record.bankInfo.accountNumber}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Chủ tài khoản:</Text>
                                    <br />
                                    <Text className="text-base">{record.bankInfo.accountHolder}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Chi nhánh:</Text>
                                    <br />
                                    <Text className="text-base">{record.bankInfo.branch}</Text>
                                </Col>
                            </Row>
                        </Card>

                        {/* Request Details */}
                        <Card size="small" className="mb-4" title="📋 Chi tiết yêu cầu">
                            <Row gutter={[16, 8]}>
                                <Col span={12}>
                                    <Text strong>Thời gian tạo:</Text>
                                    <br />
                                    <Text>{record.requestDate}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Độ ưu tiên:</Text>
                                    <br />
                                    <Tag color={record.priority === 'high' ? 'red' : 'blue'}>
                                        {record.priority === 'high' ? '🔥 Cao' : '📋 Bình thường'}
                                    </Tag>
                                </Col>
                                {record.notes && (
                                    <Col span={24}>
                                        <Text strong>Ghi chú từ người dùng:</Text>
                                        <br />
                                        <Text italic className="bg-gray-50 p-2 rounded block mt-1">
                                            "{record.notes}"
                                        </Text>
                                    </Col>
                                )}
                            </Row>
                        </Card>

                        {/* Validation Alerts */}
                        {hasInsufficientBalance && (
                            <Alert
                                message="⚠️ Cảnh báo: Số dư không đủ"
                                description={
                                    <div>
                                        <p>Người dùng yêu cầu rút <strong>{formatPrice(record.amount)}</strong> nhưng chỉ có <strong>{formatPrice(record.user.accountBalance)}</strong> trong tài khoản.</p>
                                        <p>Thiếu: <span className="text-red-600 font-semibold">{formatPrice(record.amount - record.user.accountBalance)}</span></p>
                                    </div>
                                }
                                type="error"
                                showIcon
                                className="mb-4"
                            />
                        )}

                        {isValidRequest && (
                            <Alert
                                message="✅ Thông tin hợp lệ"
                                description="Yêu cầu rút tiền này có thể được xử lý. Vui lòng kiểm tra kỹ thông tin ngân hàng trước khi tiến hành."
                                type="success"
                                showIcon
                                className="mb-4"
                            />
                        )}

                        {/* Navigation */}
                        <div className="text-center">
                            <Button type="primary" size="large" onClick={nextStep}>
                                Tiếp tục xử lý
                                <SafetyOutlined />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 1: Choose Action */}
                {currentStep === 1 && (
                    <div>
                        <Title level={4} className="mb-4 text-center">
                            <SafetyOutlined className="mr-2 text-orange-500" />
                            Chọn hành động xử lý
                        </Title>

                        <Row gutter={[24, 24]} className="mb-6">
                            {/* Approve Option */}
                            <Col span={12}>
                                <Card
                                    className={`text-center cursor-pointer transition-all hover:shadow-lg ${!isValidRequest ? 'opacity-50' : 'hover:border-green-500'}`}
                                    size="small"
                                >
                                    <div className="py-4">
                                        <CheckCircleOutlined className="text-4xl text-green-500 mb-3" />
                                        <Title level={5} className="text-green-600">Đánh dấu hoàn thành</Title>
                                        <Text type="secondary" className="block mb-4">
                                            Xác nhận đã chuyển tiền thành công
                                        </Text>

                                        <Popconfirm
                                            title="Xác nhận hoàn thành?"
                                            description="Bạn đã thực hiện chuyển khoản thành công?"
                                            onConfirm={() => setCurrentStep(2)}
                                            okText="Đã chuyển tiền"
                                            cancelText="Chưa"
                                            disabled={!isValidRequest}
                                        >
                                            <Button
                                                type="primary"
                                                size="large"
                                                disabled={!isValidRequest}
                                                className="bg-green-500 border-green-500 hover:bg-green-600"
                                            >
                                                <CheckCircleOutlined />
                                                Chọn hoàn thành
                                            </Button>
                                        </Popconfirm>

                                        {!isValidRequest && (
                                            <div className="mt-2">
                                                <Text type="danger" className="text-xs">
                                                    <WarningOutlined /> Không thể hoàn thành do số dư không đủ
                                                </Text>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </Col>

                            {/* Reject Option */}
                            <Col span={12}>
                                <Card
                                    className="text-center cursor-pointer transition-all hover:shadow-lg hover:border-red-500"
                                    size="small"
                                >
                                    <div className="py-4">
                                        <CloseCircleOutlined className="text-4xl text-red-500 mb-3" />
                                        <Title level={5} className="text-red-600">Từ chối yêu cầu</Title>
                                        <Text type="secondary" className="block mb-4">
                                            Từ chối với lý do cụ thể
                                        </Text>

                                        <Button
                                            danger
                                            size="large"
                                            onClick={() => {
                                                setCurrentStep(2);
                                                // Set form mode to reject
                                                form.setFieldsValue({ actionType: 'reject' });
                                            }}
                                        >
                                            <CloseCircleOutlined />
                                            Chọn từ chối
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        {/* Navigation */}
                        <div className="text-center">
                            <Space size="large">
                                <Button onClick={prevStep}>
                                    Quay lại
                                </Button>
                            </Space>
                        </div>
                    </div>
                )}

                {/* Step 2: Confirmation Form */}
                {currentStep === 2 && (
                    <div>
                        <Title level={4} className="mb-4 text-center">
                            <CheckCircleOutlined className="mr-2 text-green-500" />
                            Xác nhận thông tin
                        </Title>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={form.getFieldValue('actionType') === 'reject' ? handleReject : handleComplete}
                        >
                            <Form.Item name="actionType" hidden>
                                <Input />
                            </Form.Item>

                            {/* Complete Form */}
                            {form.getFieldValue('actionType') !== 'reject' && (
                                <>
                                    <Alert
                                        message="🏦 Lưu ý quan trọng"
                                        description={
                                            <div>
                                                <p><strong>Trước khi xác nhận, hãy đảm bảo:</strong></p>
                                                <ul className="mt-2 mb-0">
                                                    <li>✅ Đã thực hiện chuyển khoản thành công</li>
                                                    <li>✅ Kiểm tra thông tin ngân hàng chính xác</li>
                                                    <li>✅ Có mã giao dịch từ ngân hàng</li>
                                                    <li>✅ Lưu biên lai/screenshot làm bằng chứng</li>
                                                </ul>
                                            </div>
                                        }
                                        type="info"
                                        showIcon
                                        className="mb-4"
                                    />

                                    <Card size="small" className="mb-4 bg-green-50 border border-green-200">
                                        <Row gutter={[16, 8]}>
                                            <Col span={24}>
                                                <Text strong>Thông tin chuyển khoản:</Text>
                                            </Col>
                                            <Col span={12}>
                                                <Text>Ngân hàng: <strong>{record.bankInfo.bankName}</strong></Text>
                                            </Col>
                                            <Col span={12}>
                                                <Text>Số TK: <Text code>{record.bankInfo.accountNumber}</Text></Text>
                                            </Col>
                                            <Col span={12}>
                                                <Text>Chủ TK: <strong>{record.bankInfo.accountHolder}</strong></Text>
                                            </Col>
                                            <Col span={12}>
                                                <Text>Số tiền: <span className="text-red-600 font-bold">{formatPrice(record.amount)}</span></Text>
                                            </Col>
                                        </Row>
                                    </Card>

                                    <Form.Item
                                        name="transactionCode"
                                        label={
                                            <span>
                                                <CreditCardOutlined className="mr-1" />
                                                Mã giao dịch ngân hàng
                                            </span>
                                        }
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mã giao dịch!' },
                                            { min: 6, message: 'Mã giao dịch phải có ít nhất 6 ký tự!' },
                                            { pattern: /^[A-Z0-9]+$/, message: 'Mã giao dịch chỉ chứa chữ cái in hoa và số!' }
                                        ]}
                                    >
                                        <Input
                                            placeholder="VD: VCB240531092001"
                                            size="large"
                                            prefix={<BankOutlined />}
                                        />
                                    </Form.Item>
                                </>
                            )}

                            {/* Reject Form */}
                            {form.getFieldValue('actionType') === 'reject' && (
                                <>
                                    <Alert
                                        message="❌ Từ chối yêu cầu rút tiền"
                                        description="Vui lòng nhập lý do từ chối rõ ràng để người dùng hiểu và có thể khắc phục trong tương lai."
                                        type="warning"
                                        showIcon
                                        className="mb-4"
                                    />

                                    <Form.Item
                                        name="rejectReason"
                                        label={
                                            <span>
                                                <FileTextOutlined className="mr-1" />
                                                Lý do từ chối
                                            </span>
                                        }
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập lý do từ chối!' },
                                            { min: 10, message: 'Lý do phải có ít nhất 10 ký tự!' },
                                            { max: 500, message: 'Lý do không được quá 500 ký tự!' }
                                        ]}
                                    >
                                        <TextArea
                                            rows={4}
                                            placeholder="VD: Thông tin tài khoản ngân hàng không chính xác. Vui lòng kiểm tra lại số tài khoản và tên chủ tài khoản..."
                                            size="large"
                                            showCount
                                            maxLength={500}
                                        />
                                    </Form.Item>
                                </>
                            )}

                            {/* Submit Buttons */}
                            <Form.Item className="mb-0">
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Space className="w-full justify-center">
                                            <Button
                                                onClick={prevStep}
                                                size="large"
                                            >
                                                Quay lại
                                            </Button>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                size="large"
                                                loading={loading}
                                                className={form.getFieldValue('actionType') === 'reject' ? 'bg-red-500 border-red-500' : ''}
                                            >
                                                {form.getFieldValue('actionType') === 'reject' ? (
                                                    <>
                                                        <CloseCircleOutlined />
                                                        Xác nhận từ chối
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircleOutlined />
                                                        Xác nhận hoàn thành
                                                    </>
                                                )}
                                            </Button>
                                        </Space>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ProcessRequestModal;