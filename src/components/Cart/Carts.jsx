import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import { Button, Checkbox, Card, Divider, Spin } from 'antd';
import { ShopOutlined, DeleteOutlined, ShoppingCartOutlined, RightOutlined, ShoppingOutlined } from '@ant-design/icons';

import EmptyCart from "../../assets/image/empty-cart.png";
import { useSelector } from 'react-redux';
// import { ShowErrorModal } from '../Errors/ErrorModal';

const Carts = () => {
  const { cartItems, removeFromCart, loading } = useCart();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);


  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();


  // Nhóm sản phẩm theo seller_name
  const groupedCartItems = groupCartItemsBySeller(cartItems);


  // Xử lý chọn tất cả
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedRowKeys(checked ? cartItems.map(item => item.cart_item_id) : []);
  };


  // Tính tổng tiền
  const totalPrice = () => {
    return cartItems
      .filter(item => selectedRowKeys.includes(item.cart_item_id))
      .reduce((sum, item) => sum + item.gundam_price, 0);
  };


  // Xử lý chọn một mục
  const handleSelectItem = (cartItemId) => {
    const newSelectedRowKeys = selectedRowKeys.includes(cartItemId)
      ? selectedRowKeys.filter(key => key !== cartItemId)
      : [...selectedRowKeys, cartItemId];

    setSelectedRowKeys(newSelectedRowKeys);
    setSelectAll(newSelectedRowKeys.length === cartItems.length);
  };


  // Xử lý xóa sản phẩm
  const handleRemoveItem = (cartItemId) => {
    removeFromCart(cartItemId);

    // Cập nhật selectedRowKeys sau khi xóa
    setSelectedRowKeys(selectedRowKeys.filter(key => key !== cartItemId));
  };


  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item =>
      selectedRowKeys.includes(item.cart_item_id)
    );

    navigate('/checkout', { state: { selectedItems } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container max-w-7xl mx-auto mt-36 flex flex-col justify-center items-center h-[500px] mb-14 px-4">
        <div className="flex flex-col items-center">
          {/* Empty Cart Image - Replace with your actual image path */}
          <img
            src={EmptyCart}
            alt="Giỏ hàng trống"
            className="w-64 h-64 mb-6 opacity-70"
          />

          {/* Empty Cart Text */}
          <h2 className="text-xl font-medium text-gray-600 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-6 text-base">Bạn chưa có sản phẩm nào trong giỏ hàng</p>

          {/* Continue Shopping Button */}
          <Link to="/product">
            <Button
              type="primary"
              size="large"
              className="bg-blue-500 hover:bg-blue-600 flex items-center"
              icon={<ShoppingOutlined />}
            >
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto mt-36 mb-20 px-4">
      <div className='w-full'>
        <div className="flex items-center justify-center mb-6">
          <div className='w-fit flex items-center bg-white shadow-lg rounded-full p-5'>
            <div className='mt-2'>
              <ShoppingCartOutlined className="text-4xl text-blue-500" />
            </div>
            <h1 className="text-lg font-bold mt-2 px-2 uppercase">Giỏ hàng của bạn</h1>
          </div>
        </div>
      </div>

      {/* Thanh chọn tất cả */}
      {/* <Card className="mb-4 shadow-sm">
        <div className="flex items-center">
          <Checkbox checked={selectAll} onChange={handleSelectAll}>
            <span className="font-medium">Chọn tất cả ({cartItems.length} sản phẩm)</span>
          </Checkbox>
        </div>
      </Card> */}

      {/* Duyệt qua từng seller và hiển thị sản phẩm */}
      {Object.entries(groupedCartItems).map(([sellerName, items]) => (
        <Card key={sellerName} className="mb-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
              <ShopOutlined className="text-lg text-gray-500 mr-2" />
              <span className="font-semibold">{sellerName}</span>
            </div>
          </div>

          <Divider className="my-2" />

          {items.map(item => (
            <div key={item.cart_item_id} className="py-4 flex items-center border-b last:border-b-0">
              <Checkbox
                checked={selectedRowKeys.includes(item.cart_item_id)}
                onChange={() => handleSelectItem(item.cart_item_id)}
                className="mr-4"
              />

              <div className="flex flex-1 items-center">
                <img
                  src={item.gundam_image_url}
                  alt={item.gundam_name}
                  className="w-20 h-20 object-cover rounded border border-gray-200 mr-4"
                />

                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-1">{item.gundam_name}</h3>
                  <p className="text-red-500 font-semibold text-lg">
                    {item.gundam_price.toLocaleString()} đ
                  </p>
                </div>

                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveItem(item.cart_item_id)}
                  className="ml-4"
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </Card>
      ))}

      {/* Thanh thanh toán cố định */}
      <div className="bg-white shadow-lg border-t border-gray-200 z-10 py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAll}
              className="mr-4"
            >
              <span className="font-medium">Tất cả ({cartItems.length})</span>
            </Checkbox>
          </div>

          <div className="flex items-center">
            <div className="mr-6">
              <span className="text-gray-600 mr-2">Tổng thanh toán:</span>
              <span className="text-xl font-bold text-red-500">{totalPrice().toLocaleString()} đ</span>
            </div>

            <Button
              danger
              type="primary"
              size="large"
              icon={<RightOutlined />}
              className="border-none flex items-center"
              disabled={selectedRowKeys.length === 0}
              onClick={handleCheckout}
            >
              Mua Hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hàm nhóm sản phẩm theo seller_name
const groupCartItemsBySeller = (cartItems) => {
  return cartItems.reduce((acc, item) => {
    const sellerName = item.seller_name;
    if (!acc[sellerName]) {
      acc[sellerName] = [];
    }
    acc[sellerName].push(item);
    return acc;
  }, {});
};

export default Carts;