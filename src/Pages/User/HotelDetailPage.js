import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/HotelDetailPage.module.css';

function HotelDetailPage() {
    const { hotelId } = useParams();
    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.header}>
                     <h1>Vinpearl Resort & Spa Phú Quốc (ID: {hotelId})</h1>
                     <p>⭐ 4.9 (850 đánh giá)</p>
                </div>
                <div className={styles.gallery}>
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070" alt="Main hotel" className={styles.mainPhoto} />
                </div>
                <div className={styles.body}>
                    <div className={styles.content}>
                         <h2>Mô tả</h2>
                         <p>Tọa lạc tại một trong những bãi biển đẹp nhất hành tinh, Vinpearl Resort & Spa Phú Quốc mang đến trải nghiệm nghỉ dưỡng sang trọng...</p>
                         <div className={styles.amenities}>
                             <h3>Tiện nghi</h3>
                             <div className={styles.amenitiesGrid}>
                                 <span className={styles.amenityItem}>🏊 Hồ bơi</span>
                                 <span className={styles.amenityItem}>📶 Wifi miễn phí</span>
                                 <span className={styles.amenityItem}>🍽️ Nhà hàng</span>
                                 <span className={styles.amenityItem}>🏋️ Phòng Gym</span>
                                 <span className={styles.amenityItem}>🏖️ Bãi biển riêng</span>
                                 <span className={styles.amenityItem}>💆 Spa & Massage</span>
                             </div>
                         </div>
                    </div>
                    <aside className={styles.bookingSidebar}>
                        <h3>Giá chỉ từ <span className={styles.price}>2,100,000đ</span> / đêm</h3>
                        <div className={styles.bookingForm}>
                            <label>Ngày nhận phòng:</label>
                            <input type="date" />
                            <label>Ngày trả phòng:</label>
                            <input type="date" />
                            <Link to={`/booking/hotel/${hotelId}`}>
                                <button className={styles.bookNowBtn}>Chọn phòng</button>
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default HotelDetailPage;