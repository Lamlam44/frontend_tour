import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css'; // Dùng chung CSS nhưng nội dung khác

function TourBookingPage() {
    const { tourId } = useParams();
    // Dựa vào tourId, bạn có thể fetch thông tin tour để hiển thị trong tóm tắt

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1>Hoàn tất đặt Tour</h1>
                <div className={styles.layout}>
                    <div className={styles.customerInfoForm}>
                        <h3>Thông tin người liên hệ</h3>
                        <div className={styles.formGrid}>
                            <input type="text" placeholder="Họ và tên*" required />
                            <input type="email" placeholder="Email*" required />
                            <input type="tel" placeholder="Số điện thoại*" required />
                            <input type="text" placeholder="Địa chỉ" />
                        </div>
                        <h3>Thông tin hành khách</h3>
                        <div className={styles.passengerForm}>
                            <p>Hành khách 1 (Người lớn)</p>
                            <div className={styles.formGrid}>
                                <input type="text" placeholder="Họ và tên*" required />
                                <input type="text" placeholder="Giới tính" />
                            </div>
                        </div>
                        {/* Có thể thêm nút "Thêm hành khách" ở đây */}
                    </div>
                    <aside className={styles.summary}>
                        <h3>Tóm tắt chuyến đi</h3>
                        <div className={styles.summaryItem}>
                            <p>Tour khám phá Đà Nẵng (ID: {tourId})</p>
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
                        <Link to="/confirmation?type=tour">
                            <button className={styles.confirmBtn}>Thanh toán & Hoàn tất</button>
                        </Link>
                    </aside>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default TourBookingPage;