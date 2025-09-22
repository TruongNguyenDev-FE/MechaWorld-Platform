import { useState } from 'react';
import { Card, Button, Tooltip, Dropdown, Menu } from 'antd';
import {
    WalletOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    PlusOutlined,
    MinusOutlined,
    BankOutlined,
    MoreOutlined
} from '@ant-design/icons';

const WalletBalance = ({ balance, onDeposit, onWithdraw, onManageBankAccounts }) => {
    const [showBalance, setShowBalance] = useState(true);

    const menu = (
        <Menu>
            <Menu.Item key="bank" icon={<BankOutlined />} onClick={onManageBankAccounts}>
                Quản lý tài khoản ngân hàng
            </Menu.Item>
        </Menu>
    );

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
                {/* Balance Display */}
                <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
                        <WalletOutlined className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">Số dư khả dụng</p>
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl font-bold text-gray-900">
                                {showBalance ? `₫${balance.toLocaleString()}` : "••••••••"}
                            </span>
                            <Tooltip title={showBalance ? "Ẩn số dư" : "Hiện số dư"}>
                                <Button
                                    icon={showBalance ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                    onClick={() => setShowBalance(!showBalance)}
                                    type="text"
                                    size="small"
                                    className="text-gray-500 hover:text-gray-700"
                                />
                            </Tooltip>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onDeposit}
                        size="large"
                        className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 rounded-lg"
                    >
                        Nạp tiền
                    </Button>

                    <Button
                        icon={<MinusOutlined />}
                        onClick={onWithdraw}
                        size="large"
                        className="border-orange-400 text-orange-600 hover:border-orange-500 hover:text-orange-700 rounded-lg"
                    >
                        Rút tiền
                    </Button>

                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button
                            icon={<MoreOutlined />}
                            size="large"
                            className="border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 rounded-lg"
                        />
                    </Dropdown>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-white/70 rounded-lg p-3">
                        <p className="text-2xl font-semibold text-green-600">+12</p>
                        <p className="text-sm text-gray-600">Giao dịch tháng này</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3">
                        <p className="text-2xl font-semibold text-blue-600">₫2.5M</p>
                        <p className="text-sm text-gray-600">Đã nạp tháng này</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3">
                        <p className="text-2xl font-semibold text-orange-600">₫1.2M</p>
                        <p className="text-sm text-gray-600">Đã rút tháng này</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default WalletBalance;