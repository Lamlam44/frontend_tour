import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/SearchResultsPage.module.css';

const mockResults = [
  { id: 1, type: 'tour', title: 'Tour trọn gói Phú Quốc 3N2Đ - Khách sạn 5 sao', price: '4,500,000đ', rating: 4.8, reviews: 120, img: 'https://images.unsplash.com/photo-1589882553933-5c8a141ab64a?q=80&w=2070' },
  { id: 3, type: 'tour', title: 'Khám phá Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ', price: '5,200,000đ', rating: 4.7, reviews: 250, img: 'https://images.unsplash.com/photo-1569509831962-d7b385a4a4e5?q=80&w=1964' },
];

function SearchResultsPage() {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <h3>Bộ lọc</h3>
          <div className={styles.filterGroup}>
            <h4>Loại hình</h4>
            <label><input type="checkbox" /> Tour du lịch</label>
          </div>
          <div className={styles.filterGroup}>
            <h4>Khoảng giá</h4>
            <input type="range" min="0" max="10000000" />
          </div>
          <div className={styles.filterGroup}>
            <h4>Đánh giá</h4>
            <label><input type="radio" name="rating" /> Từ 5 sao</label>
            <label><input type="radio" name="rating" /> Từ 4 sao</label>
            <label><input type="radio" name="rating" /> Từ 3 sao</label>
          </div>
        </aside>
        <main className={styles.resultsList}>
          <h2>Tìm thấy {mockResults.length} kết quả cho "Phú Quốc"</h2>
          {mockResults.map(item => (
            <div key={item.id} className={styles.resultCard}>
              <img src={item.img} alt={item.title} />
              <div className={styles.resultInfo}>
                <h3>{item.title}</h3>
                <p>⭐ {item.rating} ({item.reviews} đánh giá)</p>
                <p className={styles.resultPrice}>Giá chỉ từ: <strong>{item.price}</strong></p>
                <Link to={`/tours/${item.id}`}>
                  <button className={styles.viewDetailsBtn}>Xem chi tiết</button>
                </Link>
              </div>
            </div>
          ))}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default SearchResultsPage;