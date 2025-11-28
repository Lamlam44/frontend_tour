import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from '../../Components/Header.js';
import Footer from '../../Components/Footer.js';
import styles from '../../Assets/CSS/PageCSS/PaymentReturnPage.module.css';
import { verifyVnPayPayment } from '../../services/api';

function PaymentReturnPage() {
    const [searchParams] = useSearchParams();
    const [paymentStatus, setPaymentStatus] = useState('processing');
    const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');
    const navigate = useNavigate(); // Hook để điều hướng

    const hasVerified = useRef(false);

    useEffect(() => {
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const allParams = Object.fromEntries(searchParams.entries());

        const verifyPayment = async () => {
            if (hasVerified.current) return; 
            hasVerified.current = true;
            
            try {
                console.log("Gửi params xuống Backend:", allParams); // Log 1

                // Gọi Backend để update DB
                const data = await verifyVnPayPayment(allParams);
                
                console.log("Backend trả về:", data); // Log 2

                // Kiểm tra cả 2 điều kiện: VNPay báo 00 VÀ Backend không báo lỗi
                if (vnp_ResponseCode === '00') {
                    setPaymentStatus('success');
                    setMessage('Thanh toán thành công! Đang chuyển hướng...');
                    setTimeout(() => navigate('/tours'), 3000);
                } else {
                    // Trường hợp VNPay trả về mã lỗi (01, 02, 09...)
                    setPaymentStatus('failed');
                    setMessage('Giao dịch bị hủy hoặc lỗi tại ngân hàng.');
                }

            } catch (error) {
                console.error("Lỗi xác thực:", error); // Log 3
                
                // QUAN TRỌNG: Kiểm tra xem lỗi là do mạng hay do Backend báo sai chữ ký
                if (error.response && error.response.status === 400) {
                    setMessage('Lỗi xác thực dữ liệu (Checksum Failed). Vui lòng liên hệ Admin.');
                } else {
                    setMessage('Lỗi kết nối Server.');
                }
                setPaymentStatus('failed');
            }
        };

        // Chỉ chạy khi có tham số trên URL
        if (vnp_ResponseCode) {
            verifyPayment();
        }
    }, [searchParams, navigate]);

    const renderIcon = () => {
        if (paymentStatus === 'success') {
            return <div className={`${styles.icon} ${styles.success}`}>✓</div>;
        }
        if (paymentStatus === 'failed') {
            return <div className={`${styles.icon} ${styles.failed}`}>✗</div>;
        }
        return null;
    };

    return (
        <div>
            <Header />
            <main className={styles.container}>
                <div className={styles.card}>
                    {renderIcon()}
                    <h1>Kết quả thanh toán</h1>
                    <p className={styles.message}>{message}</p>
                    {paymentStatus !== 'processing' && (
                        <Link to="/tours" className={styles.actionBtn}>
                            Quay lại trang danh sách tour
                        </Link>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default PaymentReturnPage;
