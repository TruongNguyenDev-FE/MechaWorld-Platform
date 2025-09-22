import { Avatar, Button, Card, Form, Input, InputNumber, message, Modal, Space, Table, Typography, Image, Tag, Row, Col } from "antd";
import {
    UserOutlined,
    DollarOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined,
    SwapOutlined,
    EyeOutlined,
    EditOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getAllExchangeOffer, updateExchangeOffer } from "../../../apis/Exchange/APIExchange";
import { useSelector } from "react-redux";

export default function ExchangeManageNegotiation() {

    const [form] = Form.useForm();
    const user = useSelector((state) => state.auth.user)

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [currentNegotiation, setCurrentNegotiation] = useState(null);
    const [currentCompensation, setCurrentCompensation] = useState(null);
    const [compensationID, setCompensationID] = useState(null);
    const [compensationType, setCompensationType] = useState('none');
    const [offerData, setOfferData] = useState([]);

    const handleEditNegotiation = (record) => {
        setCurrentNegotiation(record);

        // Set initial values cho compensation type
        const offer = record.offer;
        if (!offer.compensation_amount || offer.compensation_amount === 0) {
            setCompensationType('none');
            setCurrentCompensation(false);
        } else if (offer.payer_id === user.id) {
            setCompensationType('sender');
            setCompensationID(user.id);
            setCurrentCompensation(true);
        } else if (offer.payer_id === record.poster.id) {
            setCompensationType('receiver');
            setCompensationID(record.poster.id);
            setCurrentCompensation(true);
        }

        form.setFieldsValue({
            compensationAmount: offer.compensation_amount || 0,
            note: offer.note || ''
        });
        setIsModalVisible(true);
    };

    const handleViewDetail = (record) => {
        setCurrentNegotiation(record);
        setIsDetailModalVisible(true);
    };

    const handleModalCancel = () => {
        setCurrentCompensation(null);
        setCurrentNegotiation(null);
        setCompensationID(null);
        setCompensationType('none');
        setIsModalVisible(false);
    };

    const handleDetailModalCancel = () => {
        setCurrentNegotiation(null);
        setIsDetailModalVisible(false);
    };

    const handleModalSubmit = () => {
        form.validateFields().then(values => {
            // Chuẩn bị dữ liệu theo đúng format API expects
            const offerUpdateData = {
                compensationAmount: compensationType === 'none' ? 0 : (values.compensationAmount || 0),
                note: values.note || '',
                id: compensationType === 'none' ? null : compensationID,
                requireCompensation: compensationType !== 'none' && values.compensationAmount > 0
            };

            // console.log("Updated negotiation data:", offerUpdateData);
            // console.log("Sending to API with structure:");
            // console.log({
            //     compensation_amount: offerUpdateData.compensationAmount,
            //     note: offerUpdateData.note,
            //     payer_id: offerUpdateData.id,
            //     require_compensation: offerUpdateData.requireCompensation
            // });

            updateExchangeOffer(currentNegotiation?.offer.id, offerUpdateData).then((res) => {
                if (res.status === 200) {
                    message.success('Cập nhật đề xuất thành công.');

                    // Refresh data
                    getAllExchangeOffer().then((response) => {
                        setOfferData(response.data);
                    });

                    handleModalCancel();
                } else if (res.status === 422) {
                    message.error('Ví của bạn không đủ tiền để đề xuất. Vui lòng nạp thêm tiền vào tài khoản!');
                }
            }).catch((error) => {
                console.error('Error updating offer:', error);

                // Enhanced error handling
                if (error.response?.status === 422) {
                    message.error('Ví của bạn không đủ tiền để đề xuất. Vui lòng nạp thêm tiền vào tài khoản!');
                } else if (error.response?.status === 400) {
                    message.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin!');
                } else if (error.response?.status === 404) {
                    message.error('Không tìm thấy đề xuất này!');
                } else {
                    message.error('Có lỗi xảy ra khi cập nhật đề xuất!');
                }
            });
        }).catch((formError) => {
            console.log('Form validation failed:', formError);
            message.error('Vui lòng kiểm tra lại thông tin đã nhập!');
        });
    };

    useEffect(() => {
        getAllExchangeOffer().then((res) => {
            setOfferData(res.data);
            console.log("getAllExchangeOffer", res.data);
        });
    }, []);

    // Render danh sách Gundam mini
    const renderMiniGundamList = (gundams, maxShow = 2) => {
        if (!gundams || gundams.length === 0) return <span className="text-gray-400">Không có</span>;

        const displayGundams = gundams.slice(0, maxShow);
        const remainingCount = gundams.length - maxShow;

        return (
            <div className="space-y-1">
                {displayGundams.map((gundam, index) => (
                    <div key={gundam.gundam_id || index} className="flex items-center gap-2">
                        <Image
                            src={gundam.primary_image_url}
                            width={30}
                            height={30}
                            className="object-cover rounded"
                        />
                        <span className="text-xs text-gray-600 truncate max-w-[98px]">
                            {gundam.name}
                        </span>
                    </div>
                ))}
                {remainingCount > 0 && (
                    <div className="text-xs text-blue-500">
                        +{remainingCount} Gundam khác
                    </div>
                )}
            </div>
        );
    };

    // Columns for negotiation tab
    const negotiationColumns = [
        {
            title: "Đối tác",
            dataIndex: "poster",
            key: "poster",
            width: 160,
            align: 'center',
            render: (poster) => (
                <Space direction="vertical" size={0} className="text-center">
                    <Avatar
                        src={poster.avatar_url}
                        icon={<UserOutlined />}
                        className="border-2 border-blue-500"
                        size={40}
                    />
                    <span className="font-medium text-sm">{poster.full_name}</span>
                </Space>
            ),
        },
        {
            title: "Gundam đối tác",
            dataIndex: "offer",
            key: "poster_items",
            width: 200,
            align: 'center',
            render: (offer) => (
                <div className="space-y-2">
                    {renderMiniGundamList(offer.poster_exchange_items)}
                </div>
            )
        },
        {
            title: "Gundam bạn trao đổi",
            dataIndex: "offer",
            key: "offerer_items",
            width: 200,
            align: 'center',
            render: (offer) => (
                <div className="space-y-2">
                    {renderMiniGundamList(offer.offerer_exchange_items)}
                </div>
            ),
        },
        {
            title: "Bù trừ tiền",
            dataIndex: "offer",
            key: "compensation",
            width: 150,
            align: 'center',
            render: (offer) => (
                offer.payer_id !== null && offer.compensation_amount !== null && offer.compensation_amount > 0 ? (
                    <Space direction="vertical" size={0}>
                        {offer.payer_id === user.id ? (
                            <Typography.Text type="danger" className="text-sm">
                                <ArrowDownOutlined /> Bạn bù
                            </Typography.Text>
                        ) : (
                            <Typography.Text type="success" className="text-sm">
                                <ArrowUpOutlined /> Họ bù
                            </Typography.Text>
                        )}
                        <Typography.Text strong className="text-sm">
                            {offer.compensation_amount.toLocaleString()} VND
                        </Typography.Text>
                    </Space>
                ) : (
                    <Typography.Text className="text-sm text-gray-500">Không bù tiền</Typography.Text>
                )
            ),
        },
        {
            title: "Tin nhắn thương lượng",
            dataIndex: "offer",
            key: "note",
            width: 180,
            align: 'center',
            render: (offer) => {
                const latestNote = offer.negotiation_notes?.[offer.negotiation_notes.length - 1];
                return (
                    <div className="space-y-1">
                        <p className="text-sm text-left text-gray-700 line-clamp-2">
                            {latestNote?.content || 'Không có tin nhắn'}
                        </p>
                        {/* {latestNote && (
                            <p className="text-xs text-gray-400">
                                {new Date(latestNote.created_at).toLocaleDateString('vi-VN')}
                            </p>
                        )} */}
                    </div>
                );
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "offer",
            key: "status",
            width: 150,
            align: 'center',
            render: (offer) => {
                const statusMap = {
                    pending: { color: 'orange', text: 'Đang chờ' },
                    accepted: { color: 'green', text: 'Đã chấp nhận' },
                    rejected: { color: 'red', text: 'Đã từ chối' }
                };
                const status = statusMap[offer.status] || statusMap.pending;

                return (
                    <div className="space-y-1">
                        <Tag color={status.color} className="text-xs">
                            {status.text}
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: "Số lần thương lượng",
            dataIndex: "offer",
            key: "status",
            width: 150,
            align: 'center',
            render: (offer) => {

                return (
                    <div className="space-y-1">
                        <div className="text-base">
                            {offer.negotiations_count}/{offer.max_negotiations}
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Hành động",
            key: "action",
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space direction="vertical" size={"small"}>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                        className="w-full bg-blue-500"
                    >
                        Chi tiết đề xuất
                    </Button>
                    <Button
                        className="bg-blue-500 w-full"
                        type="primary"
                        size="small"
                        ghost
                        danger
                        icon={<EditOutlined />}
                        disabled={!record.offer.last_negotiation_at || record.offer.negotiations_count >= record.offer.max_negotiations}
                        onClick={() => handleEditNegotiation(record)}
                    >
                        Chỉnh sửa đề xuất
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                columns={negotiationColumns}
                dataSource={offerData}
                rowKey={(record) => record.offer.id}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                    showTotal: (total) => `Tổng ${total} đề xuất`
                }}
                bordered
                className="gundam-table"
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 8,
                }}
                rowClassName={(record, index) =>
                    index % 2 === 0 ? 'bg-gray-50' : ''
                }
                scroll={{ x: 1200 }}
            />

            {/* Modal for viewing detail */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <SwapOutlined className="text-blue-500" />
                        <span>CHI TIẾT ĐỀ XUẤT TRAO ĐỔI</span>
                    </div>
                }
                open={isDetailModalVisible}
                onCancel={handleDetailModalCancel}
                footer={[
                    <Button key="close" onClick={handleDetailModalCancel}>
                        Đóng
                    </Button>
                ]}
                width={800}
            >
                {currentNegotiation && (
                    <div className="space-y-4">
                        {/* Header thông tin */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <div className="text-center">
                                        <Avatar
                                            src={currentNegotiation.poster.avatar_url}
                                            size={50}
                                            icon={<UserOutlined />}
                                        />
                                        <div className="mt-2">
                                            <div className="font-medium">{currentNegotiation.poster.full_name}</div>
                                            {/* <div className="text-sm text-gray-600">{currentNegotiation.poster.email}</div> */}
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="space-y-2">
                                        <div><strong>Trạng thái:</strong> {currentNegotiation.offer.status}</div>
                                        <div><strong>Ngày tạo:</strong> {new Date(currentNegotiation.offer.created_at).toLocaleDateString('vi-VN')}</div>
                                        <div><strong>Thương lượng:</strong> {currentNegotiation.offer.negotiations_count}/{currentNegotiation.offer.max_negotiations}</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* Gundam trao đổi */}
                        <Row gutter={16}>
                            <Col span={11}>
                                <Card title={`Gundam của ${currentNegotiation.poster.full_name} (${currentNegotiation.offer.poster_exchange_items?.length || 0})`} size="small">
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {currentNegotiation.offer.poster_exchange_items?.map((gundam, index) => (
                                            <div key={gundam.gundam_id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                <Image
                                                    src={gundam.primary_image_url}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">{gundam.name}</div>
                                                    <div className="text-xs text-gray-600">{gundam.grade} - {gundam.scale}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </Col>
                            <Col span={2} className="text-center flex justify-center items-center">
                                <SwapOutlined className="text-2xl text-blue-500 mt-8" />
                            </Col>
                            <Col span={11}>
                                <Card title={`Gundam của bạn (${currentNegotiation.offer.offerer_exchange_items?.length || 0})`} size="small">
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {currentNegotiation.offer.offerer_exchange_items?.map((gundam, index) => (
                                            <div key={gundam.gundam_id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                <Image
                                                    src={gundam.primary_image_url}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">{gundam.name}</div>
                                                    <div className="text-xs text-gray-600">{gundam.grade} - {gundam.scale}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        {/* Thông tin bù trừ */}
                        {currentNegotiation.offer.compensation_amount > 0 && (
                            <Card title="Thông tin bù trừ" size="small">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">
                                        {currentNegotiation.offer.compensation_amount.toLocaleString()} VND
                                    </div>
                                    <div className="text-base text-gray-600">
                                        {currentNegotiation.offer.payer_id === user.id ? 'Bạn sẽ bù tiền' : `${currentNegotiation.poster.full_name} sẽ bù tiền`}
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Tin nhắn */}
                        <Card title="Tin nhắn trao đổi" size="small">
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                <div className="bg-blue-50 text-base p-2 rounded">
                                    {currentNegotiation.offer.note || 'Không có'}
                                </div>
                            </div>
                        </Card>

                        <Card title="Tin nhắn thương lượng" size="small">
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {currentNegotiation.offer.negotiation_notes?.map((note) => (
                                    <div key={note.id} className="bg-gray-50 p-2 rounded">
                                        <div className="text-base">{note.content}</div>
                                        {/* <div className="text-xs text-gray-500">
                                            {new Date(note.created_at).toLocaleString('vi-VN')}
                                        </div> */}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </Modal>

            {/* Modal for editing negotiation */}
            <Modal
                title="CHỈNH SỬA ĐỀ XUẤT TRAO ĐỔI"
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleModalCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" className="bg-blue-500" onClick={handleModalSubmit}>
                        Cập nhật đề xuất
                    </Button>,
                ]}
                width={600}
            >
                {currentNegotiation && (
                    <div className="py-2">
                        <Form
                            form={form}
                            layout="vertical"
                            className="pt-2"
                        >
                            <Form.Item
                                label={<span className="font-medium text-base">Bạn muốn ai là người Bù Trừ tiền?</span>}
                                className="mb-4"
                            >
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type={compensationType === 'none' ? 'primary' : 'default'}
                                        onClick={() => {
                                            setCompensationType('none');
                                            setCurrentCompensation(false);
                                            setCompensationID(null);
                                            form.setFieldsValue({
                                                compensationType: 'none',
                                                compensationAmount: 0
                                            });
                                        }}
                                        className={compensationType === 'none' ? 'bg-blue-500' : ''}
                                    >
                                        Không ai bù trừ tiền
                                    </Button>
                                    <Button
                                        type={compensationType === 'receiver' ? 'primary' : 'default'}
                                        onClick={() => {
                                            setCompensationType('receiver');
                                            setCompensationID(currentNegotiation.poster.id);
                                            setCurrentCompensation(true);
                                            form.setFieldsValue({ compensationType: 'receiver' });
                                        }}
                                        className={compensationType === 'receiver' ? 'bg-blue-500' : ''}
                                    >
                                        {currentNegotiation.poster.full_name} sẽ bù tiền
                                    </Button>
                                    <Button
                                        type={compensationType === 'sender' ? 'primary' : 'default'}
                                        onClick={() => {
                                            setCompensationType('sender');
                                            setCompensationID(user.id);
                                            setCurrentCompensation(true);
                                            form.setFieldsValue({ compensationType: 'sender' });
                                        }}
                                        className={compensationType === 'sender' ? 'bg-blue-500' : ''}
                                    >
                                        Bạn sẽ bù tiền
                                    </Button>
                                </div>
                            </Form.Item>

                            <Form.Item
                                name="compensationAmount"
                                label="Số tiền bù trừ (VND)"
                                rules={compensationType !== 'none' ? [
                                    { required: true, message: 'Vui lòng nhập số tiền bù trừ' },
                                    { type: 'number', min: 1000, message: 'Số tiền bù trừ phải từ 1,000 VND trở lên' }
                                ] : []}
                            >
                                <InputNumber
                                    className="w-full"
                                    placeholder="Nhập số tiền bù trừ"
                                    min={1000}
                                    step={10000}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                    addonBefore={<DollarOutlined />}
                                    disabled={compensationType === 'none'}
                                />
                            </Form.Item>

                            <Form.Item
                                name="note"
                                label="Tin nhắn (nếu có)"
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Nhập ghi chú về đề nghị trao đổi của bạn (nếu có)..."
                                    maxLength={500}
                                    showCount
                                />
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </Modal>
        </>
    )
}