import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';

function HotelBookingPage() {
    const { hotelId } = useParams();

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1>Hoàn tất đặt phòng Khách sạn</h1>
                <div className={styles.layout}>
                    <div className={styles.customerInfoForm}>
                        <h3>Thông tin khách nhận phòng</h3>
                        <div className={styles.formGrid}>
                            <input type="text" placeholder="Họ và tên người nhận phòng*" required />
                            <input type="email" placeholder="Email liên hệ*" required />
                            <input type="tel" placeholder="Số điện thoại liên hệ*" required />
                        </div>
                         <h3>Yêu cầu đặc biệt (tùy chọn)</h3>
                         <textarea className={styles.specialRequest} placeholder="Ví dụ: Phòng không hút thuốc, tầng cao..."></textarea>
                    </div>
                    <aside className={styles.summary}>
                        <h3>Tóm tắt đặt phòng</h3>
                        <div className={styles.summaryItem}>
                            <p>Vinpearl Resort (ID: {hotelId})</p>
                            <span>2,100,000đ</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <p>Thời gian</p>
                            <span>1 đêm</span>
                        </div>
                        <hr/>
                        <div className={`${styles.summaryItem} ${styles.total}`}>
                            <p>Tổng cộng</p>
                            <span>2,100,000đ</span>
                        </div>
                        <Link to="/confirmation?type=hotel">
                            <button className={styles.confirmBtn}>Thanh toán & Hoàn tất</button>
                        </Link>
                    </aside>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default HotelBookingPage;