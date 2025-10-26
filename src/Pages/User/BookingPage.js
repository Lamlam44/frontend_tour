import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';

function BookingPage() {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1>Hoàn tất đặt tour</h1>
        <div className={styles.layout}>
          <div className={styles.customerInfoForm}>
            <h3>Thông tin liên lạc</h3>
            <div className={styles.formGrid}>
              <input type="text" placeholder="Họ và tên*" required />
              <input type="email" placeholder="Email*" required />
              <input type="tel" placeholder="Số điện thoại*" required />
              <input type="text" placeholder="Địa chỉ" />
            </div>
            <h3>Thông tin hành khách</h3>
            <div className={styles.formGrid}>
              <input type="text" placeholder="Họ tên hành khách 1*" required />
              <input type="date" />
            </div>
          </div>
          <aside className={styles.summary}>
            <h3>Tóm tắt chuyến đi</h3>
            <div className={styles.summaryItem}>
              <p>Tour khám phá Đà Nẵng 4N3Đ</p>
              <span>5,200,000đ</span>
            </div>
            <div className={styles.summaryItem}>
              <p>Hành khách</p>
              <span>1 người lớn</span>
            </div>
            <hr/>
            <div className={`${styles.summaryItem} ${styles.total}`}>
              <p>Tổng cộng</p>
              <span>5,200,000đ</span>
            </div>
            <Link to="/confirmation">
                <button className={styles.confirmBtn}>Thanh toán & Hoàn tất</button>
            </Link>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookingPage;