import  { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { getUserAuctionParticipation, getUserAuctionBids } from "../../../apis/User/APIUser";
import { useNavigate } from 'react-router-dom';
import AuctionPaymentModal from '../../Aution/User/AuctionPaymentModal';

const AuctionParticipation = () => {
    const user = useSelector((state) => state.auth.user);
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [bidHistory, setBidHistory] = useState([]);
    const [loadingBids, setLoadingBids] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const [paymentModalVisible, setPaymentModalVisible] = useState(false);

    // Fetch danh sách đấu giá tham gia
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setLoading(true);
                const response = await getUserAuctionParticipation();
                setAuctions(response.data || []);
            } catch (err) {
                setError('Không thể tải danh sách đấu giá');
                console.error('Error fetching auctions:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAuctions();
        }
    }, [user]);

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Format ngày tháng
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Lấy trạng thái với màu sắc
    const getStatusInfo = (status) => {
        const statusMap = {
            'active': { text: 'Đang diễn ra', color: 'bg-green-100 text-green-800' },
            'completed': { text: 'Hoàn tất', color: 'bg-blue-100 text-blue-800' },
            'cancelled': { text: 'Đã hủy', color: 'bg-red-100 text-red-800' },
            'pending': { text: 'Chờ bắt đầu', color: 'bg-yellow-100 text-yellow-800' },
            'ended': { text: 'Đã kết thúc', color: 'bg-yellow-100 text-yellow-800' }
        };
        return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    };

    // Kiểm tra người dùng có thắng đấu giá không
    // const isWinner = (auction) => {
    //     return auction.winning_bid_id && 
    //            bidHistory.some(bid => bid.id === auction.winning_bid_id && bid.bidder_id === user.id);
    // };

    // Xử lý xem chi tiết
    const handleViewDetails = async (auction) => {
        try {
            setLoadingBids(true);
            setSelectedAuction(auction);
            setShowModal(true);
            
            const response = await getUserAuctionBids(auction.id);
            setBidHistory(response.data || []);
        } catch (err) {
            console.error('Error fetching bid history:', err);
            setBidHistory([]);
        } finally {
            setLoadingBids(false);
        }
    };

    // Đóng modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedAuction(null);
        setBidHistory([]);
    };

    // Xử lý xác nhận thanh toán
    const handleConfirmPayment = (auction) => {
        // TODO: Implement payment confirmation logic
        alert(`Xác nhận thanh toán cho đấu giá: ${auction.gundam_snapshot.name}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải danh sách đấu giá...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">❌</div>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Đấu Giá Gundam Đã Tham Gia
                    </h1>
                    <p className="text-gray-600">
                        Danh sách các cuộc đấu giá Gundam mà bạn đã tham gia
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng tham gia</p>
                                <p className="text-2xl font-semibold text-gray-900">{auctions.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {auctions.filter(a => a.auction.status === 'completed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Đang diễn ra</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {auctions.filter(a => a.auction.status === 'active').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auction List */}
                {auctions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🤖</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Chưa tham gia đấu giá nào
                        </h3>
                        <p className="text-gray-600">
                            Bạn chưa tham gia bất kỳ cuộc đấu giá Gundam nào
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {auctions.map((item) => {
                            const { auction } = item;
                            const statusInfo = getStatusInfo(auction.status);
                            
                            return (
                                <div key={auction.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    {/* Image */}
                                    <div className="relative">
                                        <img
                                            src={auction.gundam_snapshot.image_url}
                                            alt={auction.gundam_snapshot.name}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-gundam.jpg';
                                            }}
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                {statusInfo.text}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {auction.gundam_snapshot.name}
                                        </h3>
                                        
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span className="font-medium">Phân khúc:</span>
                                                <span className="ml-2">{auction.gundam_snapshot.grade}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span className="font-medium">Tỷ lệ:</span>
                                                <span className="ml-2">{auction.gundam_snapshot.scale}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span className="font-medium">Giá hiện tại:</span>
                                                <span className="ml-2 font-semibold text-blue-600">
                                                    {formatPrice(auction.current_price)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Bắt đầu:</span>
                                                <div className="text-gray-800">{formatDate(auction.start_time)}</div>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Kết thúc:</span>
                                                <div className="text-gray-800">{formatDate(auction.end_time)}</div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => navigate(`/auction/${auction.id}`)}
                                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                                            >
                                                Xem Chi Tiết
                                            </button>
                                            <button
                                                onClick={() => handleViewDetails(auction)}
                                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                                            >
                                                Xem Lịch Sử Cọc
                                            </button>
                                            
                                            {/* Payment confirmation button for winners */}
                                            {/* {auction.status === 'ended' && auction.winning_bid_id && (
                                                <button
                                                    onClick={() => handleConfirmPayment(auction)}
                                                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
                                                >
                                                    🎉 Xác Nhận Thanh Toán
                                                </button>
                                            )} */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal for bid history */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Lịch Sử Đấu Giá
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            {selectedAuction && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {selectedAuction.gundam_snapshot.name}
                                </p>
                            )}
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {loadingBids ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Đang tải lịch sử...</span>
                                </div>
                            ) : bidHistory.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-4xl mb-4">💰</div>
                                    <p className="text-gray-600 text-lg">
                                        Bạn chưa đặt cọc cho đấu giá này
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 mb-4">
                                        Lịch sử đặt cọc của bạn ({bidHistory.length} lần)
                                    </h4>
                                    {bidHistory
                                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                        .map((bid, index) => (
                                        <div
                                            key={bid.id}
                                            className={`p-4 rounded-lg border ${
                                                selectedAuction.winning_bid_id === bid.id
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'bg-gray-50 border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-lg font-semibold text-gray-900">
                                                            {formatPrice(bid.amount)}
                                                        </span>
                                                        {selectedAuction.winning_bid_id === bid.id && (
                                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                                                🏆 Thắng cuộc
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {formatDate(bid.created_at)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm text-gray-500">
                                                        Lần đặt #{bidHistory.length - index}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t">
                            <button
                                onClick={closeModal}
                                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuctionParticipation;