import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import FilterSidebar from '../../Components/FilterSidebar';
import styles from '../../Assets/CSS/PageCSS/ListPage.module.css';

const hotelFilterGroups = [
    { title: 'Hạng sao', type: 'checkbox', name: 'stars', options: ['5 sao', '4 sao', '3 sao', 'Khác'] },
    { title: 'Tiện nghi', type: 'checkbox', name: 'amenities', options: ['Hồ bơi', 'Wifi miễn phí', 'Bãi đỗ xe', 'Gần biển'] },
    { title: 'Đánh giá', type: 'radio', name: 'rating', options: ['Tuyệt vời 9+', 'Rất tốt 8+', 'Tốt 7+'] }
];

const mockHotels = [
    { id: 101, name: 'Vinpearl Resort & Spa Phú Quốc', price: '2,100,000đ', img: 'https://via.placeholder.com/300x200?text=Vinpearl', rating: '4.9' },
    { id: 102, name: 'InterContinental Danang Sun Peninsula', price: '7,500,000đ', img: 'https://via.placeholder.com/300x200?text=InterContinental', rating: '5.0' },
    { id: 103, name: 'Hotel de l\'Opera Hanoi - MGallery', price: '3,200,000đ', img: 'https://via.placeholder.com/300x200?text=Hanoi+Opera', rating: '4.8' },
    { id: 104, name: 'The Reverie Saigon', price: '8,900,000đ', img: 'https://via.placeholder.com/300x200?text=Reverie+Saigon', rating: '5.0' },
];

function HotelListPage() {
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
                {mockHotels.map(hotel => (
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