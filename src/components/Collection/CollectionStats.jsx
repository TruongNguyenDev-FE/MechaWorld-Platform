import { Avatar, Typography, Button, Row, Col, Statistic } from 'antd';
import {
    CalendarOutlined,
    TeamOutlined,
    BarChartOutlined,
    TrophyOutlined,
    DollarOutlined,
    FireOutlined,
    StarFilled
} from '@ant-design/icons';

const CollectionStats = ({ stats }) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="flex items-center mb-4 md:mb-0">
                <Avatar size={64} src={stats.avatar} />
                <div className="ml-4">
                    <Typography.Title level={4} className="m-0">{stats.username}</Typography.Title>
                    <Typography.Text type="secondary">
                        <CalendarOutlined className="mr-1" />
                        Bắt đầu sưu tập từ {stats.collection_started}
                    </Typography.Text>
                </div>
            </div>
            <div className="flex items-center">
                <Button type="primary" icon={<TeamOutlined />} className="mr-2">
                    Chia sẻ
                </Button>
                <Button icon={<BarChartOutlined />}>
                    Thống kê
                </Button>
            </div>
        </div>

        <Row gutter={16}>
            <Col xs={12} sm={6}>
                <Statistic
                    title="Số lượng mô hình"
                    value={stats.total_models}
                    prefix={<TrophyOutlined />}
                />
            </Col>
            <Col xs={12} sm={6}>
                <Statistic
                    title="Tổng giá trị"
                    value={stats.collection_value.toLocaleString('vi-VN')}
                    suffix="đ"
                    prefix={<DollarOutlined />}
                />
            </Col>
            <Col xs={12} sm={6}>
                <Statistic
                    title="Dòng phim yêu thích"
                    value={stats.favorite_series}
                    prefix={<FireOutlined />}
                    valueStyle={{ fontSize: '14px' }}
                />
            </Col>
            <Col xs={12} sm={6}>
                <Statistic
                    title="Mô hình hiếm"
                    value={stats.rare_models || 0}
                    prefix={<StarFilled style={{ color: '#faad14' }} />}
                />
            </Col>
        </Row>
    </div>
);

export default CollectionStats;