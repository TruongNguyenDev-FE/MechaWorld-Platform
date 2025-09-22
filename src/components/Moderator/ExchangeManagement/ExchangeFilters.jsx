import {
  Card,
  Input,
  Select,
} from "antd";
import {
  FilterOutlined,
  SearchOutlined
} from "@ant-design/icons";

const { Option } = Select;

export default function ExchangeFilters({
    searchText,
    setSearchText,
    filteredExchangeStatus,
    setFilteredExchangeStatus,
    filteredPostStatus,
    setFilteredPostStatus
}) {
    return (
        <Card className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="🔍 Tìm kiếm theo nội dung, người gửi hoặc người đăng bài"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        className="w-full"
                    />
                </div>

                <div className="flex gap-3">
                    <Select
                        placeholder="Trạng thái trao đổi"
                        allowClear
                        value={filteredExchangeStatus}
                        onChange={setFilteredExchangeStatus}
                        className="w-48"
                        suffixIcon={<FilterOutlined />}
                    >
                        <Option value="Chờ xử lí">⏳ Chờ xử lí</Option>
                        <Option value="Đang đóng gói">📦 Đang đóng gói</Option>
                        <Option value="Đang giao hàng">🚚 Đang giao hàng</Option>
                        <Option value="Hoàn tất">✅ Hoàn tất</Option>
                        <Option value="Thất bại">❌ Thất bại</Option>
                        <Option value="Bị từ chối">🚫 Bị từ chối</Option>
                    </Select>

                    <Select
                        placeholder="Trạng thái bài post"
                        allowClear
                        value={filteredPostStatus}
                        onChange={setFilteredPostStatus}
                        className="w-48"
                        suffixIcon={<FilterOutlined />}
                    >
                        <Option value="Đang được đăng">🟢 Đang được đăng</Option>
                        <Option value="Không được đăng">🔴 Không được đăng</Option>
                        <Option value="Đã xong">🔵 Đã xong</Option>
                    </Select>
                </div>
            </div>
        </Card>
    );
}