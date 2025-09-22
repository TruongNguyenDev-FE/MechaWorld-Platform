import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Spin, Typography } from 'antd';

// import CollectionStats from './CollectionStats';
import CollectionHeader from './CollectionHeader';
import FilterPanel from './FilterPanel';
import CollectionItems from './CollectionItems';
import DetailModal from './DetailModal';

import { GetGundamByID, getUser } from '../../apis/User/APIUser';

const { Title } = Typography;

// Constants
export const GRADE_LISTS = [
  'Entry Grade',
  'High Grade',
  'Real Grade',
  'Master Grade',
  'Perfect Grade',
  'Super Deformed'
];

export const SERIES_LISTS = [
  'Mobile Suit Gundam',
  'Mobile Suit Gundam: Iron-Blooded Orphans',
  'Mobile Suit Gundam SEED',
  'Mobile Suit Gundam Wing',
  'Mobile Suit Gundam Unicorn',
  'Mobile Fighter G Gundam'
];

const CollectionContainer = ({ setIsCreating, setIsUpdating, setGundamData }) => {
  const user = useSelector((state) => state.auth.user);

  // State for collection data
  const [collectionData, setCollectionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);

  // State for filters
  const [activeGradeFilter, setActiveGradeFilter] = useState('All');
  const [activeSeriesFilter, setActiveSeriesFilter] = useState('All');
  const [activeSortOption, setActiveSortOption] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  // UI state
  const [viewMode, setViewMode] = useState('grid');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Parallel API calls
        const [userResponse, gundamResponse] = await Promise.all([
          getUser(user.id),
          GetGundamByID(user.id, "")
        ]);

        // Process user stats
        const userData = userResponse.data;
        const userStatsData = {
          username: userData.username,
          avatar: userData.avatar || "/api/placeholder/80/80",
          collection_started: userData.collection_started || "2023-01-01",
          total_models: gundamResponse.data.length,
          favorite_series: userData.favorite_series || SERIES_LISTS[0],
          collection_value: calculateCollectionValue(gundamResponse.data)
        };

        setUserStats(userStatsData);
        setCollectionData(gundamResponse.data);
        setFilteredData(gundamResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  // Calculate total value of collection
  const calculateCollectionValue = (collection) => {
    return collection.reduce((total, item) => total + (item.price || 0), 0);
  };

  // Filter data
  useEffect(() => {
    let filtered = [...collectionData].filter(item =>
      ["published", "in store"].includes(item.status)
    );

    // Filter by grade
    if (activeGradeFilter !== 'All') {
      filtered = filtered.filter(item => item.grade === activeGradeFilter);
    }

    // Filter by series
    if (activeSeriesFilter !== 'All') {
      filtered = filtered.filter(item => item.series === activeSeriesFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.series.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by favorite/wishlist
    if (showFavorites) {
      filtered = filtered.filter(item => item.is_favorite);
    }

    if (showWishlist) {
      filtered = filtered.filter(item => item.is_wishlist);
    }

    // Sort data
    switch (activeSortOption) {
      case 'newest':
        filtered.sort((a, b) => b.release_year - a.release_year);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredData(filtered);
  }, [
    collectionData,
    activeGradeFilter,
    activeSeriesFilter,
    activeSortOption,
    searchTerm,
    showFavorites,
    showWishlist
  ]);

  // Show detail modal
  const showDetailModal = (product) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };

  // Toggle favorite
  const toggleFavorite = async (id) => {
    try {
      // Here you would call the API to update the favorite status
      // For now, we just update the state
      setCollectionData(prevData =>
        prevData.map(item =>
          item.gundam_id === id
            ? { ...item, is_favorite: !item.is_favorite }
            : item
        )
      );

      // Add API call to update favorite status
      // await UpdateGundamFavorite(id, !item.is_favorite);

    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (id) => {
    try {
      setCollectionData(prevData =>
        prevData.map(item =>
          item.gundam_id === id
            ? { ...item, is_wishlist: !item.is_wishlist }
            : item
        )
      );

      // Add API call to update wishlist status
      // await UpdateGundamWishlist(id, !item.is_wishlist);

    } catch (error) {
      console.error("Error updating wishlist status:", error);
    }
  };
  const handleUpdate = () => {
    setGundamData(selectedProduct);
    setIsUpdating(true);
  }
  return (
    <div className="container max-w-7xl mx-auto mb-6 px-4 py-8 mt-36 min-h-screen bg-white rounded-lg shadow">
      <Title level={2} className="text-center mb-8 uppercase">
        Bộ Sưu Tập Gundam Của Tôi
      </Title>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Collection Stats */}
          {/* {userStats && <CollectionStats stats={userStats} />} */}

          {/* Quick Actions & View Toggle */}
          <CollectionHeader
            setIsCreating={setIsCreating}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* Filter Panel */}
          <FilterPanel
            activeGradeFilter={activeGradeFilter}
            setActiveGradeFilter={setActiveGradeFilter}
            activeSeriesFilter={activeSeriesFilter}
            setActiveSeriesFilter={setActiveSeriesFilter}
            activeSortOption={activeSortOption}
            setActiveSortOption={setActiveSortOption}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            showWishlist={showWishlist}
            setShowWishlist={setShowWishlist}
          />

          {/* Collection Items */}
          <div className="mb-4">
              <Typography.Text type="secondary">
                Hiển thị {filteredData.length} mô hình
              </Typography.Text>
          </div>

          <CollectionItems
            viewMode={viewMode}
            filteredData={filteredData}
            showDetailModal={showDetailModal}
            toggleFavorite={toggleFavorite}
            toggleWishlist={toggleWishlist}
            setIsCreating={setIsCreating}
          />

          {/* Detail Modal */}
          <DetailModal
            visible={detailModalVisible}
            product={selectedProduct}
            onCancel={() => setDetailModalVisible(false)}
            toggleFavorite={toggleFavorite}
            toggleWishlist={toggleWishlist}
            handleUpdate={handleUpdate}
          />
        </>
      )}
    </div>
  );
};

export default CollectionContainer;