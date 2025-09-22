import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Table, Row, Tag, Button, Dropdown, Modal, message, Upload, Space, Tooltip, Input, Select, notification, Empty, Card, Image, Typography, Alert, Divider, Col, Progress } from "antd";
import { StopOutlined, EllipsisOutlined, DollarOutlined, WalletOutlined, BankOutlined, MobileOutlined, CreditCardOutlined, ClockCircleOutlined, CheckCircleOutlined, GiftOutlined, CarOutlined, FileTextOutlined, CheckOutlined, CloseCircleOutlined, QuestionCircleOutlined, MessageOutlined, EyeOutlined, TruckOutlined, InfoCircleOutlined, CloudUploadOutlined, CloseOutlined, InboxOutlined } from "@ant-design/icons";

import { GetOrder, ConfirmOrder, CancelPendingOrder } from "../../../apis/Sellers/APISeller";
import { PackagingOrder, GetOrderDetail } from '../../../apis/Orders/APIOrder';

import OrderHistoryDetail from '../../Profile/OrderManagement/OrderHistoryDetail';

// Trạng thái đơn hàng với màu sắc tương ứng
const orderStatusColors = {
  pending: "orange",
  packaging: "blue",
  delivering: "purple",
  delivered: "green",
  completed: "green",
  failed: "red",
  canceled: "red",
};

const orderTypeColors = {
  regular: "orange",
  exchange: "blue",
  auction: "red",
}

// Định dạng số tiền với đơn vị VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

function ShopOrderManagement() {

  const userId = useSelector((state) => state.auth.user?.id);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("")

  const [isModalPackageVisible, setIsModalPackageVisible] = useState(false);
  const [isModalPackageCheckVisible, setIsModalPackageCheckVisible] = useState(false);
  const [packagingImages, setPackagingImages] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderImage, setSelectedOrderImage] = useState([]);

  // State cho modal chi tiết đơn hàng
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);

  // Thêm state cho modal hủy đơn hàng
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);


  // Xử lý thay đổi trạng thái đơn hàng
  const handleAction = async (record, actionKey) => {
    if (actionKey === "accept") {
      try {
        setLoading(true);
        const response = await ConfirmOrder(record.seller_id, record.id);
        if (response.status === 200) {
          // message.success("Đơn hàng đã được xác nhận thành công!");
          fetchOrders();
        } else {
          message.error("Không thể xác nhận đơn hàng!");
        }
      } catch (error) {
        console.error("Error confirming order:", error);
        message.error("Đã xảy ra lỗi khi xác nhận đơn hàng!");
      } finally {
        setLoading(false);
      }
    } else if (actionKey === "cancel") {
      // Gọi modal hủy đơn hàng thay vì confirm đơn giản
      showCancelModal(record);
    } else if (actionKey === "detail") {
      handleViewOrderDetail(record.id);
    }
  };

  const showCancelModal = (record) => {
    setSelectedCancelOrder(record);
    setCancelReason('');
    setIsCancelModalVisible(true);
  };

  const handleCancelModalClose = () => {
    setIsCancelModalVisible(false);
    setSelectedCancelOrder(null);
    setCancelReason('');
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      message.warning('Vui lòng nhập lý do hủy đơn hàng!');
      return;
    }

    try {
      setCancelLoading(true);

      const response = await CancelPendingOrder(userId, selectedCancelOrder.id, cancelReason);

      if (response.status === 200) {
        notification.open({
          type: 'success',
          message: `Đã hủy đơn hàng thành công!`,
          description: `Đơn hàng  ${selectedCancelOrder.code} đã bị hủy.`
        });
        handleCancelModalClose();
        fetchOrders(); // Tải lại danh sách đơn hàng
      } else {
        message.error('Không thể hủy đơn hàng. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error canceling order:', error);

      // Xử lý các lỗi cụ thể
      if (error.response?.status === 400) {
        message.error('Đơn hàng không thể hủy ở trạng thái hiện tại!');
      } else if (error.response?.status === 404) {
        message.error('Không tìm thấy đơn hàng!');
      } else if (error.response?.status === 403) {
        message.error('Bạn không có quyền hủy đơn hàng này!');
      } else {
        message.error('Đã xảy ra lỗi khi hủy đơn hàng. Vui lòng thử lại!');
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const handleModal = (record) => {
    setSelectedOrder(record);
    setPackagingImages([]);
    setIsModalPackageVisible(true);
  };

  const handleModalCheck = (record) => {
    setSelectedOrderImage(record.packaging_image_urls || []);
    setIsModalPackageCheckVisible(true);
  };

  // Xử lý xem chi tiết đơn hàng
  const handleViewOrderDetail = async (orderId) => {
    try {
      setLoadingOrderDetail(true);
      // Hiển thị thông báo đang tải
      const loadingMessage = message.loading({
        content: "Đang tải thông tin chi tiết...",
        duration: 0,
      });

      // Fetch chi tiết đơn hàng từ API
      const response = await GetOrderDetail(orderId);

      // Đóng thông báo đang tải
      loadingMessage();

      // Cập nhật dữ liệu và hiển thị modal
      setOrderDetail(response.data);
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

  // Xử lý đóng modal chi tiết đơn hàng
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
  };

  const fetchOrders = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await GetOrder(userId);

      // console.log("Order", response);


      if (response && response.data) {
        // Chuyển đổi dữ liệu từ API sang định dạng phù hợp với Table
        const formattedOrders = response.data.map((item, index) => {
          const order = item.order;
          const orderItems = item.order_items || [];

          // Thêm key cho mỗi đơn hàng để Ant Design Table nhận dạng
          return {
            key: index,
            ...order,
            buyer_name: `Khách hàng #${order.buyer_id.substring(0, 8)}`,
            items: orderItems,
            order_items: orderItems,
          };
        });

        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);


  const handlePackagingConfirm = async () => {
    if (!selectedOrder || packagingImages.length === 0) {
      message.warning("Vui lòng tải lên ít nhất một hình ảnh đóng gói!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      packagingImages.forEach((file) => {
        formData.append("package_images", file.originFileObj);
      });

      const response = await PackagingOrder(selectedOrder.id, formData);

      if (response.status === 200) {
        // message.success("Xác nhận đóng gói thành công!");
        setIsModalPackageVisible(false);
        fetchOrders(); // Tải lại danh sách đơn hàng
      } else {
        message.error("Xác nhận đóng gói thất bại!");
      }
    } catch (error) {
      console.error("Error while packaging order:", error);
      message.error("Đã xảy ra lỗi khi xác nhận đóng gói!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = ({ fileList }) => {
    // Giới hạn số lượng hình ảnh tối đa là 5
    if (fileList.length > 5) {
      message.warning("Chỉ có thể tải lên tối đa 5 ảnh!");
      return;
    }
    setPackagingImages(fileList);
  };

  // Lọc đơn hàng theo tìm kiếm và trạng thái
  const filteredOrders = orders.filter(order => {
    const codeMatch = order.code.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter ? order.status === statusFilter : true;
    const typeMatch = typeFilter ? order.type === typeFilter : true;

    return codeMatch && statusMatch && typeMatch;
  });

  const uploadProgress = (packagingImages.length / 5) * 100;

  // Cột dữ liệu của bảng
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      width: 150,
      render: (code) => <span className="font-semibold">{code}</span>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "items",
      width: 200,
      render: (_, record) => {
        const items = record.order_items || [];
        return (
          <div>
            {items.map((item, index) => (
              <div key={index} className="flex items-center mb-1">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-10 h-10 mr-2 object-cover rounded"
                  />
                )}
                <Tooltip title={`${item.name} (${item.quantity}x)`}>
                  <span className="truncate">{item.name}</span>
                </Tooltip>
              </div>
            ))}
          </div>
        );
      }
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      width: 140,
      render: (total) => <span className="text-red-500 font-semibold">{formatCurrency(total)} đ</span>,
    },
    {
      title: "Loại đơn hàng",
      dataIndex: "type",
      width: 150,
      render: (_, record) => {
        const typeMap = {
          regular: { color: "green", label: "Mua bán" },
          exchange: { color: "blue", label: "Trao đổi" },
          auction: { color: "volcano", label: "Đấu giá" },
        };

        const { color, label } = typeMap[record.type] || { color: "default", label: record.type };

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      render: (_, record) => {
        const { status, is_packaged } = record;

        const statusConfig = {
          'pending': { color: 'orange', icon: <ClockCircleOutlined />, text: 'Chờ xác nhận' },

          // Xử lý 'packaging' dựa trên is_packaged
          'packaging': is_packaged
            ? { color: 'magenta', icon: <TruckOutlined />, text: 'Chờ bàn giao' }
            : { color: 'purple', icon: <GiftOutlined />, text: 'Đang đóng gói' },

          'delivering': { color: 'blue', icon: <CarOutlined />, text: 'Đang vận chuyển' },
          'delivered': { color: 'cyan', icon: <CheckOutlined />, text: 'Đã giao hàng' },
          'completed': { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã nhận hàng' },
          'failed': { color: 'red', icon: <CloseCircleOutlined />, text: 'Giao hàng thất bại' },
          'canceled': { color: 'red', icon: <CloseCircleOutlined />, text: 'Đã hủy' }
        };

        const config = statusConfig[status] || {
          color: 'default',
          icon: <QuestionCircleOutlined />,
          text: status
        };

        return (
          <Tag color={config.color} icon={config.icon} className="px-2 py-1">
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      width: 130,
      render: (date) => {
        const orderDate = new Date(date);
        return (
          <span>
            {orderDate.toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "payment_method",
      width: 130,
      render: (method) => {
        const paymentIcons = {
          'cod': <DollarOutlined className="text-green-500 mr-1" />,
          'wallet': <WalletOutlined className="text-blue-500 mr-1" />,
          'bank': <BankOutlined className="text-purple-500 mr-1" />,
          'momo': <MobileOutlined className="text-pink-500 mr-1" />
        };

        const paymentLabels = {
          'cod': 'Tiền mặt',
          'wallet': 'Ví điện tử',
          'bank': 'Ngân hàng',
          'momo': 'MoMo'
        };

        return (
          <div className="flex items-center">
            {paymentIcons[method] || <CreditCardOutlined className="mr-1" />}
            <span>{paymentLabels[method] || method}</span>
          </div>
        );
      }
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: 150,
      render: (note) => (
        note && note.trim() ?
          <Tooltip title={note}>
            <div className="truncate max-w-xs cursor-help">
              <MessageOutlined className="mr-1 text-gray-500" />{note}
            </div>
          </Tooltip>
          :
          <span className="text-gray-400">Không có</span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: 'right',
      width: 100,
      align: "center",
      render: (_, record) => {
        const menuItems = [];

        if (record.status === "pending") {
          menuItems.push({
            key: "accept",
            label: "Xác nhận đơn hàng",
            icon: <CheckOutlined className="text-green-500" />,
            onClick: () => handleAction(record, "accept")
          });
        }

        if (record.is_packaged) {
          menuItems.push({
            key: "viewPackage",
            label: "Ảnh đã đóng gói",
            icon: <EyeOutlined className="text-blue-500" />,
            onClick: () => handleModalCheck(record)
          });
        }

        if (record.status === "packaging" && !record.is_packaged) {
          menuItems.push({
            key: "packaged",
            label: "Đóng gói đơn hàng",
            icon: <GiftOutlined className="text-purple-500" />,
            onClick: () => handleModal(record)
          });
        }

        menuItems.push({
          key: "detail",
          label: "Chi tiết đơn hàng",
          icon: <FileTextOutlined className="text-blue-500" />,
          onClick: () => handleAction(record, "detail")
        });

        if (["pending"].includes(record.status)) {
          menuItems.push({
            key: "cancel",
            label: "Hủy đơn",
            icon: <StopOutlined className="text-red-500" />,
            danger: true,
            onClick: () => handleAction(record, "cancel")
          });
        }

        return (
          <Space size="small">
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
              <Button type="text" icon={<EllipsisOutlined />} className="flex items-center justify-center" />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Tiêu đề */}
      <h2 className="text-2xl uppercase font-bold mb-6">Quản lý đơn hàng</h2>

      {/* Thanh công cụ */}
      <Row className="mb-4 flex items-center gap-4">
        {/* Tìm kiếm sản phẩm */}
        <Input.Search
          placeholder="Tìm kiếm theo mã đơn hàng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          className="w-1/3"
        />

        {/* Bộ lọc trạng thái Đơn hàng */}
        <Select
          placeholder="Lọc theo trạng thái"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          allowClear
          style={{ width: 180 }}
          options={[
            { value: "", label: "Tất cả trạng thái" },
            ...Object.keys(orderStatusColors).map(status => ({
              value: status,
              label: (() => {
                const statusLabels = {
                  'pending': 'Chờ xử lý',
                  'packaging': 'Đang đóng gói',
                  'delivering': 'Đang vận chuyển',
                  'delivered': 'Đã giao hàng',
                  'completed': 'Đã nhận hàng',
                  'failed': 'Giao hàng thất bại',
                  'canceled': 'Đã hủy'
                };
                return statusLabels[status] || status;
              })()
            }))
          ]}
        />

        {/* Bộ lọc trạng thái Theo loại Đơn hàng*/}
        <Select
          placeholder="Lọc theo trạng thái"
          value={typeFilter}
          onChange={(value) => setTypeFilter(value)}
          allowClear
          style={{ width: 180 }}
          options={[
            { value: "", label: "Tất cả đơn hàng" },
            ...Object.keys(orderTypeColors).map(type => ({
              value: type,
              label: (() => {
                const orderTypeColors = {
                  'regular': 'Đơn mua bán',
                  'exchange': 'Đơn trao đổi',
                  'auction': 'Đơn đấu giá',
                };
                return orderTypeColors[type] || type;
              })()
            }))
          ]}
        />

        {/* Nút tải lại */}
        <Button
          type="primary"
          onClick={fetchOrders}
          loading={loading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Tải lại
        </Button>
      </Row>

      {/* Bảng hiển thị đơn hàng */}
      <Table
        columns={columns}
        dataSource={filteredOrders}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1400, y: 550 }}
        loading={loading}
        locale={{
          emptyText: <Empty description="Không có đơn hàng nào" />
        }}
      />

      {/* Modal đóng gói sản phẩm */}
      <Modal
        open={isModalPackageVisible}
        onCancel={() => setIsModalPackageVisible(false)}
        width={650}
        centered
        closable={true}
        closeIcon={<CloseOutlined className="text-gray-400 hover:text-gray-600 text-lg" />}
        footer={null}
        className="rounded-2xl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
              <InboxOutlined className="text-3xl text-blue-600" />
            </div>
            <Typography.Title level={2} className="!mb-2 uppercase !text-gray-800">
              Xác Nhận Đóng Gói Đơn Hàng
            </Typography.Title>
            <Typography.Text type="secondary" className="text-base">
              Vui lòng xác nhận và gửi ảnh chứng minh đã đóng gói sản phẩm
            </Typography.Text>
          </div>

          {/* Warning Notice */}
          <Alert
            type="warning"
            showIcon
            icon={<InfoCircleOutlined />}
            className="mb-6"
            message={
              <Typography.Text strong className="text-amber-800">
                Lưu ý quan trọng
              </Typography.Text>
            }
            description={
              <div className="text-amber-700">
                <span className="!mb-2 !text-amber-700">
                  • Ảnh phải rõ nét, thể hiện đầy đủ sản phẩm đã được đóng gói
                </span> <br />
                <span className="!mb-2 !text-amber-700">
                  • Sau khi xác nhận, đơn vị vận chuyển sẽ đến lấy hàng
                </span> <br />
                <span className="!mb-0 !text-amber-700">
                  • Shop chịu trách nhiệm nếu sản phẩm không khớp với ảnh xác thực
                </span>
              </div>
            }
          />

          {/* Upload Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Typography.Title level={5} className="!mb-0">
                <span className="text-red-500 mr-1">*</span>
                Ảnh xác minh đóng gói
              </Typography.Title>
              <Typography.Text type="secondary" className="text-sm">
                {packagingImages.length}/5 ảnh
              </Typography.Text>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <Progress
                percent={uploadProgress}
                showInfo={false}
                strokeColor="#3b82f6"
                className="mb-2"
              />
              <Typography.Text type="secondary" className="text-xs">
                Tải lên tối thiểu 1 ảnh để tiếp tục
              </Typography.Text>
            </div>

            {/* Upload Area */}
            <Upload
              multiple
              listType="picture-card"
              fileList={packagingImages}
              onChange={handleImageUpload}
              beforeUpload={() => false}
              maxCount={5}
              accept="image/*"
              className="w-full"
            >
              {packagingImages.length < 5 && (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <CloudUploadOutlined className="text-2xl text-gray-400 mb-2" />
                  <Typography.Text className="text-sm text-gray-600 block">Thêm ảnh</Typography.Text>
                  <Typography.Text type="secondary" className="text-xs mt-1">
                    JPG, PNG (tối đa 10MB)
                  </Typography.Text>
                </div>
              )}
            </Upload>
          </div>

          <Divider className="my-6" />

          {/* Action Buttons */}
          <Row gutter={12}>
            <Col span={12}>
              <Button
                size="large"
                onClick={() => setIsModalPackageVisible(false)}
                className="w-full h-12 border-gray-300 hover:!border-gray-400"
                block
              >
                Hủy bỏ
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="primary"
                size="large"
                onClick={handlePackagingConfirm}
                loading={loading}
                disabled={packagingImages.length < 1}
                className="w-full h-12 bg-blue-500 hover:!bg-blue-600 border-blue-500 hover:!border-blue-600"
                icon={!loading && <CheckCircleOutlined />}
                block
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận đóng gói'}
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* Modal xem ảnh đóng gói */}
      <Modal
        title="Hình ảnh đóng gói sản phẩm"
        open={isModalPackageCheckVisible}
        onCancel={() => setIsModalPackageCheckVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalPackageCheckVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {selectedOrderImage && selectedOrderImage.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Array.isArray(selectedOrderImage) && selectedOrderImage.map((image, index) => (
                <Card key={index} className="overflow-hidden">
                  <Image
                    src={image}
                    alt={`Đóng gói ${index + 1}`}
                    className="w-full h-40 object-cover"
                    preview={{
                      mask: <div className="text-white">Xem ảnh</div>
                    }}
                  />
                  <div className="p-3">
                    <Typography.Text className="text-sm text-gray-600">Ảnh {index + 1}</Typography.Text>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có hình ảnh đóng gói nào"
            className="py-8"
          />
        )}
      </Modal>

      {/* Modal hủy đơn hàng */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <span className="text-red-500 text-xl"><InfoCircleOutlined /></span>
            <span className="text-lg font-semibold text-red-600">Xác nhận hủy đơn hàng</span>
          </div>
        }
        open={isCancelModalVisible}
        onCancel={handleCancelModalClose}
        width={600}
        maskClosable={false}
        footer={[
          <Button
            key="back"
            onClick={handleCancelModalClose}
            disabled={cancelLoading}
          >
            Quay lại
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={handleCancelOrder}
            loading={cancelLoading}
            disabled={!cancelReason.trim()}
          >
            Xác nhận hủy
          </Button>
        ]}
      >
        <div className="space-y-4">
          {/* Cảnh báo */}
          <Alert
            message="Lưu ý khi hủy đơn hàng!"
            description={
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Việc hủy đơn hàng sẽ không thể hoàn tác</li>
                <li>Khách hàng sẽ nhận được thông báo về việc hủy đơn</li>
              </ul>
            }
            type="warning"
            showIcon
            className="mb-4"
          />

          {/* Thông tin đơn hàng */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Thông tin đơn hàng:</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="ml-2 font-semibold text-blue-600">
                  {selectedCancelOrder?.code}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="ml-2 font-semibold text-red-600">
                  {formatCurrency(selectedCancelOrder?.total_amount)} đ
                </span>
              </div>
              <div>
                <span className="text-gray-600">Trạng thái:</span>
                <Tag color="gold" className="ml-2 font-semibold">
                  {selectedCancelOrder?.status === 'pending' ? 'Chờ xác nhận' :
                    selectedCancelOrder?.status === 'packaging' ? 'Đang đóng gói' :
                      selectedCancelOrder?.status}
                </Tag>
              </div>
              <div>
                <span className="text-gray-600">Ngày tạo:</span>
                <span className="ml-2">
                  {selectedCancelOrder?.created_at ?
                    new Date(selectedCancelOrder.created_at).toLocaleDateString('vi-VN') :
                    'N/A'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Lý do hủy đơn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> Lý do hủy đơn hàng:
            </label>
            <Input.TextArea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Vui lòng nhập lý do cụ thể cho việc hủy đơn hàng này (tối thiểu 10 ký tự)..."
              rows={4}
              maxLength={500}
              showCount
              className="resize-none"
            />
            <div className="mt-2 text-xs text-gray-500">
              Lý do hủy sẽ được gửi cho khách hàng và lưu vào hệ thống để theo dõi.
            </div>
          </div>

          {/* Gợi ý lý do */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h5 className="text-sm font-medium text-blue-800 mb-2">Một số lý do phổ biến:</h5>
            <div className="flex flex-wrap gap-2">
              {[
                'Hết hàng',
                'Sản phẩm có lỗi',
                'Khách hàng yêu cầu hủy',
                'Không thể giao hàng',
                'Giá sản phẩm thay đổi',
              ].map((reason) => (
                <Button
                  key={reason}
                  size="small"
                  type="link"
                  className="text-blue-600 px-2 py-1 text-xs border border-blue-300 rounded hover:bg-blue-100"
                  onClick={() => setCancelReason(reason)}
                >
                  {reason}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal chi tiết đơn hàng */}
      {orderDetail && (
        <OrderHistoryDetail
          visible={detailModalVisible}
          onClose={handleCloseDetailModal}
          orderData={orderDetail}
        />
      )}
    </div>
  );
}

export default ShopOrderManagement;