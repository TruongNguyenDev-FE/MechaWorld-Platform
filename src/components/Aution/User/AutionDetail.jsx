import React, { useEffect, useState, useRef } from 'react';
import { Body, Caption, Container, Title } from '../Design';
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from 'react-icons/io';
import { commonClassNameOfInput } from '../Design';
import { AiOutlinePlus } from 'react-icons/ai';
import { GetListAuctionDetial, PlaceBid, PayForWinningBid } from '../../../apis/Auction/APIAuction';
import { getUserAddresses } from '../../../apis/User/APIUser';
import { getUser } from '../../../apis/User/APIUser';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message, Modal, Form, Input, Radio, Divider, Carousel, Descriptions, Collapse, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import axios from 'axios';
import { formatToCustomTime, formatDisplayTime } from './dateFormat';
import AuctionPaymentModal from './AuctionPaymentModal';
import ParticipantsTable from './ParticipantsTable';
import { useSelector } from 'react-redux';
import { GetGundamById } from '../../../apis/Gundams/APIGundam';

const AuctionDetail = () => {

  const userId = useSelector((state) => state.auth.user.id);

  const { auctionID } = useParams();
  const [auctionDetail, setAuctionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("auctionHistory");
  const [bidPrice, setBidPrice] = useState('');
  const [bidError, setBidError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [winnerInfo, setWinnerInfo] = useState(null);
  const eventSourceRef = useRef(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentForm] = Form.useForm();
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState('');
  const [bidHistory, setBidHistory] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [newBids, setNewBids] = useState([]);

  const [currentSlideImg, setCurrentSlideImg] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const carouselRef = useRef(null);

  const [imageGundam, setImageGundam] = useState([]);
  const [detailGundam, setDetailGundam] = useState("");


  const tbodyRef = useRef(null);
  const navigate = useNavigate();

  const useCountdown = (targetDate) => {
    const [countdown, setCountdown] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });

    useEffect(() => {
      if (!targetDate) return;

      const formattedDate = formatToCustomTime(targetDate);
      const targetTime = new Date(formattedDate).getTime();

      if (isNaN(targetTime)) {
        console.error('Invalid targetDate:', targetDate);
        return;
      }

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
          clearInterval(interval);
          setIsAuctionEnded(true);
          return;
        }

        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [targetDate]);

    return countdown;
  };

  const countdown = useCountdown(
    auctionDetail?.auction?.status === 'ended'
      ? auctionDetail?.auction?.actual_end_time
      : auctionDetail?.auction?.end_time
  );

  const normalizeBidData = (bid) => ({
    id: bid.id || bid.bid_id,
    type: 'bid',
    timestamp: bid.created_at || bid.timestamp || new Date().toISOString(),
    price: bid.amount || bid.bid_amount || 0,
    user: bid.user || bid.bidder || {
      id: bid.bidder_id || bid.user_id,
      full_name: bid.full_name || 'Người dùng ẩn danh',
      avatar_url: bid.avatar_url || '/default-avatar.png'
    },
    isNew: false
  });

  const fetchDetailGundamById = async (gundamId) => {
    try {
      const GetGundamDetailById = await GetGundamById(gundamId);
      console.log("GetGundamDetailById", GetGundamDetailById);


      let gundamData = GetGundamDetailById?.data || {};
      setDetailGundam(gundamData)

      const updatedImages = [gundamData?.primary_image_url || "", ...(gundamData?.secondary_image_urls || [])];
      setImageGundam(updatedImages);
      console.log("gundam", detailGundam);


    } catch (error) {
      console.log(error);
    }
  }



  const fetchAuctionDetail = async () => {
    try {
      setLoading(true);
      const response = await GetListAuctionDetial(auctionID);
      const data = response.data;

      if (!data.auction?.gundam_snapshot) {
        message.warning('Thông tin sản phẩm chưa có sẵn');
      }

      const endTime = data.auction?.end_time;
      const formattedEndTime = formatToCustomTime(endTime);
      const isValidEndTime = endTime && !isNaN(new Date(formattedEndTime).getTime());

      setAuctionDetail(data);

      // Gọi fetchDetailGundamById sau khi có auctionDetail
      if (data?.auction?.gundam_id) {
        await fetchDetailGundamById(data.auction.gundam_id);
      }

      setParticipants(data.auction_participants || []);
      setIsAuctionEnded(
        data.auction?.status === 'ended' ||
        (isValidEndTime && new Date(formattedEndTime).getTime() < Date.now())
      );

      if (data.auction?.winning_bid_id) {
        const winningBid = data.auction_bids?.find((bid) => bid.id === data.auction.winning_bid_id);
        if (winningBid) {
          try {
            const userResponse = await getUser(winningBid.bidder_id);
            setWinnerInfo({
              winner: userResponse.data,
              finalPrice: winningBid.amount,
              reason: data.auction.status
            });
          } catch (error) {
            setWinnerInfo({
              winner: { full_name: 'Người dùng ẩn danh' },
              finalPrice: winningBid.amount,
              reason: data.auction.status
            });
          }
        }
      }

      if (data.auction_bids) {
        const mappedBids = data.auction_bids.map(normalizeBidData);

        const joinEvents = (data.auction_participants || []).map(p => ({
          id: `participant-${p.user_id}`,
          type: 'participant_joined',
          timestamp: p.created_at,
          user: p.user || {
            id: p.user_id,
            full_name: 'Người dùng ẩn danh',
            avatar_url: '/default-avatar.png'
          },
          price: null,
          isNew: false
        }));

        setBidHistory(
          [...mappedBids, ...joinEvents].sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
          )
        );
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết đấu giá:', error);
      message.error('Không thể tải thông tin đấu giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionDetail();
  }, [auctionID]);



  useEffect(() => {
    if (tbodyRef.current && bidHistory.some(bid => bid.isNew)) {
      tbodyRef.current.scrollTop = 0;
    }
  }, [bidHistory]);

  const fetchUserAddresses = async () => {
    try {
      const userId = JSON.parse(decodeURIComponent(Cookies.get('user'))).id;
      const response = await getUserAddresses(userId);
      setUserAddresses(response.data);
      const primaryAddress = response.data.find(addr => addr.is_primary);
      setSelectedAddress(primaryAddress || response.data[0]);
    } catch (error) {
      console.error("Failed to fetch user addresses:", error);
    }
  };

  const calculateShippingFee = async () => {
    if (!selectedAddress) return;

    try {
      const shopAddress = {
        district_id: 1454,
        ward_code: '21012'
      };

      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
        {
          from_district_id: shopAddress.district_id,
          from_ward_code: shopAddress.ward_code,
          to_district_id: selectedAddress.ghn_district_id,
          to_ward_code: selectedAddress.ghn_ward_code,
          service_id: 0,
          service_type_id: 2,
          weight: 200,
          insurance_value: winnerInfo?.finalPrice || 0,
          coupon: null
        },
        {
          headers: {
            'Content-Type': 'application/json',
            token: import.meta.env.VITE_GHN_TOKEN_API,
            shop_id: import.meta.env.VITE_GHN_SHOP_ID
          }
        }
      );

      const feeData = response.data.data;
      setShippingFee(feeData.total);

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      setExpectedDeliveryTime(deliveryDate.toISOString());
    } catch (error) {
      console.error('Lỗi khi tính phí vận chuyển:', error);
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 3);
      setExpectedDeliveryTime(fallbackDate.toISOString());
      setShippingFee(30000);
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      setPaymentProcessing(true);

      if (!selectedAddress?.id) {
        message.error('Vui lòng chọn địa chỉ nhận hàng!');
        return;
      }

      const values = await paymentForm.validateFields();

      const paymentData = {
        delivery_fee: shippingFee,
        expected_delivery_time: formatToCustomTime(expectedDeliveryTime),
        note: values.note,
        user_address_id: selectedAddress.id
      };

      await PayForWinningBid(auctionID, paymentData);
      message.success('Thanh toán thành công!');
      setPaymentModalVisible(false);
      navigate('/member/profile/orders/regular-auction');
      // fetchAuctionDetail();
    } catch (error) {
      console.error('Payment error:', error);
      message.error(error.response?.data?.message || 'Lỗi khi thanh toán');
    } finally {
      setPaymentProcessing(false);
    }
  };

  useEffect(() => {
    if (!auctionID || isAuctionEnded) return;

    const connect = () => {
      setConnectionStatus('connecting');
      try {
        const url = `https://gundam-platform-api.fly.dev/v1/auctions/${auctionID}/stream`
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setConnectionStatus('connected');
        };

        eventSource.onerror = () => {
          setConnectionStatus('error');
          eventSource.close();
          setTimeout(connect, 5000);
        };

        eventSource.addEventListener('new_bid', (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('New bid received:', data);

            const newBid = normalizeBidData({
              ...data,
              isNew: true
            });

            setNewBids(prev => [...prev, newBid.id]);
            setTimeout(() => {
              setNewBids(prev => prev.filter(id => id !== newBid.id));
            }, 1500);

            setBidHistory(prev => {
              const updatedHistory = prev.map(bid => ({ ...bid, isNew: false }));
              return [newBid, ...updatedHistory];
            });

            setAuctionDetail(prev => ({
              ...prev,
              auction: {
                ...prev.auction,
                current_price: data.bid_amount,
                total_bids: data.total_bids
              }
            }));

            // Sửa ở đây: Sử dụng functional update để tránh trùng lặp người tham gia
            setParticipants(prevParticipants => {
              const participantIds = new Set(prevParticipants.map(p => p.user_id));
              if (!participantIds.has(data.bidder.id)) {
                return [
                  ...prevParticipants,
                  {
                    id: data.bidder.id,
                    user_id: data.bidder.id,
                    created_at: new Date().toISOString(),
                    is_refunded: false,
                    user: data.bidder
                  }
                ];
              }
              return prevParticipants;
            });

          } catch (e) {
            console.error('Lỗi xử lý bid mới:', e);
          }
        });

        eventSource.addEventListener('auction_ended', (event) => {
          try {
            const data = JSON.parse(event.data);
            setIsAuctionEnded(true);
            setWinnerInfo({
              winner: data.winner || { full_name: "Người dùng ẩn danh" },
              finalPrice: data.final_price,
              reason: data.reason
            });
            eventSource.close();
          } catch (e) {
            console.error("Error parsing end event:", e);
          }
        });

        // Lắng nghe sự kiện new_participant
        eventSource.addEventListener('new_participant', (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('New participant event:', data);

            const newParticipantRaw = data.new_participant;

            // Tạo object theo đúng cấu trúc participants
            const newParticipant = {
              id: newParticipantRaw.id,
              user_id: newParticipantRaw.id, // dùng id làm user_id
              created_at: newParticipantRaw.created_at || new Date().toISOString(),
              is_refunded: false,
            };

            // Cập nhật danh sách người tham gia
            setParticipants(prev => [...prev, newParticipant]);

            // Cập nhật tổng số
            setAuctionDetail(prev => ({
              ...prev,
              auction: {
                ...prev.auction,
                total_participants: data.total_participants
              }
            }));

            // Thêm vào lịch sử (nếu cần)
            setBidHistory(prev => [
              ...prev,
              {
                type: 'participant_joined',
                timestamp: new Date().toISOString(),
                user: { id: newParticipant.user_id }
              }
            ]);

          } catch (e) {
            console.error("Error parsing new_participant event:", e);
          }
        });

        return () => eventSource.close();
      } catch (error) {
        console.error('SSE connection error:', error);
        setConnectionStatus('failed');
      }
    };

    const cleanup = connect();

    return () => {
      if (cleanup && typeof cleanup === 'function') cleanup();
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [auctionID, isAuctionEnded]);

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleBidChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Chỉ giữ số
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Thêm dấu phẩy

    setBidPrice(value);

    if (!value) return setBidError('');

    const numericValue = Number(value.replace(/,/g, ''));
    const minBid = (auctionDetail?.auction?.current_price || 0) +
      (auctionDetail?.auction?.bid_increment || 0);

    setBidError(numericValue < minBid ?
      `Giá đấu phải tối thiểu ${minBid.toLocaleString()} VNĐ` : '');
  };

  // Thay đổi handleSubmitBid
  const handleSubmitBid = async (e) => {
    e.preventDefault();
    if (bidError || !bidPrice || isAuctionEnded || !auctionDetail) return;

    try {
      setIsSubmitting(true);
      await PlaceBid(auctionID, Number(bidPrice.replace(/,/g, '')));
      message.success("Đặt giá thành công!");
      setBidPrice('');
    } catch (error) {
      const apiError = error?.response?.data?.error;
      if (apiError === "seller cannot bid on their own auction") {
        message.error("Không thể đặt giá trong phiên của mình");
      } else {
        message.error(apiError || "Đặt giá thất bại");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (winnerInfo && paymentModalVisible) {
      fetchUserAddresses();
    }
  }, [paymentModalVisible]);

  useEffect(() => {
    if (selectedAddress && winnerInfo) {
      calculateShippingFee();
    }
  }, [selectedAddress, winnerInfo]);

  if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;
  if (!auctionDetail || !auctionDetail.auction.gundam_snapshot) {
    return <div className="text-center py-10 text-red-500">Không tìm thấy thông tin đấu giá hoặc sản phẩm</div>;
  }

  const isAuctionTrulyEnded = isAuctionEnded || ['ended', 'completed'].includes(auctionDetail.auction.status);
  const currentUserId = Cookies.get('user') ? JSON.parse(decodeURIComponent(Cookies.get('user'))).id : null;
  const isCurrentUserWinner = currentUserId === winnerInfo?.winner?.id;
  const sortedBidHistory = [...bidHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 mt-32">

        {/* Main Content */}
        <div className="p-6 rounded-lg shadow-lg bg-white grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image Gallery & Product Info */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
                <Carousel
                  ref={carouselRef}
                  autoplay={!isAutoplayPaused}
                  dots={false}
                  arrows={true}
                  autoplaySpeed={3000}
                  className="h-96"
                  afterChange={(current) => setCurrentSlideImg(current)}
                >
                  {imageGundam.map((image, index) => (
                    <div key={index} className="h-96">
                      <img
                        src={image}
                        className="w-full h-full object-contain bg-gray-50"
                        alt={`Product ${index + 1}`}
                      />
                    </div>
                  ))}
                </Carousel>

                {/* Image Controls */}
                <div className="absolute top-4 right-4 shadow-lg flex gap-2">
                  <div className="bg-black/50 text-white px-3 py-2 rounded-full text-sm">
                    {currentSlideImg + 1}/{imageGundam.length}
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex justify-evenly gap-2 overflow-x-auto">
                  {imageGundam.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      className={`w-20 h-20  object-cover rounded border-2 cursor-pointer transition-all flex-shrink-0 ${currentSlideImg === index
                        ? 'border-blue-500 opacity-100'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                        }`}
                      onClick={() => {
                        setCurrentSlideImg(index);
                        carouselRef.current?.goTo(index);
                      }}
                      alt={`Thumb ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Gundam Specifications */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-white-50">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  🤖 Thông tin chi tiết Gundam
                </h3>
              </div>

              <div className="p-6">
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
                      <Descriptions.Item label="Tên mô hình">{detailGundam.name}</Descriptions.Item>
                      <Descriptions.Item label="Dòng phim">{detailGundam.series}</Descriptions.Item>
                      <Descriptions.Item label="Phiên bản">{detailGundam.version}</Descriptions.Item>
                      <Descriptions.Item label="Nhà sản xuất">{detailGundam.manufacturer}</Descriptions.Item>
                      <Descriptions.Item label="Năm sản xuất">{detailGundam.release_year}</Descriptions.Item>
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
                      <Descriptions.Item label="Grade">{detailGundam.grade}</Descriptions.Item>
                      <Descriptions.Item label="Tỷ lệ">{detailGundam.scale}</Descriptions.Item>
                      <Descriptions.Item label="Khối lượng">{detailGundam.weight} (g)</Descriptions.Item>
                      <Descriptions.Item label="Vật liệu">{detailGundam.material}</Descriptions.Item>
                      <Descriptions.Item label="Tổng số mảnh">{detailGundam.quantity}</Descriptions.Item>
                      {detailGundam.accessories && (
                        <Descriptions.Item label="Phụ kiện thêm">
                          {detailGundam.accessories.map((item, index) => (
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
                      <Descriptions.Item label="Tình trạng">
                        {detailGundam.condition === "new" ? "Mới" : "Đã qua sử dụng"}
                      </Descriptions.Item>
                      {detailGundam.condition_description && (
                        <Descriptions.Item label="Mô tả tình trạng">
                          {detailGundam.condition_description}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  </Collapse.Panel>

                  {detailGundam.description && (
                    <Collapse.Panel
                      header={<span className="font-medium"><InfoCircleOutlined /> MÔ TẢ SẢN PHẨM </span>}
                      key="4"
                    >
                      <Typography.Paragraph className="p-3 bg-gray-50 rounded-md">
                        {detailGundam.description}
                      </Typography.Paragraph>
                    </Collapse.Panel>
                  )}
                </Collapse>
              </div>
            </div>
          </div>

          {/* Right: Auction Info */}
          <div className="space-y-6">
            <div className='sticky top-20 shadow-lg'>
              {/* Auction Status */}
              {isAuctionTrulyEnded ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">🏁 Phiên đấu giá đã kết thúc</h3>
                  {winnerInfo?.winner ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={winnerInfo.winner.avatar_url || '/default-avatar.png'}
                          alt="Winner"
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{winnerInfo.winner.full_name}</p>
                          <p className="text-sm text-gray-600">
                            Giá thắng: <span className="font-bold text-green-600">
                              {winnerInfo.finalPrice?.toLocaleString()} VNĐ
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Winner Payment Section */}
                      {isCurrentUserWinner && (
                        <div className="border-t pt-4">
                          {auctionDetail?.auction?.status === 'completed' ? (
                            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                              <div className="flex items-center gap-2">
                                <span className="text-green-600">✅</span>
                                <p className="text-green-800 font-medium">Đã thanh toán thành công!</p>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-blue-800">🎉 Chúc mừng! Bạn đã thắng đấu giá</p>
                                  <p className="text-sm text-blue-600">Vui lòng thanh toán để hoàn tất giao dịch</p>
                                </div>
                                <button
                                  onClick={() => {
                                    fetchUserAddresses();
                                    setPaymentModalVisible(true);
                                  }}
                                  disabled={paymentProcessing}
                                  className={`px-6 py-2 rounded-lg font-medium transition ${paymentProcessing
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                  {paymentProcessing ? '⏳ Đang xử lý...' : '💳 Thanh toán ngay'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">Phiên đấu giá đã kết thúc nhưng không có người thắng cuộc</p>
                  )}
                </div>
              ) : (
                <>
                  {/* Countdown Timer */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">⏰ Thời gian còn lại</h3>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      {[
                        { value: countdown.days, label: 'Ngày' },
                        { value: countdown.hours, label: 'Giờ' },
                        { value: countdown.minutes, label: 'Phút' },
                        { value: countdown.seconds, label: 'Giây' }
                      ].map((item, index) => (
                        <div key={index} className="bg-white/20 rounded-lg p-3">
                          <div className="text-2xl font-bold">{item.value}</div>
                          <div className="text-sm opacity-90">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Giá khởi điểm:</span>
                        <p className="font-semibold">{auctionDetail.auction.starting_price?.toLocaleString()} VNĐ</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Bước giá:</span>
                        <p className="font-semibold">{auctionDetail.auction.bid_increment?.toLocaleString()} VNĐ</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Số lượt đấu:</span>
                        <p className="font-semibold">{auctionDetail.auction.total_bids || 0}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Người tham gia:</span>
                        <p className="font-semibold">{participants.length}</p>
                      </div>
                    </div>

                    {/* Current Price */}
                    <div className="border-t pt-4">
                      <div className="text-center">
                        <p className="text-gray-600 text-sm">Giá hiện tại</p>
                        <p className="text-3xl font-bold text-green-600">
                          {auctionDetail.auction.current_price?.toLocaleString()} VNĐ
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bid Form */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">💰 Đặt giá của bạn</h3>
                    <form onSubmit={handleSubmitBid} className="space-y-4">
                      <div>
                        <Input
                          type="text"
                          size="large"
                          placeholder={`Tối thiểu ${((auctionDetail.auction.current_price || 0) + (auctionDetail.auction.bid_increment || 0)).toLocaleString()} VNĐ`}
                          value={bidPrice}
                          onChange={handleBidChange}
                          status={bidError ? 'error' : ''}
                          suffix="VNĐ"
                        />
                        {bidError && <p className="text-red-500 text-sm mt-1">{bidError}</p>}
                      </div>
                      <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        loading={isSubmitting}
                        disabled={!!bidError || !bidPrice}
                        className="w-full bg-blue-500"
                      >
                        {isSubmitting ? 'Đang đặt giá...' : 'Đặt giá ngay'}
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Tabs */}
        <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b">
            <div className="flex">
              <button
                className={`px-6 py-4 font-medium transition-colors ${activeTab === 'auctionHistory'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
                onClick={() => handleTabClick('auctionHistory')}
              >
                📊 Lịch sử đấu giá ({bidHistory.length})
              </button>
              <button
                className={`px-6 py-4 font-medium transition-colors ${activeTab === 'participants'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
                onClick={() => handleTabClick('participants')}
              >
                👥 Người tham gia ({participants.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'auctionHistory' && (
              <div className="space-y-4">
                {sortedBidHistory.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {sortedBidHistory.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className={`flex items-center justify-between p-4 rounded-lg border ${item.isNew ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.user?.avatar_url || '/default-avatar.png'}
                            alt={item.user?.full_name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{item.user?.full_name || 'Người dùng ẩn danh'}</p>
                            <p className="text-sm text-gray-500">
                              {formatDisplayTime(item.timestamp)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          {item.type === 'bid' ? (
                            <>
                              <p className="font-bold text-green-600">
                                {item.price?.toLocaleString()} VNĐ
                              </p>
                              <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                Đặt giá
                              </span>
                            </>
                          ) : (
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              Tham gia
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>📈 Chưa có hoạt động nào trong phiên đấu giá này</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'participants' && (
              <ParticipantsTable participants={participants} />
            )}
          </div>
        </div>

        {/* Payment Modal */}
        <AuctionPaymentModal
          visible={paymentModalVisible}
          onCancel={() => setPaymentModalVisible(false)}
          onOk={handlePaymentSubmit}
          confirmLoading={paymentProcessing}
          auctionDetail={auctionDetail}
          winnerInfo={winnerInfo}
          userAddresses={userAddresses}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          shippingFee={shippingFee}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

export default AuctionDetail;