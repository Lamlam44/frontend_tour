import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingConfirmationPage.module.css';

const TourConfirmationDetails = ({ bookingResult, paymentStatus }) => (
    <div className={styles.details}>
        <p className={styles.bookingCode}>Mã đặt tour: <strong>{bookingResult.bookingId}</strong></p>
        <div className={styles.infoGrid}>
            <div className={styles.infoItem}><span>Tour đã đặt:</span><strong>{bookingResult.tourName}</strong></div>
            <div className={styles.infoItem}><span>Khách hàng:</span><strong>{bookingResult.name}</strong></div>
            <div className={styles.infoItem}><span>Tổng chi phí:</span><strong>{bookingResult.totalPrice}</strong></div>
            <div className={styles.infoItem}><span>Thanh toán:</span><strong>{paymentStatus}</strong></div>
        </div>
    </div>
);

function BookingConfirmationPage() {
    const location = useLocation();
    const { bookingResult, fromVnPay } = location.state || {};

    const renderConfirmationContent = () => {
        if (!bookingResult) {
            return <><h2>Không tìm thấy thông tin đặt chỗ</h2><p>Vui lòng thử lại quy trình đặt chỗ từ đầu.</p></>;
        }

        const getPaymentStatus = () => {
            if (fromVnPay) return "Đã thanh toán qua VNPAY";
            if (bookingResult.paymentMethod === 'CASH') return "Thanh toán bằng tiền mặt";
            return "Chờ xử lý";
        };

        const paymentStatus = getPaymentStatus();
        let detailsComponent;
        let title = "Đặt chỗ thành công!";
        let nextSteps;

        title = "Đặt tour thành công!";
        detailsComponent = <TourConfirmationDetails bookingResult={bookingResult} paymentStatus={paymentStatus} />;
        nextSteps = <p>Voucher du lịch đã được gửi đến email của bạn. Nhân viên sẽ liên hệ sớm để xác nhận.</p>;

        return (
            <>
                <h2>{title}</h2>
                <p>Cảm ơn bạn! Thông tin chi tiết đã được gửi đến email <strong>{bookingResult.email || bookingResult.contactInfo.email}</strong>.</p>
                {detailsComponent}
                <div className={styles.nextSteps}>
                    <h4>Các bước tiếp theo</h4>
                    {nextSteps}
                </div>
            </>
        );
    };

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.box}>
                    <span className={styles.successIcon}>✅</span>
                    {renderConfirmationContent()}
                    <Link to="/">
                        <button className={styles.backHomeBtn}>Quay về trang chủ</button>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default BookingConfirmationPage;