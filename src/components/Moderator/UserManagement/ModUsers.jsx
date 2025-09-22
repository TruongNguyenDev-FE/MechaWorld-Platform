import { useState } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Dropdown,
  Avatar,
  Typography,
  Card,
  Row,
  Col,
  Tag,
  Space,
  Badge,
  Modal,
  message,
  DatePicker,
  Divider
} from "antd";
import {
  MoreOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  ShopOutlined,
  CrownOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  ReloadOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Expanded mock data với nhiều thông tin hơn
const userData = [
  {
    key: "1",
    id: "USR001",
    avatar: "https://i.pravatar.cc/50",
    name: "Nguyễn Văn An",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    role: "Member",
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2024-06-01",
    totalOrders: 12,
    totalSpent: 2500000,
  },
  {
    key: "2",
    id: "USR002",
    avatar: "https://i.pravatar.cc/51",
    name: "Trần Thị Bảo",
    email: "tranthib@email.com",
    phone: "0907654321",
    role: "Seller",
    status: "active",
    joinDate: "2024-02-20",
    lastLogin: "2024-05-30",
    totalOrders: 45,
    totalSpent: 8750000,
  },
  {
    key: "3",
    id: "USR003",
    avatar: "https://i.pravatar.cc/52",
    name: "Lê Văn Cường",
    email: "levanc@email.com",
    phone: "0909876543",
    role: "Moderator",
    status: "active",
    joinDate: "2023-12-01",
    lastLogin: "2024-06-01",
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    key: "4",
    id: "USR004",
    avatar: "https://i.pravatar.cc/53",
    name: "Phạm Thị Dung",
    email: "phamthid@email.com",
    phone: "0908765432",
    role: "Member",
    status: "banned",
    joinDate: "2024-03-10",
    lastLogin: "2024-05-15",
    totalOrders: 3,
    totalSpent: 450000,
  },
  {
    key: "5",
    id: "USR005",
    avatar: "https://i.pravatar.cc/54",
    name: "Hoàng Văn Em",
    email: "hoangvane@email.com",
    phone: "0905432109",
    role: "Seller",
    status: "inactive",
    joinDate: "2024-01-05",
    lastLogin: "2024-04-20",
    totalOrders: 28,
    totalSpent: 6200000,
  },
];

const ModUsers = () => {
  const [filteredRole, setFilteredRole] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Thống kê tổng quan
  const stats = {
    totalUsers: userData.length,
    activeUsers: userData.filter(u => u.status === 'active').length,
    members: userData.filter(u => u.role === 'Member').length,
    sellers: userData.filter(u => u.role === 'Seller').length,
    moderators: userData.filter(u => u.role === 'Moderator').length,
    bannedUsers: userData.filter(u => u.status === 'banned').length,
  };

  // Lọc người dùng
  const filteredUsers = userData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filteredRole ? user.role === filteredRole : true;
    const matchesStatus = filteredStatus ? user.status === filteredStatus : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Xử lý xem chi tiết user
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDetailModalVisible(true);
  };

  // Xử lý ban user
  const handleBanUser = (user) => {
    Modal.confirm({
      title: 'Xác nhận khóa tài khoản',
      content: `Bạn có chắc chắn muốn ${user.status === 'banned' ? 'mở khóa' : 'khóa'} tài khoản của ${user.name}?`,
      okText: user.status === 'banned' ? 'Mở khóa' : 'Khóa',
      cancelText: 'Hủy',
      okType: user.status === 'banned' ? 'primary' : 'danger',
      onOk: () => {
        message.success(`${user.status === 'banned' ? 'Mở khóa' : 'Khóa'} tài khoản thành công!`);
      },
    });
  };

  // Actions menu cho từng user
  const getActionItems = (user) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "Xem chi tiết",
      onClick: () => handleViewUser(user),
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Chỉnh sửa",
    },
    {
      type: 'divider',
    },
    {
      key: "ban",
      icon: <DeleteOutlined />,
      label: user.status === 'banned' ? "Mở khóa tài khoản" : "Khóa tài khoản",
      danger: user.status !== 'banned',
      onClick: () => handleBanUser(user),
    },
  ];

  // Render role tag
  const renderRole = (role) => {
    const roleConfig = {
      Member: { color: 'blue', icon: <UserOutlined /> },
      Seller: { color: 'green', icon: <ShopOutlined /> },
      Moderator: { color: 'orange', icon: <CrownOutlined /> },
    };

    const config = roleConfig[role] || { color: 'default', icon: <UserOutlined /> };

    return (
      <Tag color={config.color} icon={config.icon}>
        {role}
      </Tag>
    );
  };

  // Render status tag
  const renderStatus = (status) => {
    const statusConfig = {
      active: { color: 'success', text: 'Hoạt động' },
      inactive: { color: 'warning', text: 'Không hoạt động' },
      banned: { color: 'error', text: 'Đã khóa' },
    };

    const config = statusConfig[status] || { color: 'default', text: status };

    return <Badge status={config.color} text={config.text} />;
  };

  // Columns definition
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => <Text code>{id}</Text>,
    },
    {
      title: "Thông tin người dùng",
      key: "userInfo",
      render: (_, user) => (
        <Space>
          <Avatar src={user.avatar} size={50} icon={<UserOutlined />} />
          <div>
            <div className="font-semibold text-gray-800">{user.name}</div>
            <div className="text-sm text-gray-500 flex items-center">
              <MailOutlined className="mr-1" />
              {user.email}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <PhoneOutlined className="mr-1" />
              {user.phone}
            </div>
          </div>
        </Space>
      ),
      width: 300,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: renderRole,
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: renderStatus,
      width: 130,
    },
    {
      title: "Hoạt động",
      key: "activity",
      render: (_, user) => (
        <div>
          <div className="text-sm">
            <Text strong>{user.totalOrders}</Text> đơn hàng
          </div>
          <div className="text-sm text-gray-500">
            Chi tiêu: <Text strong>{user.totalSpent.toLocaleString()}₫</Text>
          </div>
          <div className="text-xs text-gray-400">
            Đăng ký: {user.joinDate}
          </div>
        </div>
      ),
      width: 150,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, user) => (
        <Dropdown
          menu={{ items: getActionItems(user) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
      width: 80,
      fixed: 'right',
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="mb-2">
            <TeamOutlined className="mr-2" />
            Quản lý Người dùng
          </Title>
          <Text className="text-gray-500">
            Quản lý thông tin và hoạt động của người dùng hệ thống
          </Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />}>Làm mới</Button>
          <Button icon={<ExportOutlined />}>Xuất Excel</Button>
          <Button className="bg-blue-500" type="primary" icon={<PlusOutlined />}>
            Thêm người dùng
          </Button>
        </Space>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên, email, ID..."
              onSearch={setSearchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              enterButton={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Vai trò"
              allowClear
              onChange={setFilteredRole}
              style={{ width: '100%' }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="Member">Member</Option>
              <Option value="Seller">Seller</Option>
              <Option value="Moderator">Moderator</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Trạng thái"
              allowClear
              onChange={setFilteredStatus}
              style={{ width: '100%' }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
              <Option value="banned">Đã khóa</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              placeholder={['Ngày đăng ký từ', 'Ngày đăng ký đến']}
              style={{ width: '100%' }}
              suffixIcon={<CalendarOutlined />}
            />
          </Col>
        </Row>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          pagination={{
            total: filteredUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
          rowSelection={{
            selectedRowKeys: selectedUsers,
            onChange: setSelectedUsers,
          }}
          scroll={{ x: 1200 }}
          className="overflow-hidden"
        />

        {selectedUsers.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <Space>
              <Text>Đã chọn {selectedUsers.length} người dùng</Text>
              <Button size="small">Gửi email hàng loạt</Button>
              <Button size="small" danger>Khóa hàng loạt</Button>
            </Space>
          </div>
        )}
      </Card>

      {/* User Detail Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            <span>Chi tiết người dùng</span>
          </Space>
        }
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Button key="edit" type="primary">
            Chỉnh sửa
          </Button>,
        ]}
        width={600}
      >
        {selectedUser && (
          <div>
            <div className="text-center mb-6">
              <Avatar src={selectedUser.avatar} size={80} icon={<UserOutlined />} />
              <Title level={4} className="mt-2 mb-1">{selectedUser.name}</Title>
              <Space>
                {renderRole(selectedUser.role)}
                {renderStatus(selectedUser.status)}
              </Space>
            </div>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>ID người dùng:</Text>
                <br />
                <Text code>{selectedUser.id}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Email:</Text>
                <br />
                <Text>{selectedUser.email}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Số điện thoại:</Text>
                <br />
                <Text>{selectedUser.phone}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Ngày đăng ký:</Text>
                <br />
                <Text>{selectedUser.joinDate}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Lần cuối đăng nhập:</Text>
                <br />
                <Text>{selectedUser.lastLogin}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Tổng đơn hàng:</Text>
                <br />
                <Text>{selectedUser.totalOrders}</Text>
              </Col>
              <Col span={24}>
                <Text strong>Tổng chi tiêu:</Text>
                <br />
                <Text className="text-lg font-semibold text-green-600">
                  {selectedUser.totalSpent.toLocaleString()}₫
                </Text>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ModUsers;