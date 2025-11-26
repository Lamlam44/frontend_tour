import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';
import { createFlightBooking, processVnPayPayment } from '../../services/api';

function FlightPaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { passengers, contactInfo, flightDetails, fareDetails, addons, totalPrice } = location.state || {};
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    if (!passengers || !flightDetails) {
        return (
            <div>
                <Header />
                <div className={styles.container}><h1>Lỗi</h1><p>Không tìm thấy thông tin đặt vé. Vui lòng thử lại.</p></div>
                <Footer />
            </div>
        );
    }

    const handlePayment = async (paymentMethod) => {
        setIsLoading(true);
        setErrorMessage('');

        const finalBookingData = {
            passengers,
            contactInfo,
            flightDetails,
            fareDetails,
            addons,
            totalPrice,
            paymentMethod,
        };

        if (paymentMethod === 'vnpay') {
            const response = await processVnPayPayment({
                amount: totalPrice.replace(/[^0-9]/g, ''),
                orderInfo: `Thanh toan cho chuyen bay ${flightDetails.id}`
            });
            if (response.success && response.data.paymentUrl) {
                console.log('Redirecting to VNPAY URL:', response.data.paymentUrl);
                setTimeout(() => {
                    navigate('/booking-confirmation', { state: { bookingResult: finalBookingData, fromVnPay: true } });
                }, 1500);
            } else {
                setErrorMessage('Không thể xử lý thanh toán VNPAY.');
                setIsLoading(false);
            }
        } else { // 'cash'
            const response = await createFlightBooking(finalBookingData);
            if (response.success) {
                navigate('/booking-confirmation', { state: { bookingResult: response.data } });
            } else {
                setErrorMessage('Không thể tạo đơn đặt vé.');
                setIsLoading(false);
            }
        }
    };

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1>Chọn phương thức thanh toán</h1>
                <div className={styles.layout}>
                    <div className={styles.customerInfoForm}>
                         <h3>Phương thức thanh toán</h3>
                        <div className={styles.paymentMethods}>
                            <button onClick={() => handlePayment('cash')} disabled={isLoading} className={styles.paymentButton}>
                                {isLoading ? 'Đang xử lý...' : 'Thanh toán bằng Tiền mặt'}
                            </button>
                            <button onClick={() => handlePayment('vnpay')} disabled={isLoading} className={styles.paymentButton}>
                                {isLoading ? 'Đang xử lý...' : 'Thanh toán qua VNPAY'}
                            </button>
                        </div>
                        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    </div>

                    <aside className={styles.summary}>
                        <h3>Tóm tắt đơn hàng</h3>
                        <div className={styles.summaryItem}>
                            <p><strong>Chuyến bay:</strong> {flightDetails.from} - {flightDetails.to}</p>
                        </div>
                        <div className={styles.summaryItem}>
                            <p><strong>Hành khách:</strong> {passengers.length} người</p>
                        </div>
                        <hr />
                        <div className={`${styles.summaryItem} ${styles.total}`}>
                            <p>Tổng cộng</p>
                            <span>{totalPrice}</span>
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default FlightPaymentPage;
