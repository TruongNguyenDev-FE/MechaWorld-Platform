import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaClipboardList, FaStore } from "react-icons/fa";

import Cookies from "js-cookie";
import PropTypes from 'prop-types';

import CartContext from "./CartContext";
import ChatBox from "../components/Chat/ChatBox";
import { logout } from "../features/auth/authSlice";
import Notification from "../components/Notification/Notification";

const UserNavbar = ({ user }) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    let timeoutId = null;
    // console.log(user);
    // const navigate = useNavigate();
    const dispatch = useDispatch();


    // Hover Enter hiện dropdown
    const handleMouseEnter = () => {
        clearTimeout(timeoutId);
        setIsDropdownOpen(true);
    };


    // Hover Leave thoát Dropdown
    const handleMouseLeave = () => {
        timeoutId = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 100);
    };


    // Hàm Logout
    const handleLogout = () => {
        dispatch(logout());
        Cookies.remove("access_token");
        Cookies.remove("user");

        setTimeout(() => {
            // navigate('/');
            window.location.href = "/";
        }, 50);
    };



    // Danh sách List Dropdown Menu
    const menuItems = [
        { to: "/register-shop", icon: <FaStore className="mr-2 text-green-600" />, label: "Đăng ký bán hàng", role: "member" },
        { to: "/shop/dashboard", icon: <FaStore className="mr-2 text-green-600" />, label: "Quản lý Shop", role: "seller" },
        { to: "/member/profile/account", icon: <FaUser className="mr-2 text-blue-600" />, label: "Tài khoản" },
        { to: "/member/profile/orders/regular-auction", icon: <FaClipboardList className="mr-2 text-yellow-500" />, label: "Đơn hàng" },
        { to: "#", icon: <FaSignOutAlt className="mr-2 text-red-500" />, label: "Đăng xuất", onClick: handleLogout },
    ];

    // Lọc menu dựa trên role
    const filteredMenu = menuItems.filter(item => !item.role || item.role === user?.role);

    return (
        <>
            <div className="space-x-6 flex items-center">

                {/* Cart */}
                <CartContext />
                <div className="h-6 border-l-2 border-l-black"></div>

                {/* Thông báo Component */}
                <Notification />
                <div className="h-6 border-l-2 border-l-black"></div>


                {/* Chat Box */}
                <ChatBox />
                <div className="h-6 border-l-2 border-l-black"></div>

                <div
                    className="user-icon relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button className="btn text-xl space-x-4 hover:text-blue-700 flex justify-center items-center m-0">
                        <span className="text-sm font-semibold max-w-[140px] truncate">
                            {user?.full_name}
                        </span>
                        <img
                            src={user?.avatar_url}
                            className="w-[40px] h-[40px] rounded-full bg-white"
                            alt="avatar"
                        />
                    </button>

                    {isDropdownOpen && (
                        <div
                            data-aos="zoom-in"
                            data-aos-duration="300"
                            className="absolute right-0 mt-2 min-w-[200px] bg-white border rounded-lg shadow-lg z-50"
                        >
                            {filteredMenu.map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.to}
                                    onClick={item.onClick}
                                    className="flex items-center text-base px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                    {item.icon} {item.label}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </>
    );
}

UserNavbar.propTypes = {
    user: PropTypes.shape({
        avatar_url: PropTypes.string,
        full_name: PropTypes.string,
        role: PropTypes.string
    }).isRequired
};

export default UserNavbar