import { notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';

const errorMessages = {
    400: {
        'phone_number required': 'Tài khoản chưa đăng ký số điện thoại! <br/> Bạn cần phải có số điện thoại để có thể mua hàng.',
    },
    401: {
        'unauthorized': 'Bạn chưa đăng nhập hoặc phiên đã hết hạn.',
    },
    402: {
        'payment failed': 'Thanh toán không thành công. Vui lòng kiểm tra lại thông tin.',
    },
    404: {
        'email not found': 'Email hoặc Mật khẩu chưa chính xác. Vui lòng thử lại.',
        '404 page not found':'Email hoặc Mật khẩu chưa chính xác. Vui lòng thử lại.',
    },
    422: {
        'insufficient balance': 'Số dư ví không đủ!<br/>Vui lòng nạp thêm để thanh toán.'
    },
    500: {
        'server error': 'Hệ thống đang bận. Vui lòng thử lại sau.',
    },
    default: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
};

const getErrorMessage = (status, errorKey) => {
    const statusErrors = errorMessages[status];
    const errorStr = typeof errorKey === 'string' ? errorKey.toLowerCase() : '';

    if (statusErrors) {
        for (const key in statusErrors) {
            if (errorStr.includes(key.toLowerCase())) {
                return statusErrors[key];
            }
        }
    }

    return errorMessages.default;
};

// 🧩 Gọi hàm này khi có lỗi từ API để hiển thị notification
export const ShowErrorNotification = (status, errorKey) => {
    notification.error({
        message: 'THÔNG BÁO LỖI!',
        description: (
            <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: getErrorMessage(status, errorKey) }}
            />
        ),
        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
        placement: 'topRight',
        duration: 5,
    });
};
