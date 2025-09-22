import { Carousel, Col, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AddToCart, GetCart } from '../../apis/Cart/APICart';
import { verifyToken } from '../../apis/Authentication/APIAuth';
import { GetGundamDetailBySlug } from '../../apis/Gundams/APIGundam';

import { useCart } from '../../context/CartContext';

import Cookies from 'js-cookie';
import ShopInfo from './ShopInfo';
import ProductInfo from './ProductInfo';
import SuggestProduct from './SuggestProduct';


const GundamProductPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [detailGundam, setDetailGundam] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [idGundam, setIdGundam] = useState(null);
    const [loadingAdded, setLoadingAdded] = useState(false);
    const [added, setAdded] = useState(false);
    const [imageGundam, setImageGundam] = useState([]);
    const [shopId, setShopId] = useState([]);
    const [userId, setUserId] = useState("");
    const [disableBuy, setDisableBuy] = useState(false);
    const [selectedImage, setSelectedImage] = useState(imageGundam[0]);
    const { cartItems, addToCart, loading } = useCart();


    const [currentSlideImg, setCurrentSlideImg] = useState(0);



    // Fetch chi tiết sản phẩm
    useEffect(() => {
        const fetchDetailGundamBySlug = async (slug) => {
            try {
                const detailGundam = await GetGundamDetailBySlug(slug);
                console.log("detailGundam", detailGundam);

                // Mapping condition từ tiếng Anh sang tiếng Việt
                const conditionMapping = {
                    "new": "Hàng mới 100%",
                    "open box": "Đã mở hộp",
                    "used": "Đã qua sử dụng"
                };
                let gundamData = detailGundam?.data || {};
                // console.log("gundamData", gundamData);  

                let assessoriesData = detailGundam?.data?.accessories;
                if (gundamData.condition) {
                    gundamData.condition = conditionMapping[gundamData.condition] || gundamData.condition;
                }
                setDetailGundam(gundamData);
                setAccessories(assessoriesData);
                setIdGundam(gundamData?.gundam_id || null);
                setShopId(gundamData?.owner_id || []);
                const updatedImages = [gundamData?.primary_image_url || "", ...(gundamData?.secondary_image_urls || [])];
                setImageGundam(updatedImages);

            } catch (error) {
                console.log("Fail to fetch detail gundam: No data detected!");
            }
        };
        fetchDetailGundamBySlug(slug);
    }, [slug]);



    // Khi component mount, lấy danh sách sản phẩm từ API
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await GetCart(); // Gọi API lấy giỏ hàng từ DB
                const cartItems = response?.data || [];  // Đảm bảo có dữ liệu
                // console.log("cartItems", cartItems);

                if (cartItems.some(item => item?.gundam_id === idGundam)) {
                    setAdded(true); // Nếu sản phẩm đã có trong giỏ hàng thì đổi UI
                }
            } catch (error) {
                console.error("Lỗi khi lấy giỏ hàng:", error);
            }
        };
        fetchCartItems();
    }, [idGundam]);


    // Lấy thông tin User từ Cookie để nhận dạng items có phải của Shop?
    useEffect(() => {
        const Access_token = Cookies.get('access_token');
        if (Access_token) {
            try {
                verifyToken(Access_token).then(response => {
                    // console.log(response?.data);
                    setUserId(response?.data?.id);
                })
            } catch (error) {
                console.error("Lỗi từ API:", error);
            }
        }
    }, [])


    // Kiểm tra nếu shopId === userId thì disable nút
    useEffect(() => {
        if (shopId !== null && userId !== null && shopId === userId) {
            setDisableBuy(true);
        } else {
            setDisableBuy(false);
        }
    }, [shopId, userId]);

    // Handle Add To Cart
    const handleAddToCart = async (id) => {
        try {
            if (!userId) {
                message.error('Bạn cần phải Đăng nhập trước!');
                navigate('/member/login');
                return;
            }

            await addToCart({ id }); // Sử dụng hàm addToCart từ context
            setAdded(true);

        } catch (error) {
            message.error("Lỗi khi thêm vào giỏ hàng!");
            console.error("Error:", error);
        }
    };


    // Handle Buy Instant
    const handleBuyNow = async (id) => {
        try {
            if (!userId) {
                message.error('Bạn cần phải Đăng nhập trước!');
                navigate('/member/login');
                return;
            }

            // Check xem sản phẩm đã có trong giỏ hàng chưa
            const existingItem = cartItems.find(item => item.gundam_id === id);
            // console.log("cartItems", cartItems);
            // console.log("existingItem", existingItem);

            if (existingItem) {
                // Nếu đã có trong giỏ hàng, chuyển thẳng tới checkout
                navigate('/checkout');
            } else {
                // Nếu chưa có, thêm vào giỏ hàng rồi chuyển tới checkout
                await addToCart({ id });

                // Đợi một chút để đảm bảo state được cập nhật
                setTimeout(() => {
                    navigate('/checkout');
                }, 100);
            }

        } catch (error) {
            message.error("Có lỗi xảy ra khi xử lý giỏ hàng!");
            console.error("Error:", error);
        } finally {
            setLoadingAdded(false);
        }
    }

    // ************** Hàm Format Tiền Việt *****************
    const formatCurrencyVND = (price) => {
        if (!price) return "0 vnd";
        return price.toLocaleString("vi-VN");
    };

    // Cập nhật ảnh được chọn
    useEffect(() => {
        if (imageGundam.length > 0) {
            setSelectedImage(imageGundam[0]);
        }
    }, [imageGundam]);

    return (
        <div className="mt-32 p-6 bg-gray-100">
            <div className="wrapper mx-20">
                {/* Main Section */}
                <div className="top-section">
                    <Row gutter={24}>

                        {/* Image */}
                        <Col span={7}>
                            <div className="image-section sticky top-16">
                                {/* Main Carousel */}
                                <div className="bg-white shadow-md rounded-md overflow-hidden">
                                    <Carousel
                                        autoplay
                                        dots={false}
                                        arrows={true}
                                        autoplaySpeed={3000}
                                        effect="scrollx"
                                        afterChange={(current) => setCurrentSlideImg(current)}
                                        className="h-[500px]"
                                    >
                                        {imageGundam.map((image, index) => (
                                            <div key={index}>
                                                <img
                                                    src={image}
                                                    className="w-full h-[500px] object-contain bg-gray-50"
                                                    alt={`Product ${index + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>

                                {/* Thumbnail List */}
                                <div className="mt-4 overflow-auto bg-white shadow-md py-2 rounded-lg">
                                    <div className="flex gap-4 max-w-[320px]">
                                        {imageGundam.slice(0, 5).map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                className={`w-20 h-20 object-cover cursor-pointer rounded-lg border transition-all duration-300 ${currentSlideImg === index ? 'border-red-500' : 'border-gray-200'
                                                    }`}
                                                onClick={() => {
                                                    // Carousel không có goTo method dễ dàng, nên giữ như cũ
                                                    setSelectedImage(image);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Describe */}
                        <Col span={10}>
                            <div className="description-section">
                                <ProductInfo info={detailGundam} assessories={accessories} />
                            </div>
                        </Col>

                        {/* Add to card */}
                        <Col span={7}>
                            <div className='space-y-4 sticky top-16'>
                                <div className="p-4 border rounded-lg bg-white shadow-md space-y-3">
                                    {/* Product Name */}
                                    <h1 className="text-xl font-bold text-gray-900">{detailGundam?.name}</h1>

                                    {/* Price */}
                                    <div className="flex items-center space-x-4">
                                        <p className="text-2xl font-semibold text-red-500">
                                            Giá: {formatCurrencyVND(detailGundam?.price)}<small className='text-base underline'>đ</small>
                                        </p>
                                    </div>

                                    {/* Gundam Info */}
                                    <div className="space-y-2 text-sm">
                                        <p className="text-green-600 font-semibold">
                                            <span className="font-semibold text-black">Tình trạng:</span> {detailGundam.condition}
                                        </p>
                                    </div>

                                    {detailGundam.condition_description && (
                                        <div className="space-y-2 text-sm">
                                            <p className="text-green-600 font-semibold">
                                                <span className="font-semibold text-black">Mô tả tình trạng:</span> {detailGundam.condition_description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Buy Button */}
                                    {!disableBuy && (
                                        <button
                                            type="button"
                                            className="w-full py-3 rounded-lg font-semibold transition bg-red-500 text-white hover:bg-red-600"
                                            onClick={() => handleBuyNow(idGundam)}
                                        >
                                            Mua ngay
                                        </button>
                                    )}

                                    {/* Add to Cart Button */}
                                    {!disableBuy && (
                                        <button
                                            type="button"
                                            onClick={() => handleAddToCart(idGundam)}
                                            disabled={loadingAdded || added}
                                            className={`w-full py-3 rounded-lg font-semibold transition 
            ${added ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-300 text-black hover:bg-gray-400"}
        `}
                                        >
                                            {added ? "✅ Đã thêm vào giỏ hàng" : loadingAdded ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                                        </button>
                                    )}

                                </div>
                                {/* Seller Info */}
                                <div className="sticky">
                                    <ShopInfo shopID={shopId} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Suggested Products */}
                {/* <SuggestProduct /> */}
            </div>
        </div>
    );
};

export default GundamProductPage;