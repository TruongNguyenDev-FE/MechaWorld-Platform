import { Collapse, Input, Button, Divider } from 'antd';
import {
    FilterOutlined,
    SearchOutlined,
    HeartOutlined,
    HeartFilled,
    StarOutlined,
    StarFilled
} from '@ant-design/icons';
import { GRADE_LISTS, SERIES_LISTS } from './CollectionContainer';

const FilterPanel = ({
    activeGradeFilter,
    setActiveGradeFilter,
    activeSeriesFilter,
    setActiveSeriesFilter,
    activeSortOption,
    setActiveSortOption,
    searchTerm,
    setSearchTerm,
    showFavorites,
    setShowFavorites,
    showWishlist,
    setShowWishlist
}) => {
    const sortOptions = [
        { label: 'Mới nhất', value: 'newest' },
        { label: 'Giá trị cao nhất', value: 'price-high' },
        { label: 'Giá trị thấp nhất', value: 'price-low' },
        { label: 'Tên A-Z', value: 'name-asc' },
        { label: 'Tên Z-A', value: 'name-desc' }
    ];

    return (
        <Collapse defaultActiveKey={['1']} className="mb-6 shadow-sm">
            <Collapse.Panel
                header={
                    <div className="flex items-center">
                        <FilterOutlined className="mr-2" />
                        <span className="font-medium">Bộ lọc và tìm kiếm</span>
                    </div>
                }
                key="1"
            >
                <div className="mb-4">
                    <Input
                        placeholder="Tìm kiếm theo tên..."
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                        className="mb-4"
                    />

                    {/* <div className="flex flex-wrap gap-2 mb-4">
                        <Button
                            type={showFavorites ? 'primary' : 'default'}
                            icon={showFavorites ? <HeartFilled /> : <HeartOutlined />}
                            onClick={() => setShowFavorites(!showFavorites)}
                        >
                            Yêu thích
                        </Button>
                        <Button
                            type={showWishlist ? 'primary' : 'default'}
                            icon={showWishlist ? <StarFilled /> : <StarOutlined />}
                            onClick={() => setShowWishlist(!showWishlist)}
                        >
                            Mong muốn
                        </Button>
                    </div> */}
                </div>

                <Divider orientation="left">Grade</Divider>
                <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                        type={activeGradeFilter === 'All' ? 'primary' : 'default'}
                        className={activeGradeFilter === 'All' ? 'bg-blue-400' : 'default'}
                        onClick={() => setActiveGradeFilter('All')}
                    >
                        Tất cả
                    </Button>
                    {GRADE_LISTS.map(grade => (
                        <Button
                            key={grade}
                            type={activeGradeFilter === grade ? 'primary' : 'default'}
                            className={activeGradeFilter === grade ? 'bg-blue-400' : 'default'}
                            onClick={() => setActiveGradeFilter(grade)}
                        >
                            {grade}
                        </Button>
                    ))}
                </div>

                {/* <Divider orientation="left">Series</Divider>
                <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                        type={activeSeriesFilter === 'All' ? 'primary' : 'default'}
                        className={activeSeriesFilter === 'All' ? 'bg-blue-400' : 'default'}
                        onClick={() => setActiveSeriesFilter('All')}
                    >
                        Tất cả
                    </Button>
                    {SERIES_LISTS.map(series => (
                        <Button
                            key={series}
                            type={activeSeriesFilter === series ? 'primary' : 'default'}
                            className={activeSeriesFilter === series ? 'bg-blue-400' : 'default'}
                            onClick={() => setActiveSeriesFilter(series)}
                        >
                            {series.length > 15 ? `${series.substring(0, 15)}...` : series}
                        </Button>
                    ))}
                </div> */}

                <Divider orientation="left">Sắp xếp</Divider>
                <div className="flex flex-wrap gap-2">
                    {sortOptions.map(option => (
                        <Button
                            key={option.value}
                            type={activeSortOption === option.value ? 'primary' : 'default'}
                            className={activeSortOption === option.value ? 'bg-blue-400' : 'default'}
                            onClick={() => setActiveSortOption(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </Collapse.Panel>
        </Collapse>
    );
};

export default FilterPanel;