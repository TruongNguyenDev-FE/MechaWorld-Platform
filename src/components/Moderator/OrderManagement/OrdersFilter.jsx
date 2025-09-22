import {
    Input,
    Select,
    Card,
    Row,
    Col,
    DatePicker,
} from "antd";
import {
    SearchOutlined,
    FilterOutlined,
    CalendarOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function OrderFilters({
    onSearch,
    onFilterStatus,
    onFilterPaymentStatus,
    onFilterPaymentMethod,
    onFilterPriority,
    onDateRangeChange
}) {
    return (
        <Card className="mb-6">
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={6}>
                    <Input.Search
                        placeholder="Tìm mã đơn, khách hàng, cửa hàng..."
                        onSearch={onSearch}
                        onChange={(e) => onSearch(e.target.value)}
                        enterButton={<SearchOutlined />}
                        allowClear
                        size="middle"
                    />
                </Col>
                <Col xs={12} sm={6} md={3}>
                    <Select
                        placeholder="Trạng thái đơn"
                        allowClear
                        onChange={onFilterStatus}
                        style={{ width: '100%' }}
                        suffixIcon={<FilterOutlined />}
                    >
                        <Option value="pending">🕐 Chờ xử lý</Option>
                        <Option value="processing">📦 Đang xử lý</Option>
                        <Option value="shipping">🚚 Đang giao hàng</Option>
                        <Option value="completed">✅ Hoàn thành</Option>
                        <Option value="failed">❌ Thất bại</Option>
                        <Option value="cancelled">🚫 Đã hủy</Option>
                    </Select>
                </Col>
                <Col xs={12} sm={6} md={3}>
                    <Select
                        placeholder="Thanh toán"
                        allowClear
                        onChange={onFilterPaymentStatus}
                        style={{ width: '100%' }}
                        suffixIcon={<FilterOutlined />}
                    >
                        <Option value="paid">💚 Đã thanh toán</Option>
                        <Option value="pending">🟡 Chờ thanh toán</Option>
                        <Option value="failed">🔴 Thất bại</Option>
                        <Option value="refunded">🟣 Đã hoàn tiền</Option>
                    </Select>
                </Col>
                <Col xs={12} sm={6} md={3}>
                    <Select
                        placeholder="Phương thức"
                        allowClear
                        onChange={onFilterPaymentMethod}
                        style={{ width: '100%' }}
                        suffixIcon={<FilterOutlined />}
                    >
                        <Option value="bank_transfer">🏦 Chuyển khoản</Option>
                        <Option value="ewallet">📱 Ví điện tử</Option>
                        <Option value="credit_card">💳 Thẻ tín dụng</Option>
                        <Option value="cod">💰 COD</Option>
                    </Select>
                </Col>
                <Col xs={12} sm={6} md={3}>
                    <Select
                        placeholder="Độ ưu tiên"
                        allowClear
                        onChange={onFilterPriority}
                        style={{ width: '100%' }}
                        suffixIcon={<FilterOutlined />}
                    >
                        <Option value="high">🔥 Cao</Option>
                        <Option value="normal">📋 Bình thường</Option>
                        <Option value="low">📝 Thấp</Option>
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
            </Row>
        </Card>
    );
};