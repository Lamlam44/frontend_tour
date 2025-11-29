import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Điều chỉnh đường dẫn import nếu cần

const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth(); // Bạn cần thêm hàm này vào AuthContext (xem phần dưới)

    useEffect(() => {
        const token = searchParams.get('token');
        
        if (token) {
            // 1. Lưu token vào localStorage
            localStorage.setItem('token', token);
            
            // 2. (Tuỳ chọn) Gọi API lấy thông tin user nếu backend không trả về user trong URL
            // Ở đây ta giả định token đã chứa đủ thông tin hoặc sẽ fetch user profile sau
            
            // 3. Cập nhật state AuthContext (nếu có)
             if (loginWithToken) {
                 loginWithToken(token);
             }

            // 4. Redirect về trang chủ hoặc Dashboard
            // Logic đơn giản: Redirect về Home, AuthContext sẽ tự check token và update UI
            window.location.href = '/'; 
        } else {
            // Nếu không có token, quay về login báo lỗi
            navigate('/login?error=auth_failed');
        }
    }, [searchParams, navigate, loginWithToken]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h2>Đang xử lý đăng nhập...</h2>
        </div>
    );
};

export default OAuth2RedirectHandler;