import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';
import { createHotelBooking, processVnPayPayment } from '../../services/api';

function HotelPaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingDetails, hotelDetails } = location.state || {};
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    if (!bookingDetails || !hotelDetails) {
        return (
            <div>
                <Header />
                <div className={styles.container}><h1>Lỗi</h1><p>Không tìm thấy thông tin đặt phòng. Vui lòng thử lại.</p></div>
                <Footer />
            </div>
        );
    }

    const handlePayment = async (paymentMethod) => {
        setIsLoading(true);
        setErrorMessage('');

        const finalBookingData = {
            ...bookingDetails,
            hotelId: hotelDetails.id,
            hotelName: hotelDetails.name,
            totalPrice: hotelDetails.price,
            paymentMethod: paymentMethod,
        };

        if (paymentMethod === 'vnpay') {
            const response = await processVnPayPayment({
                amount: hotelDetails.price.replace(/[^0-9]/g, ''),
                orderInfo: `Thanh toan cho khach san ${hotelDetails.id}`
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
        } else { // 'cash' or 'pay_at_hotel'
            const response = await createHotelBooking(finalBookingData);
            if (response.success) {
                navigate('/booking-confirmation', { state: { bookingResult: response.data } });
            } else {
                setErrorMessage('Không thể tạo đơn đặt phòng.');
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
                        <p>Hoàn tất đặt phòng bằng cách chọn một trong các phương thức dưới đây.</p>
                        <div className={styles.paymentMethods}>
                            <button onClick={() => handlePayment('pay_at_hotel')} disabled={isLoading} className={styles.paymentButton}>
                                {isLoading ? 'Đang xử lý...' : 'Thanh toán tại khách sạn'}
                            </button>
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
                            <p><strong>Khách sạn:</strong> {hotelDetails.name}</p>
                        </div>
                        <div className={styles.summaryItem}>
                            <p><strong>Khách hàng:</strong> {bookingDetails.name}</p>
                        </div>
                        <hr />
                        <div className={`${styles.summaryItem} ${styles.total}`}>
                            <p>Tổng cộng / đêm</p>
                            <span>{hotelDetails.price}</span>
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default HotelPaymentPage;
