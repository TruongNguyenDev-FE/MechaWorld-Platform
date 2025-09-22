import { useState } from 'react';
import { Modal, Button, Collapse, Descriptions, Typography, Tabs, Card } from 'antd';
import {
    InfoCircleOutlined,
    LeftOutlined,
    RightOutlined,
    PlusOutlined,
    EditOutlined,
} from '@ant-design/icons';
// import { getGradeColor } from './utils';

const DetailModal = ({ visible, product, onCancel, toggleFavorite, toggleWishlist,handleUpdate }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // const [favorited, setFavorited] = useState(product?.is_favorite || false);
    // const [wishlisted, setWishlisted] = useState(product?.is_wishlist || false);

    // useEffect(() => {
    //     if (product) {
    //         setFavorited(product.is_favorite || false);
    //         setWishlisted(product.is_wishlist || false);
    //     }
    //     setCurrentImageIndex(0);
    // }, [product]);

    if (!product) return null;

    const getImageList = () => {
        const images = [product.primary_image_url];
        if (product.secondary_image_urls && product.secondary_image_urls.length > 0) {
            return images.concat(product.secondary_image_urls);
        }
        return images;
    };

    const prevImage = () => {
        const images = getImageList();
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const nextImage = () => {
        const images = getImageList();
        setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    // const handleToggleFavorite = (e) => {
    //     e.stopPropagation();
    //     setFavorited(!favorited);
    //     toggleFavorite(product.gundam_id);
    // };

    // const handleToggleWishlist = (e) => {
    //     e.stopPropagation();
    //     setWishlisted(!wishlisted);
    //     toggleWishlist(product.gundam_id);
    // };

    return (
        <Modal
            title={
                <div className="flex justify-between items-center">
                    <div className="text-xl font-medium">{product.name}</div>
                    {/* <div className="flex gap-2">
                        <Tooltip title={favorited ? "Bỏ yêu thích" : "Yêu thích"}>
                            <Button
                                type="text"
                                shape="circle"
                                icon={favorited ? <HeartFilled style={{ color: '#f5222d' }} /> : <HeartOutlined />}
                                onClick={handleToggleFavorite}
                            />
                        </Tooltip>
                        <Tooltip title={wishlisted ? "Bỏ khỏi danh sách mong muốn" : "Thêm vào danh sách mong muốn"}>
                            <Button
                                type="text"
                                shape="circle"
                                icon={wishlisted ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                                onClick={handleToggleWishlist}
                            />
                        </Tooltip>
                    </div> */}
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Đóng
                </Button>,
                <Button key="edit" type="primary" className='bg-blue-500' icon={<EditOutlined />} onClick={() => {handleUpdate()}}>
                    Chỉnh sửa
                </Button>
            ]}
            width={800}
            centered
        >
            <div className="max-h-screen h-[600px] overflow-auto px-2 py-4">
                {/* Image Gallery */}
                <div className="flex mb-6">
                    <div className="w-4/5 pr-2">
                        <div className="relative w-full h-80 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <img
                                src={getImageList()[currentImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                            {getImageList().length > 1 && (
                                <>
                                    <Button
                                        shape="circle"
                                        icon={<LeftOutlined />}
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 opacity-80"
                                    />
                                    <Button
                                        shape="circle"
                                        icon={<RightOutlined />}
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 opacity-80"
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    {getImageList().length > 1 && (
                        <div className="w-1/5 pl-2 flex flex-col gap-2 max-h-80 overflow-y-auto">
                            {getImageList().map((img, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                                        } rounded`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <img
                                        src={img}
                                        alt={`Ảnh ${index + 1}`}
                                        className="w-full h-16 object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Thông tin chi tiết" key="1">
                        <Collapse defaultActiveKey={['1', '2', '3', '4']} className="mb-4">
                            <Collapse.Panel
                                header={<span className="font-medium"><InfoCircleOutlined /> THÔNG TIN CƠ BẢN</span>}
                                key="1"
                            >
                                <Descriptions
                                    bordered
                                    size="small"
                                    column={1}
                                    labelStyle={{ fontWeight: 'bold', width: '40%' }}
                                >
                                    <Descriptions.Item label="Tên mô hình">{product.name}</Descriptions.Item>
                                    <Descriptions.Item label="Dòng phim">{product.series}</Descriptions.Item>
                                    <Descriptions.Item label="Phiên bản">{product.version}</Descriptions.Item>
                                    <Descriptions.Item label="Nhà sản xuất">{product.manufacturer}</Descriptions.Item>
                                    <Descriptions.Item label="Năm sản xuất">{product.release_year}</Descriptions.Item>
                                </Descriptions>
                            </Collapse.Panel>

                            <Collapse.Panel
                                header={<span className="font-medium"><InfoCircleOutlined /> THÔNG SỐ KỸ THUẬT</span>}
                                key="2"
                            >
                                <Descriptions
                                    bordered
                                    size="small"
                                    column={1}
                                    labelStyle={{ fontWeight: 'bold', width: '40%' }}
                                >
                                    <Descriptions.Item label="Grade">{product.grade}</Descriptions.Item>
                                    <Descriptions.Item label="Tỷ lệ">{product.scale}</Descriptions.Item>
                                    <Descriptions.Item label="Khối lượng">{product.weight} (g)</Descriptions.Item>
                                    <Descriptions.Item label="Vật liệu">{product.material}</Descriptions.Item>
                                    <Descriptions.Item label="Tổng số mảnh">{product.quantity}</Descriptions.Item>
                                    {/* <Descriptions.Item label="Phụ kiện thêm">{product.quantity}</Descriptions.Item> */}
                                    {product.accessories && (
                                        <Descriptions.Item label="Phụ kiện thêm">
                                            {product.accessories.map((item, index) => (
                                                <div className='text-gray-500' key={index}>+ {item.name} x {item.quantity}</div>
                                            ))}
                                        </Descriptions.Item>
                                    )}
                                </Descriptions>
                            </Collapse.Panel>

                            <Collapse.Panel
                                header={<span className="font-medium"><InfoCircleOutlined /> THÔNG TIN MUA HÀNG & TÌNH TRẠNG</span>}
                                key="3"
                            >
                                <Descriptions
                                    bordered
                                    size="small"
                                    column={1}
                                    labelStyle={{ fontWeight: 'bold', width: '40%' }}
                                >
                                    {product.price > 0 && (
                                        <Descriptions.Item label="Giá mua">
                                            {product.price.toLocaleString('vi-VN')}đ
                                        </Descriptions.Item>
                                    )}
                                    {product.purchaseDate && (
                                        <Descriptions.Item label="Ngày mua">{product.purchaseDate}</Descriptions.Item>
                                    )}
                                    <Descriptions.Item label="Tình trạng">
                                        {product.condition === "new" ? "Mới" : "Đã qua sử dụng"}
                                    </Descriptions.Item>
                                    {product.condition_description && (
                                        <Descriptions.Item label="Mô tả tình trạng">
                                            {product.condition_description}
                                        </Descriptions.Item>
                                    )}
                                </Descriptions>
                            </Collapse.Panel>

                            {product.description && (
                                <Collapse.Panel
                                    header={<span className="font-medium"><InfoCircleOutlined /> MÔ TẢ SẢN PHẨM </span>}
                                    key="4"
                                >
                                    <Typography.Paragraph className="p-3 bg-gray-50 rounded-md">
                                        {product.description}
                                    </Typography.Paragraph>
                                </Collapse.Panel>
                            )}
                        </Collapse>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </Modal>
    );
};

export default DetailModal;