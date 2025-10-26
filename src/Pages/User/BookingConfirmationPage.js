import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingConfirmationPage.module.css';

// Component con để hiển thị chi tiết cho từng loại
const TourConfirmation = () => (
  <>
    <h2>Đặt tour thành công!</h2>
    <p>Cảm ơn bạn! Voucher du lịch đã được gửi đến email của bạn.</p>
    <p className={styles.bookingCode}>Mã voucher: <strong>VTR-123456</strong></p>
  </>
);

const HotelConfirmation = () => (
  <>
    <h2>Đặt phòng thành công!</h2>
    <p>Cảm ơn bạn! Xác nhận đặt phòng đã được gửi đến email của bạn.</p>
    <p className={styles.bookingCode}>Mã xác nhận: <strong>HTL-987654</strong></p>
  </>
);

const FlightConfirmation = () => (
  <>
    <h2>Đặt vé thành công!</h2>
    <p>Cảm ơn bạn! Vé điện tử đã được gửi đến email của bạn.</p>
    <div className={styles.mainInfo}>
        <div className={styles.infoItem}>
            <span>Mã đặt chỗ (PNR)</span>
            <strong className={styles.pnrCode}>ABCXYZ</strong>
        </div>
        <div className={styles.infoItem}>
            <span>Số vé điện tử</span>
            <strong className={styles.ticketNumber}>123-4567890123</strong>
        </div>
    </div>
    <div className={styles.nextSteps}>
        <h4>Các bước tiếp theo</h4>
        <p>Vui lòng có mặt tại sân bay trước giờ khởi hành ít nhất 2 tiếng và mang theo giấy tờ tùy thân hợp lệ.</p>
    </div>
  </>
);


function BookingConfirmationPage() {
  const [searchParams] = useSearchParams();
  const bookingType = searchParams.get('type');

  const renderConfirmationDetails = () => {
    switch(bookingType) {
      case 'tour':
        return <TourConfirmation />;
      case 'hotel':
        return <HotelConfirmation />;
      case 'flight':
        return <FlightConfirmation />;
      default:
        return <h2>Thanh toán thành công!</h2>;
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.box}>
          <span className={styles.successIcon}>✅</span>
          {renderConfirmationDetails()}
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