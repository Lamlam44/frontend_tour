import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // Thay đổi URL này theo backend của bạn
    timeout: 10000,
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
