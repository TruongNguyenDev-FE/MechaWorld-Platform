import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiAuctionFill } from "react-icons/ri";
import { GiTakeMyMoney } from "react-icons/gi";
import { Caption, PrimaryButton } from "../Design";
import { CheckCircleOutlined, ClockCircleOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Modal, Row, Col, Tabs, Empty, Typography, Space, Tag, Divider, Button, Tooltip, Alert, Avatar, Badge } from "antd";
import { GetListAuction, ParticipateInAuction } from "../../../apis/Auction/APIAuction";
import Cookies from 'js-cookie';
import FilterSidebar from "../../Product/ProductFilter";

const { Title, Text } = Typography;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const useCountdown = (endTime) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft('Đã kết thúc');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timeLeft;
};


const parseUserCookie = (cookieString) => {
  try {
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

const getCurrentUserFromCookies = () => {
  try {
    if (typeof Cookies !== 'undefined') {
      const userCookie = Cookies.get('user');
      if (userCookie) {
        try {
          return JSON.parse(userCookie);
        } catch {
          // Nếu không được thì chuyển sang parse thủ công
        }
      }
    }

    return parseUserCookie(document.cookie);
  } catch (e) {
    console.error("Error getting user from cookies:", e);
    return null;
  }
};

// Auction Card
const AuctionCard = ({ auctionData }) => {
  const navigate = useNavigate();
  const [hasParticipated, setHasParticipated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [cookieError, setCookieError] = useState(false);

  // Destructure data correctly
  const {
    auction,
    auction_participants: participants = [],
    auction_bids: bids = []
  } = auctionData;

  useEffect(() => {
    // console.log("Participants data:", participants);
    // console.log("Auction data:", auction);
  }, [participants, auction]);

  useEffect(() => {
    try {
      const user = getCurrentUserFromCookies();
      if (user) {
        setCurrentUser(user);

        // Kiểm tra xem user hiện tại đã tham gia chưa
        const userParticipated = participants.some(
          participant => participant.user_id === user.id
        );
        setHasParticipated(userParticipated);
      }
    } catch (e) {
      console.error("Error processing user cookie:", e);
      setCookieError(true);
    }
  }, [participants]);

  const countdown = useCountdown(auction.end_time);

  const getAuctionStatus = () => {
    return auction.status;
  };

  const status = getAuctionStatus();

  const statusConfig = {
    active: {
      color: 'success',
      text: 'Đang diễn ra',
      icon: <ClockCircleOutlined />
    },
    ended: {
      color: 'error',
      text: 'Đã kết thúc',
      icon: <CheckCircleOutlined />
    },
    scheduled: {
      color: 'processing',
      text: 'Sắp diễn ra',
      icon: <ClockCircleOutlined />
    },
    completed: {
      color: 'purple',
      text: 'Hoàn thành',
      icon: <CheckCircleOutlined />
    }
  };

  const dateOnly = auction.actual_end_time ?
    new Date(auction.actual_end_time).toISOString().split('T')[0] : '';

  const renderStatusInfo = () => {
    switch (status) {
      case 'scheduled':
        return (
          <Text type="secondary" className="text-base">
            <ClockCircleOutlined className="mr-1" />
            Bắt đầu: {formatDate(auction.start_time)}
          </Text>
        );
      case 'active':
        return (
          <Text type="success" className="text-base font-medium">
            <ClockCircleOutlined className="mr-1" />
            Kết thúc trong: {countdown}
          </Text>
        );
      case 'ended':
      case 'completed':
        return (
          <Text type="secondary" className="text-base">
            <CheckCircleOutlined className="mr-1" />
            Kết thúc vào: {dateOnly}
          </Text>
        );
      default:
        return null;
    }
  };

  const handleClickedDetailAution = (id) => {
    if (status === "ended" || hasParticipated || currentUser?.id === auction.seller_id) {
      navigate(`/auction/${id}`);
      return;
    }
    Modal.warning({
      title: 'Thông báo',
      content: "Vui lòng nhấn 'Tham gia' để đăng ký trước khi xem chi tiết",
      okText: 'Đã hiểu',
      okButtonProps: { style: { color: "#1677ff", borderColor: "#1677ff" } }
    });
  };

  const handleJoinAuction = () => {
    if (!currentUser) {
      Modal.warning({
        title: 'Chưa đăng nhập',
        content: "Vui lòng đăng nhập để tham gia đấu giá.",
        okText: 'Đã hiểu',
        okButtonProps: { style: { color: "#1677ff", borderColor: "#1677ff" } }
      });
      return;
    }

    if (status === "scheduled") {
      Modal.info({
        title: 'Thông báo',
        content: "Hiện tại phiên chưa bắt đầu nên chưa thể tham gia.",
        okText: 'Đã hiểu',
        okButtonProps: { style: { color: "#1677ff", borderColor: "#1677ff" } }
      });
      return;
    }

    if (currentUser.id === auction.seller_id) {
      Modal.warning({
        title: 'Không thể tham gia',
        content: "Bạn không thể tham gia phiên đấu giá của chính mình.",
        okText: 'Đã hiểu',
        okButtonProps: { style: { color: "#1677ff", borderColor: "#1677ff" } }
      });
      return;
    }

    const deposit = auction.deposit_amount ||
      Math.floor(auction.starting_price * parseFloat(auction.deposit_rate || "0.15"));
    setDepositAmount(deposit);
    setIsModalOpen(true);
  };

  const confirmParticipation = async () => {
    try {
      await ParticipateInAuction(auction.id);
      Modal.success({
        title: 'Thành công',
        content: 'Tham gia đấu giá thành công!',
      });
      setHasParticipated(true);
    } catch (err) {
      console.error("Chi tiết lỗi:", err);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tham gia đấu giá. Vui lòng thử lại!',
      });
    } finally {
      setIsModalOpen(false);
    }
  };

  if (cookieError) {
    return (
      <Card className="w-full max-w-sm mx-auto">
        <Alert
          message="Lỗi xác thực"
          description="Lỗi khi xác thực thông tin người dùng. Vui lòng đăng nhập lại."
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <>
      <Card
        className="w-full max-w-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
        cover={
          <div className="relative h-56 overflow-hidden group">
            <div onClick={() => handleClickedDetailAution(auction.id)}>
              <img
                src={auction.gundam_snapshot?.image_url || "default-image.jpg"}
                alt={auction.gundam_snapshot?.name || "No Name"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Status Badges Overlay */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <Badge
                status={statusConfig[status]?.color}
                text={
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                    {statusConfig[status]?.text}
                  </span>
                }
              />
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <Text className="text-sm font-medium text-green-600">
                  <UserOutlined className="mr-1" />
                  {auction.total_participants || 0}
                </Text>
              </div>
            </div>
          </div>
        }
        bodyStyle={{ padding: '16px' }}
      >
        {/* Status Info */}
        <div className="mb-3">
          {renderStatusInfo()}
        </div>

        {/* Product Title */}
        <Title level={4} className="mb-2 text-base leading-tight">
          {auction.gundam_snapshot?.name}
        </Title>

        {/* Product Tags */}
        <Space size={[4, 4]} wrap className="mb-4">
          <Tag color="default">{auction.gundam_snapshot?.grade}</Tag>
          <Tag color="default">{auction.gundam_snapshot?.scale}</Tag>
        </Space>

        <Divider className="my-4" />

        {/* Price Information */}
        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <RiAuctionFill className="text-green-500 text-xl mx-auto mb-1" />
              <Text type="secondary" className="block text-xs">
                Giá khởi điểm
              </Text>
              <Title level={5} className="text-green-600 mb-0 text-sm">
                {auction.starting_price?.toLocaleString()} VNĐ
              </Title>
            </div>
          </Col>
          <Col span={12}>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <GiTakeMyMoney className="text-red-500 text-xl mx-auto mb-1" />
              <Text type="secondary" className="block text-xs">
                Mua ngay
              </Text>
              <Title level={5} className="text-red-600 mb-0 text-sm">
                {auction.buy_now_price?.toLocaleString()} VNĐ
              </Title>
            </div>
          </Col>
        </Row>

        <Divider className="my-4" />

        {/* Action Buttons */}
        <Space size="small" className="w-full">
          <Button
            type={status === "ended" ? "default" : "primary"}
            icon={<EyeOutlined />}
            onClick={() => handleClickedDetailAution(auction.id)}
            className="flex-1 bg-blue-500 text-white"
            size="middle"
          >
            {status === "ended" ? "Xem kết quả" : "Xem chi tiết"}
          </Button>

          {currentUser?.id === auction.seller_id ? (
            <Button disabled className="flex-1" size="middle">
              Phiên của bạn
            </Button>
          ) : (
            <Tooltip title={hasParticipated ? "Bạn đã tham gia phiên này" : "Tham gia đấu giá"}>
              <Button
                type={hasParticipated ? "default" : "primary"}
                danger={!hasParticipated}
                icon={hasParticipated ? <CheckCircleOutlined /> : null}
                onClick={handleJoinAuction}
                disabled={hasParticipated}
                className="flex-1"
                size="middle"
              >
                {hasParticipated ? "Đã tham gia" : "Tham gia"}
              </Button>
            </Tooltip>
          )}
        </Space>
      </Card>

      {/* Participation Modal */}
      <Modal
        title="Xác nhận tham gia đấu giá"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Hủy
          </Button>,
          <Button key="confirm" className="bg-blue-500" type="primary" onClick={confirmParticipation}>
            Xác nhận tham gia
          </Button>
        ]}
        centered
      >
        <div className="py-4">
          <Alert
            message={
              <div>
                Số tiền cọc là{' '}
                <Text strong className="text-lg text-blue-600">
                  {depositAmount?.toLocaleString()} VNĐ
                </Text>{' '}
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
                <Text strong>{currentUser.full_name}</Text>
                <br />
                <Text type="secondary" className="text-sm">
                  {currentUser.email}
                </Text>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};


// Auction List
const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  const [filters, setFilters] = useState({
    selectedGrade: null,
  });

  const [searchText, setSearchText] = useState('');

  // Thêm state cho sort
  const [sortType, setSortType] = useState('newest');

  // Filter Side Bar
  // Hàm nhận dữ liệu lọc từ FilterSidebar
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const response = await GetListAuction();

        // Giữ nguyên toàn bộ dữ liệu trả về (bao gồm auction, participants, bids)
        const validAuctions = response.data.filter(item =>
          item.auction?.gundam_snapshot &&
          item.auction?.start_time &&
          item.auction?.end_time
        );

        validAuctions.sort((a, b) =>
          new Date(b.auction.created_at) - new Date(a.auction.created_at)
        );

        setAuctions(validAuctions);
      } catch (error) {
        console.error("Error fetching auction data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen mt-14 flex justify-center items-center">
        <div>Đang tải các phiên Đấu giá...</div>
      </div>
    );
  }

  // Filter auctions based on tab
  const activeAuctions = auctions.filter(item =>
    ['active', 'ended', 'completed'].includes(item.auction.status)
  );

  const scheduledAuctions = auctions.filter(item =>
    item.auction.status === 'scheduled'
  );

  const currentAuctions = activeTab === 'active' ? activeAuctions : scheduledAuctions;

  // Apply grade filter
  const filteredAuctions = currentAuctions.filter(item => {
    // Lọc theo grade
    if (filters.selectedGrade && (!item.auction?.gundam_snapshot?.grade ||
        item.auction.gundam_snapshot.grade.toLowerCase() !== filters.selectedGrade)) {
      return false;
    }
    // Lọc theo search
    if (searchText) {
      const name = item.auction?.gundam_snapshot?.name?.toLowerCase() || '';
      if (!name.includes(searchText.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  // Hàm sort
  const sortAuctions = (auctions) => {
    switch (sortType) {
      case 'price-low':
        return [...auctions].sort((a, b) => (a.auction.starting_price || 0) - (b.auction.starting_price || 0));
      case 'price-high':
        return [...auctions].sort((a, b) => (b.auction.starting_price || 0) - (a.auction.starting_price || 0));
      case 'ending-soon':
        return [...auctions].sort((a, b) => new Date(a.auction.end_time) - new Date(b.auction.end_time));
      case 'newest':
      default:
        return [...auctions].sort((a, b) => new Date(b.auction.created_at) - new Date(a.auction.created_at));
    }
  };

  // Thay filteredAuctions thành sortedAuctions
  const sortedAuctions = sortAuctions(filteredAuctions);

  return (
    <div className="container mx-auto p-4 mb-5 min-h-screen mt-36">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Sàn Đấu Giá GunDam</h1>
            <p className="text-gray-600 mt-2">Tham gia đấu giá các Gundam phiên bản giới hạn.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm Gundam..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </div>
            </div>
            <select
              value={sortType}
              onChange={e => setSortType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
              <option value="ending-soon">Sắp kết thúc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Status Display */}
      {filters.selectedGrade && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              Đang lọc theo Grade: <strong>{filters.selectedGrade}</strong>
            </span>
            <button
              onClick={() => setFilters({ ...filters, selectedGrade: null })}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Xóa bộ lọc
            </button>
          </div>
          <div className="text-sm text-blue-600 mt-1">
            Tìm thấy {filteredAuctions} phiên đấu giá
          </div>
        </div>
      )}

      {/* Main Layout */}
      <Row gutter={32} className="">
        {/* Left Sidebar - Filters */}
        <Col xs={24} lg={6}>
          <FilterSidebar onFilterChange={handleFilterChange} />
        </Col>

        {/* Center Content - Tabs and Auctions */}
        <Col xs={24} lg={18} className="bg-white p-4 rounded-lg">
          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            size="large"
            className="custom-auction-tabs"
            centered
            items={[
              {
                key: 'active',
                label: (
                  <div className="flex items-center justify-center gap-2 px-12 py-3 font-medium">
                    <RiAuctionFill className="text-lg" />
                    <span>Phiên Đấu giá đang diễn ra ({activeAuctions.length})</span>
                  </div>
                ),
              },
              {
                key: 'scheduled',
                label: (
                  <div className="flex items-center justify-center gap-2 px-12 py-3 font-medium">
                    <ClockCircleOutlined className="text-lg"/>
                    <span>Phiên Đấu giá sắp diễn ra ({scheduledAuctions.length})</span>
                  </div>
                ),
              },
            ]}
          />

          {/* Auction Grid */}
          <div className="space-y-6">
            {sortedAuctions.length > 0 ? (
              <Row gutter={[24, 24]}>
                {sortedAuctions.map((auctionData) => (
                  <Col key={auctionData.auction.id} xs={24} md={12}>
                    <AuctionCard auctionData={auctionData} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="shadow-sm" bodyStyle={{ padding: '48px 24px' }}>
                <Empty
                  image={<div className="text-6xl mb-4">📦</div>}
                  imageStyle={{ height: 'auto', marginBottom: '16px' }}
                  description={
                    <div className="text-center">
                      <Title level={4} className="text-gray-500 mb-2 mt-4">
                        {activeTab === 'active'
                          ? 'Không có phiên đấu giá nào đang diễn ra'
                          : 'Không có phiên đấu giá nào sắp mở'
                        }
                      </Title>
                      <p className="text-gray-400 mb-0">
                        {activeTab === 'active'
                          ? 'Hãy quay lại sau để xem các phiên đấu giá mới'
                          : 'Các phiên đấu giá sắp tới sẽ được cập nhật sớm'
                        }
                      </p>
                    </div>
                  }
                />
              </Card>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AuctionList;