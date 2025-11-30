import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';
import { requestCashPayment, createVnPayPaymentUrl } from '../../services/api';
import InvoiceDisplay from '../../Components/InvoiceDisplay';

const formatPrice = (price) => {
    if (typeof price !== 'number') return '0 đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

function PaymentMethodPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { invoice } = location.state || {};

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    if (!invoice) {
        return (
            <div>
                <Header />
                <div className={styles.container}>
                    <h1>Lỗi</h1>
                    <p>Không tìm thấy thông tin hóa đơn. Vui lòng thử lại từ đầu.</p>
                </div>
                <Footer />
            </div>
        );
    }

    const handlePayment = async (paymentMethod) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            if (paymentMethod === 'CASH') {
                await requestCashPayment(invoice.invoiceId);
                setSuccessMessage('Yêu cầu thanh toán tiền mặt đã được ghi nhận. Vui lòng kiểm tra email để xem chi tiết và hướng dẫn thanh toán.');
                setTimeout(() => navigate('/'), 4000); // Redirect to homepage

            } else if (paymentMethod === 'VNPAY') {
                const vnpayUrl = await createVnPayPaymentUrl({
                    invoiceId: invoice.invoiceId,
                });

                if (vnpayUrl) {
                    window.location.href = vnpayUrl;
                } else {
                    throw new Error('Lỗi tạo link thanh toán VNPAY');
                }
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.');
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
                                        {isLoading ? 'Đang xử lý...' : 'Thanh toán tiền mặt'}
                                    </button>
                                    <button onClick={() => handlePayment('VNPAY')} disabled={isLoading} className={styles.paymentButton}>
                                        {isLoading ? 'Đang xử lý...' : 'Thanh toán qua VNPAY'}
                                    </button>
                                </div>
                                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                            </>
                        )}
                    </div>

                    <InvoiceDisplay invoice={invoice} />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PaymentMethodPage;