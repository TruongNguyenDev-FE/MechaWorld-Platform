import { useEffect, useState } from "react";
import { Input, Button, Upload, Form, Tooltip, Steps, Card, Row, Col, Checkbox, Typography, message, Divider } from "antd";
import {
    PlusOutlined,
    InfoCircleOutlined,
    FileImageOutlined,
    RobotOutlined,
    CheckCircleOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    EditOutlined,
    SwapOutlined,
    UploadOutlined
} from "@ant-design/icons";
import { GetGundamByID } from "../../../apis/User/APIUser";
import { createExchangePost } from "../../../apis/Exchange/APIExchange";

const { Text } = Typography;
const { Step } = Steps;

export default function PostModal({ onClose, onSuccess, currentUser }) {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [selectedGundams, setSelectedGundams] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [gundamList, setGundamList] = useState([]);
    const [postContent, setPostContent] = useState("");

    // console.log("gundamList", gundamList);


    // Handle image upload
    const handleUpload = ({ fileList }) => {
        if (fileList.length > 5) {
            return;
        }
        setFileList(fileList);
    };

    // Toggle Gundam selection
    const toggleGundamSelection = (gundamId) => {
        if (selectedGundams.includes(gundamId)) {
            setSelectedGundams(selectedGundams.filter(id => id !== gundamId));
        } else {
            setSelectedGundams([...selectedGundams, gundamId]);
        }
    };

    // Handle next step
    const nextStep = async () => {
        try {
            if (currentStep === 0) {
                // Validate form fields for step 1
                await form.validateFields(['topic', 'content']);
                if (fileList.length === 0) {
                    message.error('Vui lòng tải lên ít nhất một hình ảnh Gundam mong muốn!');
                    return;
                }
            }
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.log('Validation failed:', error);
        }
    };

    // Handle previous step
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    // Final submission
    const handleSubmit = async (values) => {
        if (selectedGundams.length === 0) {
            message.error('Vui lòng chọn ít nhất một Gundam để trao đổi!');
            return;
        }

        setIsSubmitting(true);

        try {
            // Get form values
            // const formValues = form.getFieldsValue();

            // Tìm kiếm trong gundamList (dữ liệu từ API) thay vì userGundams (mock data)
            const postData = {
                content: postContent,
                images: fileList.map(file => file.originFileObj),
                selectedGundams: selectedGundams.map(id => gundamList.find(g => g.gundam_id === id))
            };

            const formData = new FormData();
            formData.append("content", postData.content);
            fileList.forEach((file) => {
                formData.append("post_images", file.originFileObj);
            });

            // Thay đổi này: sử dụng gundam_id thay vì id
            postData.selectedGundams.forEach((gundam) => {
                formData.append("post_item_id", gundam.gundam_id);
            });

            // Call API and check response status
            const res = await createExchangePost(formData);

            // Only proceed if status is 201
            if (res && res.status === 201) {
                // Call the success callback from parent component
                if (onSuccess) {
                    onSuccess(postData);
                }

                // Reset form
                form.resetFields();
                setFileList([]);
                setSelectedGundams([]);
                setCurrentStep(0);

                // Đăng bài thành công
                // Truyền ngược về ExchangeNavigator
            } else {
                // Show error if status is not 201
                message.error('Không thể tạo bài đăng. Vui lòng thử lại sau!');
            }
        } catch (error) {
            console.error("Error creating exchange post:", error);
            message.error('Đã xảy ra lỗi khi tạo bài đăng!');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Lấy danh sách Gundam mà user có và Filter chỉ những status "in store"
    useEffect(() => {
        GetGundamByID(currentUser.id, "").then((res) => {
            // Filter for Gundam models with "in store" status
            const inStoreGundams = res.data.filter(gundam => gundam.status === "in store");
            setGundamList(inStoreGundams);
        });
    }, []);


    // Step content
    const steps = [
        {
            title: 'Thông tin bài viết',
            content: (
                <div className="pt-2">
                    <Form.Item
                        name="content"
                        label="Nội dung bài viết"
                        rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                    >
                        <Input.TextArea
                            placeholder="Mô tả chi tiết về Gundam bạn mong muốn trao đổi..."
                            autoSize={{ minRows: 5, maxRows: 10 }}
                            className="shadow-sm text-lg"
                            onChange={(e) => setPostContent(e.target.value)}
                        />
                    </Form.Item>

                    <Divider orientation="left">
                        <span className="flex items-center">
                            <FileImageOutlined className="mr-2" />
                            Ảnh Gundam mong muốn
                        </span>
                    </Divider>

                    <Form.Item label={
                        <span>
                            Tải lên ảnh Gundam bạn muốn trao đổi
                            <Tooltip title="Chỉ cho phép tải lên tối đa 5 ảnh">
                                <InfoCircleOutlined className="ml-2 text-gray-500" />
                            </Tooltip>
                        </span>
                    }>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleUpload}
                            beforeUpload={() => false}
                            multiple
                        >
                            {fileList.length < 5 && <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                            </div>}
                        </Upload>
                        {fileList.length >= 5 && <Text type="danger"> <InfoCircleOutlined /> Bạn chỉ có thể tải lên tối đa 5 ảnh.</Text>}
                        {fileList.length === 0 && <Text type="danger">Vui lòng tải lên ít nhất một hình ảnh!</Text>}
                    </Form.Item>
                </div>
            ),
        },
        {
            title: 'Chọn Gundam để trao đổi',
            content: (
                <div className="pt-2">
                    <Divider orientation="left">
                        <span className="flex items-center">
                            <RobotOutlined className="mr-2" />
                            Bộ sưu tập Gundam của bạn
                        </span>
                    </Divider>

                    <div className="mb-4">
                        <Text type="secondary">Chọn một hoặc nhiều Gundam từ bộ sưu tập của bạn để trao đổi</Text>
                    </div>

                    <Row gutter={[16, 16]} className="max-h-80 overflow-y-auto">
                        {gundamList.map(gundam => (
                            <Col xs={24} sm={12} lg={8} key={gundam.gundam_id}>
                                <Card
                                    hoverable
                                    className={selectedGundams.includes(gundam.gundam_id) ? 'border-2 border-blue-500 ' : ''}
                                    cover={
                                        <div className="relative h-36 bg-gray-100 flex items-center justify-center">
                                            <img
                                                alt={gundam.name}
                                                src={gundam.primary_image_url}
                                                className="w-full h-full object-cover"
                                            />
                                            {selectedGundams.includes(gundam.gundam_id) && (
                                                <div className="absolute top-2 right-2">
                                                    <CheckCircleOutlined className="text-blue-500 text-2xl" />
                                                </div>
                                            )}
                                        </div>
                                    }
                                    onClick={() => toggleGundamSelection(gundam.gundam_id)}
                                    size="small"
                                >
                                    <Card.Meta
                                        title={gundam.name}
                                        description={
                                            <div className="w-full overflow-hidden">
                                                <div className="text-xs w-full truncate">{gundam.series}</div>
                                            </div>
                                        }
                                    />
                                    <div className="mt-2">
                                        <Checkbox
                                            checked={selectedGundams.includes(gundam.gundam_id)}
                                            onChange={() => toggleGundamSelection(gundam.gundam_id)}
                                        >
                                            Chọn
                                        </Checkbox>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {selectedGundams.length === 0 && (
                        <div className="text-left my-4 bg-red-50 border border-red-200 rounded-lg p-4 space-y-2 shadow-sm">
                            <Text type="danger" className="block text-red-600 font-medium">
                                <InfoCircleOutlined /> Vui lòng chọn ít nhất một Gundam từ bộ sưu tập của bạn để tạo bài viết.
                            </Text>
                            <Text type="danger" className="block text-red-600">
                                - Những Gundam bạn chọn sẽ hiển thị cho người khác xem và đề xuất trao đổi.
                            </Text>
                        </div>
                    )}

                    <div className="text-right mt-4">
                        <Text type="secondary">
                            Đã chọn: {selectedGundams.length} Gundam
                        </Text>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-4">
                <Steps current={currentStep} size="default">
                    <Step title="Tạo bài viết trao đổi" icon={<EditOutlined />} />
                    <Step title="Chọn Gundam trao đổi" icon={<SwapOutlined />} />
                </Steps>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                {steps[currentStep].content}

                <div className="flex justify-between mt-6">
                    {currentStep > 0 && (
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={prevStep}
                        >
                            Quay lại
                        </Button>
                    )}

                    <div className="ml-auto">
                        {currentStep < steps.length - 1 && (
                            <Button
                                className="bg-blue-500"
                                type="primary"
                                onClick={nextStep}
                            >
                                Tiếp tục <ArrowRightOutlined />
                            </Button>
                        )}


                        {currentStep === steps.length - 1 && (
                            <Button
                                className="bg-blue-500"
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting}
                                icon={<UploadOutlined />}
                                disabled={selectedGundams.length === 0}
                            >
                                {isSubmitting ? "Đang đăng bài..." : "Đăng bài viết trao đổi"}
                            </Button>
                        )}
                    </div>
                </div>
            </Form>
        </div>
    );
}