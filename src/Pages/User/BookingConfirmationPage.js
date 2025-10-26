import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingConfirmationPage.module.css';

function BookingConfirmationPage() {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.box}>
          <span className={styles.successIcon}>✅</span>
          <h2>Đặt tour thành công!</h2>
          <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Thông tin chi tiết đã được gửi đến email của bạn.</p>
          <p className={styles.bookingCode}>Mã đặt chỗ của bạn là: <strong>BKNG123456</strong></p>
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