import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import React from "react";
import UserProfile from "./UserNavbar";

const GuestNavbar = () => {
    const user = useSelector((state) => state.auth.user);
    const links = [
        { to: "/member/login", text: "Đăng nhập" },
        { to: "/member/signup", text: "Đăng ký" },
    ];

    return (
        <div className="flex items-center space-x-3 relative">
            {user ? (
                <UserProfile user={user} />
            ) : (
                links.map((link, index) => (
                    <React.Fragment key={link.to}>
                        {index > 0 && <div className="h-4 border-l-2 border-black" />}
                        <NavLink
                            to={link.to}
                            className="text-lg font-semibold capitalize text-gray-900 hover:text-gray-500"
                        >
                            {link.text}
                        </NavLink>
                    </React.Fragment>
                ))
            )}
        </div>
    );
};

export default GuestNavbar;
