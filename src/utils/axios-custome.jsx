import axios from 'axios';
import Cookies from 'js-cookie';



const baseURL = 'https://gundam-platform-api.fly.dev/v1';
// const baseURL = '/v1';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const accessToken = Cookies.get('access_token');


// Tạo instance axios với baseURL và header chứa token
const instance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    // `timeout` để chỉ định số mili - giây trước khi request hết giờ.
    // Nếu thời gian request lâu hơn `timeout` thì request sẽ được ngưng giữa chừng.
    timeout: 20000,

    // `withCredentials` biểu thị liệu việc tạo ra request cross-site `Access-Control`
    // thì có cần sử dụng credential hay không.
    withCredentials: true,
});

// Lưu Token tại LocalStorage. Dự kiến sẽ đổi qua Cookie sau
// Đã đổi qua cookie
instance.defaults.headers.common = { 'Authorization': `Bearer ${accessToken}` }

// Thêm một bộ đón chặn request
axios.interceptors.request.use(function (config) {
    // Làm gì đó trước khi request dược gửi đi

    // if (config.url?.startsWith('/cart')) {
    //     const access_token = Cookies.get('access_token');
    //     config.headers.Authorization = `Bearer ${access_token}`
    //   }
    //   const accessToken = Cookies.get('access_token');
    //   console.log("đã qua request checking",accessToken);

    const accessToken = Cookies.get('access_token');
    if (accessToken) {
        // console.log(accessToken);
        config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
        console.warn("Không thấy access_token trong Cookies....");
    }
    return config;

}, function (error) {
    // Làm gì đó với lỗi request
    return Promise.reject(error);
});

// Thêm một bộ đón chặn response
axios.interceptors.response.use(function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response
    return response;
}, function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    return Promise.reject(error);
});


export default instance;
