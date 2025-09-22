import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, message, Button, Tooltip, Badge, Avatar, Alert } from "antd";
import { EyeOutlined, CheckCircleOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { ParticipateInAuction } from "../../apis/Auction/APIAuction";
import Cookies from 'js-cookie';

// Hàm parse cookie user từ document.cookie (giống lishaution)
const parseUserCookie = () => {
  try {
    const cookieString = document.cookie;
    if (!cookieString) return null;

    const cookieMatch = cookieString.match(/user=([^;]+)/);
    if (!cookieMatch) return null;

    const encodedValue = cookieMatch[1];
    let decodedValue;

    try {
      decodedValue = decodeURIComponent(encodedValue);
    } catch {
      decodedValue = encodedValue
        .replace(/%22/g, '"')
        .replace(/%2C/g, ',')
        .replace(/%3A/g, ':')
        .replace(/%7B/g, '{')
        .replace(/%7D/g, '}');
    }

    let cleanJson = decodedValue
      .replace(/\\"/g, '"')
      .replace(/"\s*\+\s*"/g, '')
      .replace(/\n/g, '')
      .replace(/\r/g, '');

    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) return null;

    cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);

    cleanJson = cleanJson
      .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
      .replace(/:\s*([a-zA-Z0-9_]+)(\s*[},])/g, ':"$1"$2')
      .replace(/:true([^"])/g, ':true$1')
      .replace(/:false([^"])/g, ':false$1')
      .replace(/:null([^"])/g, ':null$1');

    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Failed to parse user cookie:", e);
    return null;
  }
};

const AuctionSection = ({ auctions }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [hasParticipatedMap, setHasParticipatedMap] = useState({});
  const [isModalOpenMap, setIsModalOpenMap] = useState({});
  const [depositAmountMap, setDepositAmountMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchUserData = () => {
      try {
        // Thử lấy từ js-cookie trước
        const userCookie = Cookies.get('user');
        if (userCookie) {
          try {
            setCurrentUser(JSON.parse(userCookie));
            return;
          } catch (e) {
            console.log("Failed to parse js-cookie, trying document.cookie");
          }
        }

        // Nếu không được thì parse từ document.cookie
        const user = parseUserCookie();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Kiểm tra user đã tham gia các phiên đấu giá nào
    if (currentUser && auctions?.length > 0) {
      const newMap = {};
      auctions.forEach(auctionData => {
        const auction = auctionData?.auction;
        if (auction) {
          const participants = auctionData.auction_participants || [];
          newMap[auction.id] = participants.some(
            participant => participant.user_id === currentUser.id
          );
        }
      });
      setHasParticipatedMap(newMap);
    }
  }, [currentUser, auctions]);

  const handleClickedDetailAution = (auction) => {
    const status = auction.status;
    const hasParticipated = hasParticipatedMap[auction.id] || false;

    if (status === "ended" || hasParticipated || currentUser?.id === auction.seller_id) {
      navigate(`/auction/${auction.id}`);
      return;
    }

    Modal.warning({
      title: 'Thông báo',
      content: "Vui lòng nhấn 'Tham gia' để đăng ký trước khi xem chi tiết",
      okText: 'Đã hiểu',
      okButtonProps: {
        style: {
          color: '#1890ff',
          borderColor: '#1890ff'
        }
      }
    });
  };

  const handleJoinAuction = (auction) => {
    if (!currentUser) {
      Modal.warning({
        title: 'Chưa đăng nhập',
        content: "Vui lòng đăng nhập để tham gia đấu giá.",
        okText: 'Đã hiểu',
        okButtonProps: {
          style: {
            color: '#1890ff',
            borderColor: '#1890ff'
          }
        }
      });
      return;
    }

    if (auction.status === "scheduled") {
      Modal.info({
        title: 'Thông báo',
        content: "Hiện tại phiên chưa bắt đầu nên chưa thể tham gia.",
        okText: 'Đã hiểu'
      });
      return;
    }

    if (currentUser.id === auction.seller_id) {
      Modal.warning({
        title: 'Không thể tham gia',
        content: "Bạn không thể tham gia phiên đấu giá của chính mình.",
        okText: 'Đã hiểu'
      });
      return;
    }

    const deposit = auction.deposit_amount ||
      Math.floor(auction.starting_price * parseFloat(auction.deposit_rate || "0.15"));
    setDepositAmountMap(prev => ({ ...prev, [auction.id]: deposit }));
    setIsModalOpenMap(prev => ({ ...prev, [auction.id]: true }));
  };

  const confirmParticipation = async (auctionId) => {
    try {
      await ParticipateInAuction(auctionId);
      message.success('Tham gia đấu giá thành công!');
      setHasParticipatedMap(prev => ({ ...prev, [auctionId]: true }));
    } catch (err) {
      console.error("Chi tiết lỗi:", err);
      message.error('Không thể tham gia đấu giá. Vui lòng thử lại!');
    } finally {
      setIsModalOpenMap(prev => ({ ...prev, [auctionId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'green', text: 'ĐANG DIỄN RA' },
      ended: { color: 'red', text: 'ĐÃ KẾT THÚC' },
      scheduled: { color: 'blue', text: 'SẮP DIỄN RA' },
      completed: { color: 'purple', text: 'HOÀN THÀNH' },
      canceled: { color: 'gray', text: 'ĐÃ HỦY' },
    };

    return statusConfig[status] || { color: 'default', text: 'UNKNOWN' };
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  // Chỉ lấy các phiên active hoặc scheduled
  const filteredAuctions = (auctions || []).filter(
    auctionData =>
      auctionData?.auction?.status === "active" ||
      auctionData?.auction?.status === "scheduled"
  );

  // Số lượng sản phẩm muốn hiển thị mặc định
  const DISPLAY_LIMIT = 3;
  const displayAuctions = showAll ? filteredAuctions : filteredAuctions.slice(0, DISPLAY_LIMIT);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayAuctions.map((auctionData) => {
          const auction = auctionData?.auction;
          if (!auction) return null; // Skip nếu không có dữ liệu

          const statusBadge = getStatusBadge(auction.status);
          const hasParticipated = hasParticipatedMap[auction.id] || false;
          const isModalOpen = isModalOpenMap[auction.id] || false;
          const depositAmount = depositAmountMap[auction.id] || 0;
          const isAuctionEnded = auction.status === 'ended' || auction.status === 'completed';

          return (
            <div key={auction.id} className="relative">
              {/* Status Badge */}
              <div className="absolute top-2 right-2 z-10">
                <Badge
                  status={statusBadge.color}
                  text={
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                      {statusBadge.text}
                    </span>
                  }
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={auction.gundam_snapshot.image_url}
                    alt={auction.gundam_snapshot.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold mb-2">{auction.gundam_snapshot.name}</h3>

                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Giá hiện tại:</span>
                    <span className="font-bold">{auction.current_price} VNĐ</span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Số lượt đấu giá:</span>
                    <span>{auction.total_bids}</span>
                  </div>

                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600 dark:text-gray-300">Kết thúc:</span>
                    <span>
                      <ClockCircleOutlined className="mr-1" />
                      {new Date(auction.end_time).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-auto flex space-x-2">
                    <Button
                      type={auction.status === "ended" ? "default" : "primary"}
                      icon={<EyeOutlined />}
                      onClick={() => handleClickedDetailAution(auction)}
                      className="flex-1 text-[#1890ff] border-[#1890ff] hover:bg-blue-50"
                    >
                      {auction.status === "ended" ? "Xem kết quả" : "Xem chi tiết"}
                    </Button>

                    {currentUser?.id === auction.seller_id ? (
                      <Button disabled className="flex-1">
                        Phiên của bạn
                      </Button>
                    ) : (
                      <Tooltip title={hasParticipated ? "Bạn đã tham gia phiên này" : "Tham gia đấu giá"}>
                        <Button
                          type={hasParticipated ? "default" : "primary"}
                          danger={!hasParticipated}
                          icon={hasParticipated ? <CheckCircleOutlined /> : null}
                          onClick={() => handleJoinAuction(auction)}
                          disabled={hasParticipated}
                          className="flex-1"
                        >
                          {hasParticipated ? "Đã tham gia" : "Tham gia"}
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>

              {/* Participation Modal */}
              <Modal
                title="Xác nhận tham gia đấu giá"
                open={isModalOpen}
                onCancel={() => setIsModalOpenMap(prev => ({ ...prev, [auction.id]: false }))}
                footer={[
                  <Button key="cancel" onClick={() => setIsModalOpenMap(prev => ({ ...prev, [auction.id]: false }))}>
                    Hủy
                  </Button>,
                  <Button
                    type={isAuctionEnded ? "default" : hasParticipated ? "default" : "primary"}
                    danger={!isAuctionEnded && !hasParticipated}
                    icon={isAuctionEnded ? null : hasParticipated ? <CheckCircleOutlined /> : null}
                    onClick={isAuctionEnded ? null : () => handleJoinAuction(auction)}
                    disabled={isAuctionEnded || hasParticipated}
                    className="flex-1"
                  >
                    {isAuctionEnded ? "Đã kết thúc" : hasParticipated ? "Đã tham gia" : "Tham gia"}
                  </Button>
                ]}
                centered
              >
                <div className="py-4">
                  <Alert
                    message={
                      <div>
                        Số tiền cọc là{' '}
                        <span className="font-bold text-blue-600">
                          {depositAmount.toLocaleString()} VNĐ
                        </span>{' '}
                        (15% giá khởi điểm)
                      </div>
                    }
                    description="Bạn có chắc chắn muốn tham gia đấu giá?"
                    type="info"
                    showIcon
                    className="mb-4"
                  />

                  {currentUser && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar icon={<UserOutlined />} />
                      <div>
                        <span className="font-bold">{currentUser.full_name}</span>
                        <br />
                        <span className="text-gray-500 text-sm">
                          {currentUser.email}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Modal>
            </div>
          );
        })}
      </div>
      {/* Nút Xem thêm */}
                  <div className="text-center mt-6">
                      <Link 
                          to="/auction" 
                          className="inline-block px-6 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
                      >
                          Xem thêm các phiên đấu giá
                      </Link>
                  </div>
    </div>
  );
};

export default AuctionSection;