import { useState } from 'react';
import {
  Typography,
  Space,
  Button,
} from "antd";
import {
  ShoppingCartOutlined,
  ExportOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import OrderStatistics from './OrderStatistics';
import OrderFilters from './OrdersFilter';
import OrdersTable from './OrdersTable';
import OrderDetailModal from './OrderDetailModal'

const { Title, Text } = Typography;


const regularOrderData = [
  {
    key: "1",
    id: "REG001",
    orderNumber: "GH-2024-001",
    trackingCode: "VN123456789",
    buyer: {
      name: "Nguyễn Văn An",
      avatar: "https://i.pravatar.cc/32",
      phone: "0901234567",
      address: "123 Nguyễn Huệ, Q1, TP.HCM",
      email: "nguyenvana@email.com"
    },
    seller: {
      name: "Trần Thị Bảo",
      avatar: "https://i.pravatar.cc/32",
      phone: "0907654321",
      shop: "Gundam Store"
    },
    products: [
      { name: "RG RX-78-2 Gundam", quantity: 1, price: 800000, sku: "RG001" },
      { name: "Action Base 1 Clear", quantity: 2, price: 350000, sku: "AB001" }
    ],
    subtotal: 1500000,
    shippingFee: 50000,
    totalAmount: 1550000,
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    status: "pending",
    orderDate: "2024-05-28 14:30",
    estimatedDelivery: "2024-06-05",
    actualDelivery: null,
    priority: "normal",
    notes: "Giao hàng trong giờ hành chính"
  },
  {
    key: "2",
    id: "REG002",
    orderNumber: "GH-2024-002",
    trackingCode: "VN987654321",
    buyer: {
      name: "Lê Hoàng Cường",
      avatar: "https://i.pravatar.cc/32",
      phone: "0909876543",
      address: "456 Lê Lợi, Q3, TP.HCM",
      email: "lehoangcuong@email.com"
    },
    seller: {
      name: "Nguyễn Văn An",
      avatar: "https://i.pravatar.cc/32",
      phone: "0901234567",
      shop: "Mecha World"
    },
    products: [
      { name: "MG Strike Freedom", quantity: 1, price: 1200000, sku: "MG001" },
      { name: "LED Unit for MG", quantity: 1, price: 300000, sku: "LED001" }
    ],
    subtotal: 1500000,
    shippingFee: 80000,
    totalAmount: 1580000,
    paymentMethod: "ewallet",
    paymentStatus: "paid",
    status: "shipping",
    orderDate: "2024-05-25 10:15",
    estimatedDelivery: "2024-06-02",
    actualDelivery: null,
    priority: "high",
    notes: "Khách hàng VIP"
  },
  {
    key: "3",
    id: "REG003",
    orderNumber: "GH-2024-003",
    trackingCode: null,
    buyer: {
      name: "Phạm Minh Dũng",
      avatar: "https://i.pravatar.cc/32",
      phone: "0908765432",
      address: "789 Nguyễn Trãi, Q5, TP.HCM",
      email: "phamminhd@email.com"
    },
    seller: {
      name: "Lê Hoàng Cường",
      avatar: "https://i.pravatar.cc/32",
      phone: "0909876543",
      shop: "Gunpla Corner"
    },
    products: [
      { name: "HG Barbatos Lupus", quantity: 1, price: 450000, sku: "HG001" },
      { name: "Panel Line Marker Set", quantity: 1, price: 150000, sku: "TOOL001" }
    ],
    subtotal: 600000,
    shippingFee: 30000,
    totalAmount: 630000,
    paymentMethod: "cod",
    paymentStatus: "pending",
    status: "failed",
    orderDate: "2024-05-30 16:45",
    estimatedDelivery: "2024-06-07",
    actualDelivery: null,
    priority: "normal",
    notes: "Khách không nhận được hàng - số điện thoại không liên lạc được"
  },
  {
    key: "4",
    id: "REG004",
    orderNumber: "GH-2024-004",
    trackingCode: "VN456789123",
    buyer: {
      name: "Võ Thị Lan",
      avatar: "https://i.pravatar.cc/32",
      phone: "0905432109",
      address: "321 Hai Bà Trưng, Q1, TP.HCM",
      email: "vothilan@email.com"
    },
    seller: {
      name: "Trần Thị Bảo",
      avatar: "https://i.pravatar.cc/32",
      phone: "0907654321",
      shop: "Gundam Store"
    },
    products: [
      { name: "PG Unicorn Gundam", quantity: 1, price: 2500000, sku: "PG001" }
    ],
    subtotal: 2500000,
    shippingFee: 100000,
    totalAmount: 2600000,
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    status: "completed",
    orderDate: "2024-05-20 09:20",
    estimatedDelivery: "2024-05-28",
    actualDelivery: "2024-05-27 14:30",
    priority: "normal",
    notes: "Giao hàng thành công"
  },
  {
    key: "5",
    id: "REG005",
    orderNumber: "GH-2024-005",
    trackingCode: "VN789123456",
    buyer: {
      name: "Đặng Văn Nam",
      avatar: "https://i.pravatar.cc/32",
      phone: "0903456789",
      address: "654 Cách Mạng Tháng 8, Q3, TP.HCM",
      email: "dangvannam@email.com"
    },
    seller: {
      name: "Nguyễn Văn An",
      avatar: "https://i.pravatar.cc/32",
      phone: "0901234567",
      shop: "Mecha World"
    },
    products: [
      { name: "RG Nu Gundam", quantity: 1, price: 900000, sku: "RG002" },
      { name: "Action Base 2", quantity: 1, price: 400000, sku: "AB002" },
      { name: "Topcoat Spray", quantity: 2, price: 180000, sku: "TOOL002" }
    ],
    subtotal: 1660000,
    shippingFee: 60000,
    totalAmount: 1720000,
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    status: "processing",
    orderDate: "2024-05-31 11:00",
    estimatedDelivery: "2024-06-08",
    actualDelivery: null,
    priority: "normal",
    notes: ""
  }
];

const ModOrders = () => {
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [filteredPriority, setFilteredPriority] = useState(null);
  const [filteredPaymentMethod, setFilteredPaymentMethod] = useState(null);
  const [filteredPaymentStatus, setFilteredPaymentStatus] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  // Thống kê tổng quan
  const stats = {
    totalOrders: regularOrderData.length,
    pendingOrders: regularOrderData.filter(o => o.status === 'pending').length,
    processingOrders: regularOrderData.filter(o => o.status === 'processing').length,
    shippingOrders: regularOrderData.filter(o => o.status === 'shipping').length,
    completedOrders: regularOrderData.filter(o => o.status === 'completed').length,
    failedOrders: regularOrderData.filter(o => o.status === 'failed').length,
    totalRevenue: regularOrderData.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0),
  };

  // Lọc dữ liệu
  const filteredData = regularOrderData.filter((item) => {
    const matchesStatus = filteredStatus ? item.status === filteredStatus : true;
    const matchesPriority = filteredPriority ? item.priority === filteredPriority : true;
    const matchesPaymentMethod = filteredPaymentMethod ? item.paymentMethod === filteredPaymentMethod : true;
    const matchesPaymentStatus = filteredPaymentStatus ? item.paymentStatus === filteredPaymentStatus : true;
    const matchesSearch = searchText ? (
      item.buyer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.seller.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.seller.shop.toLowerCase().includes(searchText.toLowerCase()) ||
      item.id.toLowerCase().includes(searchText.toLowerCase()) ||
      item.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.trackingCode && item.trackingCode.toLowerCase().includes(searchText.toLowerCase()))
    ) : true;

    return matchesStatus && matchesPriority && matchesPaymentMethod && matchesPaymentStatus && matchesSearch;
  });

  // Xử lý xem chi tiết đơn hàng
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="mb-2">
            <ShoppingCartOutlined className="mr-2 text-blue-500" />
            Quản lý Đơn hàng Mua bán
          </Title>
          <Text className="text-gray-500">
            Xem và theo dõi đơn hàng mua bán trong hệ thống
          </Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />}>Làm mới</Button>
          <Button icon={<ExportOutlined />}>Xuất báo cáo</Button>
        </Space>
      </div>

      {/* Statistics */}
      <OrderStatistics stats={stats} />

      {/* Filters */}
      <OrderFilters
        onSearch={setSearchText}
        onFilterStatus={setFilteredStatus}
        onFilterPaymentStatus={setFilteredPaymentStatus}
        onFilterPaymentMethod={setFilteredPaymentMethod}
        onFilterPriority={setFilteredPriority}
        onDateRangeChange={setDateRange}
      />

      {/* Orders Table */}
      <OrdersTable
        data={filteredData}
        onViewOrder={handleViewOrder}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        visible={isDetailModalVisible}
        order={selectedOrder}
        onClose={() => setIsDetailModalVisible(false)}
      />
    </div>
  );
};

export default ModOrders;