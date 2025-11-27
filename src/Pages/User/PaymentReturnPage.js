import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../../Components/Header.js';
import Footer from '../../Components/Footer.js';
import styles from '../../Assets/CSS/PageCSS/PaymentReturnPage.module.css';
import { verifyVnPayPayment } from '../../services/api'; // API để xác thực lại giao dịch

function PaymentReturnPage() {
    const [searchParams] = useSearchParams();
    const [paymentStatus, setPaymentStatus] = useState('processing'); // 'processing', 'success', 'failed'
    const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');

    useEffect(() => {
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const allParams = Object.fromEntries(searchParams.entries());

        // --- XÁC THỰC PHÍA SERVER ---
        // Gửi toàn bộ params về backend để xác thực chữ ký điện tử (secure hash)
        // Điều này để đảm bảo dữ liệu không bị thay đổi trên đường đi.
        const verifyPayment = async () => {
            try {
                // Backend sẽ kiểm tra vnp_SecureHash và cập nhật trạng thái đơn hàng
                await verifyVnPayPayment(allParams);

                if (vnp_ResponseCode === '00') {
                    setPaymentStatus('success');
                    setMessage('Thanh toán thành công! Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi.');
                } else {
                    setPaymentStatus('failed');
                    setMessage('Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.');
                }
            } catch (error) {
                setPaymentStatus('failed');
                setMessage('Có lỗi xảy ra trong quá trình xác thực thanh toán. Vui lòng liên hệ bộ phận hỗ trợ.');
                console.error("Lỗi xác thực thanh toán:", error);
            }
        };

        verifyPayment();

    }, [searchParams]);

    const renderIcon = () => {
        if (paymentStatus === 'success') {
            return <div className={`${styles.icon} ${styles.success}`}>✓</div>;
        }
        if (paymentStatus === 'failed') {
            return <div className={`${styles.icon} ${styles.failed}`}>✗</div>;
        }
        return null; // Không hiển thị icon khi đang xử lý
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
                        <Link to="/my-bookings" className={styles.actionBtn}>
                            Xem lại các tour đã đặt
                        </Link>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default PaymentReturnPage;