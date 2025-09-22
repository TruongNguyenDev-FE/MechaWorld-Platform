import axios from '../../utils/axios-custome';
import Cookies from 'js-cookie';

// Axios request interceptor
axios.interceptors.request.use((config) => {
    const accessToken = Cookies.get('access_token'); // Lấy token từ cookie
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Axios response interceptor để xử lý lỗi 401 (token hết hạn)
axios.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Gọi API refresh token để lấy access_token mới
        try {
            const refreshToken = Cookies.get('refresh_token'); // Lấy refresh_token từ cookie
            const response = await axios.post('/auth/refresh', { refreshToken });
            const newAccessToken = response.data.access_token;

            // Lưu access_token mới vào cookie
            Cookies.set('access_token', newAccessToken);

            // Thêm access_token mới vào header và thử lại request
            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
        } catch (refreshError) {
            // Xử lý lỗi refresh token (ví dụ: đăng xuất người dùng)
            console.error('Refresh token failed:', refreshError);
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});


// ************ GET - POST - PUT - PATCH - DELETE **************


// 1. GET List Cart Items
export const GetCart = () => {
    return axios.get('/cart/items');
}


// 2. POST Add Items into Cart
export const AddToCart = (id) => {
    return axios.post(`/cart/items`, {
        gundam_id: id,
    },)
}


// 3. DELETE Remove Cart Item
export const DeleteCart = (id) => {
    return axios.delete(`/cart/items/${id}`);
}