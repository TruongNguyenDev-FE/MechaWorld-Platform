import React, { memo, useState, useEffect, useCallback } from 'react';
import { Skeleton, Table, Tag, Tooltip, message } from 'antd';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { getUser } from '../../../apis/User/APIUser';

const ParticipantsTable = memo(({ participants }) => {
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sử dụng useCallback để memoize hàm fetch
  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const details = {};
      const uniqueUserIds = [...new Set(participants.map(p => p.user_id))];
      
      // Fetch song song để tối ưu hiệu suất
      await Promise.all(
        uniqueUserIds.map(async userId => {
          try {
            const response = await getUser(userId);
            details[userId] = response.data;
          } catch (err) {
            console.error(`Failed to fetch user ${userId}:`, err);
            details[userId] = { 
              full_name: 'Người dùng ẩn danh',
              email: 'Không có thông tin',
              avatar_url: null
            };
          }
        })
      );
      
      setUserDetails(details);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Không thể tải thông tin người tham gia');
      message.error('Có lỗi khi tải thông tin người tham gia');
    } finally {
      setLoading(false);
    }
  }, [participants]);

  useEffect(() => {
    if (participants.length > 0) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [participants, fetchUserDetails]);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Người tham gia',
      dataIndex: 'user_id',
      key: 'user',
      render: (userId) => (
        <div className="flex items-center">
          <span>{userDetails[userId]?.full_name || 'Đang tải...'}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'user_id',
      key: 'email',
      render: (userId) => userDetails[userId]?.email || '--',
    },
    {
      title: 'Thời gian tham gia',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_refunded',
      key: 'status',
      render: (isRefunded) => (
        <Tag color={isRefunded ? 'volcano' : 'green'}>
          {isRefunded ? 'Đã hoàn tiền' : 'Đang giữ cọc'}
        </Tag>
      ),
    },
  ];

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <InfoCircleOutlined className="text-red-500 mr-2" />
        <span>{error}</span>
        <button 
          onClick={fetchUserDetails}
          className="ml-4 text-blue-500 hover:text-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-6">
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        Chưa có người tham gia
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Table
        columns={columns}
        dataSource={participants}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          hideOnSinglePage: true,
        }}
        scroll={{ x: 800 }}
        locale={{
          emptyText: 'Không có dữ liệu',
        }}
      />
      
      <div className="mt-2 text-sm text-gray-500">
        <Tooltip title="Số tiền cọc sẽ được hoàn lại nếu không thắng phiên đấu giá">
          <InfoCircleOutlined className="mr-1" />
          Tổng số người tham gia: {participants.length}
        </Tooltip>
      </div>
    </div>
  );
});

export default ParticipantsTable;