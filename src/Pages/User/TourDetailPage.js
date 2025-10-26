import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/TourDetailPage.module.css';

const tourData = {
  title: 'Khám phá Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ',
  rating: 4.7, reviews: 250, price: '5,200,000đ',
  images: [ 'https://images.unsplash.com/photo-1569509831962-d7b385a4a4e5?q=80&w=1964' ],
  itinerary: [
    { day: 1, title: 'Đón sân bay - Khám phá Hội An', details: 'Xe và HDV đón quý khách tại sân bay Đà Nẵng...' },
    { day: 2, title: 'Bà Nà Hills - Cầu Vàng', details: 'Trải nghiệm cáp treo đạt 4 kỷ lục thế giới...' },
    { day: 3, title: 'Tắm biển Mỹ Khê - Mua sắm', details: 'Tự do tắm biển tại bãi biển Mỹ Khê...' },
    { day: 4, title: 'Tiễn sân bay', details: 'Ăn sáng tại khách sạn, xe đưa quý khách ra sân bay...' },
  ],
};

function TourDetailPage() {
  const { tourId } = useParams();
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{tourData.title} (ID: {tourId})</h1>
          <p>⭐ {tourData.rating} ({tourData.reviews} đánh giá)</p>
        </div>
        <div className={styles.gallery}>
          <img src={tourData.images[0]} alt="Main tour" className={styles.mainPhoto} />
        </div>
        <div className={styles.body}>
          <div className={styles.content}>
            <h2>Lịch trình chi tiết</h2>
            {tourData.itinerary.map(item => (
              <div key={item.day} className={styles.itineraryItem}>
                <h3>Ngày {item.day}: {item.title}</h3>
                <p>{item.details}</p>
              </div>
            ))}
          </div>
          <aside className={styles.bookingSidebar}>
            <h3>Giá chỉ từ <span className={styles.price}>{tourData.price}</span> / khách</h3>
            <div className={styles.bookingForm}>
              <label>Chọn ngày khởi hành:</label>
              <input type="date" />
              <label>Số lượng khách:</label>
              <input type="number" defaultValue="1" min="1" />
              <Link to={`/booking/tour/${tourId}`}>
                  <button className={styles.bookNowBtn}>Đặt ngay</button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TourDetailPage;