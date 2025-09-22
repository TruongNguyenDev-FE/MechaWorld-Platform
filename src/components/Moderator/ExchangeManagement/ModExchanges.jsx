import { useState } from 'react';
import {
  Typography,
} from "antd";
import {
  SwapOutlined,
} from "@ant-design/icons";
import ExchangeStatistics from './ExchangeStatistics';
import ExchangeFilters from './ExchangeFilters';
import ExchangeTable from './ExchangeTable';
import ExchangeDetailModal from './ExchangeDetailModal';

const { Title, Text } = Typography;

// Dữ liệu mẫu
const exchangeData = [
  {
    key: "1",
    content: "Chào mọi người, mình đang tìm kiếm một mẫu Gundam MG Sazabi Ver.Ka để trao đổi với MG RX-78-2 Ver.3.0 của mình. Sản phẩm còn nguyên seal, chưa mở hộp.",
    sender: { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/32", id: "U00001" },
    postOwner: "Trần Thị B",
    priceDifference: 500000,
    exchangeStatus: "Chờ xử lí",
    postStatus: "Đang được đăng",
  },
  {
    key: "2",
    content: "Cần trao đổi Gundam MG RX-78-2 Ver.3.0, ai có MG Unicorn Ver.Ka không? Có thể trả thêm tiền nếu cần.",
    sender: { name: "Lê Hoàng C", avatar: "https://i.pravatar.cc/32", id: "U00002" },
    postOwner: "Nguyễn Văn A",
    priceDifference: -200000,
    exchangeStatus: "Đang giao hàng",
    postStatus: "Không được đăng",
  },
  {
    key: "3",
    content: "Mình có Gundam Unicorn Ver.Ka muốn đổi lấy MG Sazabi, cả hai đều condition tốt, có thể gặp trực tiếp tại TP.HCM",
    sender: { name: "Phạm Minh D", avatar: "https://i.pravatar.cc/32", id: "U00003" },
    postOwner: "Lê Hoàng C",
    priceDifference: 0,
    exchangeStatus: "Hoàn tất",
    postStatus: "Đã xong",
  },
  {
    key: "4",
    content: "Đổi PG Unicorn lấy MG Strike Freedom Full Burst Mode, ai quan tâm inbox mình nhé!",
    sender: { name: "Võ Thị E", avatar: "https://i.pravatar.cc/32", id: "U00004" },
    postOwner: "Phạm Minh D",
    priceDifference: 1200000,
    exchangeStatus: "Bị từ chối",
    postStatus: "Đang được đăng",
  }
];

const ModExchanges = () => {
  const [filteredExchangeStatus, setFilteredExchangeStatus] = useState(null);
  const [filteredPostStatus, setFilteredPostStatus] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Lọc dữ liệu
  const filteredData = exchangeData.filter((item) => {
    return (
      (filteredExchangeStatus ? item.exchangeStatus === filteredExchangeStatus : true) &&
      (filteredPostStatus ? item.postStatus === filteredPostStatus : true) &&
      (searchText
        ? item.sender.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.postOwner.toLowerCase().includes(searchText.toLowerCase()) ||
        item.content.toLowerCase().includes(searchText.toLowerCase())
        : true)
    );
  });

  const handleViewDetail = (exchange) => {
    setSelectedExchange(exchange);
    setDetailModalVisible(true);
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Title level={2} className="flex items-center gap-3 mb-2">
          <SwapOutlined className="text-blue-500" />
          Quản Lý Trao Đổi
        </Title>
        <Text className="text-gray-600">
          Quản lý và theo dõi các giao dịch trao đổi giữa người dùng
        </Text>
      </div>

      {/* Statistics */}
      <ExchangeStatistics data={filteredData} />

      {/* Filters */}
      <ExchangeFilters
        searchText={searchText}
        setSearchText={setSearchText}
        filteredExchangeStatus={filteredExchangeStatus}
        setFilteredExchangeStatus={setFilteredExchangeStatus}
        filteredPostStatus={filteredPostStatus}
        setFilteredPostStatus={setFilteredPostStatus}
      />

      {/* Main Table */}
      <ExchangeTable
        data={filteredData}
        onViewDetail={handleViewDetail}
      />

      {/* Detail Modal */}
      <ExchangeDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        exchangeData={selectedExchange}
      />
    </div>
  );
};

export default ModExchanges;