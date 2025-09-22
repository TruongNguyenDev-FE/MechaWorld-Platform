import { useState, useEffect } from "react";
import { Tabs, Input, Card, Button, Tag, Avatar, Spin, message, Image, Empty, notification, Modal, Alert } from "antd";
import {
    SearchOutlined,
    ClockCircleOutlined,
    GiftOutlined,
    CarOutlined,
    CheckOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    InfoCircleOutlined,
    SwapOutlined,
    SendOutlined,
    InboxOutlined,
    UserOutlined
} from "@ant-design/icons";

import { GetListOrderHistory, GetOrderDetail, ConfirmOrderDelivered } from "../../../apis/Orders/APIOrder";
import { GetShopInfoById } from "../../../apis/Seller Profile/APISellerProfile";
import OrderHistoryDetail from "./OrderHistoryDetail";
import { useSelector } from "react-redux";
import { getUser } from "../../../apis/User/APIUser";

const { Search } = Input;

const OrderExchange = () => {
    const userId = useSelector((state) => state.auth.user.id);

    const [activeTab, setActiveTab] = useState("all");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");

    // State cho modal trong component OrderExchange
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

    // Status object định nghĩa icon, màu và text cho từng trạng thái trao đổi
    const exchangeStatusConfig = {
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
            console.log("response", response);
            
            const ordersData = response.data;

            // Lọc chỉ lấy orders có type "exchange"
            const exchangeOrdersData = ordersData.filter(item => {
                const orderType = item.order.type || item.order.order_type;
                return orderType === 'exchange';
            });

            const currentUserId = userId;

            // Lấy danh sách user_id duy nhất để fetch thông tin
            const allUserIds = [...new Set(exchangeOrdersData.flatMap(item => [item.order.buyer_id, item.order.seller_id]))];

            // Gọi API lấy thông tin user cho tất cả users
            const userInfoMap = {};
            const detailedUserInfoMap = {};

            await Promise.all(allUserIds.map(async (id) => {
                const [info, detailedInfo] = await Promise.all([
                    fetchUserInfo(id),
                    getUser(id)
                ]);
                userInfoMap[id] = info;
                detailedUserInfoMap[id] = detailedInfo;
            }));

            // XỬ LÝ TRỰC TIẾP TỪNG ORDER - KHÔNG DÙNG GROUPING
            const processedOrders = [];
            const processedOrderIds = new Set();

            for (const orderData of exchangeOrdersData) {
                const order = orderData.order;

                // Chỉ xử lý order mà user hiện tại tham gia
                if (order.buyer_id !== currentUserId && order.seller_id !== currentUserId) {
                    continue;
                }

                // Tránh xử lý order đã processed
                if (processedOrderIds.has(order.id)) {
                    continue;
                }

                // Tìm order đối tác
                const partnerOrderData = exchangeOrdersData.find(otherOrderData => {
                    const otherOrder = otherOrderData.order;
                    return otherOrder.id !== order.id &&
                        ((order.buyer_id === otherOrder.seller_id && order.seller_id === otherOrder.buyer_id));
                });

                // Xác định partner user ID
                const partnerUserId = order.buyer_id === currentUserId ? order.seller_id : order.buyer_id;
                const partnerInfo = userInfoMap[partnerUserId] || {};
                const getPartnerInfo = detailedUserInfoMap[partnerUserId] || {};

                // Trạng thái tổng thể
                const exchangeStatus = getExchangeStatus(order.status, partnerOrderData?.order.status);
                const statusInfo = getExchangeStatusInfo(exchangeStatus);

                const processedOrder = {
                    id: order.id,
                    exchangeId: `EX-${order.id.slice(0, 8)}`,
                    code: order.code,
                    partnerCode: partnerOrderData?.order.code || 'N/A',

                    // Thông tin đối tác
                    partnerId: partnerUserId,
                    partnerOrderId: partnerOrderData?.order?.id,
                    partnerName: getPartnerInfo?.data?.full_name || partnerInfo.shopName || partnerInfo.full_name,
                    partnerAvatar: partnerInfo.avatar_url || getPartnerInfo?.data?.avatar_url || '',

                    // Trạng thái
                    status: exchangeStatus,
                    myOrderStatus: order.buyer_id === currentUserId ? partnerOrderData?.order.status || 'unknown' : order.status,
                    partnerOrderStatus: order.buyer_id === currentUserId ? order.status : partnerOrderData?.order.status || 'unknown',
                    statusText: statusInfo?.text,
                    statusColor: statusInfo?.color,
                    statusIcon: statusInfo?.icon,

                    // Thông tin đơn hàng
                    isPackaged: order.is_packaged,
                    partnerIsPackaged: partnerOrderData?.order.is_packaged || false,
                    deliveryFee: order.delivery_fee,
                    totalAmount: order.total_amount,
                    formattedTotal: formatCurrency(order.total_amount),
                    paymentMethod: formatPaymentMethod(order.payment_method),
                    createdAt: new Date(order.created_at).toLocaleDateString('vi-VN'),
                    note: order.note,

                    // Thông tin hủy đơn
                    canceledBy: order.canceled_by,
                    canceledReason: order.canceled_reason,

                    // Items của tôi (order hiện tại)
                    myItems: order.buyer_id === currentUserId
                        ? (partnerOrderData?.order_items.map(item => ({
                            id: item.id,
                            name: item.name,
                            grade: item.grade,
                            scale: item.scale,
                            quantity: item.quantity,
                            price: item.price,
                            formattedPrice: formatCurrency(item.price),
                            imageUrl: item.image_url
                        })) || [])
                        : orderData.order_items.map(item => ({
                            id: item.id,
                            name: item.name,
                            grade: item.grade,
                            scale: item.scale,
                            quantity: item.quantity,
                            price: item.price,
                            formattedPrice: formatCurrency(item.price),
                            imageUrl: item.image_url
                        })),

                    partnerItems: order.buyer_id === currentUserId
                        ? orderData.order_items.map(item => ({
                            id: item.id,
                            name: item.name,
                            grade: item.grade,
                            scale: item.scale,
                            quantity: item.quantity,
                            price: item.price,
                            formattedPrice: formatCurrency(item.price),
                            imageUrl: item.image_url
                        }))
                        : (partnerOrderData?.order_items.map(item => ({
                            id: item.id,
                            name: item.name,
                            grade: item.grade,
                            scale: item.scale,
                            quantity: item.quantity,
                            price: item.price,
                            formattedPrice: formatCurrency(item.price),
                            imageUrl: item.image_url
                    })) || [])
                };

                // console.log("processedOrder",processedOrder);
                

                processedOrders.push(processedOrder);
                processedOrderIds.add(order.id);
                if (partnerOrderData) {
                    processedOrderIds.add(partnerOrderData.order.id);
                }
            }

            // processedOrders.forEach((order, index) => {
            //     console.log(`Order ${index}:`, {
            //         id: order.id,
            //         partnerId: order.partnerId,
            //         myItemsCount: order.myItems.length,
            //         partnerItemsCount: order.partnerItems.length,
            //         myItems: order.myItems.map(i => i.name),
            //         partnerItems: order.partnerItems.map(i => i.name)
            //     });
            // });

            setOrders(processedOrders);
        } catch (error) {
            console.error("Fetch error", error);
            message.error("Không thể tải danh sách đơn trao đổi.");
        } finally {
            setLoading(false);
        }
    };

    // console.log("order", orders);


    // Hàm nhóm các đơn hàng exchange theo cặp
    

    // Hàm xác định trạng thái tổng thể của giao dịch trao đổi
    const getExchangeStatus = (myStatus, partnerStatus) => {
        if (myStatus === 'canceled' || partnerStatus === 'canceled') return 'canceled';
        if (myStatus === 'failed' || partnerStatus === 'failed') return 'failed';
        if (myStatus === 'completed' && partnerStatus === 'completed') return 'completed';
        if (myStatus === 'delivered' && partnerStatus === 'delivered') return 'both_delivered';
        if (myStatus === 'delivering' || partnerStatus === 'delivering') return 'delivering';
        if (myStatus === 'packaging' || partnerStatus === 'packaging') return 'packaging';
        if (myStatus === 'pending' || partnerStatus === 'pending') return 'pending';
        return 'unknown';
    };

    // Hàm lấy thông tin hiển thị cho trạng thái trao đổi
    const getExchangeStatusInfo = (status) => {
        return exchangeStatusConfig[status] || exchangeStatusConfig['unknown'];
    };

    const fetchUserInfo = async (userId) => {
        try {
            const res = await GetShopInfoById(userId);

            if (res.data) {
                const { user, seller_profile } = res.data;

                return {
                    shopName: seller_profile?.shop_name || user?.full_name || `User ${userId.slice(0, 4)}...`,
                    avatarUrl: user?.avatar_url || "https://source.unsplash.com/40x40/?user",
                    fullName: user?.full_name || ""
                };
            }

            return {
                shopName: `User ${userId.slice(0, 4)}...`,
                avatarUrl: "https://source.unsplash.com/40x40/?user",
                fullName: ""
            };
        } catch (err) {
            console.error("Failed to fetch user info", err);
            return {
                shopName: `User ${userId.slice(0, 4)}...`,
                avatarUrl: "https://source.unsplash.com/40x40/?user",
                fullName: ""
            };
        }
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
            unknown: "Không xác định"
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
            unknown: "default"
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
        { key: "delivering", label: "Đang vận chuyển" },
        { key: "both_delivered", label: "Đã giao hàng" },
        { key: "completed", label: "Hoàn tất" },
        { key: "canceled", label: "Đã hủy" },
        { key: "failed", label: "Thất bại" },
    ];

    // Lọc đơn trao đổi theo tab (status) và tìm kiếm
    const filteredOrders = orders
        .filter(order => activeTab === "all" || order.status === activeTab)
        .filter(order => {
            if (!searchText) return true;
            const searchLower = searchText.toLowerCase();
            return (
                order.code.toLowerCase().includes(searchLower) ||
                order.partnerCode.toLowerCase().includes(searchLower) ||
                order.partnerName.toLowerCase().includes(searchLower) ||
                order.exchangeId.toLowerCase().includes(searchLower) ||
                order.myItems.some(item => item.name.toLowerCase().includes(searchLower)) ||
                order.partnerItems.some(item => item.name.toLowerCase().includes(searchLower))
            );
        });

    const showConfirmDeliveredModal = (id) => {
        const order = orders.find(order => order.id === id);
        if (order && order.status !== 'both_delivered') {
            notification.warning({
                message: 'Không thể xác nhận',
                description: 'Chỉ khi cả hai đơn hàng đều đã được giao mới có thể xác nhận hoàn tất trao đổi.'
            });
            return;
        }

        setConfirmingOrderId(id);
        setConfirmModalVisible(true);
    };

    const showCancelReasonModal = (order) => {
        setSelectedCancelOrder(order);
        setCancelReasonModalVisible(true);
    };

    const handleCloseCancelReasonModal = () => {
        setCancelReasonModalVisible(false);
        setSelectedCancelOrder(null);
    };

    const handleConfirmDelivery = async () => {
        if (!confirmingOrderId) return;

        setConfirmLoading(true);
        try {
            await ConfirmOrderDelivered(confirmingOrderId);

            const updatedOrders = orders.map(order => {
                if (order.id === confirmingOrderId) {
                    const newStatus = 'completed';
                    const statusInfo = exchangeStatusConfig[newStatus];

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
            message.success('Đã xác nhận hoàn tất trao đổi!');
            setConfirmModalVisible(false);
        } catch (error) {
            console.error('Error confirming delivery:', error);
            notification.error({
                message: 'Không thể xác nhận hoàn tất trao đổi',
                description: 'Đã xảy ra lỗi khi xác nhận. Vui lòng thử lại sau.'
            });
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleCancelConfirm = () => {
        setConfirmModalVisible(false);
        setConfirmingOrderId(null);
    };

    const showOrderDetail = async (id) => {
        try {
            setLoadingOrderDetail(true);
            const loadingMessage = message.loading({
                content: "Đang tải thông tin chi tiết...",
                duration: 0,
            });

            const response = await GetOrderDetail(id);
            loadingMessage();

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

    const handleCloseModal = () => {
        setDetailModalVisible(false);
    };

    const shouldShowConfirmButton = (status) => {
        return status === 'both_delivered';
    };

    const shouldShowCancelReasonButton = (status, canceledReason) => {
        return status === 'canceled' && canceledReason;
    };

    // Hàm render card trao đổi compact
    const renderExchangeCard = (order) => {
        // XÁC ĐỊNH ORDER NÀO LÀ CỦA USER HIỆN TẠI
        const currentUserId = userId;

        // console.log("=== RENDER DEBUG ===");
        // console.log("Current User ID:", currentUserId);
        // console.log("Order ID:", order.id);
        // console.log("Partner ID:", order.partnerId);
        // console.log("Should swap?", currentUserId === order.partnerId);
        // console.log("My Items:", order.myItems.map(i => i.name));
        // console.log("Partner Items:", order.partnerItems.map(i => i.name));

        // Xác định ai gửi ai nhận dựa trên userId
        let myItems, partnerItems, myStatus, partnerStatus, myCode, partnerCode;

        if (currentUserId === order.partnerId) {
            // Nếu currentUser là partner thì đảo ngược
            myItems = order.partnerItems;
            partnerItems = order.myItems;
            myStatus = order.partnerOrderStatus;
            partnerStatus = order.myOrderStatus;
            myCode = order.partnerCode;
            partnerCode = order.code;
        } else {
            // Nếu currentUser là chính chủ order
            myItems = order.myItems;
            partnerItems = order.partnerItems;
            myStatus = order.myOrderStatus;
            partnerStatus = order.partnerOrderStatus;
            myCode = order.code;
            partnerCode = order.partnerCode;
        }

        // console.log("order", order);
        

        return (
            <Card key={order.id} className="border rounded-lg shadow-sm mb-4 hover:shadow-md transition-shadow">
                {/* Header compact */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar size={36} src={order.partnerAvatar} icon={<UserOutlined />} />
                            <SwapOutlined className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1 text-xs" />
                        </div>
                        <div>
                            <span className="font-semibold text-base">{order.partnerName}</span>
                            <p className="text-xs text-gray-500">{order.createdAt}</p>
                        </div>
                    </div>
                </div>

                {/* Layout chia đôi cho 2 đơn hàng */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Bên trái - Đơn của bạn */}
                    <div className="border-r border-gray-200 pr-4">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-2 mb-3">
                                <SendOutlined className="text-blue-500 text-sm" />
                                <span className="text-sm font-medium text-blue-700">Bạn gửi</span>
                                <Tag size="small" color={getStatusColor(myStatus)}>
                                    {convertStatus(myStatus)}
                                </Tag>
                            </div>
                            <Button
                                type="primary"
                                ghost
                                className="bg-blue-500"
                                onClick={() => showOrderDetail(currentUserId === order.partnerId ? order.partnerOrderId : order.id)}
                                loading={loadingOrderDetail}
                                icon={<EyeOutlined />}
                                size="small"
                            >
                                Chi tiết
                            </Button>
                        </div>

                        <div className="space-y-2 mb-3">
                            {myItems.slice(0, 2).map((item, index) => (
                                <div key={item.id} className="flex items-center gap-2">
                                    <Image
                                        width={32}
                                        height={32}
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fallback="https://source.unsplash.com/32x32/?gundam"
                                        className="rounded border flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.grade}</p>
                                    </div>
                                </div>
                            ))}
                            {myItems.length > 2 && (
                                <p className="text-xs text-gray-500 pl-2">+{myItems.length - 2} sản phẩm khác</p>
                            )}
                        </div>

                        <div className="text-xs text-gray-600 space-y-1">
                            <p><span className="font-medium">Mã:</span> {myCode}</p>
                        </div>
                    </div>

                    {/* Bên phải - Đơn đối tác */}
                    <div className="pl-4">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-2 mb-3">
                                <InboxOutlined className="text-green-500 text-sm" />
                                <span className="text-sm font-medium text-green-700">Bạn nhận</span>
                                <Tag size="small" color={getStatusColor(partnerStatus)}>
                                    {convertStatus(partnerStatus)}
                                </Tag>
                            </div>
                            <Button
                                type="primary"
                                ghost
                                className="bg-blue-500"
                                onClick={() => showOrderDetail(currentUserId === order.partnerId ? order.id : order.partnerOrderId)}
                                loading={loadingOrderDetail}
                                icon={<EyeOutlined />}
                                size="small"
                            >
                                Chi tiết
                            </Button>
                        </div>

                        <div className="space-y-2 mb-3">
                            {partnerItems.length > 0 ? (
                                <>
                                    {partnerItems.slice(0, 2).map((item, index) => (
                                        <div key={item.id} className="flex items-center gap-2">
                                            <Image
                                                width={32}
                                                height={32}
                                                src={item.imageUrl}
                                                alt={item.name}
                                                fallback="https://source.unsplash.com/32x32/?gundam"
                                                className="rounded border flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.grade}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {partnerItems.length > 2 && (
                                        <p className="text-xs text-gray-500 pl-2">+{partnerItems.length - 2} sản phẩm khác</p>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-2">
                                    <Spin size="small" />
                                    <p className="text-xs text-gray-500 mt-1">Đang tải...</p>
                                </div>
                            )}
                        </div>

                        <div className="text-xs text-gray-600 space-y-1">
                            <p><span className="font-medium">Mã:</span> {partnerCode}</p>
                        </div>
                    </div>
                </div>

                {/* Footer compact - giữ nguyên */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <div className="flex flex-col gap-4 text-sm">
                        <span className="text-gray-600">
                            Phí ship: <span className="font-semibold text-red-600">{order.formattedTotal}</span>
                        </span>
                        <span className="text-gray-600">
                            Mã đơn Trao đổi: <strong>{order.exchangeId}</strong>
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {shouldShowConfirmButton(order.status) && (
                            <Button
                                type="primary"
                                danger
                                onClick={() => showConfirmDeliveredModal(order.id)}
                                icon={<CheckCircleOutlined />}
                                size="small"
                            >
                                Hoàn tất
                            </Button>
                        )}
                        {shouldShowCancelReasonButton(order.status, order.canceledReason) && (
                            <Button
                                type="default"
                                danger
                                onClick={() => showCancelReasonModal(order)}
                                icon={<InfoCircleOutlined />}
                                size="small"
                            >
                                Lý do hủy
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="mx-auto p-6">

            <Tabs centered={true} activeKey={activeTab} onChange={setActiveTab} className="mb-4">
                {tabItems.map((tab) => (
                    <Tabs.TabPane
                        tab={<span className="text-base font-medium">{tab.label}</span>}
                        key={tab.key}
                    />
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
                <div className="text-center py-20">
                    <Spin size="large" />
                    <p className="text-gray-500 mt-4">Đang tải danh sách trao đổi...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                    <Empty
                        description="Chưa có giao dịch trao đổi nào cho mục này"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => renderExchangeCard(order))}
                </div>
            )}

            {/* Modal xác nhận hoàn tất trao đổi */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-lg font-bold text-blue-600">
                        <CheckCircleOutlined className="text-blue-500" />
                        Xác nhận hoàn tất trao đổi
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
                        Xác nhận hoàn tất
                    </Button>,
                ]}
            >
                <div className="py-4">
                    <Alert
                        message="Xác nhận hoàn tất trao đổi"
                        description={
                            <div className="mt-3">
                                <p className="text-base mb-3">
                                    Bạn xác nhận đã nhận được hàng từ đối tác và hoàn tất giao dịch trao đổi này?
                                </p>
                                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Lưu ý quan trọng:</strong> Sau khi xác nhận hoàn tất, bạn sẽ không thể khiếu nại
                                        về tình trạng sản phẩm nhận được. Vui lòng kiểm tra kỹ sản phẩm trước khi xác nhận.
                                    </p>
                                </div>
                            </div>
                        }
                        type="info"
                        showIcon
                    />
                </div>
            </Modal>

            {/* Modal xem lý do hủy trao đổi */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-lg font-semibold text-red-600">
                        <CloseCircleOutlined className="text-red-500" />
                        Lý do hủy giao dịch trao đổi
                    </div>
                }
                open={cancelReasonModalVisible}
                onCancel={handleCloseCancelReasonModal}
                footer={[
                    <Button key="close" type="primary" onClick={handleCloseCancelReasonModal}>
                        Đóng
                    </Button>
                ]}
                width={600}
            >
                {selectedCancelOrder && (
                    <div className="space-y-4">
                        {/* Thông tin giao dịch trao đổi */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <SwapOutlined />
                                Thông tin giao dịch trao đổi:
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-gray-600">Mã trao đổi:</span>
                                        <span className="ml-2 font-semibold text-blue-600">
                                            {selectedCancelOrder.exchangeId}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Đối tác:</span>
                                        <span className="ml-2 font-semibold">
                                            {selectedCancelOrder.partnerName}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-gray-600">Phí vận chuyển:</span>
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
                        </div>

                        {/* Lý do hủy */}
                        <Alert
                            message="Lý do hủy giao dịch"
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

                        {/* Thông tin sản phẩm bị ảnh hưởng */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border rounded-lg p-3">
                                <h5 className="font-medium text-sm text-blue-700 mb-2 flex items-center gap-1">
                                    <SendOutlined className="text-xs" />
                                    Sản phẩm bạn đã chuẩn bị gửi:
                                </h5>
                                <div className="space-y-2">
                                    {selectedCancelOrder.myItems.map((item, index) => (
                                        <div key={index} className="text-sm text-gray-600">
                                            • {item.name} ({item.grade})
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="border rounded-lg p-3">
                                <h5 className="font-medium text-sm text-green-700 mb-2 flex items-center gap-1">
                                    <InboxOutlined className="text-xs" />
                                    Sản phẩm bạn mong đợi nhận:
                                </h5>
                                <div className="space-y-2">
                                    {selectedCancelOrder.partnerItems.map((item, index) => (
                                        <div key={index} className="text-sm text-gray-600">
                                            • {item.name} ({item.grade})
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Thông tin hoàn tiền */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h5 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                                <CheckCircleOutlined />
                                Thông tin hoàn tiền:
                            </h5>
                            <p className="text-sm text-green-700">
                                Giao dịch trao đổi này đã bị hủy, do đó phí vận chuyển đã thanh toán sẽ được
                                hoàn trả lại vào tài khoản của bạn trong vòng 24 giờ. Bạn không bị mất bất kỳ
                                khoản tiền nào và sản phẩm của bạn vẫn được giữ nguyên.
                            </p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal chi tiết giao dịch trao đổi */}
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

export default OrderExchange;