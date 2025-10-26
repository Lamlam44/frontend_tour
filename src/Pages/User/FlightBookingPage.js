import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css'; // Tái sử dụng CSS chung

// Component con để xử lý form cho từng hành khách
function PassengerForm({ number }) {
    return (
        <div className={styles.passengerForm}>
            <p>Hành khách {number} (Người lớn)</p>
            <div className={styles.formGrid}>
                <input type="text" placeholder="Họ và Tên (như trên giấy tờ)*" required />
                <input type="date" placeholder="Ngày sinh" required/>
                <select>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                </select>
            </div>
        </div>
    );
}

function FlightBookingPage() {
    const { flightId } = useParams();
    // Dựa vào flightId, bạn có thể fetch thông tin chuyến bay để hiển thị tóm tắt

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1>Hoàn tất đặt vé máy bay</h1>
                <div className={styles.layout}>
                    <div className={styles.customerInfoForm}>
                        <PassengerForm number={1} />
                        {/* Có thể thêm nút "Thêm hành khách" để render thêm PassengerForm */}

                        <h3 className={styles.sectionTitle}>Dịch vụ bổ sung</h3>
                        <div className={styles.addOnSection}>
                            <label><input type="checkbox"/> Thêm 23kg hành lý ký gửi (550,000đ)</label>
                            <label><input type="checkbox"/> Bảo hiểm du lịch (99,000đ)</label>
                        </div>
                        
                        <h3 className={styles.sectionTitle}>Thông tin liên hệ</h3>
                        <div className={styles.formGrid}>
                            <input type="text" placeholder="Họ và tên người liên hệ*" required />
                            <input type="email" placeholder="Email (để nhận vé)*" required />
                            <input type="tel" placeholder="Số điện thoại*" required />
                        </div>
                    </div>

                    <aside className={styles.summary}>
                        <h3>Tóm tắt chuyến bay</h3>
                        <div className={styles.summaryItem}>
                            <p>Chuyến bay VNA-{flightId}</p>
                            <span>1,550,000đ</span>
                        </div>
                         <div className={styles.summaryItem}>
                            <p>Thuế và phí</p>
                            <span>Đã bao gồm</span>
                        </div>
                        <hr/>
                        <div className={`${styles.summaryItem} ${styles.total}`}>
                            <p>Tổng cộng</p>
                            <span>1,550,000đ</span>
                        </div>
                        <Link to="/confirmation?type=flight">
                            <button className={styles.confirmBtn}>Thanh toán & Hoàn tất</button>
                        </Link>
                    </aside>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default FlightBookingPage;