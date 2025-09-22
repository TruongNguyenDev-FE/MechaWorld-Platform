import { Button } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useCart } from '../context/CartContext';
import { ShoppingCartOutlined, ArrowRightOutlined } from '@ant-design/icons';

import EmptyCart from "../assets/image/empty-cart.png";

const CartContext = () => {
    const { cartItems, removeFromCart, loading, error } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const cartRef = useRef(null);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.gundam_price, 0);
    };

    // Xử lý click bên ngoài để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [cartRef]);

    // Toggle giỏ hàng khi click vào icon
    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    if (loading) return (
        <div className="cart-section relative">
            <ShoppingCartOutlined className="text-2xl text-black drop-shadow-sm cursor-pointer" />
            <div className="bg-gray-500 absolute -right-2 -bottom-2 text-xs w-4 h-4 flex items-center justify-center text-white rounded-full">
                0
            </div>
        </div>
    );

    if (error) return (
        <div className="cart-section relative">
            <ShoppingCartOutlined className="text-2xl text-black drop-shadow-sm cursor-pointer" />
            <div className="bg-gray-500 absolute -right-2 -bottom-2 text-xs w-4 h-4 flex items-center justify-center text-white rounded-full">
                0
            </div>
        </div>
    );

    return (
        <div className="cart-section relative" ref={cartRef}>
            <div
                className="relative cursor-pointer"
                onClick={toggleCart}
            >
                <ShoppingCartOutlined className="text-2xl text-black drop-shadow-sm transition-all hover:text-blue-500" />
                <div className="bg-gray-500 absolute -right-2 -bottom-2 text-xs w-4 h-4 flex items-center justify-center text-white rounded-full">
                    {cartItems.length}
                </div>
            </div>

            {/* Dropdown khi click */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border z-50">
                    <div className='flex gap-2 items-center border-b p-2 justify-center'>
                        <div className='font-medium text-xl'>
                            <ShoppingCartOutlined className="text-blue-500" />
                        </div>
                        <h1 className="uppercase font-medium">Giỏ hàng của bạn</h1>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {cartItems.length === 0 ? (
                            <div className='flex justify-center'>
                                <div>
                                    <img
                                        src={EmptyCart}
                                        alt="Giỏ hàng trống"
                                        className="w-24 h-24 opacity-70"
                                    />
                                    <p className="text-gray-500 mb-6 text-base">Giỏ hàng trống.</p>
                                </div>
                            </div>
                        ) : (
                            <ul>
                                {cartItems.map((item) => (
                                    <li
                                        key={item.cart_item_id}
                                        className="p-3 border-b flex items-center gap-2 hover:bg-gray-50 transition-all"
                                    >
                                        <img
                                            src={item.gundam_image_url}
                                            alt={item.gundam_name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium truncate">{item.gundam_name}</h4>
                                            <p className="text-red-500 font-medium text-sm">
                                                {item.gundam_price.toLocaleString()} VNĐ
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromCart(item.cart_item_id);
                                            }}
                                            className="text-gray-400 hover:text-red-500 text-lg transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-gray-50 flex items-center justify-between">

                        <div className="p-3 border-b flex justify-between items-center">
                            <h3 className="font-medium">Số lượng: ({cartItems.length})</h3>
                        </div>
                        <Link to="/cart" onClick={() => setIsOpen(false)}>
                            <Button
                                ghost
                                type="primary"
                                size='small'
                                className="w-full bg-blue-500 py-4 text-sm flex items-center justify-center"
                            >
                                Chi tiết giỏ hàng
                                <ArrowRightOutlined className="ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartContext;