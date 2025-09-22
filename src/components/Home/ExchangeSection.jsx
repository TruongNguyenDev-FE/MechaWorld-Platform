import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Typography, Image, Carousel } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from "moment/min/moment-with-locales";

const { Text, Paragraph } = Typography;

moment.locale("vi");

const ExchangeSection = ({ exchanges }) => {
    const conditionMap = {
        "new": "Mới",
        "open box": "Hộp đã mở",
        "used": "Đã sử dụng"
    };

    return (
        <div data-aos="fade-right" data-duration="1000" data-aos-once="true" className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">BÀI VIẾT TRAO ĐỔI GUNDAM MỚI NHẤT</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exchanges.map((exchange) => {
                    const translatedItems = exchange.exchange_post_items.map(item => ({
                        ...item,
                        displayCondition: conditionMap[item.condition] || item.condition
                    }));

                    return (
                        <div key={exchange.exchange_post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            {/* Header with user info */}
                            <div className="p-4 border-b">
                                <div className="flex items-center gap-3">
                                    <Avatar 
                                        size={40} 
                                        src={exchange.poster.avatar_url} 
                                        icon={!exchange.poster.avatar_url && <UserOutlined />} 
                                    />
                                    <div>
                                        <Text strong className="block">{exchange.poster.full_name}</Text>
                                        <Text type="secondary" className="flex items-center text-xs">
                                            <ClockCircleOutlined className="mr-1" /> 
                                            {moment(exchange.exchange_post.created_at).fromNow()}
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                {/* Image carousel */}
                                <Carousel 
                                    dots={false} 
                                    className="mb-4 rounded-md overflow-hidden"
                                >
                                    {exchange.exchange_post.post_image_urls.map((imageUrl, index) => (
                                        <div key={index}>
                                            <Image
                                                src={imageUrl}
                                                width="100%"
                                                height={200}
                                                className="object-cover"
                                                preview={false}
                                            />
                                        </div>
                                    ))}
                                </Carousel>

                                {/* Post content */}
                                <Paragraph 
                                    ellipsis={{ rows: 3, expandable: true }} 
                                    className="text-gray-600 mb-4"
                                >
                                    {exchange.exchange_post.content}
                                </Paragraph>

                                {/* Exchange items preview */}
                                <div className="mb-4">
                                    <Text strong className="block mb-2">Gundam trao đổi:</Text>
                                    <div className="space-y-2">
                                        {translatedItems.slice(0, 2).map((item, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <Image
                                                    src={item.primary_image_url}
                                                    width={60}
                                                    height={60}
                                                    className="object-cover rounded"
                                                    preview={false}
                                                />
                                                <div>
                                                    <Text strong className="block text-sm">{item.name}</Text>
                                                    <Text type="secondary" className="text-xs">
                                                        {item.displayCondition}
                                                    </Text>
                                                </div>
                                            </div>
                                        ))}
                                        {translatedItems.length > 2 && (
                                            <Text type="secondary" className="text-sm">
                                                + {translatedItems.length - 2} sản phẩm khác...
                                            </Text>
                                        )}
                                    </div>
                                </div>

                                {/* Action button */}
                                <Link 
                                    to={`/exchange/list`}
                                    className="block text-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* View all button */}
            <div className="text-center mt-6">
                <Link 
                    to="/exchange/list" 
                    className="inline-block px-6 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
                >
                    Xem tất cả bài viết trao đổi
                </Link>
            </div>
        </div>
    );
};

export default ExchangeSection;