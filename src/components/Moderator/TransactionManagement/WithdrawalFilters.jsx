import { Card, Row, Col, Input, Select, DatePicker } from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    CalendarOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const WithdrawalFilters = ({
    onSearch,
    onFilterStatus,
    onFilterRole,
    onDateRangeChange
}) => {
    return (
        <Card className="mb-6">
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={6}>
                    <Input.Search
                        placeholder="Tìm tên, email, mã yêu cầu..."
                        onSearch={onSearch}
                        onChange={(e) => onSearch(e.target.value)}
                        enterButton={<SearchOutlined />}
                        allowClear
                        size="middle"
                    />
                </Col>
                <Col xs={12} sm={6} md={4}>
                    <Select
                        placeholder="Trạng thái"
                        allowClear
                        onChange={onFilterStatus}
                        style={{ width: '100%' }}
                        suffixIcon={<FilterOutlined />}
                    >
                        <Option value="pending">🕐 Chờ xử lý</Option>
                        <Option value="processing">⚡ Đang xử lý</Option>
                        <Option value="completed">✅ Đã hoàn thành</Option>
                        <Option value="rejected">❌ Đã từ chối</Option>
                    </Select>
                </Col>
                <Col xs={12} sm={6} md={4}>
                    <Select
                        placeholder="Loại tài khoản"
                        allowClear
                        onChange={onFilterRole}
                        style={{ width: '100%' }}
                        suffixIcon={<FilterOutlined />}
                    >
                        <Option value="member">👤 Member</Option>
                        <Option value="seller">🏪 Seller</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <RangePicker
                        placeholder={['Từ ngày', 'Đến ngày']}
                        style={{ width: '100%' }}
                        suffixIcon={<CalendarOutlined />}
                        onChange={onDateRangeChange}
                        format="DD/MM/YYYY"
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <Select
                        placeholder="Độ ưu tiên"
                        allowClear
                        style={{ width: '100%' }}
                    >
                        <Option value="high">🔥 Cao</Option>
                        <Option value="normal">📋 Bình thường</Option>
                        <Option value="low">📝 Thấp</Option>
                    </Select>
                </Col>
            </Row>
        </Card>
    );
};

export default WithdrawalFilters;