import { Row, Col, Empty, Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import GundamCard from './GundamCard';
import TableView from './TableView';
import GalleryView from './GalleryView';

const EmptyCollection = ({ onAddNew }) => (
    <Empty
        description={
            <div>
                <Typography.Title level={4}>Chưa có mô hình nào</Typography.Title>
                <Typography.Paragraph>
                    Bạn chưa có mô hình Gundam nào trong bộ sưu tập. Hãy thêm mô hình đầu tiên!
                </Typography.Paragraph>
            </div>
        }
    >
        <Button type="primary" className='bg-blue-500' icon={<PlusOutlined />} onClick={onAddNew}>
            Thêm mô hình
        </Button>
    </Empty>
);

const CollectionItems = ({ viewMode, filteredData, showDetailModal, toggleFavorite, toggleWishlist, setIsCreating }) => {
    if (filteredData.length === 0) {
        return <EmptyCollection onAddNew={() => setIsCreating(true)} />;
    }

    switch (viewMode) {
        case 'grid':
            return (
                <Row gutter={[24, 24]} justify="start">
                    {filteredData.map((item) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={item.gundam_id}>
                            <GundamCard
                                item={item}
                                onClick={showDetailModal}
                                onToggleFavorite={toggleFavorite}
                                onToggleWishlist={toggleWishlist}
                            />
                        </Col>
                    ))}
                </Row>
            );
        case 'table':
            return (
                <TableView
                    data={filteredData}
                    showDetailModal={showDetailModal}
                    toggleFavorite={toggleFavorite}
                    toggleWishlist={toggleWishlist}
                />
            );
        case 'gallery':
            return (
                <GalleryView
                    data={filteredData}
                    showDetailModal={showDetailModal}
                />
            );
        default:
            return null;
    }
};

export default CollectionItems;