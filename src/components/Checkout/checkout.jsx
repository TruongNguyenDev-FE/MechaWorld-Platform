import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EnvironmentOutlined, ShopOutlined, MoneyCollectOutlined, InfoCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Card, Button, Radio, Divider, message, Table, Modal, Form, Select, Input, Checkbox, Empty, Tabs, notification, InputNumber } from 'antd';

import { useCart } from '../../context/CartContext';
import { checkWallet } from '../../apis/User/APIUser';
import { CheckoutCart } from '../../apis/Orders/APIOrder';
import { ShowErrorNotification } from "../Errors/ShowErrorNotification";
import { getUserAddresses, postUserAddresses, updateAddress } from '../../apis/User/APIUser';

import axios from 'axios';
import Cookies from 'js-cookie';
import WalletImg from "../../assets/image/icon/iconwallet.png";

const { Option } = Select;

const groupByShop = (items) => {
  return items.reduce((acc, item) => {
    const shopName = item.seller_name;
    if (!acc[shopName]) acc[shopName] = [];
    acc[shopName].push(item);
    return acc;
  }, {});
};

const Checkout = () => {

  const user = useSelector((state) => state.auth.user);
  const userCookie = Cookies.get('user');

  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems } = useCart();
  const [userAddress, setUserAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  // const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [tabPannel, setTabPannel] = useState("1");

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const [isPrimary, setIsPrimary] = useState(true);

  const [addresses, setAddresses] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [rawExpectedDeliveryDate, setRawExpectedDeliveryDate] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');

  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  const userData = JSON.parse(decodeURIComponent(userCookie));
  const selectedItems = location.state?.selectedItems || cartItems;

  const totalPrice = selectedItems.reduce((acc, item) => acc + item.gundam_price, 0);

  const finalPrice = totalPrice + shippingFee;

  const groupedCartItems = groupByShop(selectedItems);

  const calculateShippingFee = async () => {
    if (!userAddress || !selectedItems.length) return;

    setIsCalculatingShipping(true);

    try {
      const shopAddress = {
        district_id: 1454,
        ward_code: "21012"
      };

      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
        {
          from_district_id: shopAddress.district_id,
          from_ward_code: shopAddress.ward_code,
          to_district_id: userAddress.ghn_district_id,
          to_ward_code: userAddress.ghn_ward_code,
          service_id: 53321,
          service_type_id: 2,
          weight: selectedItems.length * 200,
          insurance_value: totalPrice,
          coupon: null
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'token': import.meta.env.VITE_GHN_TOKEN_API,
            'shop_id': import.meta.env.VITE_GHN_SHOP_ID
          }
        }
      );

      const feeData = response.data.data;
      setShippingFee(feeData.total);

      // Tính toán ngày dự kiến giao hàng
      const leadTimeResponse = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime',
        {
          from_district_id: shopAddress.district_id,
          from_ward_code: shopAddress.ward_code,
          to_district_id: userAddress.ghn_district_id,
          to_ward_code: userAddress.ghn_ward_code,
          service_id: feeData.service_id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'token': import.meta.env.VITE_GHN_TOKEN_API
          }
        }
      );

      const leadTimeData = leadTimeResponse.data.data;
      // console.log("leadTimeData", leadTimeData);

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + leadTimeData.leadtime);

      setRawExpectedDeliveryDate(deliveryDate); // Lưu đối tượng Date gốc
      setExpectedDeliveryDate(formatDeliveryDate(deliveryDate)); // Lưu chuỗi đã định dạng

    } catch (error) {
      console.error('Lỗi khi tính phí vận chuyển:', error);
      message.error('Không thể tính phí vận chuyển. Vui lòng thử lại sau.');

      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 3);

      setRawExpectedDeliveryDate(fallbackDate); // Lưu đối tượng Date gốc
      setExpectedDeliveryDate(formatDeliveryDate(fallbackDate));
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const formatDeliveryDate = (date) => {
    // Các ngày trong tuần bằng tiếng Việt
    const daysOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const day = daysOfWeek[date.getDay()];
    const dateNum = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}, ngày ${dateNum} tháng ${month} năm ${year}`;
  };

  const ghn_api = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/';
  const api = axios.create({
    baseURL: ghn_api,
    headers: {
      'Content-Type': 'application/json',
      'token': import.meta.env.VITE_GHN_TOKEN_API
    }
  });

  useEffect(() => {
    if (userAddress && selectedItems.length > 0) {
      calculateShippingFee();
    }
  }, [userAddress, selectedItems]);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const userId = userData.id;
        const addressResponse = await getUserAddresses(userId);
        setAddresses(addressResponse.data);
        const primaryAddress = addressResponse.data.find(addr => addr.is_primary) || addressResponse.data[0] || null;
        setUserAddress(primaryAddress);
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const fetchUserBalance = async () => {
      try {
        const response = await checkWallet(userData.id);
        setUserBalance(response.data.balance);
      } catch (error) {
        console.error('Lỗi khi fetch số dư:', error);
      }
    };
    fetchUserBalance();
    fetchCheckoutData();
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await api.get(`province`);
      let data = response.data.data;
      data = data.filter(province => province.ProvinceID !== 286 && province.ProvinceID !== 290 && province.ProvinceID !== 298 && province.ProvinceID !== 2002);
      setCities(data);
    } catch (error) {
      console.error('Lỗi khi fetch thành phố:', error);
    }
  };

  const fetchDistricts = async (province_id) => {
    try {
      const response = await api.post(`district`, { province_id });
      setDistricts(response.data.data);
    } catch (error) {
      console.error('Lỗi khi fetch quận:', error);
    }
  };

  const fetchWards = async (district_id) => {
    try {
      const response = await api.post(`ward`, { district_id });
      setWards(response.data.data);
    } catch (error) {
      console.error('Lỗi khi fetch phường/xã:', error);
    }
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setDistricts([]);
    setWards([]);
    fetchDistricts(value);
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setWards([]);
    fetchWards(value);
  };

  const onFinishAddress = async (values) => {
    setLoading(true);
    const city = cities.find(city => city.ProvinceID === values.city);
    const district = districts.find(district => district.DistrictID === values.district);
    const ward = wards.find(ward => ward.WardCode === values.ward);

    const addressData = {
      full_name: user.full_name,
      detail: values.detail,
      province_name: city ? city.ProvinceName : "",
      district_name: district ? district.DistrictName : "",
      ward_name: ward ? ward.WardName : "",
      ghn_district_id: values.district,
      ghn_ward_code: values.ward,
      phone_number: values.phone_number || user.phone_number,
      is_primary: isPrimary
    };

    try {
      const response = await postUserAddresses(userData.id, addressData);
      const newAddress = response.data;
      setAddresses([...addresses, newAddress]);
      if (isPrimary) {
        setUserAddress(newAddress);
      }
      message.success("Thêm địa chỉ thành công!");
      // setIsAddressModalVisible(false);
      setTabPannel("1");
      form.resetFields();
    } catch (error) {
      message.error("Lỗi khi thêm địa chỉ!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimaryAddress = async (address) => {
    try {
      await updateAddress(userData.id, address.id, { is_primary: true });
      setUserAddress(address);
      setAddresses(addresses.map(addr => ({
        ...addr,
        is_primary: addr.id === address.id
      })));
      message.success("Đã cập nhật địa chỉ giao hàng!");
    } catch (error) {
      message.error("Lỗi khi cập nhật địa chỉ!");
      console.error(error);
    }
  };

  const handleCheckout = async () => {
    if (!userAddress) {
      notification.error({
        message: "THÔNG BÁO LỖI!",
        description: "Bạn chưa có địa chỉ giao hàng."
      });
      return;
    }

    if (isCalculatingShipping) {
      message.warning("Vui lòng đợi hệ thống tính toán phí vận chuyển");
      return;
    }

    // Procesar cada tienda de forma independiente
    const shops = Object.entries(groupedCartItems);
    // let hasError = false;
    // let errorDetails = null;

    try {
      // Mostrar loading mientras se procesan las órdenes
      message.loading({ content: "Đang xử lý đơn hàng...", key: "orderProcessing", duration: 0 });

      // Iterar a través de cada tienda y crear órdenes por separado
      for (const [shopName, items] of shops) {
        const shopTotal = items.reduce((sum, item) => sum + item.gundam_price, 0);
        const shopShippingFee = Math.round(shippingFee * (items.length / selectedItems.length));

        const orderPayload = {
          buyer_address_id: userAddress.id,
          delivery_fee: shopShippingFee,
          expected_delivery_time: rawExpectedDeliveryDate,
          gundam_ids: items.map(item => item.gundam_id),
          items_subtotal: shopTotal,
          note: note,
          payment_method: paymentMethod,
          seller_id: items[0].seller_id, // Usar el ID de vendedor de esta tienda
          total_amount: shopTotal + shopShippingFee,
          completed_at: null
        };

        // Llamar a la API para crear la orden
        await CheckoutCart(orderPayload);
      }

      // Cerrar notificación de carga y mostrar éxito
      message.destroy("orderProcessing");
      // message.success("Đặt hàng thành công!");
      navigate('/member/profile/orders/regular-auction');
    } catch (error) {
      // Cerrar notificación de carga
      message.destroy("orderProcessing");
      console.error("Checkout error:", error);

      // Obtener detalles del error
      const status = error?.response?.status;
      const errorKey = error?.response?.data?.error || 'unknown';

      // Mostrar notificación de error
      ShowErrorNotification(status, errorKey);
    }
  };

  if (loading) return <div className="text-xl">Loading...</div>;

  return (
    <div className="container mx-auto mt-36 mb-14 text-lg grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-3">
        {/* Địa chỉ */}
        <Card className="mb-4">
          <div className="flex items-center">
            <EnvironmentOutlined className="text-2xl text-red-500 mr-2" />
            {userAddress ? (
              <div className="flex flex-col w-full">
                <div className="flex items-center">
                  <p className="font-semibold text-xl mr-5">{userAddress.full_name} ({userAddress.phone_number})</p>
                  {userAddress.is_primary && (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">Mặc định</span>
                  )}
                </div>
                <p className="text-lg">{userAddress.detail}, {userAddress.ward_name}, {userAddress.district_name}, {userAddress.province_name}</p>
              </div>
            ) : <p className="text-base text-gray-400">Chưa có địa chỉ nhận hàng</p>}
            <Button
              type="link"
              danger
              icon={<PlusCircleOutlined className='mt-1 text-lg' />}
              className="ml-auto text-red-400 text-base"
              onClick={() => setIsAddressModalVisible(true)}
            >
              Cập nhật
            </Button>
          </div>
        </Card>

        <Modal
          title={<h2 className="text-xl font-bold text-blue-600">ĐỊA CHỈ GIAO HÀNG</h2>}
          open={isAddressModalVisible}
          onCancel={() => setIsAddressModalVisible(false)}
          footer={null}
          width={600}
        >
          <Tabs defaultActiveKey={tabPannel}>
            <Tabs.TabPane tab="Địa chỉ đã lưu" key="1">
              {addresses.length > 0 ? (
                <div className="grid gap-3">
                  {addresses.map(address => (
                    <div
                      key={address.id}
                      onClick={() => {
                        setUserAddress(address);
                        setIsAddressModalVisible(false);
                      }}
                      className={`transition-all duration-200 rounded-lg border cursor-pointer p-4 hover:shadow-md ${userAddress?.id === address.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                        }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {address.full_name} ({address.phone_number})
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            {address.detail}, {address.ward_name}, {address.district_name}, {address.province_name}
                          </p>
                        </div>
                        {address.is_primary ? (
                          <span className="px-2 py-0.5 w-20 text-xs font-medium text-white bg-red-500 rounded shadow">
                            Mặc định
                          </span>
                        ) : (
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetPrimaryAddress(address);
                            }}
                            className="text-sm"
                          >
                            Đặt làm địa chỉ giao hàng
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  description="Bạn chưa có địa chỉ nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="my-8"
                />
              )}
            </Tabs.TabPane>

            <Tabs.TabPane tab="Thêm địa chỉ mới" key="2">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinishAddress}
                className="gap-4 mt-4"
              >
                <Form.Item
                  label="Thành phố"
                  name="city"
                  rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
                  className="col-span-1"
                >
                  <Select onChange={handleCityChange} placeholder="Chọn thành phố">
                    {cities.map((city) => (
                      <Option key={city.ProvinceID} value={city.ProvinceID}>
                        {city.ProvinceName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Quận/Huyện"
                  name="district"
                  rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                  className="col-span-1"
                >
                  <Select
                    onChange={handleDistrictChange}
                    placeholder="Chọn quận/huyện"
                    disabled={!selectedCity}
                  >
                    {districts.map((district) => (
                      <Option key={district.DistrictID} value={district.DistrictID}>
                        {district.DistrictName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Phường/Xã"
                  name="ward"
                  rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
                  className="col-span-1"
                >
                  <Select placeholder="Chọn phường/xã" disabled={!selectedDistrict}>
                    {wards.map((ward) => (
                      <Option key={ward.WardCode} value={ward.WardCode}>
                        {ward.WardName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Địa chỉ cụ thể"
                  name="detail"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể' }]}
                  className="col-span-1"
                >
                  <Input placeholder="Ví dụ: Số nhà, tên đường..." />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="phone_number"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                  ]}
                  tooltip={{
                    title: 'Số điện thoại dùng để xác nhận bên vận chuyển khi giao hàng. Để trống sẽ mặc định lấy sđt của người dùng.',
                    icon: <InfoCircleOutlined />,
                  }}
                >
                  <Input
                    placeholder="Nhập số điện thoại"
                    maxLength={10}
                    onKeyPress={(e) => {
                      // Chỉ cho phép nhập số
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      // Loại bỏ ký tự không phải số nhưng giữ nguyên số 0 đầu
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      e.target.value = value;
                    }}
                  />
                </Form.Item>

                <Form.Item className="col-span-2 -mt-2">
                  <Checkbox
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="text-sm"
                  >
                    Đặt làm địa chỉ mặc định
                  </Checkbox>
                </Form.Item>

                <Form.Item className="col-span-2 text-right">
                  <Button type="primary" htmlType="submit" className="bg-blue-500">
                    Lưu địa chỉ
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Modal>

        {/* Nội dung Thanh toán */}
        <Card className="mb-4">
          {Object.keys(groupedCartItems).length > 0 ? (
            Object.entries(groupedCartItems).map(([shopName, items]) => {
              // Tính tổng tiền sản phẩm của shop
              const shopTotal = items.reduce((sum, item) => sum + item.gundam_price, 0);
              // Giả định phí vận chuyển cho shop này
              const shopShippingFee = isCalculatingShipping ? 'Đang tính...' : Math.round(shippingFee * (items.length / selectedItems.length)).toLocaleString() + ' đ';
              // Tổng đơn shop
              const shopFinalTotal = isCalculatingShipping ?
                'Đang tính...' :
                (shopTotal + Math.round(shippingFee * (items.length / selectedItems.length))).toLocaleString() + ' đ';

              return (
                <div key={shopName} className="mb-6 border-b pb-4">
                  {/* Tên Shop */}
                  <div className="flex items-center mt-5 mb-5">
                    <ShopOutlined className="text-xl text-gray-500 mr-2" />
                    <p className="font-semibold text-lg">{shopName}</p>
                  </div>

                  {/* Items Shop đó */}
                  <Table dataSource={items} pagination={false} rowKey="cart_item_id">
                    <Table.Column
                      title="Sản phẩm"
                      key="product"
                      render={(text, record) => (
                        <div className="flex items-center">
                          <img src={record.gundam_image_url} alt={record.gundam_name} className="w-14 h-14 object-cover rounded border border-gray-300 mr-3" />
                          <div>
                            <p className="font-semibold text-sm">{record.gundam_name}</p>
                            <p className="text-xs text-gray-500">{record.seller_name}</p>
                          </div>
                        </div>
                      )}
                      width="75%"
                    />
                    <Table.Column
                      title="Thành tiền"
                      dataIndex="gundam_price"
                      key="gundam_price"
                      render={(price) => `${price.toLocaleString()} đ`}
                      align="right"
                      width="25%"
                    />
                  </Table>

                  {/* Tạm tính cho đơn hàng của shop này */}
                  <div className="bg-gray-50 p-4 rounded mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Tạm tính ({items.length} sản phẩm):</span>
                      <span className="font-medium">{shopTotal.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span className="font-medium">{shopShippingFee}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold">Tổng đơn hàng:</span>
                      <span className="font-semibold text-red-600">{shopFinalTotal}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <p className="text-lg text-gray-500 mb-4">Không có sản phẩm nào để thanh toán</p>
                  <Button type="primary" size="large" className="bg-blue-500" onClick={() => navigate('/product')}>
                    Quay lại mua hàng
                  </Button>
                </div>
              }
              className="py-12"
            />
          )}

          {Object.keys(groupedCartItems).length > 0 && (
            <>
              {/* Ghi chú và vận chuyển tổng */}
              <Card className="mb-4 border-none">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-base mb-2">Ghi chú</p>
                    <input
                      type="text"
                      placeholder="Nhập ghi chú cho shop..."
                      className="w-full p-2 border rounded"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-base mb-2">Thông tin vận chuyển</p>
                    <p className="flex justify-between text-sm text-gray-600">
                      Dự kiến nhận hàng:
                      <span className="font-semibold">
                        {isCalculatingShipping ? 'Đang tính toán...' : expectedDeliveryDate}
                      </span>
                    </p>
                    <p className="flex justify-between text-sm text-gray-600">
                      Tổng phí giao hàng:
                      <span className="font-semibold">
                        {isCalculatingShipping ? 'Đang tính toán...' : `${shippingFee.toLocaleString()} VNĐ`}
                      </span>
                    </p>
                    <p className="flex justify-between font-semibold text-lg mt-2">
                      Tổng thanh toán:
                      <span className="font-semibold text-red-600">{finalPrice.toLocaleString()} VNĐ</span>
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </Card>

        {/* Phương thức thanh toán - Chỉ hiển thị khi có sản phẩm */}
        {Object.keys(groupedCartItems).length > 0 && (
          <Card
            title={<div className="font-bold text-lg">Phương thức thanh toán</div>}
            className="mb-4"
          >
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <Radio value="wallet">
                  <div className="flex items-center justify-between w-full p-2 border border-transparent hover:border-gray-200 rounded-md">
                    <div className="flex items-center">
                      <img src={WalletImg} alt="wallet" className="max-w-[50px] mr-3" />
                      <div>
                        <p className="font-medium text-base">Thanh toán bằng ví ComZone</p>
                        <p className="text-gray-500 text-xs mt-1">
                          Số dư: {userBalance.toLocaleString()} đ
                        </p>
                        {paymentMethod === 'wallet' && userBalance < finalPrice && (
                          <p className="text-red-500 text-xs mt-1">
                            Số dư không đủ. <span className="text-blue-500 cursor-pointer">Nạp thêm</span>
                          </p>
                        )}
                      </div>
                    </div>
                    {paymentMethod === 'wallet' && (
                      <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
                        Đã chọn
                      </div>
                    )}
                  </div>
                </Radio>

                <Radio value="cod">
                  <div className="flex items-center justify-between w-full p-2 border border-transparent hover:border-gray-200 rounded-md">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-100 rounded-md mr-3">
                        <MoneyCollectOutlined className="text-xl text-gray-500" />
                      </div>
                      <p className="font-medium text-base">Thanh toán khi nhận hàng</p>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
                        Đã chọn
                      </div>
                    )}
                  </div>
                </Radio>
              </div>
            </Radio.Group>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="col-span-1">
        <div className="sticky top-20">
          <Card className="">
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold">ĐƠN HÀNG</p>
              <a href="/cart" className="text-blue-500 text-sm">Quay lại giỏ hàng</a>
            </div>
            <p className="text-gray-500 mt-2">{selectedItems.length} sản phẩm</p>
            <Divider />
            <div className="flex justify-between text-lg mt-2">
              <p className="text-gray-600">Tổng tiền hàng:</p>
              <p className="font-semibold">{totalPrice.toLocaleString()} đ</p>
            </div>
            <div className="flex justify-between text-lg mt-2">
              <p className="text-gray-600">Tổng tiền giao hàng:</p>
              <p className="font-semibold">{shippingFee.toLocaleString()} đ</p>
            </div>
            <Divider />
            <div className="flex justify-between text-lg font-bold">
              <p className="text-black">Tổng tiền thanh toán:</p>
              <p className="text-red-500">{finalPrice.toLocaleString()} đ</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Nhấn <span className="font-semibold">Thanh toán</span> đồng nghĩa với việc bạn đã đồng ý với
              <a href="#" className="text-blue-500"> Điều khoản của MechWorld</a>
            </p>
            <Button
              type="primary"
              danger
              className="w-full mt-4 text-lg border-none cursor pb-4 pt-4"
              onClick={handleCheckout}
            >
              THANH TOÁN
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;