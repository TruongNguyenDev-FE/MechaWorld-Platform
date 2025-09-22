import { Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { message } from 'antd';

import PieChart from './charts/PieChart';
// import ColumnChart from './charts/ColumnChart';
import StatCards from './StatCards';
import { SellerDashboard } from '../../../apis/Seller Profile/APISellerProfile';
import { useSelector } from 'react-redux';


const DashboardTab = ({ shopData }) => {
    // State to track filtered data for charts
    // const [columnData, setColumnData] = useState(Array.isArray(shopData) ? shopData : []);
    const user = useSelector((state) => state.auth.user);
    const [statsData, setStatsData] = useState([]);


    // Chart interaction handlers
    const handlePieElementClick = (grade) => {
        // eslint-disable-next-line no-unused-vars
        const filtered = shopData.filter((item) => item.grade === grade);
        // setColumnData(filtered);
        message.info(`Đang hiển thị dữ liệu cho loại sản phẩm: ${grade}`);
    };

    const handlePieElementDoubleClick = () => {
        // setColumnData(shopData);
        message.info('Đã khôi phục tất cả dữ liệu');
    };

    useEffect(() => {
  SellerDashboard(user?.id).then((response) => {
    if (response?.status === 200) {
      const data = response.data;

      const mappedStatsData = [
        { title: 'Tổng thu nhập', value: data.total_income, color: '#52c41a' },
        { title: 'Đơn hàng hoàn tất', value: data.completed_orders_count, color: '#722ed1' },
        { title: 'Đơn hàng đang xử lý', value: data.processing_orders_count, color: '#eb2f96' },
        { title: 'Thu nhập tháng này', value: data.income_this_month, color: '#faad14' },
        { title: 'Phiên đấu giá đang hoạt động', value: data.active_auctions_count, color: '#13c2c2' },
        { title: 'Yêu cầu đấu giá đang chờ', value: data.pending_auction_requests_count, color: '#ff4d4f' }
      ];

      setStatsData(mappedStatsData);

      // setColumnData(shopData);
    } else {
      message.error('Không thể tải dữ liệu thống kê');
    }
  }).catch((error) => {
    console.error('Error fetching dashboard data:', error);
    message.error('Lỗi khi tải dữ liệu thống kê');
  });
}, []);




    return (
        <div>
            {/* Product Stats Cards */}
            <Row gutter={16} className="mb-6">
                <StatCards stats={statsData} />
            </Row>
            {(shopData.length === 0 ? (
              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={24} style={{ textAlign: 'center', color: '#888' }}>
                  Không có dữ liệu để hiển thị biểu đồ.
                </Col>
              </Row>
            ) : (
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                    <PieChart
                        shopData={shopData}
                        onElementClick={handlePieElementClick}
                        onElementDoubleClick={handlePieElementDoubleClick}
                    />
                </Col>

              </Row>
            ))}
            
        </div>
    );
};

export default DashboardTab;