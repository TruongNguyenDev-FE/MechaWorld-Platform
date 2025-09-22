import { useState, useEffect } from 'react';
import { Typography, Space, Button, Alert, message } from 'antd';
import { DollarOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import { GetWithdrawalRequests } from '../../../apis/Moderator/APIModerator';

// Import components
import WithdrawalStatistics from './WithdrawalStatistics';
import WithdrawalFilters from './WithdrawalFilters';
import WithdrawalsTable from './WithdrawalsTable';
import WithdrawalDetailModal from './WithdrawalDetailModal';
import ProcessRequestModal from './ProcessRequestModal';

const { Title, Text } = Typography;

const ModWithdrawals = () => {
  const [withdrawalData, setWithdrawalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [filteredRole, setFilteredRole] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isProcessModalVisible, setIsProcessModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  // Fetch withdrawal requests from API
  const fetchWithdrawalRequests = async () => {
    try {
      setLoading(true);
      const response = await GetWithdrawalRequests();
      setWithdrawalData(response.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách yêu cầu rút tiền');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalRequests();
  }, []);

  // Thống kê tổng quan
  const stats = {
    totalRequests: withdrawalData.length,
    pendingRequests: withdrawalData.filter(w => w.status === 'pending').length,
    completedRequests: withdrawalData.filter(w => w.status === 'completed').length,
    rejectedRequests: withdrawalData.filter(w => w.status === 'rejected').length,
    totalAmount: withdrawalData
      .filter(w => w.status === 'completed')
      .reduce((sum, w) => sum + w.amount, 0),
  };

  // Lọc dữ liệu
  const filteredData = withdrawalData.filter((item) => {
    const matchesStatus = filteredStatus ? item.status === filteredStatus : true;
    const matchesSearch = searchText ? (
      item.id.toLowerCase().includes(searchText.toLowerCase()) ||
      item.bank_account.account_number.includes(searchText) ||
      (item.user_id && item.user_id.toLowerCase().includes(searchText.toLowerCase()))
    ) : true;

    return matchesStatus && matchesSearch;
  });

  // Xử lý xem chi tiết
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  // Xử lý yêu cầu rút tiền
  const handleProcessRequest = (record) => {
    setSelectedRecord(record);
    setIsProcessModalVisible(true);
  };

  // Xử lý hoàn thành rút tiền
  const handleCompleteWithdrawal = async (requestId, transactionCode) => {
    try {
      // Gọi API hoàn thành
      // const response = await CompleteWithdrawalRequest(requestId, transactionCode);
      message.success('Đã hoàn thành yêu cầu rút tiền');
      fetchWithdrawalRequests();
      return { success: true };
    } catch (error) {
      message.error('Không thể hoàn thành yêu cầu');
      return { success: false };
    }
  };

  // Xử lý từ chối rút tiền
  const handleRejectWithdrawal = async (requestId, rejectReason) => {
    try {
      // Gọi API từ chối
      // const response = await RejectWithdrawalRequest(requestId, rejectReason);
      message.success('Đã từ chối yêu cầu rút tiền');
      fetchWithdrawalRequests();
      return { success: true };
    } catch (error) {
      message.error('Không thể từ chối yêu cầu');
      return { success: false };
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="mb-2">
            <DollarOutlined className="mr-2 text-green-500" />
            Quản lý Yêu cầu Rút tiền
          </Title>
          <Text className="text-gray-500">
            Xử lý và quản lý các yêu cầu rút tiền từ người dùng
          </Text>
        </div>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchWithdrawalRequests}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button icon={<ExportOutlined />}>Xuất báo cáo</Button>
        </Space>
      </div>

      {/* Important Notice */}
      <Alert
        message="Lưu ý quan trọng cho Moderator"
        description={
          <ul className="mt-2 mb-0">
            <li>• Kiểm tra kỹ thông tin tài khoản ngân hàng trước khi chuyển tiền</li>
            <li>• Thực hiện chuyển khoản qua internet banking hoặc trực tiếp tại ngân hàng</li>
            <li>• Lưu lại mã giao dịch và biên lai từ ngân hàng để đối soát</li>
            <li>• Chỉ đánh dấu "Hoàn thành" sau khi đã chuyển tiền thành công</li>
          </ul>
        }
        type="info"
        showIcon
        className="mb-6"
      />

      {/* Statistics */}
      <WithdrawalStatistics stats={stats} />

      {/* Filters */}
      <WithdrawalFilters
        onSearch={setSearchText}
        onFilterStatus={setFilteredStatus}
        onFilterRole={setFilteredRole}
        onDateRangeChange={setDateRange}
      />

      {/* Withdrawals Table */}
      <WithdrawalsTable
        data={filteredData}
        loading={loading}
        onViewDetails={handleViewDetails}
        onProcessRequest={handleProcessRequest}
      />

      {/* Detail Modal */}
      <WithdrawalDetailModal
        visible={isDetailModalVisible}
        record={selectedRecord}
        onClose={() => setIsDetailModalVisible(false)}
      />

      {/* Process Request Modal */}
      <ProcessRequestModal
        visible={isProcessModalVisible}
        record={selectedRecord}
        onClose={() => setIsProcessModalVisible(false)}
        onComplete={handleCompleteWithdrawal}
        onReject={handleRejectWithdrawal}
      />
    </div>
  );
};

export default ModWithdrawals;