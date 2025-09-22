import { GetCart, DeleteCart, AddToCart } from '../apis/Cart/APICart';
import { createContext, useState, useContext, useEffect } from 'react';

import Cookies from 'js-cookie';

// Tạo Context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch giỏ hàng từ API
    const fetchCartItems = async () => {
        const accessToken = Cookies.get('access_token');
        if (!accessToken) {
            setLoading(false);
            return;
        }

        try {
            const response = await GetCart(accessToken); // Truyền access_token vào API
            if (Array.isArray(response.data)) {
                setCartItems(response.data);
                // console.log("Số lượng sản phẩm trong giỏ hàng sau khi fetch:", response.data.length);
            } else {
                setCartItems([]);
                // console.log("Giỏ hàng trống sau khi fetch");
            }
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            setCartItems([]);
            console.log("Lỗi khi fetch giỏ hàng:", err.message);
        }
    };

    // Hàm thêm sản phẩm vào giỏ hàng
    // Trong CartContext.js
    const addToCart = async (item) => {
        try {
            const response = await AddToCart(item.id);
            const newItem = response.data;

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            setCartItems(prevItems => {
                const existingItem = prevItems.find(i => i.gundam_id === newItem.gundam_id);
                if (existingItem) {
                    return prevItems; // Không làm gì nếu đã có
                }
                return [...prevItems, newItem];
            });

            return newItem; // Trả về item mới để có thể sử dụng nếu cần
        } catch (error) {
            console.error("Error adding to cart:", error);
            throw error; // Ném lỗi để component có thể bắt
        }
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = async (itemId) => {
        try {
            await DeleteCart(itemId); // Gọi API xóa sản phẩm
            setCartItems((prevItems) => {
                const updatedItems = prevItems.filter((item) => item.cart_item_id !== itemId);
                // console.log("Số lượng sản phẩm trong giỏ hàng sau khi xóa:", updatedItems.length);
                return updatedItems;
            });
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    // Fetch giỏ hàng khi component mount hoặc access_token thay đổi
    useEffect(() => {
        fetchCartItems();
    }, []);

    // Theo dõi sự thay đổi của cartItems
    useEffect(() => {
        // console.log("Số lượng sản phẩm trong giỏ hàng:", cartItems.length);
    }, [cartItems]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, loading, error }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook để sử dụng Context
export const useCart = () => useContext(CartContext);