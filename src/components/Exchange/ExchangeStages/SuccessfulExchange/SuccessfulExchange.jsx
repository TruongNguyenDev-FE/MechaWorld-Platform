import { useNavigate } from "react-router-dom";
import { Card, Button, Typography, Space, Result, Divider, Avatar } from 'antd';
import { CheckCircleOutlined, WalletOutlined, SwapOutlined, StarFilled } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const SuccessfulExchange = () => {
  const navigate = useNavigate();

  return (
    <div className=" bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-1 flex items-center justify-center">
      <div className=" w-full">
        <Card
          className="shadow-2xl border-0 overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <Avatar
                size={80}
                className="bg-white/20 border-4 border-white/30 mb-6 animate-bounce"
                icon={<CheckCircleOutlined className="text-white text-3xl" />}
              />
              <Title level={1} className="!text-white !mb-2 !text-4xl font-bold">
                TRAO ĐỔI THÀNH CÔNG!
              </Title>
              <div className="flex items-center justify-center gap-2">
                <StarFilled className="text-yellow-300 text-lg animate-pulse" />
                <Text className="text-green-100 text-lg">Chúc mừng bạn đã hoàn thành giao dịch</Text>
                <StarFilled className="text-yellow-300 text-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid lg:grid-cols-5 gap-8 items-start">

              {/* Left: Success Message */}
              <div className="lg:col-span-3 space-y-6">
                <Card
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm"
                  size="small"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Text className="text-white text-lg font-bold">"</Text>
                    </div>
                    <div>
                      <Paragraph
                        className="!mb-0 text-gray-700 italic leading-relaxed"
                        style={{ fontSize: '16px' }}
                      >
                        Quá trình trao đổi đã hoàn tất. Chúng tôi hy vọng bạn sẽ có một
                        khoảng thời gian tận hưởng bộ sưu tập mới!
                      </Paragraph>
                    </div>
                  </div>
                </Card>

                {/* Transaction Details */}
                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <CheckCircleOutlined className="text-green-500" />
                      <span>Chi tiết giao dịch</span>
                    </div>
                  }
                  className="shadow-sm"
                  size="small"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Text className="text-gray-600">Trạng thái:</Text>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <Text className="text-green-600 font-semibold">Hoàn thành</Text>
                      </div>
                    </div>
                    <Divider className="!my-3" />
                    <div className="flex justify-between items-center">
                      <Text className="text-gray-600">Thời gian:</Text>
                      <Text className="font-medium">{new Date().toLocaleString('vi-VN')}</Text>
                    </div>

                  </div>
                </Card>
              </div>

              {/* Right: Action Buttons */}
              <div className="lg:col-span-2">
                <Card
                  title="Bước tiếp theo"
                  className="shadow-lg border-gray-200"
                  headStyle={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  <Space direction="vertical" size="middle" className="w-full">

                    <Button
                      type="default"
                      size="large"
                      icon={<WalletOutlined />}
                      onClick={() => navigate("/member/profile/wallet")}
                      className="w-full h-12 flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 font-medium"
                    >
                      Kiểm tra ví của tôi
                    </Button>

                    <Button
                      type="primary"
                      size="large"
                      icon={<SwapOutlined />}
                      onClick={() => navigate("/exchange/list")}
                      className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                    >
                      Tiếp tục trao đổi
                    </Button>

                    <Divider className="!my-4" />

                    {/* Additional Quick Actions */}
                    <div className="space-y-2">
                      <Text className="text-gray-500 text-sm block">Thao tác nhanh:</Text>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="small"
                          type="text"
                          className="text-blue-600 hover:bg-blue-50 border border-blue-200 hover:border-blue-400 transition-all duration-200"
                        >
                          Lịch sử
                        </Button>
                        <Button
                          size="small"
                          type="text"
                          className="text-green-600 hover:bg-green-50 border border-green-200 hover:border-green-400 transition-all duration-200"
                        >
                          Chia sẻ
                        </Button>
                      </div>
                    </div>
                  </Space>
                </Card>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <CheckCircleOutlined className="text-green-500" />
              <Text className="text-sm">
                Cảm ơn bạn đã sử dụng dịch vụ trao đổi của chúng tôi
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuccessfulExchange;