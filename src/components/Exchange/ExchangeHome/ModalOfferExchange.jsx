import { useEffect, useState } from 'react';
import { Modal, Tabs, Form, Input, InputNumber, Button, Card, Tag, Checkbox, message } from 'antd';
import { DollarOutlined, FileTextOutlined, SwapOutlined, InfoCircleOutlined, ArrowRightOutlined, UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { createExchangeOffer } from '../../../apis/Exchange/APIExchange';
import { checkWallet } from '../../../apis/User/APIUser';


export default function ModalOfferExchange({ isOpen, onClose, requestData, gundamList, yourGundamList, requestPost }) {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('1');

    // Thay đổi từ single selection sang multiple selection
    const [selectedGundams, setSelectedGundams] = useState([]); // Gundam của poster
    const [selectedYourGundams, setSelectedYourGundams] = useState([]); // Gundam của offerer

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [compensationType, setCompensationType] = useState('none');
    const [compensationID, setCompensationID] = useState(null);

    const [balance, setBalance] = useState(0);

    // Dữ liệu người hiện tại
    const currentUser = useSelector((state) => state.auth.user);

    // Gọi Api xem số dư ví
    useEffect(() => {
        if (currentUser?.id) {
            checkWallet(currentUser.id).then((response) => {
                setBalance(response.data.balance);
            }).catch((error) => {
                console.error('Lỗi API:', {
                    message: error.message,
                    response: error.response?.data,
                    config: error.config
                });
                setBalance(0); // Set giá trị mặc định khi có lỗi
            });
        } else {
            setBalance(0); // Reset balance khi không có user
        }
    }, [currentUser?.id]);

    const handleTabChange = (key) => {
        // Validate form trước khi chuyển sang tab khác
        if (key === '3' && activeTab === '1') {
            form.validateFields(['compensationType', 'compensationAmount'])
                .then(() => {
                    setActiveTab(key);
                })
                .catch((error) => {
                    console.log('Form validation failed:', error);
                });
        } else {
            setActiveTab(key);
        }
    };

    // Handle multiple gundam selection cho poster
    const handleGundamSelect = (gundamId) => {
        setSelectedGundams(prev => {
            if (prev.includes(gundamId)) {
                return prev.filter(id => id !== gundamId);
            } else {
                return [...prev, gundamId];
            }
        });
    };

    // Handle multiple gundam selection cho offerer
    const handleYourGundamSelect = (gundamId) => {
        setSelectedYourGundams(prev => {
            if (prev.includes(gundamId)) {
                return prev.filter(id => id !== gundamId);
            } else {
                return [...prev, gundamId];
            }
        });
    };

    // Business rule validation
    const validateBusinessRules = async (values) => {
        const errors = [];

        // 1. Không thể tạo offer cho bài đăng của chính mình
        if (requestPost?.user_id === currentUser.id) {
            errors.push('Không thể tạo đề xuất trao đổi cho bài đăng của chính mình');
        }

        // 2. Kiểm tra status gundam của poster (phải là "for exchange")
        const posterGundamsWithWrongStatus = gundamList?.filter(g =>
            selectedGundams.includes(g.gundam_id) && g.status !== 'for exchange'
        );
        if (posterGundamsWithWrongStatus?.length > 0) {
            errors.push('Một số Gundam của chủ bài đăng không có sẵn để trao đổi');
        }

        // 3. Kiểm tra status gundam của offerer (phải là "in store")
        const offererGundamsWithWrongStatus = yourGundamList?.filter(g =>
            selectedYourGundams.includes(g.gundam_id) && g.status !== 'in store'
        );
        if (offererGundamsWithWrongStatus?.length > 0) {
            errors.push('Một số Gundam của bạn không có sẵn để trao đổi (phải ở trạng thái "in store")');
        }

        // 4. Kiểm tra số dư nếu người đề xuất là người trả compensation
        if (compensationType === 'sender' && values.compensationAmount > 0) {
            const userBalance = balance || 0;
            if (userBalance < values.compensationAmount) {
                errors.push(`Số dư không đủ. Bạn cần ${values.compensationAmount.toLocaleString()} VND nhưng chỉ có ${userBalance.toLocaleString()} VND`);
            }
        }

        // 5. Kiểm tra đã có offer cho bài đăng này chưa (cần gọi API check)
        try {
            // Giả sử có API checkExistingOffer
            // const existingOffer = await checkExistingOffer(requestPost.id, currentUser.id);
            // if (existingOffer) {
            //     errors.push('Bạn đã có đề xuất trao đổi cho bài đăng này');
            // }
        } catch (error) {
            console.warn('Could not check existing offer:', error);
        }

        return errors;
    };

    const handleSubmit = async () => {
        // Validation kiểm tra Gundam được chọn
        if (selectedGundams.length === 0) {
            message.error('Vui lòng chọn ít nhất một Gundam của chủ bài đăng để trao đổi');
            setActiveTab('3');
            return;
        }

        if (selectedYourGundams.length === 0) {
            message.error('Vui lòng chọn ít nhất một Gundam của bạn để trao đổi');
            setActiveTab('2');
            return;
        }

        try {
            // Validate form fields chỉ khi cần thiết
            let values = { note: '' };
            if (compensationType !== 'none') {
                values = await form.validateFields();
            } else {
                // Chỉ validate note
                values = await form.validateFields(['note']);
            }

            // Lấy compensation amount từ form hoặc set 0
            const compensationAmount = compensationType !== 'none' ?
                (form.getFieldValue('compensationAmount') || 0) : 0;

            // Debug logging - Kiểm tra từng giá trị
            // console.log('=== DEBUG PAYLOAD CREATION ===');
            // console.log('selectedGundams:', selectedGundams);
            // console.log('selectedYourGundams:', selectedYourGundams);
            // console.log('requestPost:', requestPost);
            // console.log('currentUser:', currentUser);
            // console.log('requestData:', requestData);
            // console.log('compensationType:', compensationType);
            // console.log('compensationAmount:', compensationAmount);
            // console.log('form values:', values);

            // Validate business rules
            const businessRuleErrors = await validateBusinessRules({ ...values, compensationAmount });
            if (businessRuleErrors.length > 0) {
                businessRuleErrors.forEach(error => message.error(error));
                return;
            }

            setIsSubmitting(true);

            // Chuẩn bị dữ liệu theo format API mới - KIỂM TRA TỪNG FIELD
            const offerData = {
                exchange_post_id: requestPost?.id,
                note: values.note || '',
                poster_gundam_ids: [...selectedGundams], // Ensure array copy
                offerer_gundam_ids: [...selectedYourGundams], // Ensure array copy
                compensation_amount: Number(compensationAmount) || 0, // Ensure number
                payer_id: compensationType === 'sender' ? currentUser.id :
                    compensationType === 'receiver' ? requestData?.id : null
            };

            // Detailed logging
            // console.log('=== FINAL OFFER DATA ===');
            // console.log('offerData object:', offerData);
            // console.log('JSON.stringify(offerData):', JSON.stringify(offerData, null, 2));

            // Kiểm tra từng property
            Object.keys(offerData).forEach(key => {
                console.log(`${key}:`, offerData[key], `(type: ${typeof offerData[key]})`);
            });

            // Gọi API tạo yêu cầu trao đổi
            await createExchangeOffer(offerData);
            // console.log("responseCreateExchangeOffer", responseCreateExchangeOffer);

            // Xử lý response thành công
            message.success('Đã gửi yêu cầu trao đổi thành công!');

            // Reset form và state
            resetFormAndState();

            // Đóng modal
            onClose();

        } catch (error) {
            console.error('Error create exchange offer:', error);

            // Xử lý các loại lỗi khác nhau
            if (error.errorFields) {
                // Lỗi validation form
                message.error('Vui lòng kiểm tra lại thông tin đã nhập');
            } else if (error.response) {
                // Lỗi từ API
                const errorMessage = error.response.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu trao đổi';
                message.error(errorMessage);
            } else {
                // Lỗi network hoặc lỗi khác
                message.error('Không thể kết nối đến server. Vui lòng thử lại sau.');
            }
        } finally {
            // Đảm bảo luôn tắt loading state
            setIsSubmitting(false);
        }
    };

    // Helper function để reset form và state
    const resetFormAndState = () => {
        form.resetFields();
        setSelectedGundams([]);
        setSelectedYourGundams([]);
        setCompensationID(null);
        setActiveTab('1');
        setCompensationType('none');
    };

    const handleCancel = () => {
        resetFormAndState();
        onClose();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <SwapOutlined className="text-blue-500" />
                    <span className="text-lg font-bold">TẠO YÊU CẦU TRAO ĐỔI NHIỀU-NHIỀU</span>
                </div>
            }
            open={isOpen}
            onCancel={handleCancel}
            width={800}
            footer={null}
            destroyOnClose={true}
        >
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start gap-2">
                    <InfoCircleOutlined className="text-blue-500 mt-1" />
                    <div>
                        <p className="mb-1">
                            Bạn đang tạo đề nghị trao đổi nhiều-nhiều với{' '}
                            <span className="font-semibold">{requestData?.full_name}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                            - Có thể chọn nhiều Gundam để trao đổi với nhau
                        </p>
                    </div>
                </div>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={[
                    // Tab 1: THÔNG TIN BÙ TRỪ TIỀN
                    {
                        key: '1',
                        label: (
                            <span className="flex items-center gap-1">
                                <FileTextOutlined />
                                THÔNG TIN BÙ TRỪ TIỀN
                            </span>
                        ),
                        children: (
                            <Form
                                form={form}
                                layout="vertical"
                                className="pt-2"
                                initialValues={{
                                    compensationType: 'none',
                                    compensationID: null,
                                    compensationAmount: 0
                                }}
                            >
                                <Form.Item
                                    label={<span className="font-medium text-base">Bạn muốn ai là người Bù Trừ tiền?</span>}
                                    className="mb-4"
                                >
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            type={compensationType === 'none' ? 'primary' : 'default'}
                                            onClick={() => {
                                                setCompensationType('none');
                                                form.setFieldsValue({
                                                    compensationType: 'none',
                                                    compensationAmount: 0
                                                });
                                            }}
                                            className={compensationType === 'none' ? 'bg-blue-500' : ''}
                                        >
                                            Không ai phải bù trừ tiền
                                        </Button>
                                        <Button
                                            type={compensationType === 'receiver' ? 'primary' : 'default'}
                                            onClick={() => {
                                                setCompensationType('receiver');
                                                setCompensationID(requestData?.id);
                                                form.setFieldsValue({ compensationType: 'receiver' });
                                            }}
                                            className={compensationType === 'receiver' ? 'bg-blue-500' : ''}
                                        >
                                            {requestData?.full_name} sẽ bù tiền
                                        </Button>
                                        <Button
                                            type={compensationType === 'sender' ? 'primary' : 'default'}
                                            onClick={() => {
                                                setCompensationType('sender');
                                                setCompensationID(currentUser.id);
                                                form.setFieldsValue({ compensationType: 'sender' });
                                            }}
                                            className={compensationType === 'sender' ? 'bg-blue-500' : ''}
                                        >
                                            Bạn sẽ bù tiền
                                        </Button>
                                    </div>
                                    <Form.Item name="compensationType" hidden>
                                        <Input />
                                    </Form.Item>
                                </Form.Item>

                                <Form.Item
                                    name="compensationAmount"
                                    label="Số tiền bù trừ (VND)"
                                    rules={compensationType !== 'none' ? [
                                        { required: true, message: 'Vui lòng nhập số tiền bù trừ' },
                                        { type: 'number', min: 1000, message: 'Số tiền bù trừ phải từ 1,000 VND trở lên' }
                                    ] : []}
                                >
                                    <InputNumber
                                        className="w-full"
                                        placeholder="Nhập số tiền bù trừ"
                                        min={1000}
                                        step={10000}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                        addonBefore={<DollarOutlined />}
                                        disabled={compensationType === 'none'}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="note"
                                    label="Ghi chú (không bắt buộc)"
                                >
                                    <Input.TextArea
                                        rows={4}
                                        placeholder="Nhập ghi chú về đề nghị trao đổi của bạn (nếu có)..."
                                        maxLength={500}
                                        showCount
                                    />
                                </Form.Item>

                                <Form.Item className="mb-0">
                                    <div className="flex justify-between">
                                        <Button onClick={handleCancel}>
                                            Hủy
                                        </Button>
                                        <Button
                                            className='bg-blue-500'
                                            type="primary"
                                            onClick={() => handleTabChange('2')}>
                                            Tiếp theo <ArrowRightOutlined />
                                        </Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        ),
                    },

                    // Tab 2: CHỌN GUNDAM CỦA MÌNH ĐỂ TRAO ĐỔI
                    {
                        key: '2',
                        label: (
                            <span className="flex items-center gap-1">
                                <SwapOutlined />
                                GUNDAM CỦA BẠN ({selectedYourGundams.length})
                            </span>
                        ),
                        children: (
                            <div className="pt-2">
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                    <span className='text-green-700 font-medium'>
                                        *Chọn một hoặc nhiều Gundam từ Bộ Sưu Tập của bạn để trao đổi.
                                        <br />
                                        Đã chọn: {selectedYourGundams.length} Gundam
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto">
                                    {yourGundamList?.filter(gundam => gundam.status === 'in store').map((gundam) => (
                                        <Card
                                            key={gundam.gundam_id}
                                            hoverable
                                            className={`border-2 transition-all ${selectedYourGundams.includes(gundam.gundam_id)
                                                ? 'border-blue-500 shadow-md bg-blue-50'
                                                : gundam.status !== 'in store'
                                                    ? 'border-red-300 opacity-60'
                                                    : 'border-gray-200'
                                                }`}
                                            cover={
                                                <div className="relative">
                                                    <img
                                                        alt={gundam.name}
                                                        src={gundam.primary_image_url}
                                                        className="h-48 w-full object-cover"
                                                    />
                                                </div>
                                            }
                                            onClick={() => gundam.status === 'in store' && handleYourGundamSelect(gundam.gundam_id)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold mb-1">{gundam.name}</p>
                                                    <Tag color="blue">{gundam.scale}</Tag>
                                                </div>
                                                <Checkbox
                                                    checked={selectedYourGundams.includes(gundam.gundam_id)}
                                                    onChange={() => gundam.status === 'in store' && handleYourGundamSelect(gundam.gundam_id)}
                                                    className="scale-125"
                                                    disabled={gundam.status !== 'in store'}
                                                />
                                            </div>
                                        </Card>
                                    ))}

                                    {yourGundamList?.length === 0 && (
                                        <div className="col-span-3 text-center py-8 bg-gray-100 rounded-lg">
                                            <p className="text-gray-500">Bạn chưa có Gundam nào để trao đổi</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between">
                                    <Button onClick={() => handleTabChange('1')}>
                                        Quay lại
                                    </Button>
                                    <Button
                                        className='bg-blue-500'
                                        type="primary"
                                        onClick={() => handleTabChange('3')}
                                        disabled={selectedYourGundams.length === 0}
                                    >
                                        Tiếp theo <ArrowRightOutlined />
                                    </Button>
                                </div>
                            </div>
                        ),
                    },

                    // Tab 3: CHỌN GUNDAM CỦA NGƯỜI ĐĂNG ĐỂ TRAO ĐỔI
                    {
                        key: '3',
                        label: (
                            <span className="flex items-center gap-1">
                                <SwapOutlined />
                                GUNDAM CỦA {requestData?.full_name?.toUpperCase()} ({selectedGundams.length})
                            </span>
                        ),
                        children: (
                            <div className="pt-2">
                                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                                    <span className="text-orange-700 font-medium">
                                        *Chọn một hoặc nhiều Gundam của {requestData?.full_name} để trao đổi.
                                        <br />
                                        Đã chọn: {selectedGundams.length} Gundam
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto">
                                    {gundamList?.map((gundam) => (
                                        <Card
                                            key={gundam.gundam_id}
                                            hoverable
                                            className={`border-2 transition-all ${selectedGundams.includes(gundam.gundam_id)
                                                ? 'border-blue-500 shadow-md bg-blue-50'
                                                : gundam.status !== 'for exchange'
                                                    ? 'border-red-300 opacity-60'
                                                    : 'border-gray-200'
                                                }`}
                                            cover={
                                                <div className="relative">
                                                    <img
                                                        alt={gundam.name}
                                                        src={gundam.primary_image_url}
                                                        className="h-48 w-full object-cover"
                                                    />
                                                </div>
                                            }
                                            onClick={() => gundam.status === 'for exchange' && handleGundamSelect(gundam.gundam_id)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold mb-1">{gundam.name}</p>
                                                    <Tag color="blue">{gundam.scale}</Tag>
                                                </div>
                                                <Checkbox
                                                    checked={selectedGundams.includes(gundam.gundam_id)}
                                                    onChange={() => gundam.status === 'for exchange' && handleGundamSelect(gundam.gundam_id)}
                                                    className="scale-125"
                                                    disabled={gundam.status !== 'for exchange'}
                                                />
                                            </div>
                                        </Card>
                                    ))}

                                    {yourGundamList?.filter(gundam => gundam.status === 'in store').length === 0 && (
                                        <div className="col-span-3 text-center py-8 bg-gray-100 rounded-lg">
                                            <p className="text-gray-500">{requestData?.full_name} chưa thêm Gundam nào để trao đổi</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between">
                                    <Button onClick={() => handleTabChange('2')}>
                                        Quay lại
                                    </Button>
                                    <Button
                                        className='bg-blue-500'
                                        type="primary"
                                        onClick={handleSubmit}
                                        loading={isSubmitting}
                                        icon={<UploadOutlined />}
                                        disabled={selectedGundams.length === 0}
                                    >
                                        {isSubmitting ? "Đang gửi đề xuất..." : "Gửi đề xuất trao đổi"}
                                    </Button>
                                </div>
                            </div>
                        ),
                    },
                ]}
            />
        </Modal>
    );
}