import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import { Bell } from "lucide-react";
import 'react-toastify/dist/ReactToastify.css';  // Đừng quên thêm CSS của react-toastify

const NotificationIcon = ({ count = 0 }) => {
  // Hàm để hiển thị thông báo
  const notify = () => toast("Notification!");

  return (
    <div>
      <button onClick={notify}>
          <div className="relative inline-block">
          {/* Bell Icon */}
          <div className="p-2 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 cursor-pointer">
            <Bell className="w-6 h-6 text-gray-800" />
          </div>
          {/* Notification Badge */}
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </div>
      </button>  {/* Nút bấm để hiển thị thông báo */}
      <ToastContainer />  {/* Phần chứa thông báo */}
    </div>
  );
}

export default NotificationIcon;

