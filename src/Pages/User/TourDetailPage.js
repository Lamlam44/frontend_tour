import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/TourDetailPage.module.css';
import { getTourById } from '../../services/api';

function TourDetailPage() {
  const { tourId } = useParams();
  const [tourData, setTourData] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const data = await getTourById(tourId);
        setTourData(data);
      } catch (error) {
        console.error(`Error fetching tour with id ${tourId}:`, error);
      }
    };

    fetchTour();
  }, [tourId]);

  if (!tourData) {
    return <div>Loading...</div>;
  }

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
              <Link to={`/booking/${tourId}`} state={{ tourDetails: { id: tourId, name: tourData.title, price: tourData.price } }}>
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