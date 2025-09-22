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

// 1. GET List all auction requests for moderator
export const GetListAuctionRequestsForModerator = () => {
    return axios.get('/mod/auction-requests');
}

export const GetListAuctionForModerator = () => {
    return axios.get('/mod/auctions');
}

// 2. PATCH Approve an auction request by moderator
export const ApproveAuctionRequest = (requestID) => {
    return axios.patch(`/mod/auction-requests/${requestID}/approve`);
}

// 3. PATCH Reject an auction request by moderator
export const RejectAuctionRequest = (requestID, reason) => {
    return axios.patch(`/mod/auction-requests/${requestID}/reject`, {
      reason: reason,
    });
  };

// 4. PATCH Update auction time by moderator
export const UpdateAuctionTime = (auctionID, timeData) => {
    return axios.patch(`/mod/auctions/${auctionID}`, timeData);
};

// 5. GET - Lấy danh sách yêu cầu rút tiền
export const GetWithdrawalRequests = () => {
    return axios.get('/mod/withdrawal-requests');
};

export const RejectWithdrawalRequest = (requestID, reason) => {
    console.log('Sending reject request with:', { requestID, reason });
    return axios.patch(`/mod/withdrawal-requests/${requestID}/reject`, {
        reason: reason,
    });
};

export const CompleteWithdrawalRequest = (requestID, transactionReference) => {
    console.log('Sending complete request with:', { requestID, transactionReference });
    return axios.patch(`/mod/withdrawal-requests/${requestID}/complete`, {
        transaction_reference: transactionReference,
    });
};

export const GetModeratorDashboard = () => {
    return axios.get(`/mod/dashboard`);
}