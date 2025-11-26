import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import FilterSidebar from '../../Components/FilterSidebar';
import styles from '../../Assets/CSS/PageCSS/ListPage.module.css';
import { getAccommodations } from '../../services/api';

const hotelFilterGroups = [
    { title: 'Hạng sao', type: 'checkbox', name: 'stars', options: ['5 sao', '4 sao', '3 sao', 'Khác'] },
    { title: 'Tiện nghi', type: 'checkbox', name: 'amenities', options: ['Hồ bơi', 'Wifi miễn phí', 'Bãi đỗ xe', 'Gần biển'] },
    { title: 'Đánh giá', type: 'radio', name: 'rating', options: ['Tuyệt vời 9+', 'Rất tốt 8+', 'Tốt 7+'] }
];

function HotelListPage() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getAccommodations();
        setHotels(data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Ưu Đãi Khách Sạn Tốt Nhất</h1>
          <p>Tìm kiếm và đặt phòng với giá không thể tốt hơn</p>
        </div>
        <div className={styles.layout}>
            <FilterSidebar filterGroups={hotelFilterGroups} />
            <main className={styles.mainContent}>
                <div className={styles.grid}>
                {hotels.map(hotel => (
                    <Link to={`/hotels/${hotel.id}`} key={hotel.id} className={styles.card}>
                    <img src={hotel.img} alt={hotel.name} />
                    <div className={styles.cardContent}>
                        <h3>{hotel.name}</h3>
                        <p className={styles.rating}>⭐ {hotel.rating}</p>
                        <p className={styles.price}>Từ {hotel.price} / đêm</p>
                    </div>
                    </Link>
                ))}
                </div>
            </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HotelListPage;