import { Form, Input, Button, Row, Col, Tag, Avatar, Card, Divider, message } from 'antd';
import { SaveOutlined, UserOutlined, ShopOutlined, PhoneOutlined, HomeOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';


const ShopInfoTab = ({ shopInfo, originalShopName, onUpdateShopInfo }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // console.log("shopInfo", shopInfo);
    // console.log("originalShopName", originalShopName);



    // Update form when shopInfo changes
    useEffect(() => {
        if (Object.keys(shopInfo).length > 0) {
            form.setFieldsValue(shopInfo);
        }
    }, [shopInfo, form]);

    // Handle form submit
    const handleSubmit = (values) => {
        const shopName = values.shop_name.trim();

        if (!shopName) {
            message.error('Tên shop không được để trống!');
            return;
        }

        setLoading(true);

        // Gửi dữ liệu trong đối tượng với thuộc tính shop_name
        const updatedData = { shop_name: shopName };

        setTimeout(() => {
            onUpdateShopInfo(updatedData);
            setIsEditing(false);
            setLoading(false);
        }, 1000);
    };

    // Handle form values change
    const handleFormValuesChange = (changedValues, allValues) => {

        // Kiểm tra thay đổi của shop_name với originalShopName (chuỗi)
        const isShopNameChanged = allValues.shop_name !== originalShopName;
        setIsEditing(isShopNameChanged);
    };

    return (
        <Card className="shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <span className='text-xl font-medium'>Thông tin cửa hàng</span>
                <div className="flex justify-end mb-4">
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={loading}
                        disabled={!isEditing}
                        onClick={() => form.submit()}
                        className="bg-blue-500 hover:bg-blue-400"
                    >
                        Cập nhật
                    </Button>
                </div>
            </div>

            <Divider />

            <div className="flex items-center mb-6">
                <div className="mr-8">
                    <Avatar size={100} icon={<UserOutlined />} className="bg-blue-500" />
                </div>
                <div className="flex-1">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        onValuesChange={handleFormValuesChange}
                        initialValues={{
                            shop_name: shopInfo?.shop_name || originalShopName || ''
                        }}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="shop_name"
                                    label="Tên cửa hàng"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên cửa hàng!' }]}
                                >
                                    <Input placeholder="Nhập tên cửa hàng" prefix={<ShopOutlined className="text-gray-400" />} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="phone_number" label="Số điện thoại">
                                    <Input
                                        placeholder="Nhập số điện thoại"
                                        prefix={<PhoneOutlined className="text-gray-400" />}
                                        suffix={<Tag color="green"><CheckCircleOutlined /> Đã xác thực</Tag>}
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="pickup_address" label="Địa chỉ lấy hàng">
                                    <Input disabled placeholder="Chưa thiết lập địa chỉ lấy hàng" prefix={<HomeOutlined className="text-gray-400" />} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="email" label="Email">
                                    <Input disabled placeholder="Nhập email" prefix={<MailOutlined className="text-gray-400" />} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </Card>
    );
};

export default ShopInfoTab;