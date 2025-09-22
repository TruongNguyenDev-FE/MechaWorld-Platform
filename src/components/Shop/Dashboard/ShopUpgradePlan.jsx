import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Modal,
  Tag,
  Space,
  Divider,
  Badge,
  message,
  Spin,
} from "antd";
import {
  RocketOutlined,
  CrownOutlined,
  StarOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  ShopOutlined,
  TrophyOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { Infinity } from "lucide-react";
import { GetPlan } from "../../../apis/Plan/APIPlan";
import { UpgradePlan as UpgradePlanAPI } from "../../../apis/Plan/APIPlan";
import { useSelector } from "react-redux";
const { Title, Text, Paragraph } = Typography;

const ShopUpgradePlan = ({ sellerPlan }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  // Mock user ID - in real app this would come from auth context
  const user = useSelector((state) => state.auth.user);
  // Current plan ID from props
  const currentPlanId = sellerPlan?.plan_id;

  // Mock function to upgrade plan
  const UpgradePlan = async (planId, userId) => {
    setUpgrading(true);
    try {
      await UpgradePlanAPI(planId, userId);
      message.success("Nâng cấp gói thành công!");
      setUpgradeModalVisible(false);
      setSelectedPlan(null);
      // Có thể reload lại thông tin gói hiện tại ở đây nếu cần
    } catch (error) {
      message.error("Nâng cấp gói thất bại. Vui lòng thử lại!");
      console.error("Upgrade plan error:", error);
    } finally {
      setUpgrading(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    const fetchPlans = async () => {
      try {
        const response = await GetPlan();
        setPlans(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plans:", error);
        message.error("Không thể tải gói dịch vụ. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Get button configuration based on current plan
  const getButtonConfig = (plan) => {
    if (!currentPlanId) {
      // No current plan, allow all upgrades
      return {
        text: plan.price === 0 ? "Gói miễn phí" : "NÂNG CẤP NGAY",
        disabled: plan.price === 0,
        type: plan.price === 0 ? "default" : "primary",
      };
    }

    if (plan.id === currentPlanId) {
      // Current plan
      return {
        text: "Gói hiện tại",
        disabled: true,
        type: "default",
      };
    }

    if (plan.id < currentPlanId) {
      // Lower tier plan
      return {
        text: "Đã nâng cấp",
        disabled: true,
        type: "default",
      };
    }

    // Higher tier plan - allow upgrade
    return {
      text: "NÂNG CẤP NGAY",
      disabled: false,
      type: "primary",
    };
  };

  // Handle plan selection and show upgrade modal
  const handleSelectPlan = (plan) => {
    const buttonConfig = getButtonConfig(plan);

    if (buttonConfig.disabled) {
      if (plan.id === currentPlanId) {
        message.info("Đây là gói dịch vụ hiện tại của bạn");
      } else if (plan.id < currentPlanId) {
        message.info("Bạn đã nâng cấp lên gói cao hơn");
      }
      return;
    }

    setSelectedPlan(plan);
    setUpgradeModalVisible(true);
  };

  // Handle upgrade confirmation
  const handleUpgradeConfirm = () => {
    if (selectedPlan) {
      UpgradePlan(selectedPlan.id, user.id);
    }
  };

  // Format price to Vietnamese currency
  const formatPrice = (price) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get plan icon based on plan type
  const getPlanIcon = (plan) => {
    if (plan.price === 0) return <StarOutlined className="text-2xl" />;
    if (plan.is_unlimited) return <CrownOutlined className="text-2xl" />;
    return <RocketOutlined className="text-2xl" />;
  };

  // Get plan color theme
  const getPlanTheme = (plan) => {
    if (plan.price === 0) return "border-gray-300";
    if (plan.is_unlimited) return "border-red-500 shadow-red-100";
    return "border-blue-500 shadow-blue-100";
  };

  // Get plan badge
  const getPlanBadge = (plan) => {
    if (plan.price === 0) return null;
    if (plan.is_unlimited)
      return (
        <Badge.Ribbon text="PREMIUM" color="red" className="font-bold">
          <div />
        </Badge.Ribbon>
      );
    return (
      <Badge.Ribbon text="PHỔ BIẾN" color="blue" className="font-bold">
        <div />
      </Badge.Ribbon>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-red-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <TrophyOutlined className="text-4xl text-red-600 mr-3" />
            <Title
              level={1}
              className="m-0 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent"
            >
              NÂNG CẤP GÓI DỊCH VỤ
            </Title>
            <TrophyOutlined className="text-4xl text-blue-600 ml-3" />
          </div>

          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mở rộng khả năng kinh doanh của bạn với các gói dịch vụ chuyên
            nghiệp. Từ shop nhỏ đến đế chế Gundam, chúng tôi có gói phù hợp cho
            mọi quy mô!
          </Paragraph>

          <div className="flex justify-center items-center mt-6 space-x-4">
            <FireOutlined className="text-red-500 text-xl" />
            <Text className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
              Ưu đãi đặc biệt cho Gundam Builders
            </Text>
            <FireOutlined className="text-red-500 text-xl" />
          </div>
        </div>

        {/* Plans Grid */}
        <Row gutter={[24, 24]} justify="center">
          {plans.map((plan, index) => (
            <Col xs={24} md={8} key={plan.id}>
              <div className="relative">
                {getPlanBadge(plan)}
                <Card
                  className={`h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 ${getPlanTheme(
                    plan
                  )} ${index === 1 ? "transform scale-105" : ""}`}
                  styles={{ body: {padding: "32px 24px" }}}
                >
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                        plan.price === 0
                          ? "bg-gray-100 text-gray-600"
                          : plan.is_unlimited
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {getPlanIcon(plan)}
                    </div>

                    <Title level={3} className="mb-2 text-gray-800">
                      {plan.name}
                    </Title>

                    <div className="mb-4">
                      <Text className="text-3xl font-bold text-gray-900">
                        {formatPrice(plan.price)}
                      </Text>
                      {plan.duration_days && (
                        <Text className="text-gray-500 block text-sm">
                          / {plan.duration_days} ngày
                        </Text>
                      )}
                    </div>
                  </div>

                  <Divider />

                  {/* Plan Features */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ShopOutlined className="text-blue-500 mr-2" />
                        <Text>Đăng bán sản phẩm</Text>
                      </div>
                      <Tag
                        color={plan.is_unlimited ? "red" : "blue"}
                        className="font-semibold"
                      >
                        {plan.is_unlimited ? (
                          <>
                            <Infinity /> Không giới hạn
                          </>
                        ) : (
                          `${plan.max_listings} sản phẩm`
                        )}
                      </Tag>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TrophyOutlined className="text-yellow-500 mr-2" />
                        <Text>Phiên đấu giá</Text>
                      </div>
                      <Tag
                        color={plan.is_unlimited ? "red" : "blue"}
                        className="font-semibold"
                      >
                        {plan.is_unlimited ? (
                          <>
                            <Infinity /> Không giới hạn
                          </>
                        ) : (
                          `${plan.max_open_auctions} phiên`
                        )}
                      </Tag>
                    </div>

                    {plan.duration_days && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckOutlined className="text-green-500 mr-2" />
                          <Text>Thời hạn sử dụng</Text>
                        </div>
                        <Tag color="green" className="font-semibold">
                          {plan.duration_days} ngày
                        </Tag>
                      </div>
                    )}

                    {plan.is_unlimited && (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <StarOutlined className="text-yellow-500 mr-2" />
                            <Text>Hỗ trợ ưu tiên</Text>
                          </div>
                          <Tag color="gold" className="font-semibold">
                            24/7
                          </Tag>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CrownOutlined className="text-purple-500 mr-2" />
                            <Text>Badge đặc biệt</Text>
                          </div>
                          <Tag color="purple" className="font-semibold">
                            VIP
                          </Tag>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Button */}
                  {(() => {
                    const buttonConfig = getButtonConfig(plan);
                    return (
                      <Button
                        type={buttonConfig.type}
                        size="large"
                        block
                        className={`font-semibold h-12 ${
                          buttonConfig.disabled
                            ? "border-gray-300 bg-gray-100 text-gray-500"
                            : plan.is_unlimited
                            ? "bg-red-600 hover:bg-red-700 border-red-600"
                            : "bg-blue-600 hover:bg-blue-700 border-blue-600"
                        }`}
                        onClick={() => handleSelectPlan(plan)}
                        disabled={buttonConfig.disabled}
                      >
                        {buttonConfig.text}
                      </Button>
                    );
                  })()}
                </Card>
              </div>
            </Col>
          ))}
        </Row>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <Card className="max-w-4xl mx-auto border border-gray-200 shadow-sm">
            <Title level={4} className="text-gray-800 mb-4">
              <ExclamationCircleOutlined className="text-yellow-500 mr-2" />
              Dịch vụ cung cấp
            </Title>
            <Row gutter={[24, 16]}>
              <Col xs={24} md={8}>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <CheckOutlined className="text-blue-600 text-xl mb-2" />
                  <Text strong className="block mb-1">
                    Thanh toán an toàn
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Mọi giao dịch được bảo mật với công nghệ mã hóa tiên tiến
                  </Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="p-4 bg-green-50 rounded-lg">
                  <RocketOutlined className="text-green-600 text-xl mb-2" />
                  <Text strong className="block mb-1">
                    Kích hoạt tức thì
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Gói dịch vụ được kích hoạt ngay sau khi thanh toán thành
                    công
                  </Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <StarOutlined className="text-purple-600 text-xl mb-2" />
                  <Text strong className="block mb-1">
                    Hỗ trợ 24/7
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp đỡ bạn
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      {/* Upgrade Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleOutlined className="text-yellow-500 mr-2 text-xl" />
            <span className="text-lg font-semibold">
              Xác nhận nâng cấp gói dịch vụ
            </span>
          </div>
        }
        open={upgradeModalVisible}
        onCancel={() => {
          setUpgradeModalVisible(false);
          setSelectedPlan(null);
        }}
        footer={null}
        width={600}
      >
        {selectedPlan && (
          <div>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <Title level={4} className="text-blue-800 mb-2">
                {selectedPlan.name}
              </Title>
              <Text className="text-2xl font-bold text-blue-900">
                {formatPrice(selectedPlan.price)}
              </Text>
              {selectedPlan.duration_days && (
                <Text className="text-blue-700 block">
                  Thời hạn: {selectedPlan.duration_days} ngày
                </Text>
              )}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg mb-6 border-l-4 border-yellow-400">
              <Title level={5} className="text-yellow-800 mb-3">
                <ExclamationCircleOutlined className="mr-2" />
                Lưu ý quan trọng trước khi nâng cấp:
              </Title>

              <Space direction="vertical" className="w-full">
                <Text className="text-yellow-800">
                  <strong>•</strong> Không có chính sách hoàn tiền cho gói cũ
                  chưa hết hạn
                </Text>
                <Text className="text-yellow-800">
                  <strong>•</strong> Nên cân nhắc thời điểm nâng cấp để tối ưu
                  chi phí
                </Text>
                <Text className="text-yellow-800">
                  <strong>•</strong> Sau khi nâng cấp, tất cả các hạn mức sử
                  dụng sẽ được reset về 0
                </Text>
              </Space>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-400">
              <Title level={5} className="text-blue-800 mb-2">
                💳 Phương thức thanh toán
              </Title>
              <Text className="text-blue-800">
                Thanh toán chỉ được thực hiện thông qua{" "}
                <strong>Ví của hệ thống</strong>. Vui lòng đảm bảo số dư ví đủ
                để thanh toán.
              </Text>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                size="large"
                onClick={() => {
                  setUpgradeModalVisible(false);
                  setSelectedPlan(null);
                }}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                size="large"
                loading={upgrading}
                onClick={handleUpgradeConfirm}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {upgrading ? "Đang xử lý..." : "Xác nhận nâng cấp"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

ShopUpgradePlan.propTypes = {
  sellerPlan: PropTypes.shape({
    plan_id: PropTypes.number,
  }),
};

export default ShopUpgradePlan;
