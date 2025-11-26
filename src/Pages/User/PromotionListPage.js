import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/ListPage.module.css';
import { getPromotions } from '../../services/api';

function PromotionListPage() {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await getPromotions();
        setPromotions(data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Chương Trình Khuyến Mãi</h1>
          <p>Đừng bỏ lỡ những ưu đãi hấp dẫn nhất từ chúng tôi</p>
        </div>
        <div className={styles.grid}>
          {promotions.map(promo => (
            <Link to={promo.tourId ? `/tours/${promo.tourId}` : `/hotels/${promo.hotelId}`} key={promo.id} className={styles.card}>
              <img src={promo.img} alt={promo.title} />
              <div className={styles.cardContent}>
                <h3>{promo.title}</h3>
                <p>{promo.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PromotionListPage;