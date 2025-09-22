import { Drawer, Button, Badge, List, Space, Avatar, Divider, Typography, Modal, Form, Input, message, notification } from "antd";
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { acceptOffer, requestNegotiation } from "../../../apis/Exchange/APIExchange";
import { checkWallet } from "../../../apis/User/APIUser";

const { Text } = Typography;

export default function OffersDrawer({ visible, offers, onClose, onViewOfferDetail }) {

    const [form] = Form.useForm();
    const user = useSelector((state) => state.auth.user);
    const userId = useSelector((state) => state.auth.user.id);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!offers) return null;

    const handleModalCancel = () => {
        setIsModalVisible(false)
    }

    // Hàm kiểm tra số dư ví
    useEffect(() => {
        const fetchBalance = async () => {
            if (!userId || !visible) return;

            try {
                setLoading(true);
                const response = await checkWallet(userId);
                // Giả sử API trả về data.balance
                const walletBalance = response?.data?.balance || 0;
                setBalance(walletBalance);
                setError(null);
            } catch (err) {
                setError('Không thể kiểm tra số dư ví');
                console.error('Error fetching wallet balance:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, [userId, visible]);

    // Hàm xử lý chấp nhận trao đổi được cập nhật
    const handleAcceptExchange = async (offer) => {
        try {

            // Kiểm tra lại số dư ví hiện tại
            const walletResponse = await checkWallet(userId);
            const currentBalance = walletResponse?.data?.balance || 0;

            // Xác định số tiền cần thanh toán
            let requiredAmount = 0;

            // Kiểm tra nếu user hiện tại phải bù trừ tiền
            if (offer.payer_id === user.id && offer.compensation_amount > 0) {
                requiredAmount = offer.compensation_amount;
            }

            // Kiểm tra số dư có đủ không
            if (currentBalance < requiredAmount) {
                notification.error({
                    message: 'BẠN KHÔNG ĐỦ SỐ DƯ',
                    description: (
                        <div>
                            <div>Số dư hiện tại: <strong>{currentBalance.toLocaleString()}đ</strong></div>
                        </div>
                    ),
                    duration: 5,
                });
                return;
            }

            // Nếu đủ tiền hoặc không cần thanh toán, tiến hành chấp nhận đề xuất
            const res = await acceptOffer(offer.post_id, offer.id);

            if (res.status === 200) {
                notification.success({
                    message: 'CHẤP NHẬN ĐỀ XUẤT THÀNH CÔNG',
                    // description: requiredAmount > 0 ?
                    //     `Đã thanh toán ${requiredAmount.toLocaleString()}đ` :
                    //     'Không có khoản bù trừ',
                });

                // Đóng drawer
                onClose();

                // Chuyển hướng sau 1.5 giây
                setTimeout(() => {
                    window.location.href = `/exchange/detail/${res.data.id}`;
                }, 1500);
            }
        } catch (error) {
            console.error('Error accepting offer:', error);
            notification.error({
                message: 'LỖI KHI CHẤP NHẬN ĐỀ XUẤT',
                description: error.response?.data?.message || error.message || 'Có lỗi xảy ra, vui lòng thử lại',
            });
        }
    };


    const handleModalSubmit = (values) => {
        requestNegotiation(offers[0].post_id, offers[0]?.id, values.note).then((res) => {
            if (res.status === 200) {
                setTimeout(
                    message.success('Đã gửi thương lượng'), 1300
                )
                setIsModalVisible(false);
            }
        })
    }

    const viewOfferDetail = (offer) => {

        onViewOfferDetail(offer);
    };

    return (
        <>
            <Drawer
                title={
                    <>
                        <div>
                            <Text className="uppercase text-base" strong>Đề xuất trao đổi cho bài viết của bạn</Text>
                        </div>
                    </>
                }
                width={500}
                open={visible}
                onClose={onClose}
                footer={
                    <div className="flex justify-end">
                        <Button onClick={onClose}>Đóng</Button>
                    </div>
                }
            >

                <Divider orientation="left">
                    <Space>
                        <Badge>
                            <Text strong>Danh sách đề xuất</Text>
                        </Badge>
                    </Space>
                </Divider>

                {offers?.length > 0 ? (
                    <List
                        dataSource={offers}
                        renderItem={(offer) => (
                            <List.Item
                                key={offer.id}
                                actions={[
                                    <div key={`offer-actions-${offer.id}`} className="flex flex-col w-32 gap-2">
                                        <Button
                                            danger
                                            ghost
                                            type="primary"
                                            block
                                            onClick={() => setIsModalVisible(true)}
                                        >
                                            Thương lượng
                                        </Button>
                                        <Button
                                            key={`detail-${offer.id}`}
                                            type="primary"
                                            className="bg-blue-500"
                                            block
                                            onClick={() => {
                                                viewOfferDetail(offer)
                                                console.log("offer", offer);
                                            }}
                                        >
                                            Chi tiết
                                        </Button>
                                        {/* <Button
                                            type="primary"
                                            className="bg-blue-500"
                                            block
                                            onClick={() => handleAcceptExchange(offer)}
                                        >
                                            Chấp nhận
                                        </Button> */}
                                    </div>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={offer.offerer.avatar_url}>{offer.offerer.avatar_url}</Avatar>}
                                    title={
                                        <Space>
                                            <Text strong>{offer.offerer.full_name}</Text>
                                            {/* <Tag
                                                icon={offerStatusMap[offer.status].icon}
                                                color={offerStatusMap[offer.status].color}
                                            >
                                                {offerStatusMap[offer.status].text}
                                            </Tag> */}
                                        </Space>
                                    }
                                    description={
                                        <Space direction="vertical" size={0}>
                                            <div><Text>{offer.offerer_exchange_items[0].name}</Text></div>
                                            <Text>
                                                {offer.payer_id === null ? (
                                                    <Text type="success">
                                                        Không có bù trừ
                                                    </Text>
                                                ) : offer.payer_id === user.id ? (
                                                    <div className="text-gray-400">
                                                        Đề xuất: <Text type="danger"> <ArrowDownOutlined />Bạn bù {offer.compensation_amount.toLocaleString()}đ </Text>
                                                    </div>
                                                ) : (
                                                    <Text type="success">
                                                        <ArrowUpOutlined /> Họ bù {offer.compensation_amount.toLocaleString()}đ
                                                    </Text>
                                                )}
                                            </Text>
                                        </Space>
                                    }
                                />
                            </List.Item>
                        )}
                    />

                ) : (
                    <div className="text-center py-8">
                        <Text type="secondary">Chưa có đề xuất trao đổi nào</Text>
                    </div>
                )}
            </Drawer>

            {/* Modal Gửi Thương lượng */}
            <Modal
                title="GỬI THƯƠNG LƯỢNG ĐỀ XUẤT TRAO ĐỔI"
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleModalCancel}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        className="bg-blue-500"
                        onClick={() => {
                            form.validateFields().then(values => {
                                handleModalSubmit(values);
                            }).catch(err => {
                                console.log('Validation Failed:', err);
                            });
                        }}
                    >
                        Gửi tin nhắn
                    </Button>,
                ]}
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        compensationType: 'none',
                        compensationAmount: 0,
                        note: ''
                    }}
                >

                    <Form.Item name="note" label="Tin nhắn" rules={[{ required: true }]}>
                        <Input.TextArea
                            rows={4}
                            placeholder="Nhập tin nhắn mong muốn đối tác chỉnh sửa lại đề xuất trao đổi..."
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>
                </Form>
            </Modal>

        </>
    );
}