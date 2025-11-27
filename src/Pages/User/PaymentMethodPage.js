import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css'; // Reuse styles
import { createInvoice, createVnPayPaymentUrl } from '../../services/api';

function PaymentMethodPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingDetails, itemDetails: tourDetails, totalAmount } = location.state || {}; // Also get totalAmount
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // If data is not passed correctly, render an error state
    if (!bookingDetails || !tourDetails || !totalAmount) { // Added totalAmount check
        return (
            <div>
                <Header />
                <div className={styles.container}>
                    <h1>Lỗi</h1>
                    <p>Không tìm thấy thông tin đặt tour hoặc tổng tiền. Vui lòng thử lại từ đầu.</p>
                </div>
                <Footer />
            </div>
        );
    }

    const handlePayment = async (paymentMethod) => {
        setIsLoading(true);
        setErrorMessage('');

        // Construct invoice data for backend (InvoiceRequestDTO)
        const invoiceData = {
            customerName: bookingDetails.name,
            customerEmail: bookingDetails.email,
            customerPhone: bookingDetails.phone,
            
            // Required fields from InvoiceRequestDTO
            discountAmount: 0.0, // Default to 0.0 for now, as not provided
            taxAmount: 0.0,      // Default to 0.0 for now, as not provided
            totalAmount: totalAmount,
            numberOfPeople: bookingDetails.guestCount || 1, // From bookingDetails
            tourId: tourDetails.id,

            // Optional fields already in DTO
            paymentMethod: paymentMethod, // Will be "CASH" or "VNPAY"
            // accountId: // If available from logged in user (not handled here)
            // promotionIds: // If applicable (not handled here)
        };
        
        let invoiceResult;
        // First, create the invoice to get an ID
        const invoiceResponse = await createInvoice(invoiceData);
        
        if (invoiceResponse.success) { // Assuming backend returns { success: true, data: invoiceObject }
            invoiceResult = invoiceResponse.data; // This should contain the InvoiceResponseDTO with id
            const invoiceId = invoiceResult.id; // Assuming the created invoice object has an 'id' field

            if (paymentMethod === 'cash') {
                // For cash, invoice is already considered created
                navigate('/booking-confirmation', { state: { invoiceResult: invoiceResult } });
            } else if (paymentMethod === 'vnpay') {
                const amountToSend = String(invoiceResult.totalAmount).replace(/[^0-9]/g, ''); // Ensure amount is clean number string
                
                const vnpayResponse = await createVnPayPaymentUrl({
                    invoiceId: invoiceId, // Use the ID from the created invoice
                    amount: amountToSend,
                    orderInfo: `Thanh toan cho hoa don ${invoiceId}`
                });

                if (vnpayResponse.success && vnpayResponse.data.paymentUrl) {
                    console.log('Redirecting to VNPAY URL:', vnpayResponse.data.paymentUrl);
                    window.location.href = vnpayResponse.data.paymentUrl; // Redirect to VNPAY
                } else {
                    setErrorMessage('Không thể tạo liên kết thanh toán VNPAY. Vui lòng thử lại.');
                    setIsLoading(false);
                    // Optionally, delete the created invoice if VNPAY link creation fails
                    // await deleteInvoice(invoiceId); // Need a deleteInvoice API and service for this
                }
            }
        } else {
            setErrorMessage(invoiceResponse.error || 'Không thể tạo hóa đơn. Vui lòng thử lại.');
            setIsLoading(false);
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
                                onClick={() => handlePayment('CASH')} 
                                disabled={isLoading}
                                className={styles.paymentButton}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Thanh toán bằng Tiền mặt'}
                            </button>
                            <button 
                                onClick={() => handlePayment('VNPAY')} 
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
