import React, { useEffect, useState } from 'react';
import { Table, Tag, Avatar, Tooltip } from 'antd';
import { formatDisplayTime } from './dateFormat';

const AuctionHistory = ({ bids, participants, startingPrice, currentPrice, bidIncrement }) => {
  const [dataSource, setDataSource] = useState([]);
  const [highlightedRow, setHighlightedRow] = useState(null);

  // Cập nhật datasource khi bids thay đổi
  useEffect(() => {
    const formattedData = bids.map(bid => ({
      key: bid.id || bid.timestamp,
      timestamp: bid.timestamp,
      user: bid.user || { full_name: 'Ẩn danh' },
      price: bid.price,
      type: bid.type,
      isNew: bid.isNew // Thêm trạng thái mới
    }));
    
    setDataSource(formattedData);

    // Highlight bid mới nhất
    if (bids.length > 0 && bids[0].isNew) {
      setHighlightedRow(bids[0].id);
      const timer = setTimeout(() => setHighlightedRow(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [bids]);

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time) => formatDisplayTime(time),
      width: 150,
    },
    {
      title: 'Người đấu giá',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <div className="flex items-center gap-2">
          <Avatar src={user?.avatar_url} size="small">
            {user?.full_name?.charAt(0) || 'A'}
          </Avatar>
          <span>{user?.full_name || 'Ẩn danh'}</span>
          {highlightedRow === user.id && (
            <span className="text-green-500 animate-pulse">🆕</span>
          )}
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price, record) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{price?.toLocaleString() || '0'} VNĐ</span>
          {record.type === 'bid' && (
            <Tag color={price === currentPrice ? 'green' : 'default'}>
              {price === currentPrice ? 'Hiện tại' : 'Đã bị vượt'}
            </Tag>
          )}
        </div>
      ),
      align: 'right',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'bid' ? 'blue' : 'purple'}>
          {type === 'bid' ? 'Đặt giá' : 'Tham gia'}
        </Tag>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        rowClassName={(record) => 
          highlightedRow === record.key ? 'highlight-row' : ''
        }
        locale={{
          emptyText: 'Chưa có lịch sử đấu giá'
        }}
      />
    </div>
  );
};

export default AuctionHistory;