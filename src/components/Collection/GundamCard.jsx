import { Card, Typography, Tag, Button, Badge } from 'antd';
// import {
//     HeartOutlined,
//     HeartFilled,
//     StarOutlined,
//     StarFilled
// } from '@ant-design/icons';
import { getGradeColor } from './utils';

const GundamCard = ({ item, onClick, onToggleFavorite, onToggleWishlist }) => (
    <Card
        hoverable
        className="h-full flex flex-col"
        cover={
            <div className="bg-gray-100 flex items-center justify-center overflow-hidden h-48 relative">
                <img
                    alt={item.name}
                    src={item.primary_image_url}
                    className="object-cover h-full w-full"
                />
                {/* <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                        type="text"
                        shape="circle"
                        icon={item.is_favorite ? <HeartFilled style={{ color: '#f5222d' }} /> : <HeartOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(item.gundam_id);
                        }}
                        className="bg-white shadow-sm"
                    />
                    <Button
                        type="text"
                        shape="circle"
                        icon={item.is_wishlist ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(item.gundam_id);
                        }}
                        className="bg-white shadow-sm"
                    />
                </div> */}
                {item.is_rare && (
                    <Badge.Ribbon text="Hiếm" color="gold" className="z-10" />
                )}
            </div>
        }
        onClick={() => onClick(item)}
    >
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
                <Typography.Title level={5} className="m-0 text-gray-800 truncate" style={{ maxWidth: '70%' }}>
                    {item.name}
                </Typography.Title>
                <Tag color={getGradeColor(item.grade)}>{item.scale}</Tag>
            </div>
            <div className="mb-3 flex flex-wrap gap-1">
                <Tag color={getGradeColor(item.grade)}>{item.grade}</Tag>
                {item.version && <Tag color="blue">{item.version}</Tag>}
            </div>
            <div className="mt-auto flex justify-between items-center">
                <Typography.Text className="text-gray-600">{item.series}</Typography.Text>
            </div>
        </div>
    </Card>
);

export default GundamCard;