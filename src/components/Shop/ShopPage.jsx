import {
  ShoppingOutlined,
  BankOutlined,
  ShopOutlined,
  InboxOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, Layout, Card, Avatar, Tag } from 'antd';

import { GetSellerStatus } from "../../apis/Sellers/APISeller";
import { GetShopInfoById } from "../../apis/Seller Profile/APISellerProfile";
import { updateShopInfo, updateSellerPlan } from '../../features/user/userSlice';

const { Sider, Content } = Layout;

// Define the mapping of paths to menu keys
const pathToKeyMap = {
  '/shop/dashboard': '1',
  '/shop/management': '2',
  '/shop/order-management': '3',
  '/shop/auction-management': '4'
};

export default function ShopPage() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [selectedKey, setSelectedKey] = useState('1');

  const user = useSelector((state) => state.auth.user);
  const shopInfo = useSelector((state) => state.user.shop);
  const sellerPlan = useSelector((state) => state.user.sellerPlan);

  // Set the selected menu key based on current path
  useEffect(() => {
    // Find which path prefix matches the current location
    for (const path in pathToKeyMap) {
      if (location.pathname.startsWith(path)) {
        setSelectedKey(pathToKeyMap[path]);
        break;
      }
    }
  }, [location.pathname]);

  // Menu items with keys matching the paths
  const items = [
    {
      key: "1",
      icon: <ShopOutlined />,
      label: <Link to="/shop/dashboard">Quản Lý Shop</Link>,
    },
    {
      key: '2',
      icon: <InboxOutlined />,
      label: <Link to="/shop/management">Quản Lý Sản Phẩm</Link>,
    },
    {
      key: '3',
      icon: <ShoppingOutlined />,
      label: <Link to="/shop/order-management">Quản Lý Đơn Hàng</Link>,
    },
    {
      key: '4',
      icon: <BankOutlined />,
      label: <Link to="/shop/auction-management">Quản Lý Đấu Giá</Link>
    },
  //   {
  //   key: '5',
  //   icon: <GiftOutlined />,
  //   label: <Link to="/shop/subscription">Đăng ký gói</Link>
  // },
];

  useEffect(() => {
    // Fetch shop info từ API và cập nhật vào Redux
    const fetchShopInfo = async () => {
      try {
        const response = await GetShopInfoById(user.id);
        const shopData = response.data?.seller_profile;
        dispatch(updateShopInfo(shopData));
      } catch (error) {
        console.error("Error fetching shop info:", error);
      }
    };

    // Fetch seller status từ API và cập nhật vào Redux
    const fetchSellerStatus = async () => {
      try {
        const response = await GetSellerStatus(user.id);
        const statusData = response.data;
        dispatch(updateSellerPlan(statusData));
      } catch (error) {
        console.error("Error fetching seller status:", error);
      }
    };

    // Luôn fetch thông tin shop và seller status mỗi khi component mount
    fetchShopInfo();
    fetchSellerStatus();
  }, [user.id, dispatch]);

  // Lấy giá trị hiển thị từ Redux store
  const shopName = shopInfo?.shop_name || "Đang tải...";
  const subscriptionName = sellerPlan?.subscription_name || "Đang tải...";
  const listingsUsed = sellerPlan?.listings_used || 0;
  const maxListings = sellerPlan?.max_listings || 0;
  const auctionsUsed = sellerPlan?.open_auctions_used || 0;
  const maxAuctions = sellerPlan?.max_open_auctions || 0;

  return (
    <>
      <Layout className="flex container">
        <Sider width={300} className="bg-white shadow-md h-fit rounded-lg p-4 mt-36 mb-4">
          <Card className="mb-4">
            {/* Shop Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <Avatar className='p-5 bg-blue-500' icon={<ShopOutlined />} size="large" />
                <div>
                  <p className="font-bold text-base">{shopName}</p>
                  <Tag color="blue" className="text-xs">{subscriptionName}</Tag>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {/* Lượt bán sản phẩm */}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lượt đăng bán:</span>
                <span className="font-semibold">{listingsUsed} / {maxListings}</span>
              </div>

              {/* Lượt đấu giá */}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lượt đấu giá:</span>
                <span className="font-semibold">{auctionsUsed} / {maxAuctions}</span>
              </div>
            </div>
          </Card>

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={items}
          />
        </Sider>

        <Layout className="flex-1 py-4 ml-6 mt-32">
          <Content className="bg-white rounded-lg shadow-md p-6 h-full min-w-full max-w-fix">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}