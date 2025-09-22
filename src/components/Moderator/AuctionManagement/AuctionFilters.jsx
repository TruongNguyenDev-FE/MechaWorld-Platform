import {
  Card,
  Input,
  Select,
} from "antd";
import {
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export default function AuctionFilters({
    searchTerm,
    setSearchTerm,
    filteredStatus,
    setFilteredStatus
}) {
    return (
        <Card className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="🔍 Tìm kiếm theo người bán hoặc tên Gundam"
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                        className="w-full"
                    />
                </div>

                <div className="flex gap-3">
                    <Select
                        placeholder="Trạng thái đấu giá"
                        allowClear
                        value={filteredStatus}
                        onChange={setFilteredStatus}
                        className="w-48"
                        suffixIcon={<FilterOutlined />}
                    >
                        <Option value="pending">⏳ Chờ duyệt</Option>
                        <Option value="approved">✅ Đã phê duyệt</Option>
                        <Option value="rejected">❌ Bị từ chối</Option>
                        <Option value="active">🔥 Đang diễn ra</Option>
                        <Option value="completed">🏆 Hoàn thành</Option>
                    </Select>
                </div>
            </div>
        </Card>
    );
  }