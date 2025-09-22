import {
  ShoppingOutlined,
  UserOutlined,
  WalletOutlined, EditOutlined,
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { useSelector } from 'react-redux';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { RiAuctionLine } from "react-icons/ri";


export default function Profile() {

  const { Sider, Content } = Layout;
  const location = useLocation();

  const { user } = useSelector(state => state.auth);

  // Danh sách Menu
  const items = [
    {
      key: "/member/profile",
      icon: <UserOutlined className="text-lg text-blue-500" />,
      label: "Tài khoản Của Tôi",
      children: [
        { key: "/member/profile/account", label: <Link to="/member/profile/account">Hồ sơ</Link> },
        { key: "/member/profile/address-setting", label: <Link to="/member/profile/address-setting">Địa chỉ</Link> },
      ],
    },
    {
      key: "/member/profile/orders",
      icon: <ShoppingOutlined className="text-lg text-red-500" />,
      label: <Link to="/member/profile/orderHistory">Đơn hàng</Link>,
      children: [
        { key: "/member/profile/orders/regular-auction", label: <Link to="/member/profile/orders/regular-auction">Mua bán & Đấu giá</Link> },
        { key: "/member/profile/orders/exchange", label: <Link to="/member/profile/orders/exchange">Trao đổi</Link> },
      ],
    },
    {
      key: "/member/profile/auction-participation",
      icon: <RiAuctionLine  className="text-lg text-green-500" />,
      label: <Link to="/member/profile/auction-participation">Đấu giá đã tham gia </Link>,
    },
    {
      key: "/member/profile/wallet",
      icon: <WalletOutlined className="text-lg text-green-500" />,
      label: <Link to="/member/profile/wallet">Số dư & Giao dịch</Link>,
    },
  ];

  return (
    <Layout className="container">

      {/* Sidebar - Menu */}
      <Sider width={250} className="bg-white shadow-md h-fit rounded-lg p-4 mt-36 mb-4">
        <div className='flex flex-col'>
          <div className="flex items-center py-2 gap-3 border-b">
            <img
              src={user?.avatar_url}
              className="w-10 h-10 bg-gray-100 rounded-full object-contain"
              alt="Avatar"
            />
            <div className='flex flex-col'>
              <p className="font-bold">{user?.full_name}</p>

              <div className='flex items-center space-x-2 text-sm text-gray-400'>
                <EditOutlined className='mt-1' />
                <Link to="/member/profile/user">
                  Sửa hồ sơ
                </Link>
              </div>
            </div>
          </div>
        </div>


        {/* Menu Điều Hướng */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]} // Highlight menu dựa trên đường dẫn hiện tại
          defaultOpenKeys={["/member/profile", "/member/profile/orderHistory"]} // Mở menu mặc định
          items={items}
        />

      </Sider>

      <Layout className="flex-1 py-4 ml-6 mt-32">
        <Content className="bg-white rounded-lg shadow-md h-full w-full">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
