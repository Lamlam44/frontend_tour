import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import FilterSidebar from '../../Components/FilterSidebar';
import styles from '../../Assets/CSS/PageCSS/ListPage.module.css';

const tourFilterGroups = [
    { title: 'Sắp xếp theo', type: 'radio', name: 'sort', options: ['Phổ biến', 'Giá thấp đến cao', 'Giá cao đến thấp'] },
    { title: 'Thời lượng', type: 'checkbox', name: 'duration', options: ['1-3 ngày', '4-6 ngày', '7+ ngày'] },
    { title: 'Đánh giá', type: 'radio', name: 'rating', options: ['Từ 5 sao', 'Từ 4 sao', 'Từ 3 sao'] }
];

const mockTours = [
  { id: 1, title: 'Tour Phú Quốc 3N2Đ', price: '2,990,000đ', img: 'https://via.placeholder.com/300x200?text=Phu+Quoc', duration: '3 ngày 2 đêm' },
  { id: 2, title: 'Khám phá Đà Nẵng - Hội An', price: '3,500,000đ', img: 'https://via.placeholder.com/300x200?text=Da+Nang', duration: '4 ngày 3 đêm' },
  { id: 3, title: 'Hà Giang - Mùa hoa tam giác mạch', price: '4,200,000đ', img: 'https://via.placeholder.com/300x200?text=Ha+Giang', duration: '3 ngày 2 đêm' },
  { id: 4, title: 'Về Miền Tây Sông Nước', price: '2,500,000đ', img: 'https://via.placeholder.com/300x200?text=Mien+Tay', duration: '2 ngày 1 đêm' },
];

function TourListPage() {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Tour Du Lịch Hàng Đầu</h1>
          <p>Khám phá những điểm đến tuyệt vời nhất cùng chúng tôi</p>
        </div>
        <div className={styles.layout}>
          <FilterSidebar filterGroups={tourFilterGroups} />
          <main className={styles.mainContent}>
            <div className={styles.grid}>
              {mockTours.map(tour => (
                <Link to={`/tours/${tour.id}`} key={tour.id} className={styles.card}>
                  <img src={tour.img} alt={tour.title} />
                  <div className={styles.cardContent}>
                    <h3>{tour.title}</h3>
                    <p className={styles.duration}>{tour.duration}</p>
                    <p className={styles.price}>Từ {tour.price}</p>
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

export default TourListPage;