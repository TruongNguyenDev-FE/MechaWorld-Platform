import { Card, Typography } from "antd";
import { CheckCircleOutlined, ShopOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const SuccessfulRegistration = ({ next }) => {
    return (
        <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
                        <CheckCircleOutlined className="text-5xl text-green-500" />
                    </div>
                </div>
                <Title level={2} className="font-bold mb-2">Chúc mừng! Bạn đã đăng ký thành công Shop</Title>
                <Paragraph className="text-gray-500 text-lg">
                    Cửa hàng của bạn đã được kích hoạt và bạn có thể bắt đầu bán hàng ngay bây giờ
                </Paragraph>
            </div>

            {/* Plan Details */}
            <Card className="mb-8 border-2 border-green-500 shadow-md">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/4 text-center mb-4 md:mb-0">
                        <ShopOutlined className="text-5xl text-blue-500 mb-2" />
                        <Title level={4} className="m-0">GÓI BẮT ĐẦU</Title>
                        <Text className="text-green-500 font-bold">Đã kích hoạt</Text>
                    </div>

                    <div className="md:w-2/4 md:border-l md:border-r md:px-6">
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <CheckCircleOutlined className="mr-2 text-green-500" />
                                <Text>5 lượt đăng bán sản phẩm</Text>
                            </div>
                            <div className="flex items-center">
                                <CheckCircleOutlined className="mr-2 text-green-500" />
                                <Text>1 lượt mở đấu giá</Text>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/4 text-center mt-4 md:mt-0">
                        <Text className="block font-bold mb-2 text-2xl">Miễn phí</Text>
                        <Text className="text-gray-500 block">Thời hạn: Không giới hạn</Text>
                    </div>
                </div>
            </Card>

            {/* Next Steps */}
            {/* <Card className="mb-8 shadow-md">
                <Title level={4} className="mb-4">
                    <RocketOutlined className="mr-2 text-blue-500" />
                    Bắt đầu bán hàng trong 3 bước đơn giản
                </Title>

                <Steps
                    direction="vertical"
                    current={0}
                    items={[
                        {
                            title: 'Đăng sản phẩm đầu tiên',
                            description: 'Thêm hình ảnh chất lượng và mô tả chi tiết để thu hút khách hàng.',
                        },
                        {
                            title: 'Cài đặt phương thức thanh toán',
                            description: 'Liên kết tài khoản ngân hàng để nhận thanh toán khi có đơn hàng.',
                        },
                        {
                            title: 'Quảng bá cửa hàng của bạn',
                            description: 'Chia sẻ cửa hàng lên mạng xã hội để tiếp cận nhiều khách hàng hơn.',
                        },
                    ]}
                />
            </Card> */}

            {/* Promotion */}
            {/* <Card className="mb-8 bg-blue-50 border-0 shadow-md">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/4 text-center mb-4 md:mb-0">
                        <GiftOutlined className="text-5xl text-orange-500" />
                    </div>
                    <div className="md:w-3/4">
                        <Title level={4} className="text-blue-700 mb-2">Ưu đãi đặc biệt cho người bán mới</Title>
                        <Paragraph className="mb-4">
                            Nhận thêm 5 lượt đăng sản phẩm MIỄN PHÍ khi bán được sản phẩm đầu tiên trong 7 ngày tới!
                        </Paragraph>
                        <Button type="primary" className="bg-orange-500 hover:bg-orange-600 border-0">
                            Tìm hiểu thêm
                        </Button>
                    </div>
                </div>
            </Card> */}
        </div>
    );
};

export default SuccessfulRegistration;