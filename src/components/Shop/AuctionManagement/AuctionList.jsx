import { useEffect, useState } from "react";
import { Table, Tag, Image, message, Modal, Button, Input, Card, Space, Tooltip } from "antd";
import { EyeOutlined, StopOutlined, ClockCircleOutlined, DollarOutlined, TrophyOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { GetSellerAuction, CancelAuction } from "../../../apis/Auction/APIAuction";
import { useSelector } from "react-redux";

const { TextArea } = Input;

const AuctionList = () => {
  const user = useSelector((state) => state.auth.user);
  const [auctionData, setAuctionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [currentAuction, setCurrentAuction] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const fetchAuctionData = async () => {
    try {
      setLoading(true);
      const response = await GetSellerAuction(user.id);
      setAuctionData(response.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách đấu giá");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAuction = async () => {
    if (!cancelReason.trim()) {
      message.warning("Vui lòng nhập lý do hủy");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        reason: cancelReason,
        user_id: user.id
      };

      await CancelAuction(user.id,currentAuction.id, payload);
      message.success("Hủy đấu giá thành công");
      setCancelModalVisible(false);
      setCancelReason("");
      fetchAuctionData();
    } catch (error) {
      console.error("Cancel error:", error.response?.data || error);
      message.error(error.response?.data?.message || "Hủy đấu giá thất bại");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      scheduled: { color: "blue", text: "Chưa bắt đầu", icon: <ClockCircleOutlined /> },
      active: { color: "green", text: "Đang diễn ra", icon: <DollarOutlined /> },
      completed: { color: "purple", text: "Đã kết thúc", icon: <StopOutlined /> },
    };
    return configs[status] || { color: "gray", text: status, icon: null };
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: ["auction", "gundam_snapshot"],
      key: "product",
      width: 280,
      render: (gundam) => (
        <div className="flex items-center space-x-3">
          <Image
            width={64}
            height={64}
            src={gundam.image_url}
            alt={gundam.name}
            className="rounded-lg object-cover border border-gray-200"
            preview={false}
          />
          <div className="flex-1 min-w-0">
            <Tooltip title={gundam.name}>
              <div className="font-semibold text-gray-800 truncate">{gundam.name}</div>
            </Tooltip>
            <Tag color="blue" className="mt-1 text-xs">
              {gundam.grade}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Giá khởi điểm",
      dataIndex: ["auction", "starting_price"],
      key: "starting_price",
      width: 120,
      render: (price) => (
        <div className="text-green-600 text-base font-semibold">
          {price.toLocaleString()}₫
        </div>
      ),
    },
    {
      title: "Giá hiện tại",
      dataIndex: ["auction", "current_price"],
      key: "current_price",
      width: 120,
      render: (price) => (
        <div className="text-red-600 font-bold text-base">
          {price.toLocaleString()}₫
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      width: 400,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Bắt đầu:</span>
            <span className="font-medium">
              {moment(record.auction.start_time).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Kết thúc:</span>
            <span className="font-medium">
              {moment(record.auction.end_time).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: ["auction", "status"],
      key: "status",
      width: 140,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} className="px-3 py-1 rounded-full font-medium">
            <Space size={4}>
              {config.icon}
              {config.text}
            </Space>
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 140,
      render: (_, record) => (
        <Space size={8}>
          <NavLink to={`/auctions/${record.auction.id}`}>
            <Tooltip title="Xem chi tiết">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="small"
                className="bg-blue-500 hover:bg-blue-600"
              >
                Xem
              </Button>
            </Tooltip>
          </NavLink>
          {record.auction.status === "scheduled" && (
            <Tooltip title="Hủy đấu giá">
              <Button
                danger
                icon={<StopOutlined />}
                size="small"
                onClick={() => {
                  setCurrentAuction(record.auction);
                  setCancelModalVisible(true);
                }}
              >
                Hủy
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchAuctionData();
  }, []);

  if (auctionData.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Chưa có phiên đấu giá nào
        </h3>
        <p className="text-gray-500">
          Tạo yêu cầu đấu giá để bắt đầu bán sản phẩm của bạn
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng phiên đấu giá</p>
              <p className="text-2xl font-bold text-blue-600">{auctionData.length}</p>
            </div>
            <TrophyOutlined className="text-3xl text-blue-500" />
          </div>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang diễn ra</p>
              <p className="text-2xl font-bold text-green-600">
                {auctionData.filter(item => item.auction.status === 'active').length}
              </p>
            </div>
            <DollarOutlined className="text-3xl text-green-500" />
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-purple-600">
                {auctionData.filter(item => item.auction.status === 'completed').length}
              </p>
            </div>
            <StopOutlined className="text-3xl text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={auctionData}
          rowKey={(record) => record.auction.id}
          loading={loading}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} phiên đấu giá`
          }}
          className="auction-table"
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Cancel Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <StopOutlined className="text-red-500" />
            <span>Hủy đấu giá</span>
          </div>
        }
        open={cancelModalVisible}
        onOk={handleCancelAuction}
        onCancel={() => {
          setCancelModalVisible(false);
          setCancelReason("");
        }}
        confirmLoading={loading}
        okText="Xác nhận hủy"
        cancelText="Hủy bỏ"
        okButtonProps={{ danger: true }}
        width={500}
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">
              ⚠️ Bạn có chắc chắn muốn hủy đấu giá này?
            </p>
            <p className="text-red-600 text-sm mt-1">
              Hành động này không thể hoàn tác và sẽ thông báo cho tất cả người tham gia.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do hủy: <span className="text-red-500">*</span>
            </label>
            <TextArea
              rows={4}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Vui lòng nhập lý do cụ thể để hủy phiên đấu giá này..."
              className="resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AuctionList;