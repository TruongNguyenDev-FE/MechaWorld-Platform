import { Table, Button, Tooltip, Modal, Input, message, Popconfirm, Descriptions, DatePicker, Form } from "antd";
import { InfoCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  GetListAuctionForModerator,
  UpdateAuctionTime,
} from "../../../apis/Moderator/APIModerator";
import dayjs from "dayjs";

const formatCurrency = (value) =>
  value?.toLocaleString("vi-VN") + " đ";

const AuctionList = ({ searchTerm, filteredStatus }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAuctions();
  }, [searchTerm, filteredStatus]);

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const response = await GetListAuctionForModerator();
      let filteredData = response.data;

      // Filter by search term
      if (searchTerm) {
        filteredData = filteredData.filter(item => 
          item.auction.gundam_snapshot.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by status
      if (filteredStatus) {
        filteredData = filteredData.filter(item => 
          item.auction.status === filteredStatus
        );
      }

      setAuctions(filteredData);
    } catch (error) {
      message.error("Failed to fetch auctions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTime = (auction) => {
    setSelectedAuction(auction);
    form.setFieldsValue({
      start_time: dayjs(auction.start_time),
      end_time: dayjs(auction.end_time)
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        start_time: values.start_time.toISOString(),
        end_time: values.end_time.toISOString()
      };

      await UpdateAuctionTime(selectedAuction.id, updatedData);
      message.success("Auction time updated successfully");
      setIsModalVisible(false);
      fetchAuctions();
    } catch (error) {
      message.error("Failed to update auction time");
      console.error(error);
    }
  };

  // Thêm hàm map status
  const mapStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Sắp diễn ra';
      case 'active':
        return 'Đang diễn ra';
      case 'completed':
        return 'Đã hoàn thành';
      case 'ended':
        return 'Đã kết thúc';
      case 'canceled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Gundam',
      dataIndex: ['auction', 'gundam_snapshot', 'name'],
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <img 
            src={record.auction.gundam_snapshot.image_url} 
            alt={text} 
            className="w-10 h-10 object-cover mr-2"
          />
          {text}
        </div>
      ),
    },
    {
      title: 'Giá Khởi điểm',
      dataIndex: ['auction', 'starting_price'],
      key: 'starting_price',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Giá hiện tại',
      dataIndex: ['auction', 'current_price'],
      key: 'current_price',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Trạng thái',
      dataIndex: ['auction', 'status'],
      key: 'status',
      render: (status) => (
        <span className={`capitalize ${
          status === 'scheduled' ? 'text-blue-500' : 
          status === 'active' ? 'text-green-500' : 
          status === 'completed' ? 'text-purple-500' : 
          status === 'ended' ? 'text-red-500' :
          status === 'canceled' ? 'text-orange-400' :
          'text-gray-500'
        }`}>
          {mapStatusText(status)}
        </span>
      ),
    },
    {
      title: 'Thời gian Bắt đầu',
      dataIndex: ['auction', 'start_time'],
      key: 'start_time',
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Thời gian Kết thúc',
      dataIndex: ['auction', 'end_time'],
      key: 'end_time',
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Tooltip title="View Details">
            <Button 
              icon={<InfoCircleOutlined />} 
              onClick={() => setSelectedAuction(record.auction)}
            />
          </Tooltip>
          <Tooltip title="Edit Time">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => handleUpdateTime(record.auction)}
              disabled={record.auction.status !== 'scheduled'}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={auctions}
        rowKey={(record) => record.auction.id}
        loading={loading}
        scroll={{ x: true }}
      />

      {/* Auction Details Modal */}
      <Modal
        title="Auction Details"
        visible={!!selectedAuction && !isModalVisible}
        onCancel={() => setSelectedAuction(null)}
        footer={[
          <Button key="back" onClick={() => setSelectedAuction(null)}>
            Close
          </Button>,
        ]}
      >
        {selectedAuction && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên Gundam">
              {selectedAuction.gundam_snapshot.name}
            </Descriptions.Item>
            <Descriptions.Item label="Grade">{selectedAuction.gundam_snapshot.grade}</Descriptions.Item>
            <Descriptions.Item label="Tỉ lệ">{selectedAuction.gundam_snapshot.scale}</Descriptions.Item>
            <Descriptions.Item label="Giá Khởi điểm">
              {formatCurrency(selectedAuction.starting_price)}
            </Descriptions.Item>
            <Descriptions.Item label="Giá hien tại">
              {formatCurrency(selectedAuction.current_price)}
            </Descriptions.Item>
            <Descriptions.Item label="Giá Mua Ngay">
              {formatCurrency(selectedAuction.buy_now_price)}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <span className="capitalize">{mapStatusText(selectedAuction.status)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian bắt đầu">
              {dayjs(selectedAuction.start_time).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian kết thúc">
              {dayjs(selectedAuction.end_time).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng người tham gia">
              {selectedAuction.total_participants}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng số lượt đấu giá">
              {selectedAuction.total_bids}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Update Time Modal */}
      <Modal
        title="Cập nhật Thời Gian Đấu Giá"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="start_time"
            label="Start Time"
            rules={[{ required: true, message: 'Hãy chọn thời điểm bắt đầu' }]}
          >
            <DatePicker 
              showTime 
              format="YYYY-MM-DD HH:mm" 
              style={{ width: '100%' }} 
            />
          </Form.Item>
          <Form.Item
            name="end_time"
            label="End Time"
            rules={[{ required: true, message: 'Hãy chọn thời điểm kết thúc' }]}
          >
            <DatePicker 
              showTime 
              format="YYYY-MM-DD HH:mm" 
              style={{ width: '100%' }} 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AuctionList;