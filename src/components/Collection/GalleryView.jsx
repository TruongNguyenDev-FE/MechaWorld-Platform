import { Typography, Tag, Badge } from 'antd';
import { HeartFilled, StarFilled } from '@ant-design/icons';
import { getGradeColor } from './utils';

const GalleryView = ({ data, showDetailModal }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {data.map((item) => (
                <div
                    key={item.gundam_id}
                    className="aspect-square relative cursor-pointer overflow-hidden group"
                    onClick={() => showDetailModal(item)}
                >
                    <img
                        src={item.primary_image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Typography.Text className="text-white block">{item.name}</Typography.Text>
                        <div className="flex justify-between items-center">
                            <Tag color={getGradeColor(item.grade)}>{item.grade}</Tag>
                            <div className="flex gap-1">
                                {item.is_favorite && <HeartFilled style={{ color: '#f5222d' }} />}
                                {item.is_wishlist && <StarFilled style={{ color: '#faad14' }} />}
                            </div>
                        </div>
                    </div>
                    {item.is_rare && (
                        <Badge.Ribbon text="Hiếm" color="gold" className="z-10" />
                    )}
                </div>
            ))}
        </div>
    );
};

export default GalleryView;