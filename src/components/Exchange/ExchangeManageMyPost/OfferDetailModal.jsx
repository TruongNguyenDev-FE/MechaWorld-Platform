import { Modal, Button, Card, Tag, Avatar, Typography, Image, Row, Col, Statistic, Divider } from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    SwapOutlined,
    DollarOutlined
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export default function OfferDetailModal({ open, offer, post, onClose, onAction }) {
    // console.log("OfferDetailModal - visible:", open);
    // console.log("OfferDetailModal - offer:", offer);
    // console.log("OfferDetailModal - post:", post);
    // console.log("latestNote", latestNote);
    const latestNote = offer?.negotiation_notes[0]


    if (!offer) {
        // console.log("OfferDetailModal - Not rendering due to missing offer data");
        return null;
    }

    // const offerStatusMap = {
    //     pending: { text: "Đang chờ xác nhận", color: "orange", icon: <ClockCircleOutlined /> },
    //     accepted: { text: "Đã chấp nhận", color: "green", icon: <CheckCircleOutlined /> },
    //     rejected: { text: "Đã từ chối", color: "red", icon: <CloseCircleOutlined /> }
    // };

    // Lấy danh sách Gundam từ API response
    const posterGundams = offer.poster_exchange_items || [];
    const offererGundams = offer.offerer_exchange_items || [];

    // Thông tin người đề xuất
    const offererInfo = offer.offerer || {};

    // Xác định ai là người trả tiền bù trừ
    const getPaymentInfo = () => {
        if (!offer.compensation_amount || offer.compensation_amount === 0) {
            return {
                amount: 0,
                direction: 'none',
                description: "Không có bù trừ tiền"
            };
        }

        // Nếu payer_id === offerer.id thì người đề xuất trả
        // Ngược lại thì poster (chủ bài đăng) trả
        const isOffererPaying = offer.payer_id === offererInfo.id;

        return {
            amount: offer.compensation_amount,
            direction: isOffererPaying ? 'offerer_pays' : 'poster_pays',
            description: isOffererPaying
                ? `${offererInfo.full_name} sẽ bù thêm tiền cho bạn`
                : `Bạn sẽ bù thêm tiền cho ${offererInfo.full_name}`
        };
    };

    const paymentInfo = getPaymentInfo();

    // Render danh sách Gundam
    const renderGundamList = (gundams, title, emptyMessage) => (
        <div>
            <div className="text-center mb-3">
                <Text strong className="text-base">{title}</Text>
                <div className="text-xs text-gray-500 mt-1">({gundams.length} Gundam)</div>
            </div>

            {gundams.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Text type="secondary">{emptyMessage}</Text>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {gundams.map((gundam, index) => (
                        <Card key={gundam.gundam_id || index} size="small" className="shadow-sm hover:shadow-md transition-shadow">
                            <Row gutter={12} align="middle">
                                <Col span={8}>
                                    <Image
                                        src={gundam.primary_image_url}
                                        width="100%"
                                        height={80}
                                        className="object-cover rounded"
                                    />
                                </Col>
                                <Col span={16}>
                                    <div className="space-y-1">
                                        <Text strong className="text-sm leading-tight">
                                            {gundam.name}
                                        </Text>
                                        <div className="flex flex-wrap gap-1">
                                            <Text className="text-gray-400">Tỷ lệ: <Tag color="green" size="small">{gundam.scale}</Tag></Text>
                                            <Text className="text-gray-400">Phân khúc: <Tag color="blue" size="small">{gundam.grade}</Tag></Text>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {/* <Tag color="green" size="small">
                                                {gundam.condition === 'new' ? 'Mới' : 'Đã sử dụng'}
                                            </Tag> */}
                                            <Text className="text-gray-400">Dòng phim: <Tag color="purple" size="small">{gundam.series}</Tag></Text>
                                        </div>
                                        {/* <div className="text-xs text-gray-600">
                                            <DollarOutlined className="mr-1" />
                                            {gundam.price?.toLocaleString('vi-VN')} VND
                                        </div> */}
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );

    // Tính tổng giá trị
    const posterTotalValue = posterGundams.reduce((sum, gundam) => sum + (gundam.price || 0), 0);
    const offererTotalValue = offererGundams.reduce((sum, gundam) => sum + (gundam.price || 0), 0);

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <SwapOutlined className="text-blue-500" />
                    <span>CHI TIẾT ĐỀ XUẤT TRAO ĐỔI NHIỀU-NHIỀU</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={
                <>
                    {/* <Button key="reject" danger onClick={() => onAction(offer.id, "reject")}>
                        Từ chối đề xuất
                    </Button>, */}
                    <Button key="accept" type="primary" className="bg-blue-500" onClick={() => onAction(offer.id, "accept")}>
                        Chấp nhận đề xuất
                    </Button>,
                </>
            }
            width={1000}
            className="offer-detail-modal"
        >
            {/* Header thông tin người đề xuất */}
            <div className="flex items-center mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                <Avatar
                    src={offererInfo.avatar_url}
                    size={48}
                    className="border-2 border-white shadow-sm"
                >
                    {offererInfo.full_name?.charAt(0)}
                </Avatar>
                <div className="ml-3 flex-1">
                    <Text strong className="text-lg">{offererInfo.full_name}</Text>
                    <div className="text-xs text-gray-500">
                        Đề xuất lúc: {new Date(offer.created_at).toLocaleString('vi-VN')}
                    </div>
                </div>
                {/* <div>
                    <Tag
                        icon={offerStatusMap[offer.status]?.icon}
                        color={offerStatusMap[offer.status]?.color}
                        className="text-sm px-3 py-1"
                    >
                        {offerStatusMap[offer.status]?.text || 'Đang chờ xác nhận'}
                    </Tag>
                </div> */}
            </div>

            {/* Thông tin trao đổi nhiều Gundam */}
            <Card className="mb-4" title="Thông tin Gundam trao đổi">
                <Row gutter={32}>
                    {/* Gundam của bạn (poster) */}
                    <Col span={11}>
                        {renderGundamList(posterGundams, "Gundam của bạn", "Không có Gundam nào")}
                        {/* <div className="mt-3 p-2 bg-blue-50 rounded text-center">
                            <Text strong className="text-blue-700">
                                Tổng giá trị: {posterTotalValue.toLocaleString('vi-VN')} VND
                            </Text>
                        </div> */}
                    </Col>

                    {/* Icon trao đổi */}
                    <Col span={2}>
                        <div className="flex items-center justify-center h-full pt-12">
                            <div className="text-center">
                                <div className="bg-blue-100 rounded-full p-3 mb-2">
                                    <SwapOutlined className="text-2xl text-blue-500" />
                                </div>
                                <div className="text-xs text-gray-500 font-medium">
                                    {posterGundams.length}:{offererGundams.length}
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Gundam được đề xuất (offerer) */}
                    <Col span={11}>
                        {renderGundamList(offererGundams, `Gundam của ${offererInfo.full_name}`, "Không có Gundam nào được đề xuất")}
                        {/* <div className="mt-3 p-2 bg-green-50 rounded text-center">
                            <Text strong className="text-green-700">
                                Tổng giá trị: {offererTotalValue.toLocaleString('vi-VN')} VND
                            </Text>
                        </div> */}
                    </Col>
                </Row>
            </Card>

            {/* Thông tin bù trừ tiền */}
            <Card className="mb-4" title={
                <div className="pt-2">
                    <Text className="text-lg font-semibold mb-2 block">
                        {paymentInfo.description}
                    </Text>
                </div>
            }>
                <Statistic
                    title="Số tiền bù trừ"
                    value={paymentInfo.amount}
                    precision={0}
                    valueStyle={{
                        color: paymentInfo.direction === 'none' ? '#666' :
                            paymentInfo.direction === 'offerer_pays' ? '#3f8600' : '#cf1322',
                        fontSize: '24px'
                    }}
                    prefix={
                        paymentInfo.direction === 'none' ? null :
                            paymentInfo.direction === 'offerer_pays' ? <ArrowUpOutlined /> : <ArrowDownOutlined />
                    }
                    suffix="VND"
                />
            </Card>

            <Divider />

            {/* Tin nhắn đề xuất */}
            <Card title={`💬 Tin nhắn từ ${offererInfo.full_name}`}>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <Paragraph className="mb-0 text-gray-700 text-base">
                        {latestNote?.content || offer.note || "Không có tin nhắn đề xuất nào."}
                    </Paragraph>
                </div>
            </Card>

            {/* Thống kê tổng quan */}
            {/* <Card className="mt-4 bg-gradient-to-r from-gray-50 to-blue-50" title="📊 Thống kê trao đổi">
                <Row gutter={16} className="text-center">
                    <Col span={6}>
                        <Statistic
                            title="Gundam của bạn"
                            value={posterGundams.length}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic
                            title="Gundam đề xuất"
                            value={offererGundams.length}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic
                            title="Tỷ lệ trao đổi"
                            value={`${posterGundams.length}:${offererGundams.length}`}
                            valueStyle={{ color: '#fa541c' }}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic
                            title="Chênh lệch giá trị"
                            value={Math.abs(posterTotalValue - offererTotalValue)}
                            precision={0}
                            valueStyle={{ color: '#722ed1' }}
                            suffix="VND"
                        />
                    </Col>
                </Row>
            </Card> */}

            {/* Thông tin thương lượng (nếu có) */}
            {offer.max_negotiations > 0 && (
                <Card className="mt-4" title="🤝 Thông tin thương lượng">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Text>Số lần thương lượng đã dùng: </Text>
                            <Text strong>{offer.negotiations_count}/{offer.max_negotiations}</Text>
                        </Col>
                        <Col span={8}>
                            <Text>Có thể thương lượng thêm: </Text>
                            <Text strong className={offer.negotiations_count < offer.max_negotiations ? 'text-green-600' : 'text-red-600'}>
                                {offer.negotiations_count < offer.max_negotiations ? 'Có' : 'Không'}
                            </Text>
                        </Col>
                        <Col span={8}>
                            {offer.last_negotiation_at && (
                                <>
                                    <Text>Lần thương lượng cuối: </Text>
                                    <Text strong>{new Date(offer.last_negotiation_at).toLocaleDateString('vi-VN')}</Text>
                                </>
                            )}
                        </Col>
                    </Row>
                </Card>
            )}
        </Modal>
    );
}