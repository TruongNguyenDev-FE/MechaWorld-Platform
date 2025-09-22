import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { Button, Layout, message, Modal, Input, notification } from 'antd';
import {
    MenuOutlined,
    FilterOutlined,
    AppstoreOutlined,
    ProfileOutlined,
    SyncOutlined
} from '@ant-design/icons';

import PostModal from './PostModal';

const { Content } = Layout;

const navItems = [
    {
        label: 'Các bài viết trao đổi',
        path: '/exchange/list',
        icon: <AppstoreOutlined />
    },
    {
        label: 'Quản lý bài viết của tôi',
        path: '/exchange/my-post',
        icon: <ProfileOutlined />
    },
    {
        label: 'Quản lý các trao đổi của tôi',
        path: '/exchange/manage',
        icon: <SyncOutlined />
    },
];

const filterOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Mới nhất', value: 'latest' },
    { label: 'Cũ nhất', value: 'oldest' },
];

export default function ExchangeNavigator() {

    const currentUser = useSelector((state) => state.auth.user)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');


    // Open modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Handle successful post submission
    const handlePostSuccess = (postData) => {
        console.log("Post created successfully:", postData);
        closeModal();

        // Show success notification
        notification.success({
            message: 'Đăng bài viết thành công!',
            description: 'Bài viết bạn đã được đăng lên nền tảng.',
            placement: 'topRight',
        });

        setTimeout(() => {
            window.location.reload();
        }, 1000)

    };

    // Handle filter change
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        console.log("Filter changed to:", filter);
    };

    return (
        <Content className="bg-white shadow rounded-lg">
            {/* Part 1: User Info (Facebook style poster) */}
            <div className="p-4 border-b">
                <div>
                    <Input
                        placeholder="+ ĐĂNG BÀI VIẾT TRAO ĐỔI Ở ĐÂY..."
                        className="hover:bg-gray-200 shadow-md cursor-pointer rounded-full px-4"
                        onClick={openModal}
                        readOnly
                    />

                </div>
            </div>

            {/* Part 2: Navigation Links */}
            <div className="p-4 border-b">
                <h3 className="font-medium text-gray-700 mb-3">Điều hướng</h3>
                <nav className="block w-full">
                    <ul className="text-gray-700 space-y-2">
                        {navItems.map(({ label, path, icon }) => (
                            <li key={path}>
                                <NavLink
                                    to={path}
                                    className={({ isActive }) =>
                                        `block p-2 rounded cursor-pointer flex items-center ${isActive ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-100'}`
                                    }
                                >
                                    <span className="mr-3">{icon}</span>
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="mt-4 md:hidden">
                    <Button icon={<MenuOutlined />} className="w-full">
                        Menu
                    </Button>
                </div>
            </div>

            {/* Part 3: Filter */}
            <div className="p-4">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                    <FilterOutlined className="mr-2" />
                    Lọc bài viết
                </h3>
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map(option => (
                        <Button
                            key={option.value}
                            type={activeFilter === option.value ? "primary" : "default"}
                            onClick={() => handleFilterChange(option.value)}
                            className={activeFilter === option.value ? "bg-blue-500" : ""}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Post Modal */}
            <Modal
                title="ĐĂNG BÀI VIẾT TRAO ĐỔI"
                open={isModalOpen}
                onCancel={closeModal}
                width={600}
                footer={null}
                destroyOnClose
            >
                <PostModal
                    currentUser={currentUser}
                    onClose={closeModal}
                    onSuccess={handlePostSuccess}
                />
            </Modal>
        </Content>
    );
}