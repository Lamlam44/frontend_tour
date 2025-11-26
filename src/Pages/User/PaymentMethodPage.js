import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css'; // Reuse styles
import { createBooking, processVnPayPayment } from '../../services/api';

function PaymentMethodPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingDetails, tourDetails } = location.state || {};
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // If data is not passed correctly, render an error state
    if (!bookingDetails || !tourDetails) {
        return (
            <div>
                <Header />
                <div className={styles.container}>
                    <h1>Lỗi</h1>
                    <p>Không tìm thấy thông tin đặt tour. Vui lòng thử lại từ đầu.</p>
                </div>
                <Footer />
            </div>
        );
    }

    const handlePayment = async (paymentMethod) => {
        setIsLoading(true);
        setErrorMessage('');

        const finalBookingData = {
            ...bookingDetails,
            tourId: tourDetails.id,
            tourName: tourDetails.name,
            totalPrice: tourDetails.price,
            paymentMethod: paymentMethod,
        };

        if (paymentMethod === 'cash') {
            const response = await createBooking(finalBookingData);
            if (response.success) {
                // Navigate to confirmation page with booking details
                navigate('/booking-confirmation', { state: { bookingResult: response.data } });
            } else {
                setErrorMessage('Không thể tạo đơn đặt tour. Vui lòng thử lại.');
                setIsLoading(false);
            }
        } else if (paymentMethod === 'vnpay') {
            const response = await processVnPayPayment({
                amount: tourDetails.price.replace(/[^0-9]/g, ''), // Send amount as a number
                orderInfo: `Thanh toan cho tour ${tourDetails.id}`
            });
            if (response.success && response.data.paymentUrl) {
                // Redirect to VNPAY's payment gateway
                // In a real app, backend provides a full URL to redirect to
                // a page that handles the VNPAY logic.
                // After payment, VNPAY will redirect back to a `returnUrl` specified
                // by the backend, which could be our confirmation page.
                // For this simulation, we'll just navigate there directly.
                console.log('Redirecting to VNPAY URL:', response.data.paymentUrl);
                
                // Giả lập redirect và quay về
                setTimeout(() => {
                     navigate('/booking-confirmation', { state: { bookingResult: finalBookingData, fromVnPay: true } });
                }, 1500);

            } else {
                setErrorMessage('Không thể xử lý thanh toán VNPAY. Vui lòng thử lại.');
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
                        <p>Lựa chọn hình thức thanh toán phù hợp với bạn.</p>
                        <div className={styles.paymentMethods}>
                            <button 
                                onClick={() => handlePayment('cash')} 
                                disabled={isLoading}
                                className={styles.paymentButton}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Thanh toán bằng Tiền mặt'}
                            </button>
                            <button 
                                onClick={() => handlePayment('vnpay')} 
                                disabled={isLoading}
                                className={styles.paymentButton}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Thanh toán qua VNPAY'}
                            </button>
                        </div>
                        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    </div>

                    <aside className={styles.summary}>
                        <h3>Tóm tắt đơn hàng</h3>
                        <div className={styles.summaryItem}>
                            <p><strong>Tour:</strong> {tourDetails.name}</p>
                        </div>
                        <div className={styles.summaryItem}>
                            <p><strong>Khách hàng:</strong> {bookingDetails.name}</p>
                            <span>{bookingDetails.email}</span>
                        </div>
                        <hr />
                        <div className={`${styles.summaryItem} ${styles.total}`}>
                            <p>Tổng cộng</p>
                            <span>{tourDetails.price}</span>
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PaymentMethodPage;
