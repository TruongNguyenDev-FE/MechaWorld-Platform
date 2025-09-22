import { useEffect, useState } from "react";
import { Table, Tag, Image, message, Button, Modal, Card, Space, Tooltip } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { GetListAuctionRequests, DeleteAuctionRequest } from "../../../apis/Auction/APIAuction";
import { useSelector } from "react-redux";

const { confirm } = Modal;

const AuctionRequests = () => {
  const user = useSelector((state) => state.auth.user);
  const [auctionData, setAuctionData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (requestID, productName) => {
    confirm({
      title: 'Xác nhận xóa yêu cầu',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div className="py-2">
          <p>Bạn có chắc chắn muốn xóa yêu cầu đấu giá cho sản phẩm:</p>
          <p className="font-semibold text-blue-600 mt-2">"{productName}"</p>
          <p className="text-red-500 text-sm mt-2">Hành động này không thể hoàn tác.</p>
        </div>
      ),
      okText: 'Xóa yêu cầu',
      okType: 'danger',
      cancelText: 'Hủy bỏ',
      onOk: async () => {
        try {
          await DeleteAuctionRequest(user.id, requestID);
          message.success("Xóa yêu cầu thành công");
          setAuctionData(prev => prev.filter(item => item.id !== requestID));
        } catch (error) {
          message.error("Xóa yêu cầu thất bại");
          console.error("Lỗi khi xóa yêu cầu:", error);
        }
      },
    });
  };

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const response = await GetListAuctionRequests(user.id);
        const dataWithKeys = response.data.map((item) => ({
          ...item,
          key: item.id,
        }));
        setAuctionData(dataWithKeys);
      } catch (error) {
        message.error("Lỗi khi tải danh sách yêu cầu đấu giá.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [user.id]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "blue",
        text: "Chờ duyệt",
        icon: <FileTextOutlined />,
        bgColor: "bg-blue-50 border-blue-200"
      },
      approved: {
        color: "green",
        text: "Đã duyệt",
        icon: <CheckCircleOutlined />,
        bgColor: "bg-green-50 border-green-200"
      },
      rejected: {
        color: "red",
        text: "Bị từ chối",
        icon: <CloseCircleOutlined />,
        bgColor: "bg-red-50 border-red-200"
      },
    };
    return configs[status] || { color: "gray", text: status, icon: null };
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: ["gundam_snapshot"],
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
      dataIndex: "starting_price",
      key: "starting_price",
      width: 170,
      render: (price) => (
        <div className="text-green-600 font-semibold">
          {formatCurrency(price)}
        </div>
      ),
    },
    {
      title: "Bước giá",
      dataIndex: "bid_increment",
      key: "bid_increment",
      width: 120,
      render: (price) => (
        <div className="text-blue-600 font-medium">
          {formatCurrency(price)}
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
              {moment(record.start_time).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Kết thúc:</span>
            <span className="font-medium">
              {moment(record.end_time).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
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
      title: "Lý do từ chối",
      dataIndex: "rejected_reason",
      key: "rejected_reason",
      width: 200,
      render: (reason, record) =>
        record.status === "rejected" ? (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
            <span className="text-red-700">
              {reason || "Không có lý do cụ thể"}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Tooltip title="Xóa yêu cầu">
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id, record.gundam_snapshot.name)}
            className="hover:bg-red-50"
          />
        </Tooltip>
      ),
    },
  ];

  const filteredData = auctionData.filter(
    (item) => ["pending", "approved", "rejected"].includes(item.status)
  );

  // Stats data
  const stats = {
    pending: filteredData.filter(item => item.status === 'pending').length,
    approved: filteredData.filter(item => item.status === 'approved').length,
    rejected: filteredData.filter(item => item.status === 'rejected').length,
  };

  if (filteredData.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Chưa có yêu cầu đấu giá nào
        </h3>
        <p className="text-gray-500">
          Tạo yêu cầu đấu giá từ trang quản lý sản phẩm để bắt đầu
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
              <p className="text-sm text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
            </div>
            <FileTextOutlined className="text-3xl text-blue-500" />
          </div>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircleOutlined className="text-3xl text-green-500" />
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bị từ chối</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <CloseCircleOutlined className="text-3xl text-red-500" />
          </div>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} yêu cầu`
          }}
          className="auction-requests-table"
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default AuctionRequests;