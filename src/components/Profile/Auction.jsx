import { useState, useEffect } from "react";
import { 
  Tabs, Input, Card, Button, Tag, Spin, Image, Empty, notification, 
  Modal, Descriptions, Divider, Typography 
} from "antd";
import { GetUserParticipatedAuctions, GetListAuctionDetial } from "../../apis/Auction/APIAuction";

const { TabPane } = Tabs;
const { Search } = Input;
const { Text, Title } = Typography;

const AuctionHistory = () => {
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAuction, setCurrentAuction] = useState(null);
  const [auctionDetail, setAuctionDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchParticipatedAuctions();
  }, []);

  const fetchParticipatedAuctions = async () => {
    try {
      setLoading(true);
      const response = await GetUserParticipatedAuctions();
      setAuctions(response.data);
      setFilteredAuctions(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch auction history",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    if (!value) {
      setFilteredAuctions(auctions);
      return;
    }
    const filtered = auctions.filter((item) =>
      item.auction.gundam_snapshot.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAuctions(filtered);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "all") {
      setFilteredAuctions(auctions);
    } else {
      const filtered = auctions.filter((item) => item.auction.status === key);
      setFilteredAuctions(filtered);
    }
  };

  const getStatusTag = (status) => {
    let color = "";
    let text = "";
    
    switch (status) {
      case "active":
        color = "blue";
        text = "Active";
        break;
      case "ended":
        color = "orange";
        text = "Ended";
        break;
      case "completed":
        color = "green";
        text = "Completed";
        break;
      default:
        color = "default";
        text = status;
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  const isWinner = (auction) => {
    return auction.auction_participant.user_id === auction.auction.winner_id;
  };

  const renderAuctionCard = (item) => {
    const auction = item.auction;
    const gundam = auction.gundam_snapshot;
    const isUserWinner = isWinner(item);
    
    return (
      <Card
        key={auction.id}
        style={{ marginBottom: 16 }}
        hoverable
      >
        <div style={{ display: "flex" }}>
          <Image
            width={150}
            src={gundam.image_url}
            alt={gundam.name}
            fallback="https://via.placeholder.com/150"
            style={{ objectFit: "cover" }}
          />
          <div style={{ marginLeft: 16, flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{gundam.name}</h3>
              {getStatusTag(auction.status)}
            </div>
            <p>
              <strong>Grade:</strong> {gundam.grade}
            </p>
            <p>
              <strong>Scale:</strong> {gundam.scale}
            </p>
            <p>
              <strong>Final Price:</strong> {auction.current_price.toLocaleString()} VND
            </p>
            <p>
              <strong>Your Deposit:</strong> {item.auction_participant.deposit_amount.toLocaleString()} VND
              {item.auction_participant.is_refunded && (
                <Tag color="green" style={{ marginLeft: 8 }}>Refunded</Tag>
              )}
            </p>
            {isUserWinner && (
              <Tag color="gold">You Won</Tag>
            )}
            <div style={{ marginTop: 16 }}>
              <Button 
                className="border-black text-black" 
                type="primary" 
                onClick={() => viewAuctionDetails(auction.id, item)}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const viewAuctionDetails = async (auctionId, auctionData) => {
    try {
      setDetailLoading(true);
      setCurrentAuction(auctionData);
      const response = await GetListAuctionDetial(auctionId);
      setAuctionDetail(response.data);
      setModalVisible(true);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch auction details",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentAuction(null);
    setAuctionDetail(null);
  };

  const renderAuctionDetails = () => {
    if (!currentAuction || !auctionDetail) return null;

    const auction = currentAuction.auction;
    const gundam = auction.gundam_snapshot;
    const participant = currentAuction.auction_participant;
    const isUserWinner = isWinner(currentAuction);

    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Image
            width={300}
            src={gundam.image_url}
            alt={gundam.name}
            fallback="https://via.placeholder.com/300"
            style={{ objectFit: "cover" }}
          />
          <Title level={3} style={{ marginTop: 16 }}>{gundam.name}</Title>
          {getStatusTag(auction.status)}
          {isUserWinner && (
            <Tag color="gold" style={{ marginLeft: 8 }}>You Won</Tag>
          )}
        </div>

        <Divider orientation="left">Gundam Information</Divider>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Grade">{gundam.grade}</Descriptions.Item>
          <Descriptions.Item label="Scale">{gundam.scale}</Descriptions.Item>
          <Descriptions.Item label="Weight">{gundam.weight} g</Descriptions.Item>
          <Descriptions.Item label="Quantity">{gundam.quantity}</Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Auction Information</Divider>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Starting Price">{auction.starting_price.toLocaleString()} VND</Descriptions.Item>
          <Descriptions.Item label="Current Price">{auction.current_price.toLocaleString()} VND</Descriptions.Item>
          <Descriptions.Item label="Bid Increment">{auction.bid_increment.toLocaleString()} VND</Descriptions.Item>
          <Descriptions.Item label="Buy Now Price">{auction.buy_now_price.toLocaleString()} VND</Descriptions.Item>
          <Descriptions.Item label="Total Participants">{auction.total_participants}</Descriptions.Item>
          <Descriptions.Item label="Total Bids">{auction.total_bids}</Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Time Information</Divider>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Start Time">{new Date(auction.start_time).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="End Time">{new Date(auction.end_time).toLocaleString()}</Descriptions.Item>
          {auction.actual_end_time && (
            <Descriptions.Item label="Actual End Time">{new Date(auction.actual_end_time).toLocaleString()}</Descriptions.Item>
          )}
          {auction.winner_payment_deadline && (
            <Descriptions.Item label="Payment Deadline">{new Date(auction.winner_payment_deadline).toLocaleString()}</Descriptions.Item>
          )}
        </Descriptions>

        <Divider orientation="left">Your Participation</Divider>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Deposit Amount">{participant.deposit_amount.toLocaleString()} VND</Descriptions.Item>
          <Descriptions.Item label="Deposit Status">
            {participant.is_refunded ? (
              <Tag color="green">Refunded</Tag>
            ) : (
              <Tag color="orange">Not Refunded</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Participation Date">{new Date(participant.created_at).toLocaleString()}</Descriptions.Item>
        </Descriptions>

        {auctionDetail.bids && auctionDetail.bids.length > 0 && (
          <>
            <Divider orientation="left">Bid History</Divider>
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {auctionDetail.bids.map((bid, index) => (
                <Card key={bid.id} size="small" style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>#{index + 1}: {bid.amount.toLocaleString()} VND</Text>
                    <Text type="secondary">{new Date(bid.created_at).toLocaleString()}</Text>
                  </div>
                  <Text type="secondary">By: {bid.bidder_name || 'Anonymous'}</Text>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: 24 }}>
      <h1 className="pb-4">Your Auction History</h1>
      
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by Gundam name"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
          style={{ width: 400 }}
        />
      </div>
      
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="All Auctions" key="all" />
        <TabPane tab="Active" key="active" />
        <TabPane tab="Ended" key="ended" />
        <TabPane tab="Completed" key="completed" />
      </Tabs>
      
      {loading ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin size="large" />
        </div>
      ) : filteredAuctions.length === 0 ? (
        <Empty
          description={
            <span>
              No auctions found {activeTab !== "all" ? `for ${activeTab} status` : ""}
            </span>
          }
        />
      ) : (
        <div>
          {filteredAuctions.map((item) => renderAuctionCard(item))}
        </div>
      )}

      <Modal
        title="Auction Details"
        visible={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>
        ]}
        width={800}
      >
        {detailLoading ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <Spin size="large" />
          </div>
        ) : (
          renderAuctionDetails()
        )}
      </Modal>
    </div>
  );
};

export default AuctionHistory;