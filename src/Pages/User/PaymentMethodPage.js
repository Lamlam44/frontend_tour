import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';
import { createInvoice, createVnPayPaymentUrl } from '../../services/api';

const formatPrice = (price) => {
    if (typeof price !== 'number') return '0 đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

function PaymentMethodPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lấy dữ liệu an toàn từ state
    const { 
        bookingDetails, 
        itemDetails: tourDetails, 
        displayTotalAmount, // Chỉ để hiển thị
        transactionData     // Dữ liệu quan trọng: { tourId, quantity, promotionIds }
    } = location.state || {};

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    if (!bookingDetails || !tourDetails || !transactionData) {
        return <div className={styles.container}>Lỗi: Thiếu thông tin đặt tour.</div>;
    }

    const handlePayment = async (paymentMethod) => {
        setIsLoading(true);
        setErrorMessage('');

        // Payload gửi về Backend (Khớp với InvoiceRequestDTO)
        const invoicePayload = {
            customerName: bookingDetails.name,
            customerEmail: bookingDetails.email,
            customerPhone: bookingDetails.phone,
            
            tourId: transactionData.tourId,
            numberOfPeople: transactionData.quantity,
            
            // Gửi danh sách ID khuyến mãi để Backend tự tính
            promotionIds: transactionData.promotionIds, 
            
            paymentMethod: paymentMethod,
            
            // Gửi 0 hoặc null, Backend sẽ ghi đè giá trị này
            totalAmount: 0, 
            discountAmount: 0,
            taxAmount: 0
        };
        
        try {
            // 1. Tạo hóa đơn - Backend tính tiền và trả về số tiền thật
            const invoiceResponse = await createInvoice(invoicePayload);
            
            if (invoiceResponse && invoiceResponse.invoiceId) { 
                const realAmount = invoiceResponse.totalAmount; // Số tiền Backend chốt

                if (paymentMethod === 'CASH') {
                    setSuccessMessage(`Đặt tour thành công! Vui lòng thanh toán: ${formatPrice(realAmount)}`);
                    setTimeout(() => navigate('/tours'), 3000);
                } else if (paymentMethod === 'VNPAY') {
                    // 2. Tạo link thanh toán với số tiền Backend vừa trả về
                    // (Hoặc chỉ gửi invoiceId, Backend tự query lại tiền)
                    const vnpayUrl = await createVnPayPaymentUrl({
                        invoiceId: invoiceResponse.invoiceId,
                        amount: realAmount, // Đảm bảo khớp với DB
                        orderInfo: `Thanh toan hoa don ${invoiceResponse.invoiceId}`
                    });

                    if (vnpayUrl) window.location.href = vnpayUrl;
                    else throw new Error('Lỗi tạo link thanh toán');
                }
            } else {
                throw new Error(invoiceResponse.message || 'Lỗi server');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.paymentTitle}>Chọn phương thức thanh toán</div>
                <div className={styles.layout}>
                    <div className={styles.customerInfoForm}>
                        {successMessage ? (
                            <div className={styles.successMessage}>{successMessage}</div>
                        ) : (
                            <>
                                <h3>Phương thức thanh toán</h3>
                                <div className={styles.paymentMethods}>
                                    <button onClick={() => handlePayment('CASH')} disabled={isLoading} className={styles.paymentButton}>
                                        {isLoading ? 'Đang xử lý...' : 'Tiền mặt'}
                                    </button>
                                    <button onClick={() => handlePayment('VNPAY')} disabled={isLoading} className={styles.paymentButton}>
                                        {isLoading ? 'Đang xử lý...' : 'VNPAY'}
                                    </button>
                                </div>
                                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                            </>
                        )}
                    </div>

                    <aside className={styles.summary}>
                        <h3>Tóm tắt đơn hàng</h3>
                        <div className={styles.summaryItem}>
                            <p><strong>Tour:</strong> {tourDetails.name}</p>
                        </div>
                        <div className={styles.summaryItem}>
                            <p><strong>Khách hàng:</strong> {bookingDetails.name}</p>
                        </div>
                        <div className={styles.summaryItem}>
                            <p><strong>Số lượng:</strong> {transactionData.quantity}</p>
                        </div>
                        <hr />
                        <div className={`${styles.summaryItem} ${styles.total}`}>
                            <p>Tổng cộng (Dự kiến)</p>
                            {/* Hiển thị giá Frontend tính cho user xem trước */}
                            <span>{formatPrice(displayTotalAmount)}</span>
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PaymentMethodPage;