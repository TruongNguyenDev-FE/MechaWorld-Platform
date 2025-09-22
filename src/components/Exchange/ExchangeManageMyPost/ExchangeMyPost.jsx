import { useEffect, useState } from "react";
import { Layout, Card, Tabs, Typography, message, notification } from "antd";
import { useSelector } from "react-redux";

import PostsTable from "./PostsTable";
import OffersDrawer from "./OffersDrawer";
import ListGundamModal from "./ListGundamModal";
import OfferDetailModal from "./OfferDetailModal";

import { deleteExchangePost, getAllUserExchangePost, acceptOffer, rejectOffer } from "../../../apis/Exchange/APIExchange";
import { checkWallet } from "../../../apis/User/APIUser";

const { Content } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;

export default function ExchangeMyPost() {
    const [activeTab, setActiveTab] = useState("1");
    const [selectedPost, setSelectedPost] = useState(null);
    const [offersDrawerVisible, setOffersDrawerVisible] = useState(false);
    const [offerDetailModalVisible, setOfferDetailModalVisible] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [postOffers, setPostOffers] = useState([]);
    const [gunplasModalVisible, setGunplasModalVisible] = useState(false);
    const [userPost, setUserPost] = useState([]);

    const user = useSelector((state) => state.auth.user);
    const userId = useSelector((state) => state.auth.user?.id);

    // View post offers
    const viewOffers = (post) => {
        setPostOffers(post.offers);
        setSelectedPost(post);
        setOffersDrawerVisible(true);
    };

    // View gunplas in the post
    const viewGunplas = (post) => {
        setSelectedPost(post);
        setGunplasModalVisible(true);
    };

    // View offer details
    const viewOfferDetail = (offer, originalOffer = null) => {
        // console.log("Selected offer:", offer);
        // console.log("Original offer:", originalOffer);
        setSelectedOffer({
            ...offer,
            originalOffer: originalOffer // Lưu data gốc để dùng cho API
        });
        setOfferDetailModalVisible(true);
    };

    // Handle offer actions (accept/reject)
    const handleOfferAction = async (offerId, action) => {
        // console.log(`Offer ${offerId} ${action}`);

        if (action === "accept") {
            // Xử lý chấp nhận đề xuất
            await handleAcceptOffer(offerId);
        } else if (action === "reject") {
            // Xử lý từ chối đề xuất
            await handleRejectOffer(offerId);
        }
    };

    // Hàm xử lý chấp nhận đề xuất
    const handleAcceptOffer = async (offerId) => {
        try {
            // Tìm offer từ selectedOffer.originalOffer hoặc postOffers (data gốc)
            let currentOffer = null;

            if (selectedOffer?.originalOffer) {
                currentOffer = selectedOffer.originalOffer;
            } else {
                currentOffer = postOffers.find(offer => offer.id === offerId);
            }

            if (!currentOffer) {
                throw new Error("Không tìm thấy thông tin đề xuất");
            }

            // Kiểm tra số dư ví hiện tại nếu user phải bù trừ tiền
            if (currentOffer.payer_id === userId && currentOffer.compensation_amount > 0) {
                const walletResponse = await checkWallet(userId);
                const currentBalance = walletResponse?.data?.balance || 0;
                const requiredAmount = currentOffer.compensation_amount;

                if (currentBalance < requiredAmount) {
                    notification.error({
                        message: 'BẠN KHÔNG ĐỦ SỐ DƯ',
                        description: (
                            <div>
                                <div>Số dư hiện tại: <strong>{currentBalance.toLocaleString()}đ</strong></div>
                                <div>Số tiền cần thanh toán: <strong>{requiredAmount.toLocaleString()}đ</strong></div>
                            </div>
                        ),
                        duration: 5,
                    });
                    return;
                }
            }

            // Gọi API chấp nhận đề xuất với post_id và offer_id từ data gốc
            const res = await acceptOffer(currentOffer.post_id, currentOffer.id);

            if (res.status === 200) {
                notification.success({
                    message: 'CHẤP NHẬN ĐỀ XUẤT THÀNH CÔNG',
                    description: 'Đề xuất trao đổi đã được chấp nhận',
                });

                // Đóng modal
                setOfferDetailModalVisible(false);
                setOffersDrawerVisible(false);

                // Refresh danh sách bài viết
                await refreshUserPosts();

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

    // Hàm xử lý từ chối đề xuất
    const handleRejectOffer = async (offerId) => {
        try {
            // Tìm offer từ selectedOffer.originalOffer hoặc postOffers (data gốc)
            let currentOffer = null;

            if (selectedOffer?.originalOffer) {
                currentOffer = selectedOffer.originalOffer;
            } else {
                currentOffer = postOffers.find(offer => offer.id === offerId);
            }

            if (!currentOffer) {
                throw new Error("Không tìm thấy thông tin đề xuất");
            }

            // Gọi API từ chối đề xuất với post_id và offer_id từ data gốc
            const res = await rejectOffer(currentOffer.id);

            if (res.status === 200) {
                notification.success({
                    message: 'TỪ CHỐI ĐỀ XUẤT THÀNH CÔNG',
                    description: 'Đề xuất trao đổi đã được từ chối',
                });

                // Đóng modal
                setOfferDetailModalVisible(false);

                // Refresh danh sách offers trong drawer nếu đang mở
                if (offersDrawerVisible && selectedPost) {
                    const updatedOffers = postOffers.filter(offer => offer.id !== currentOffer.id);
                    setPostOffers(updatedOffers);
                }

                // Refresh danh sách bài viết
                await refreshUserPosts();
            }
        } catch (error) {
            console.error('Error rejecting offer:', error);
            notification.error({
                message: 'LỖI KHI TỪ CHỐI ĐỀ XUẤT',
                description: 'Có lỗi xảy ra, vui lòng thử lại',
            });
        }
    };

    // Hàm refresh danh sách bài viết
    const refreshUserPosts = async () => {
        try {
            const res = await getAllUserExchangePost();
            setUserPost(res.data);
        } catch (error) {
            console.error("Error refreshing user posts:", error);
        }
    };

    // Delete post
    const handleDeletePost = async (postId) => {
        try {
            // console.log(`Post ${postId} deleted`);
            const res = await deleteExchangePost(postId);

            if (res.status === 200) {
                message.success(`Đã xóa bài viết!`);
                await refreshUserPosts();
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            message.error("Có lỗi xảy ra khi xóa bài viết");
        }
    };

    useEffect(() => {
        refreshUserPosts();
    }, []);

    return (
        <Layout className="min-h-screen mx-auto bg-gray-100 mt-5">
            <Content className="w-[1200px] mx-auto mt-24 px-4 py-6">
                <Card className="shadow-md">
                    <Title level={3} className="text-center mb-6 uppercase">Quản Lý Bài Viết Trao Đổi Gundam</Title>

                    <Tabs centered activeKey={activeTab} onChange={setActiveTab} type="card" size="large">
                        <TabPane tab="Các bài viết của tôi" key="1">
                            <PostsTable
                                userPost={userPost}
                                onViewOffers={viewOffers}
                                onViewGunplas={viewGunplas}
                                onDeletePost={handleDeletePost}
                            />
                        </TabPane>
                    </Tabs>
                </Card>

                {/* Modals & Drawers */}
                <ListGundamModal
                    visible={gunplasModalVisible}
                    post={selectedPost}
                    onClose={() => setGunplasModalVisible(false)}
                />

                <OffersDrawer
                    visible={offersDrawerVisible}
                    post={selectedPost}
                    offers={postOffers}
                    onClose={() => setOffersDrawerVisible(false)}
                    onViewOfferDetail={viewOfferDetail}
                />

                <OfferDetailModal
                    open={offerDetailModalVisible}
                    offer={selectedOffer}
                    post={selectedPost}
                    onClose={() => setOfferDetailModalVisible(false)}
                    onAction={handleOfferAction}
                />
            </Content>
        </Layout>
    );
}