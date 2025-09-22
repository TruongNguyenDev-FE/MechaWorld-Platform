import { Tabs, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { BarChartOutlined, ShopOutlined } from '@ant-design/icons';

import { getUserAddresses } from '../../../apis/User/APIUser';

// Import components
import DashboardTab from './DashboardTab';
import ShopInfoTab from './ShopInfoTab';

import { updateShopInfo } from '../../../features/user/userSlice';
import { GetShopInfoById, UpdateShopName } from '../../../apis/Seller Profile/APISellerProfile';
import ShopUpgradePlan from './ShopUpgradePlan';
import { GetOrder } from '../../../apis/Sellers/APISeller';

const { TabPane } = Tabs;

const ShopDashboard = () => {
  // State management
  const [shopInfo, setShopInfo] = useState({});
  const [originalShopName, setOriginalShopName] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [formattedShopData, setFormattedShopData] = useState({});
  const [shopData, setShopData] = useState({});

  // const userId = useSelector((state) => state.auth.user.id);
  const user = useSelector((state) => state.auth.user);
  const sellerPlan = useSelector((state) => state.user.sellerPlan);
  const dispatch = useDispatch()


  // Fetch initial data
  useEffect(() => {
    // console.log(sellerPlan);
    // Get InfoShop
    GetShopInfoById(user.id)
      .then((res) => {
        setShopInfo(res.data.seller_profile.shop_name);
        setOriginalShopName(res.data.seller_profile.shop_name);
        // console.log("res info", res);

      })
      .catch((error) => {
        console.error("Error fetching shopInfo: ", error);
      });

    // Get user addresses
    getUserAddresses(user.id)
      .then((res) => {
        setAddresses(res.data);
      })
      .catch((error) => {
        console.error("Error fetching seller address status: ", error);
      });
     GetOrder(user.id)
    .then((res) => {
      if (res.status === 200) {
        const data = res.data;
        if (data == null ) {
          console.log("No orders found for this user.");
          setShopData([]); 
          return;
        }
        // Lọc và map dữ liệu
        const formattedOrderData = data
          .filter((order) => order.order.status === "completed") // Lọc đơn hàng đã hoàn tất
          .flatMap((order) =>
            order.order_items.map((item) => ({
              type: order.order.type,
              value: order.order.items_subtotal,
              grade: item.grade,
            }))
          );

        console.log("Formatted Order Data:", formattedOrderData);
        setShopData(formattedOrderData); // Cập nhật state shopData
      }
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
      message.error("Lỗi khi tải đơn hàng");
    });
  }, [user.id]);


  // Combine shop info and address data
  useEffect(() => {
    if (Object.keys(shopInfo).length > 0 && addresses.length > 0) {
      // Dò tìm address Nhận hàng (is_pickup_address)
      const pickupAddress = addresses.find(addr => addr.is_pickup_address === true) || addresses[0];

      // Format Address để hiển thị
      const formattedAddress = pickupAddress ?
        `${pickupAddress.detail}, ${pickupAddress.ward_name}, ${pickupAddress.district_name}, ${pickupAddress.province_name}` :
        "Chưa thiết lập địa chỉ lấy hàng";

      // Combine shop info with address
      const combinedData = {
        ...shopInfo,
        pickup_address: formattedAddress
      };

      setFormattedShopData(combinedData);
    }
  }, [shopInfo, addresses]);


  // HÀM CẬP NHẬT SHOP NAME
  const handleShopInfoUpdate = async (values) => {
    try {
      // Giả sử values là một đối tượng có thuộc tính shop_name
      const newShopName = values.shop_name || values;

      // Gọi API để cập nhật tên shop
      await UpdateShopName(newShopName, user.id);
      // console.log("res update shop_name", res);

      // console.log("shopInfo trigger", shopInfo);

      // Cập nhật state shopInfo
      const updatedShopInfo = {
        ...shopInfo,
        shop_name: newShopName
      };

      // console.log("Update ShopInfo into state", updatedShopInfo);

      // Cập nhật state và Redux
      setShopInfo(updatedShopInfo);
      setOriginalShopName(newShopName);
      dispatch(updateShopInfo(updatedShopInfo));

      // Cập nhật formattedShopData
      setFormattedShopData(prev => ({
        ...prev,
        shop_name: newShopName
      }));

      message.success('Cập nhật thông tin shop thành công!');
    } catch (error) {
      console.log("Error update ShopInfo:", error);
      message.error('Cập nhật thông tin shop thất bại!');
    }
  };

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Dashboard
            </span>
          }
          key="1"
        >
          <DashboardTab shopData={shopData}  />
        </TabPane>

        <TabPane
          tab={
            <span>
              <ShopOutlined />
              Thông tin Shop
            </span>
          }
          key="2"
        >
          <ShopInfoTab
            shopInfo={formattedShopData}
            originalShopName={originalShopName}
            onUpdateShopInfo={handleShopInfoUpdate}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <ShopOutlined />
              Gói dịch vụ
            </span>
          }
          key="3"
        >
          <ShopUpgradePlan
            shopInfo={formattedShopData}
            sellerPlan={sellerPlan}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ShopDashboard;