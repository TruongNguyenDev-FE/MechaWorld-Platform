import { Layout, Menu, Avatar, Dropdown, Badge, Button, Typography, Divider } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from "../features/auth/authSlice";
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import {
  UserOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  MoneyCollectFilled
} from '@ant-design/icons';

import { useState } from 'react';

const { Content, Sider, Header } = Layout;
const { Text } = Typography;

const ModeratorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  // Lấy key đang chọn dựa trên pathname - FIX LOGIC
  const getSelectedKey = () => {
    const pathname = location.pathname;

    // Nếu đang ở trang chính /moderator hoặc /moderator/dashboard
    if (pathname === '/moderator' || pathname === '/moderator/dashboard') {
      return 'dashboard';
    }

    // Loại bỏ /moderator/ và lấy phần còn lại
    const routeKey = pathname.replace('/moderator/', '');

    // Kiểm tra xem route có tồn tại trong menu items không
    const menuKeys = [
      'dashboard',
      'user-management',
      'order-management',
      'exchange-management',
      'auction-management',
      'transaction-management'
    ];

    return menuKeys.includes(routeKey) ? routeKey : 'dashboard';
  };

  const selectedKey = getSelectedKey();

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("access_token");
    Cookies.remove("user");

    setTimeout(() => {
      // navigate('/');
      window.location.href = "/";
    }, 50);
  };

  // Menu items với icons
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined className="text-lg" />,
      label: 'Dashboard',
    },
    // {
    //   key: 'user-management',
    //   icon: <UserOutlined className="text-lg" />,
    //   label: 'Quản lý Người dùng',
    // },
    // {
    //   key: 'order-management',
    //   icon: <FileTextOutlined className="text-lg" />,
    //   label: 'Quản lý Mua bán',
    // },
    // {
    //   key: 'exchange-management',
    //   icon: <SwapOutlined className="text-lg" />,
    //   label: 'Quản lý Trao đổi',
    // },
    {
      key: 'auction-management',
      icon: <ShoppingOutlined className="text-lg" />,
      label: 'Kiểm duyệt Đấu giá',
    },
    {
      key: 'transaction-management',
      icon: <MoneyCollectFilled className="text-lg" />,
      label: 'Giao dịch và Rút tiền',
    },
  ];

  // User dropdown menu
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
      className: 'text-red-500 hover:text-red-600',
    },
  ];

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sider
        width={280}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="shadow-lg border-r border-gray-200"
      >
        {/* Logo/Brand */}
        <div className="p-6 text-center border-b border-white/20">
          <div className="flex items-center justify-center mb-2">
            {!collapsed && (
              <Text className="text-3xl font-bold text-white">
                MechaWorld
              </Text>
            )}
          </div>
          {!collapsed && (
            <Text className="text-sm text-white/80">
              Moderator Panel
            </Text>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="vertical"
          selectedKeys={[selectedKey]}
          className="border-none bg-transparent mt-4"
          onClick={(e) => {
            if (e.key === 'logout') {
              handleLogout();
            } else {
              navigate(`/moderator/${e.key}`);
            }
          }}
          items={menuItems.map(item => ({
            ...item,
            className: `
              mx-3 mb-2 rounded-lg hover:bg-white/10 
              ${selectedKey === item.key ? 'bg-white/20 text-white' : 'text-white/80'}
            `,
            style: {
              height: '48px',
              lineHeight: '48px',
              fontSize: '14px',
              fontWeight: selectedKey === item.key ? '600' : '400',
            }
          }))}
        />

        {/* Logout Button at Bottom */}
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="w-full text-left text-white/80 hover:text-white hover:bg-white/10 border-none h-12 rounded-lg"
          >
            {!collapsed && 'Đăng xuất'}
          </Button>
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className="bg-white shadow-sm border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="mr-4 text-gray-600 hover:text-gray-800"
            />
            <Text className="text-lg font-semibold text-gray-800">
              {menuItems.find(item => item.key === selectedKey)?.label || 'Dashboard'}
            </Text>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="text-gray-600 text-xl hover:text-gray-800"
              />
            </Badge>

            <Divider type='vertical' className='' />

            {/* User Profile Dropdown */}
            <Dropdown
              menu={{
                items: userMenuItems,
              }}
              placement="bottomRight"
              arrow
            >
              <div className="flex items-center cursor-pointer hover:bg-gray-50 px-3 rounded-lg transition-colors">
                <span className='text-lg'>Moderator</span>

                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  className="ml-2"
                />
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Main Content */}
        <Content className="m-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-180px)]">
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ModeratorLayout;