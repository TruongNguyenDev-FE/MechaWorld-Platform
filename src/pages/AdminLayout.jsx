import { Layout, Menu, Avatar, Dropdown, Badge, Button, Typography, Divider, Card } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from "../features/auth/authSlice";
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import {
    UserOutlined,
    LogoutOutlined,
    BellOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    TeamOutlined,
    ShopOutlined,
    BarChartOutlined,
    SecurityScanOutlined,
    DatabaseOutlined,
    CrownOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';

import { useState } from 'react';

const { Content, Sider, Header } = Layout;
const { Text, Title } = Typography;

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);

    // Lấy key đang chọn dựa trên pathname
    const getSelectedKey = () => {
        const pathname = location.pathname;

        if (pathname === '/admin' || pathname === '/admin/dashboard') {
            return 'dashboard';
        }

        const routeKey = pathname.replace('/admin/', '');

        // Chỉ check trong các routes được enable
        const enabledRoutes = adminMenuConfig
            .filter(item => item.enabled)
            .map(item => item.key);

        return enabledRoutes.includes(routeKey) ? routeKey : 'dashboard';
    };

    const selectedKey = getSelectedKey();

    const handleLogout = () => {
        dispatch(logout());
        Cookies.remove("access_token");
        Cookies.remove("user");

        setTimeout(() => {
            window.location.href = "/";
        }, 50);
    };

    // Admin menu configuration - dễ dàng thêm tính năng mới
    const adminMenuConfig = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined className="text-xl" />,
            label: 'Dashboard',
            gradient: 'from-blue-500 to-cyan-500',
            enabled: true, // Hiện tại đang active
            description: 'System overview and statistics'
        },
    ];

    // Chỉ hiển thị các menu items được enable
    const menuItems = adminMenuConfig.filter(item => item.enabled);

    // User dropdown menu với admin styling
    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Admin Profile',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Sign Out',
            onClick: handleLogout,
            className: 'text-red-500 hover:text-red-600',
        },
    ];

    return (
        <Layout className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Sidebar với glassmorphism effect */}
            <Sider
                width={300}
                collapsed={collapsed}
                onCollapse={setCollapsed}
                className="backdrop-blur-xl bg-white/10 border-r border-white/20 shadow-2xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                }}
            >
                {/* Admin Brand Header */}
                <div className="p-6 text-center border-b border-white/20">
                    <div className="flex items-center justify-center">
                        {!collapsed && (
                            <div className="">
                                <Title level={3} className="!text-gray-800 !mb-0 font-bold">
                                    MechaWorld
                                </Title>
                                <div className="flex items-center justify-center">
                                    <ThunderboltOutlined className="text-yellow-500 mr-1" />
                                    <Text className="text-sm font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                        ADMIN CONTROL
                                    </Text>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Menu với future-ready design */}
                <div className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isSelected = selectedKey === item.key;
                        return (
                            <div key={item.key}>
                                <button
                                    onClick={() => navigate(`/admin/${item.key}`)}
                                    className={`
                    w-full h-12 flex items-center px-4 rounded-lg
                    transition-colors duration-200
                    ${isSelected
                                            ? 'bg-blue-500 hover:bg-blue-300 text-white'
                                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                        }
                  `}
                                >
                                    <span className="mr-3 text-lg">
                                        {item.icon}
                                    </span>
                                    {!collapsed && (
                                        <span className="font-medium">
                                            {item.label}
                                        </span>
                                    )}
                                </button>
                            </div>
                        );
                    })}

                    {/* Coming Soon Features - Optional Preview */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-6 pt-4 border-t border-white/20">
                            {adminMenuConfig
                                .filter(item => !item.enabled)
                                .slice(0, 2) // Chỉ hiển thị 2 feature đầu tiên
                                .map((item) => (
                                    <div key={item.key} className="mb-2">
                                        <Button
                                            type="text"
                                            disabled
                                            className="w-full h-12 flex items-center justify-start px-4 rounded-xl text-gray-400 opacity-50"
                                            title={item.description}
                                        >
                                            <span className="mr-3">{item.icon}</span>
                                            {!collapsed && (
                                                <span className="font-medium text-xs">{item.label}</span>
                                            )}
                                        </Button>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </Sider>

            {/* Main Layout */}
            <Layout>
                {/* Header với glass effect */}
                <Header
                    className="backdrop-blur-xl bg-white/80 shadow-md border-b border-white/20 px-6 py-11 rounded-sm flex items-center justify-between"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                    }}
                >
                    <div className="flex items-center">
                        {/* <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="mr-6 text-gray-700 hover:text-gray-900 text-xl h-30 w-30 rounded-lg hover:bg-white/50 transition-all duration-300"
                        /> */}
                        <div>
                            <Text className="text-xl text-gray-600">
                                System Administrator Panel
                            </Text>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* System Status Indicator */}
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <Text className="text-xs text-gray-600 font-medium">System Online</Text>
                        </div>

                        {/* Notifications với special styling */}
                        <Badge count={3} size="small">
                            <Button
                                type="text"
                                icon={<BellOutlined />}
                                className="text-gray-700 text-xl hover:text-orange-500 h-10 w-10 rounded-lg hover:bg-white/50 transition-all duration-300"
                            />
                        </Badge>

                        <Divider type='vertical' className='border-gray-300' />

                        {/* Admin Profile Dropdown */}
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            arrow
                        >
                            <Card
                                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-r from-blue-500 to-purple-600"
                                bodyStyle={{ padding: '8px 16px' }}
                            >
                                <div className="flex items-center">
                                    <div>
                                        <Text className="text-white font-bold text-sm">Administrator</Text>
                                        <div className="flex items-center">
                                            <CrownOutlined className="text-yellow-300 text-xs mr-1" />
                                            <Text className="text-white/80 text-xs">Full Access</Text>
                                        </div>
                                    </div>
                                    <Avatar
                                        size="large"
                                        icon={<UserOutlined />}
                                        className="ml-3 bg-white/20 border-2 border-white/30"
                                    />
                                </div>
                            </Card>
                        </Dropdown>
                    </div>
                </Header>

                {/* Main Content với enhanced styling */}
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

export default AdminLayout;