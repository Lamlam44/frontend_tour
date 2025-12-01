import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';
// 1. Bổ sung hàm updateInvoice vào import
import { requestCashPayment, createVnPayPaymentUrl, updateInvoice } from '../../services/api';
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
                // --- BƯỚC 1: Cập nhật Payment Method vào Database ---
                
                // Chuẩn bị payload (Cần điền đủ các trường bắt buộc của DTO để tránh lỗi 400)
                const updatePayload = {
                    tourId: invoice.tour?.tourId, // Bắt buộc (@NotBlank)
                    numberOfPeople: invoice.numberOfPeople, // Bắt buộc (@NotNull)
                    paymentMethod: 'CASH', // Cập nhật trường này
                    
                    // Các trường khác giữ nguyên hoặc gửi kèm để đảm bảo tính toàn vẹn
                    customerName: invoice.customerName,
                    customerPhone: invoice.customerPhone,
                    customerEmail: invoice.customerEmail,
                    status: invoice.status,
                    discountAmount: invoice.discountAmount,
                    taxAmount: invoice.taxAmount,
                    serviceFee: invoice.serviceFee,
                    totalAmount: invoice.totalAmount,
                    // Nếu có account, gửi accountId
                    accountId: invoice.account?.accountId,
                    // Nếu có accommodation, gửi ID
                    accommodationId: invoice.accommodation?.accommodationId || invoice.tour?.accommodation?.accommodationId
                };

                // Gọi API Update
                await updateInvoice(invoice.invoiceId, updatePayload);

                // --- BƯỚC 2: Gửi yêu cầu xác nhận qua Email (Logic cũ) ---
                await requestCashPayment(invoice.invoiceId);
                
                setSuccessMessage('Phương thức thanh toán Tiền mặt đã được cập nhật. Vui lòng kiểm tra email để xem hướng dẫn.');
                setTimeout(() => navigate('/'), 4000); 

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
            setErrorMessage(error.message || 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.');
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