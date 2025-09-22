// RequestList.jsx
import { Card, List, Avatar, Typography, Modal, Button, Image, Carousel, Input } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from "moment/min/moment-with-locales";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ModalOfferExchange from './ModalOfferExchange';

import { getAllExchangePost } from '../../../apis/Exchange/APIExchange';
import { GetGundamByID } from '../../../apis/User/APIUser';

moment.locale("vi");

const { Link, Text, Paragraph } = Typography;

const { Search } = Input;

export default function ExchangeList() {
    const user = useSelector((state) => state.auth.user);

    const [selectedRequest, setSelectedRequest] = useState(null);

    // Modal List Poster Gundam Avaiable
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestData, setRequestData] = useState();

    // Moda Offer Exchange Request
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [listRequest, setListRequest] = useState([]);
    const [requestPost, setRequestPost] = useState(null);
    const [yourGundamList, setYourGundamList] = useState([]);


    const [expandedContent, setExpandedContent] = useState(false);

    const handleOpenModal = (request) => {
        // console.log(request);
        const conditionMap = {
            "new": "Hàng mới",
            "open box": "Đã mở hộp",
            "used": "Đã qua sử dụng"
        };

        // Đây là mảng mới với condition đã được dịch
        const translatedItems = request.exchange_post_items.map(item => {
            // Tạo một bản sao của item
            const translatedItem = { ...item };

            // Thêm thuộc tính displayCondition với giá trị đã dịch
            translatedItem.displayCondition = conditionMap[item.condition] || item.condition;

            return translatedItem;
        });

        // Cập nhật state với mảng đã được dịch
        setSelectedRequest(translatedItems);
        setIsModalOpen(true);
    };

    const handleOfferModal = (request) => {
        // console.log(request);
        setSelectedRequest(request.exchange_post_items);
        setRequestData(request.poster);
        setRequestPost(request.exchange_post);
        setIsOfferModalOpen(true);

    };

    
    useEffect(() => {
        getAllExchangePost().then((res) => {
            setListRequest(res.data);
        });

        if (user?.id) { // Kiểm tra user và id có tồn tại
            GetGundamByID(user.id, "").then((res) => {
                const conditionMap = {
                    "new": "Mới",
                    "open box": "Hộp đã mở",
                    "used": "Đã sử dụng"
                };

                const translatedGundams = res.data.map(gundam => ({
                    ...gundam,
                    displayCondition: conditionMap[gundam.condition] || gundam.condition
                }));

                setYourGundamList(translatedGundams);
            });
        }
    }, [user?.id]);

    return (
        <>
            <div className="bg-white p-4 shadow rounded-lg">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold">CÁC BÀI VIẾT TRAO ĐỔI GUNDAM</h2>

                    {/* Phần tìm kiếm bài viết */}
                    <div className="w-2/5">
                        <Search
                            placeholder="Tìm kiếm bài viết trao đổi..."
                            allowClear
                            onSearch={(value) => {
                                // Xử lý tìm kiếm
                                // Nếu có API tìm kiếm, có thể gọi API ở đây
                                // Ví dụ: searchExchangePost(value).then(res => setListRequest(res.data))

                                // Hoặc lọc từ danh sách đã có
                                if (value) {
                                    const filteredList = listRequest.filter(item =>
                                        item.exchange_post.content.toLowerCase().includes(value.toLowerCase()) ||
                                        item.poster.full_name.toLowerCase().includes(value.toLowerCase())
                                    );
                                    setListRequest(filteredList);
                                } else {
                                    // Nếu ô tìm kiếm trống, lấy lại toàn bộ danh sách
                                    getAllExchangePost().then((res) => {
                                        setListRequest(res.data);
                                    });
                                }
                            }}
                        />
                    </div>
                </div>

                {/* List các Yêu cầu Trao đổi */}
                <List
                    itemLayout="vertical"
                    dataSource={listRequest}
                    renderItem={(item) => (
                        <Card className="mb-3" >
                            <List.Item className="flex items-center">
                                <div className="content-wrapp space-y-2">
                                    {/* Icon user - username - Time posted */}
                                    <div className="flex flex-col items-start">
                                        <div className='flex items-center justify-between w-full'>
                                            <div className='flex items-center gap-3'>
                                                <Avatar size={48} src={item.poster.avatar_url} icon={!item.poster.avatar_url && <UserOutlined />} />
                                                <div className="">
                                                    <Link href={item.userProfile} className="mr-4 text-sm">
                                                        {item.poster.full_name}
                                                    </Link>
                                                    <Text type="secondary" className="flex items-center text-xs">
                                                        <ClockCircleOutlined className="mr-1" /> {moment(item.exchange_post.created_at).format("LLL")}
                                                    </Text>
                                                </div>
                                            </div>
                                            <div className='space-x-2'>
                                                <Button onClick={() => handleOpenModal(item)} ghost type='primary' className='bg-blue-400'>
                                                    Gundam Trao Đổi
                                                </Button>
                                                {item.poster.id === user.id ? ("") : (
                                                    <Button
                                                        onClick={() => handleOfferModal(item)}
                                                        type='primary'
                                                        className='bg-blue-500 px-4'
                                                        disabled={item.poster.id === user.id} // Khóa nút nếu người đăng là chính mình
                                                    >
                                                        Đề xuất trao đổi
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nội dung bài Post */}
                                    <div className='content-post flex items-start'>
                                        {/* List ảnh Gundam đăng Trao đổi - Chỉ hiển thị ảnh đại diện */}
                                        {/* List ảnh Gundam đăng Trao đổi - Hiển thị carousel ảnh */}
                                        <div className="relative mr-4 w-48">
                                            <Carousel autoplay={false} dots={false} arrows={true} className="rounded-md overflow-hidden">
                                                {item.exchange_post.post_image_urls.map((imageUrl, index) => (
                                                    <div key={index}>
                                                        <Image
                                                            src={imageUrl}
                                                            width={190}
                                                            height={150}
                                                            className="object-cover rounded-md"
                                                            preview={true}
                                                        />
                                                    </div>
                                                ))}
                                            </Carousel>
                                        </div>

                                        {/* Nội dung chính của bài post */}
                                        <div className="flex-1">
                                            <Paragraph
                                                ellipsis={
                                                    item.exchange_post.content.split('\n').length > 5 && !expandedContent
                                                        ? { rows: 5 }
                                                        : false
                                                }
                                                className="text-base text-gray-600"
                                            >
                                                {item.exchange_post.content}
                                            </Paragraph>
                                            {item.exchange_post.content.split('\n').length > 5 && (
                                                <Text
                                                    type="secondary"
                                                    className="text-blue-500 cursor-pointer text-sm"
                                                    onClick={() => setExpandedContent(!expandedContent)}
                                                >
                                                    {expandedContent ? 'Ẩn bớt' : 'Xem thêm'}
                                                </Text>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </List.Item>
                        </Card>
                    )}
                />
            </div>

            {/* Modal Gửi Yêu cầu Đề Xuất Trao Đổi */}
            <ModalOfferExchange
                isOpen={isOfferModalOpen}
                onClose={() => setIsOfferModalOpen(false)}
                requestData={requestData}
                gundamList={selectedRequest}
                yourGundamList={yourGundamList}
                requestPost={requestPost}
            />

            {/* Modal để hiển thị các gundam mà Người đăng sẵn sàng Trao đổi */}
            <Modal
                title="DANH SÁCH GUNDAM CÓ SẴN ĐỂ TRAO ĐỔI"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={900}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={selectedRequest}
                    className="mt-4 max-h-96 overflow-auto"
                    renderItem={(item) => (
                        <List.Item className="items-start">
                            <List.Item.Meta
                                avatar={<Image src={item.primary_image_url} width={130} height={150} />}
                                title={<Text strong className='text-base'>{item.title}</Text>}
                                description={
                                    <div className='mt-7'>
                                        <div><Text className='text-base' strong>{item.name}</Text></div>
                                        <div>{item.series}</div>
                                        <div> Phiên bản: <Text strong>{item.version}</Text></div>
                                        <div> Tình trạng: <Text strong>{item.displayCondition}</Text> </div>
                                    </div>
                                }
                            />
                            <Carousel
                                dots={false}
                                arrows
                                slidesToShow={2}
                                slidesToScroll={1}
                                className="w-[320px]"
                                prevArrow={<button className="text-black bg-black rounded-full p-2">←</button>}
                                nextArrow={<button className="text-white bg-black rounded-full p-2">→</button>}
                            >
                                {(item.secondary_image_urls || []).map((imgUrl, idx) => (
                                    <div key={idx} className="px-1">
                                        <Image
                                            src={imgUrl}
                                            width={120}
                                            height={170}
                                            className="object-cover rounded-md"
                                            preview={true}
                                        />
                                    </div>
                                ))}
                            </Carousel>

                        </List.Item>
                    )}
                />

                <div className="flex justify-end mt-4">
                    <Button type="primary" onClick={() => setIsModalOpen(false)}>
                        Đóng
                    </Button>
                </div>
            </Modal>
        </>
    );
}