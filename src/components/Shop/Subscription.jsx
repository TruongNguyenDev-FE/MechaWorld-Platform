import React, { useState, useEffect } from 'react';
import { GetSubscriptionPlans, upgradeSubscription, GetSellerActiveSubscription } from '../../apis/Subscription/APISubscription';
import { Card, Button, Spin, Typography, Tag, Space, message, Modal, Badge } from 'antd';
import { CrownOutlined, StarOutlined, RocketOutlined, ExclamationCircleOutlined, CheckOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';

const { Title, Text } = Typography;
const { confirm } = Modal;

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const userCookie = Cookies.get('user');
  const sellerId = userCookie ? JSON.parse(userCookie)?.id : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [plansResponse, currentPlanResponse] = await Promise.all([
          GetSubscriptionPlans(),
          GetSellerActiveSubscription(sellerId)
        ]);
        
        setPlans(plansResponse.data || []);
        setCurrentPlan(currentPlanResponse.data || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchData();
    }
  }, [sellerId]);

  const handleUpgrade = async (planId) => {
    if (!sellerId) {
      message.error('Vui lòng đăng nhập để thực hiện nâng cấp');
      return;
    }

    if (currentPlan?.plan_id === 3) {
      message.warning('Bạn đang sử dụng gói không giới hạn, không thể đăng ký gói thấp hơn');
      return;
    }

    if (currentPlan && planId < currentPlan.plan_id) {
      message.warning('Bạn không thể đăng ký gói thấp hơn gói hiện tại');
      return;
    }

    confirm({
      title: 'Xác nhận nâng cấp gói đăng ký',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn nâng cấp gói đăng ký?</p>
          <p>Số tiền sẽ được trừ trực tiếp từ ví của bạn.</p>
        </div>
      ),
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setUpgrading(true);
          await upgradeSubscription(sellerId, planId);
          message.success('Nâng cấp gói đăng ký thành công!');
          
          const response = await GetSellerActiveSubscription(sellerId);
          setCurrentPlan(response.data || null);
        } catch (error) {
          message.error(`Nâng cấp thất bại: ${error.response?.data?.message || error.message}`);
        } finally {
          setUpgrading(false);
        }
      }
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPlanIcon = (id) => {
    switch (id) {
      case 1: return <StarOutlined className="text-yellow-500" />;
      case 2: return <RocketOutlined className="text-blue-500" />;
      case 3: return <CrownOutlined className="text-purple-500" />;
      default: return <StarOutlined />;
    }
  };

  const getPlanTag = (id) => {
    switch (id) {
      case 1: return <Tag color="gold">Dùng thử</Tag>;
      case 2: return <Tag color="blue">Phổ biến</Tag>;
      case 3: return <Tag color="purple">Cao cấp</Tag>;
      default: return null;
    }
  };

  const isPlanDisabled = (planId) => {
    if (currentPlan?.plan_id === 3) return true;
    if (currentPlan && planId <= currentPlan.plan_id) return true;
    if (planId === 1 && currentPlan?.plan_id) return true;
    return false;
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Text type="danger">Đã xảy ra lỗi: {error}</Text>;

  const PlanCard = ({ plan }) => (
    <Card
      className={`shadow-lg hover:shadow-xl transition-shadow ${
        plan.id === currentPlan?.plan_id ? 'border-2 border-green-500' : ''
      }`}
      title={
        <Space className="w-full justify-between">
          <Space>
            {getPlanIcon(plan.id)}
            <span className="font-semibold">{plan.name}</span>
          </Space>
          {getPlanTag(plan.id)}
        </Space>
      }
      actions={[
        <Button 
          type={plan.id === currentPlan?.plan_id ? 'default' : 'primary'} 
          size="large" 
          block
          loading={upgrading && plan.id === currentPlan?.plan_id}
          onClick={() => handleUpgrade(plan.id)}
          disabled={isPlanDisabled(plan.id)}
          icon={plan.id === currentPlan?.plan_id ? <CheckOutlined /> : null}
          className={plan.id === currentPlan?.plan_id ? '' : 'bg-blue-600 hover:bg-blue-700'}
        >
          {plan.id === currentPlan?.plan_id
            ? 'Đang sử dụng'
            : plan.id === 1 && currentPlan?.plan_id
            ? 'Đã dùng thử'
            : 'Đăng ký ngay'}
        </Button>
      ]}
    >
      <div className="flex flex-col flex-grow">
        <div className="text-center mb-4">
          <Text className="text-2xl font-bold block">
            {plan.price === 0 ? 'Miễn phí' : formatPrice(plan.price)}
          </Text>
          {plan.duration_days && (
            <Text type="secondary" className="block">
              / {plan.duration_days} ngày
            </Text>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 flex-grow">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center">
              <Text className="text-gray-600">Số tin đăng tối đa:</Text>
              <Text strong className="text-right min-w-[100px]">
                {plan.max_listings === null ? 'Không giới hạn' : plan.max_listings}
              </Text>
            </div>
            <div className="flex justify-between items-center">
              <Text className="text-gray-600">Số phiên đấu giá:</Text>
              <Text strong className="text-right min-w-[100px]">
                {plan.max_open_auctions === null ? 'Không giới hạn' : plan.max_open_auctions}
              </Text>
            </div>
            <div className="flex justify-between items-center">
              <Text className="text-gray-600">Loại gói:</Text>
              <Text strong className="text-right min-w-[100px]">
                {plan.is_unlimited ? 'Không giới hạn' : 'Có giới hạn'}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">Các Gói Đăng Ký</Title>
      
      {currentPlan && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <Text strong className="text-lg">
            Gói hiện tại: {plans.find(p => p.id === currentPlan.plan_id)?.name || 'Không xác định'}
          </Text>
          <Text className="block">Hết hạn vào: {new Date(currentPlan.expires_at).toLocaleDateString()}</Text>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          plan.id === currentPlan?.plan_id ? (
            <Badge.Ribbon text="Đang sử dụng" color="green" key={plan.id}>
              <PlanCard plan={plan} />
            </Badge.Ribbon>
          ) : (
            <PlanCard plan={plan} key={plan.id} />
          )
        ))}
      </div>
    </div>
  );
};

export default Subscription;