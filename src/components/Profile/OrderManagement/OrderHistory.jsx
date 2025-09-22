import { useState, useEffect } from "react";
import { Tabs, Input, Card, Button, Tag, Avatar, Spin, message, Image, Empty, notification, Modal, Alert } from "antd";
import {
  SearchOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  GiftOutlined,
  CarOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  EyeOutlined,
  TruckOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";

import { GetListOrderHistory, GetOrderDetail, ConfirmOrderDelivered } from "../../../apis/Orders/APIOrder";
import { GetShopInfoById } from "../../../apis/Seller Profile/APISellerProfile";
import OrderHistoryDetail from "./OrderHistoryDetail";

const { Search } = Input;

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // State cho modal trong component OrderHistory
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);

  // State cho modal xác nhận đã giao hàng
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // State cho modal xem lý do hủy
  const [cancelReasonModalVisible, setCancelReasonModalVisible] = useState(false);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState(null);

  // console.log("orders", orders);


  // Status object định nghĩa icon, màu và text cho từng trạng thái
  const statusConfig = {
    'pending': { color: 'orange', icon: <ClockCircleOutlined />, text: 'Chờ xử lý' },
    'packaging': { color: 'purple', icon: <GiftOutlined />, text: 'Đang đóng gói' },
    'delivering': { color: 'blue', icon: <CarOutlined />, text: 'Đang vận chuyển' },
    'delivered': { color: 'cyan', icon: <CheckOutlined />, text: 'Đã giao hàng' },
    'completed': { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã nhận hàng' },
    'failed': { color: 'red', icon: <CloseCircleOutlined />, text: 'Giao hàng thất bại' },
    'canceled': { color: 'red', icon: <CloseCircleOutlined />, text: 'Đã hủy' }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await GetListOrderHistory();
      // console.log("fetch res", response);

      const ordersData = response.data;

      // Lọc chỉ lấy orders có type "regular" hoặc "auction", loại bỏ "exchange"
      const filteredOrdersData = ordersData.filter(item => {
        const orderType = item.order.type || item.order.order_type; // Kiểm tra cả 2 trường có thể có
        return orderType === 'regular' || orderType === 'auction';
      });

      // Lấy danh sách seller_id duy nhất từ dữ liệu đã lọc
      const sellerIds = [...new Set(filteredOrdersData.map(item => item.order.seller_id))];

      // Gọi API lấy thông tin shop
      const sellerInfoMap = {};
      await Promise.all(sellerIds.map(async (id) => {
        const info = await fetchShopInfo(id);
        sellerInfoMap[id] = info;
      }));

      // Xử lý dữ liệu đơn hàng với dữ liệu đã được lọc
      const processedOrders = filteredOrdersData.map(item => {
        const { order, order_items } = item;
        const shopInfo = sellerInfoMap[order.seller_id] || {};
        const status = order.status;

        // Xác định status text dựa trên status và is_packaged
        const statusText = getStatusText(status, order.is_packaged);

        // Xác định icon và màu dựa trên status và is_packaged
        let statusIcon, statusColor;

        // Nếu đang ở trạng thái đóng gói và is_packaged là true, sử dụng icon và màu khác
        if (status === 'packaging' && order.is_packaged === true) {
          statusIcon = <TruckOutlined />;
          statusColor = 'orange';
        } else {
          // Sử dụng config mặc định cho các trường hợp khác
          const defaultStatusInfo = statusConfig[status] || {
            color: 'default',
            icon: <ClockCircleOutlined />
          };
          statusIcon = defaultStatusInfo.icon;
          statusColor = defaultStatusInfo.color;
        }

        return {
          id: order.id,
          code: order.code,
          shopId: order.seller_id,
          shopName: shopInfo.shopName || `Shop ${order.seller_id.slice(0, 4)}...`,
          shopAvatar: shopInfo.avatarUrl || '',
          status: status,
          isPackaged: order.is_packaged,
          statusText: statusText,
          statusColor: statusColor,
          statusIcon: statusIcon,
          subtotal: order.items_subtotal,
          deliveryFee: order.delivery_fee,
          totalAmount: order.total_amount,
          formattedTotal: formatCurrency(order.total_amount),
          paymentMethod: formatPaymentMethod(order.payment_method),
          createdAt: new Date(order.created_at).toLocaleDateString('vi-VN'),
          // Thêm thông tin về việc hủy đơn hàng
          canceledBy: order.canceled_by,
          canceledReason: order.canceled_reason,
          // Thêm thông tin loại đơn hàng để debug nếu cần
          orderType: order.type || order.order_type,
          items: order_items.map(item => ({
            id: item.id,
            name: item.name,
            grade: item.grade,
            scale: item.scale,
            quantity: item.quantity,
            price: item.price,
            formattedPrice: formatCurrency(item.price),
            imageUrl: item.image_url
          }))
        };
      });

      setOrders(processedOrders);
    } catch (error) {
      console.error("Fetch error", error);
      message.error("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const fetchShopInfo = async (sellerId) => {
    try {
      const res = await GetShopInfoById(sellerId);

      // Lấy thông tin từ cả hai phần của response API
      if (res.data) {
        const { user, seller_profile } = res.data;

        // Trả về một đối tượng có cả thông tin shop và avatar từ user
        return {
          shopName: seller_profile?.shop_name || `Shop ${sellerId.slice(0, 4)}...`,
          avatarUrl: user?.avatar_url || "https://source.unsplash.com/40x40/?shop",
          fullName: user?.full_name || ""
        };
      }

      return {
        shopName: `Shop ${sellerId.slice(0, 4)}...`,
        avatarUrl: "https://source.unsplash.com/40x40/?shop",
        fullName: ""
      };
    } catch (err) {
      console.error("Failed to fetch shop info", err);
      return {
        shopName: `Shop ${sellerId.slice(0, 4)}...`,
        avatarUrl: "https://source.unsplash.com/40x40/?shop",
        fullName: ""
      };
    }
  };

  // Hàm mới để xác định status text dựa trên status và is_packaged
  const getStatusText = (status, isPackaged) => {
    // Nếu là trạng thái "packaging" (đang đóng gói)
    if (status === 'packaging') {
      // Kiểm tra giá trị is_packaged
      return isPackaged === true ? "Đang bàn giao" : "Đang đóng gói";
    }

    // Các trạng thái khác vẫn giữ nguyên như cũ
    return convertStatus(status);
  };

  const convertStatus = (status) => {
    const map = {
      pending: "Chờ xác nhận",
      packaging: "Đang đóng gói",
      delivering: "Đang giao hàng",
      delivered: "Đã giao hàng",
      completed: "Đã nhận hàng",
      canceled: "Đã hủy",
      failed: "Thất bại",
    };
    return map[status] || "Không xác định";
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: "orange",
      packaging: "purple",
      delivering: "blue",
      delivered: "cyan",
      completed: "green",
      failed: "red",
      canceled: "red",
    };
    return colorMap[status] || "default";
  };

  const formatPaymentMethod = (method) => {
    const methods = {
      wallet: "Ví điện tử",
      cod: "Thanh toán khi nhận hàng",
      bank: "Chuyển khoản ngân hàng"
    };
    return methods[method] || method;
  };

  const formatCurrency = (number) =>
    new Intl.NumberFormat("vi-VN").format(number) + "đ";

  const tabItems = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "packaging", label: "Đang đóng gói" },
    { key: "delivering", label: "Đang giao hàng" },
    { key: "delivered", label: "Đã giao thành công" },
    { key: "completed", label: "Hoàn tất" },
    { key: "canceled", label: "Đã hủy" },
    { key: "failed", label: "Thất bại" },
  ];

  // Lọc đơn theo tab (status) và tìm kiếm
  const filteredOrders = orders
    .filter(order => activeTab === "all" || order.status === activeTab)
    .filter(order => {
      if (!searchText) return true;
      const searchLower = searchText.toLowerCase();
      return (
        order.code.toLowerCase().includes(searchLower) ||
        order.shopName.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower))
      );
    });

  const showConfirmDeliveredModal = (id) => {
    // Chỉ cho phép xác nhận nếu trạng thái đơn hàng là "delivered"
    const order = orders.find(order => order.id === id);
    if (order && order.status !== 'delivered') {
      notification.warning({
        message: 'Không thể xác nhận',
        description: 'Chỉ đơn hàng đã giao mới có thể xác nhận đã nhận.'
      });
      return;
    }

    setConfirmingOrderId(id);
    setConfirmModalVisible(true);
  };

  // Hàm hiển thị modal lý do hủy đơn
  const showCancelReasonModal = (order) => {
    setSelectedCancelOrder(order);
    setCancelReasonModalVisible(true);
  };

  // Hàm đóng modal lý do hủy đơn
  const handleCloseCancelReasonModal = () => {
    setCancelReasonModalVisible(false);
    setSelectedCancelOrder(null);
  };

  // Hàm xử lý xác nhận đã giao hàng
  const handleConfirmDelivery = async () => {
    if (!confirmingOrderId) return;

    setConfirmLoading(true);
    try {
      await ConfirmOrderDelivered(confirmingOrderId);

      // Cập nhật lại trạng thái đơn hàng trong state
      const updatedOrders = orders.map(order => {
        if (order.id === confirmingOrderId) {
          // Cập nhật trạng thái thành "completed"
          const newStatus = 'completed';
          const statusInfo = statusConfig[newStatus];

          return {
            ...order,
            status: newStatus,
            statusText: statusInfo.text,
            statusColor: statusInfo.color,
            statusIcon: statusInfo.icon
          };
        }
        return order;
      });

      setOrders(updatedOrders);
      message.success('Đã xác nhận nhận hàng thành công!');

      // Đóng modal xác nhận
      setConfirmModalVisible(false);
    } catch (error) {
      console.error('Error confirming delivery:', error);
      notification.error({
        message: 'Không thể xác nhận đã nhận hàng',
        description: 'Đã xảy ra lỗi khi xác nhận. Vui lòng thử lại sau.'
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  // Hàm hủy xác nhận
  const handleCancelConfirm = () => {
    setConfirmModalVisible(false);
    setConfirmingOrderId(null);
  };

  // Hàm mở modal chi tiết đơn hàng
  const showOrderDetail = async (id) => {
    try {
      setLoadingOrderDetail(true);
      // Hiển thị thông báo đang tải
      const loadingMessage = message.loading({
        content: "Đang tải thông tin chi tiết...",
        duration: 0,
      });

      // Fetch chi tiết đơn hàng từ API
      const response = await GetOrderDetail(id);

      // Đóng thông báo đang tải
      loadingMessage();

      // Cập nhật dữ liệu và hiển thị modal
      setSelectedOrder(response.data);
      setDetailModalVisible(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      notification.error({
        message: 'Không thể tải thông tin đơn hàng',
        description: 'Đã xảy ra lỗi khi tải chi tiết đơn hàng.'
      });
    } finally {
      setLoadingOrderDetail(false);
    }
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setDetailModalVisible(false);
  };

  // Kiểm tra xem button xác nhận giao hàng có nên hiển thị không (chỉ hiện với đơn đã giao)
  const shouldShowConfirmButton = (status) => {
    return status === 'delivered';
  };

  // Kiểm tra xem button xem lý do hủy có nên hiển thị không (chỉ hiện với đơn đã hủy)
  const shouldShowCancelReasonButton = (status, canceledReason) => {
    return status === 'canceled' && canceledReason;
  };

  return (
    <div className="mx-auto p-6">
      <Tabs centered={true} activeKey={activeTab} onChange={setActiveTab}>
        {tabItems.map((tab) => (
          <Tabs.TabPane tab={<span className="text-base font-medium">{tab.label}</span>} key={tab.key} />
        ))}
      </Tabs>

      <Search
        placeholder="Tìm kiếm theo tên sản phẩm, người bán, mã đơn hàng..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        className="mb-6 w-full bg-blue-500 rounded-lg"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <Empty description="Chưa có đơn mua cho mục này" />
        </div>
      ) : (
        filteredOrders.map((order) => (
          <Card key={order.id} className="border rounded-lg shadow-sm mb-4">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <div className="flex items-center gap-3">
                <Avatar size={30} src={order.shopAvatar} icon={<ShopOutlined />} />
                <span className="font-semibold text-base">{order.shopName}</span>
              </div>
              <Tag color={order.statusColor} icon={order.statusIcon}>
                {order.statusText}
              </Tag>
            </div>

            <div className="space-y-4 border-b pb-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    width={60}
                    height={60}
                    src={item.imageUrl}
                    alt={item.name}
                    fallback="https://source.unsplash.com/60x60/?product"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-500">{item.grade} {item.scale}</p>
                  </div>
                  <p className="text-red-500 font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 text-gray-500 text-sm">
              <p>Mã đơn hàng: {order.code} | Ngày đặt: {order.createdAt}</p>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Phí vận chuyển: {formatCurrency(order.deliveryFee)}</p>
                <p className="text-lg font-semibold text-red-500">Thành tiền: {order.formattedTotal}</p>
              </div>
              <div className="flex gap-3">
                {shouldShowConfirmButton(order.status) && (
                  <Button
                    type="primary" danger
                    onClick={() => showConfirmDeliveredModal(order.id)}
                    icon={<CheckCircleOutlined />}
                  >
                    Xác nhận đã nhận hàng
                  </Button>
                )}
                {shouldShowCancelReasonButton(order.status, order.canceledReason) && (
                  <Button
                    type="default"
                    danger
                    onClick={() => showCancelReasonModal(order)}
                    icon={<InfoCircleOutlined />}
                  >
                    Xem lý do hủy
                  </Button>
                )}
                <Button
                  type="primary"
                  className="bg-blue-500"
                  onClick={() => showOrderDetail(order.id)}
                  loading={loadingOrderDetail}
                  icon={<EyeOutlined />}
                >
                  Xem chi tiết đơn mua
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}

      {/* Modal xác nhận đơn hàng đã giao */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-base uppercase font-bold text-red-600">
            <QuestionCircleOutlined className="text-red-500" />
            Xác nhận đã nhận hàng
          </div>
        }
        open={confirmModalVisible}
        onCancel={handleCancelConfirm}
        confirmLoading={confirmLoading}
        footer={[
          <Button key="cancel" onClick={handleCancelConfirm}>
            Hủy
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            icon={<CheckCircleOutlined />}
            onClick={handleConfirmDelivery}
            loading={confirmLoading}
          >
            Xác nhận đã nhận hàng
          </Button>,
        ]}
      >
        <div className="py-4">
          <p className="text-base mb-3">
            Bạn xác nhận đã nhận được hàng và kiểm tra hàng hóa đầy đủ?
          </p>
          <p className="text-gray-500">
            Lưu ý: Sau khi xác nhận, bạn sẽ không thể khiếu nại về tình trạng đơn hàng. Vui lòng kiểm tra kỹ trước khi tiếp tục.
          </p>
        </div>
      </Modal>

      {/* Modal xem lý do hủy đơn hàng */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-semibold text-red-600">
            <CloseCircleOutlined className="text-red-500" />
            Lý do hủy đơn hàng
          </div>
        }
        open={cancelReasonModalVisible}
        onCancel={handleCloseCancelReasonModal}
        footer={[
          <Button key="close" type="primary" onClick={handleCloseCancelReasonModal}>
            Đóng
          </Button>
        ]}
        width={500}
      >
        {selectedCancelOrder && (
          <div className="space-y-4">
            {/* Thông tin đơn hàng */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Thông tin đơn hàng:</h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="ml-2 font-semibold text-blue-600">
                    {selectedCancelOrder.code}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="ml-2 font-semibold text-red-600">
                    {selectedCancelOrder.formattedTotal}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="ml-2">{selectedCancelOrder.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Lý do hủy */}
            <Alert
              message="Lý do hủy đơn hàng"
              description={
                <div className="mt-2">
                  <p className="text-base">
                    "{selectedCancelOrder.canceledReason}"
                  </p>
                </div>
              }
              type="error"
              showIcon
            />

            {/* Thông tin thanh toán */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h5 className="text-sm font-medium text-green-800 mb-2">Thông tin thanh toán:</h5>
              <p className="text-sm text-green-700">
                Đơn hàng này đã bị hủy, do đó số tiền đã thanh toán sẽ được hoàn trả lại vào tài khoản của bạn ngay lập tức. Bạn không bị mất bất kỳ khoản tiền nào.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <OrderHistoryDetail
          visible={detailModalVisible}
          onClose={handleCloseModal}
          orderData={selectedOrder}
        />
      )}
    </div>
  );
};

export default OrderHistory;