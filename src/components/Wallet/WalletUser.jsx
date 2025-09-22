import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Tabs, message } from 'antd';
import { WalletOutlined } from '@ant-design/icons';

import { checkWallet } from '../../apis/User/APIUser';
import { GetWalletTransactions } from '../../apis/Wallet/APIWallet';

import WalletBalance from './WalletBanlance';
import TransactionHistory from './TransactionHistory';
import DepositModal from './DepositModal';
import WithdrawalModal from './WithdrawalModal';
import BankAccountModal from './BankAccountModal';
import WithdrawalHistory from './WithdrawalHistory';
const { TabPane } = Tabs;

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isWithdrawalModalVisible, setIsWithdrawalModalVisible] = useState(false);
  const [isBankAccountModalVisible, setIsBankAccountModalVisible] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);

  const userId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    fetchWalletData();
    fetchBankAccounts();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [balanceRes, transactionsRes] = await Promise.all([
        checkWallet(userId),
        GetWalletTransactions()
      ]);

      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu ví:', error);
      message.error('Lỗi khi lấy thông tin ví. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      // API call to get bank accounts
      // const response = await getBankAccounts();
      // setBankAccounts(response.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy tài khoản ngân hàng:', error);
    }
  };

  const handleDepositSuccess = (amount) => {
    setBalance(prev => prev + amount);
    fetchWalletData(); // Refresh data
    message.success(`Nạp tiền thành công ${amount.toLocaleString()} VNĐ`);
  };

  const handleWithdrawalSuccess = (amount) => {
    setBalance(prev => prev - amount);
    fetchWalletData(); // Refresh data
    message.success(`Yêu cầu rút tiền ${amount.toLocaleString()} VNĐ đã được gửi`);
  };

  const handleBankAccountAdded = () => {
    fetchBankAccounts();
    message.success('Thêm tài khoản ngân hàng thành công');
  };

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <WalletOutlined className="mr-3 text-blue-600" />
            Ví MechaWorld
          </h1>
          <p className="text-gray-600 mt-2">Quản lý số dư và giao dịch của bạn</p>
        </div>

        <Tabs
          defaultActiveKey="1"
          type="card"
          className="bg-white rounded-lg shadow-sm"
        >
          <TabPane tab="Số dư & Giao dịch" key="1">
            <div className="space-y-6">
              <WalletBalance
                balance={balance}
                onDeposit={() => setIsDepositModalVisible(true)}
                onWithdraw={() => setIsWithdrawalModalVisible(true)}
                onManageBankAccounts={() => setIsBankAccountModalVisible(true)}
              />
            </div>
          </TabPane>

          <TabPane tab="Lịch sử giao dịch" key="2">
            <TransactionHistory
              transactions={transactions}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="Danh sách hoàn tiền" key="3">
            <WithdrawalHistory
              bankAccounts={bankAccounts}
              loading={loading}
            />
          </TabPane>

        </Tabs>

        {/* Modals */}
        <DepositModal
          visible={isDepositModalVisible}
          onCancel={() => setIsDepositModalVisible(false)}
          onSuccess={handleDepositSuccess}
        />

        <WithdrawalModal
          visible={isWithdrawalModalVisible}
          onCancel={() => setIsWithdrawalModalVisible(false)}
          onSuccess={handleWithdrawalSuccess}
          balance={balance}
          bankAccounts={bankAccounts}
        />

        <BankAccountModal
          visible={isBankAccountModalVisible}
          onCancel={() => setIsBankAccountModalVisible(false)}
          onSuccess={handleBankAccountAdded}
        />
      </div>
    </div>
  );
};

export default WalletPage;