import { FaStore } from "react-icons/fa";
import { NavLink } from "react-router-dom";

import RegisterShop from "./RegisterShop";

const RegisterShopLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-md py-4">
                <div className="container mx-auto flex gap-4 justify-between items-center px-6">
                    <span className="text-blue-400 font-bold text-3xl flex items-center">
                        <FaStore className="text-4xl mr-2" /> MechaWorld
                    </span>
                    <span className="text-xl uppercase font-semibold text-black">
                        Đăng Ký Trở Thành Nhà Bán Hàng
                    </span>

                    <NavLink to="/" className="text-lg font-medium text-gray-400 hover:text-blue-500">
                        Quay về Trang Chủ?
                    </NavLink>
                </div>
            </header>

            {/* Nội dung chính */}
            <main className="flex-grow flex items-center justify-center bg-gray-100 py-10">
                <div className="w-full max-w-7xl bg-white shadow-md rounded-lg p-6">
                    <RegisterShop /> {/* Form đăng ký shop */}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
                © {new Date().getFullYear()} MechaWorld Seller. All rights reserved.
            </footer>
        </div>
    );
};

export default RegisterShopLayout;
