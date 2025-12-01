import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
// localhost <=> 127.0.0.1
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8080/api',
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor để tự động thêm token vào mọi request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Thêm "Bearer " prefix cho JWT token
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý response và lỗi
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn hoặc không hợp lệ
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
