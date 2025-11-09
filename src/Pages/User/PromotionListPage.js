import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/ListPage.module.css';

const mockPromotions = [
  { id: 1, title: 'Giảm 30% tour Đà Nẵng', description: 'Áp dụng cho các booking trong tháng 10.', tourId: 2, img: 'https://via.placeholder.com/400x250?text=Sale+Da+Nang' },
  { id: 2, title: 'Mua 1 tặng 1 vé VinWonders', description: 'Khi đặt tour Phú Quốc trọn gói.', tourId: 1, img: 'https://via.placeholder.com/400x250?text=VinWonders+Promo' },
  { id: 3, title: 'Ưu đãi đặt phòng sớm', description: 'Giảm 20% cho tất cả khách sạn tại Hà Nội.', hotelId: 103, img: 'https://via.placeholder.com/400x250?text=Early+Bird+Hanoi' },
  { id: 4, title: 'Giảm 30% tour Đà Nẵng', description: 'Áp dụng cho các booking trong tháng 10.', tourId: 2, img: 'https://via.placeholder.com/400x250?text=Sale+Da+Nang' },
  { id: 5, title: 'Mua 1 tặng 1 vé VinWonders', description: 'Khi đặt tour Phú Quốc trọn gói.', tourId: 1, img: 'https://via.placeholder.com/400x250?text=VinWonders+Promo' },
  { id: 6, title: 'Ưu đãi đặt phòng sớm', description: 'Giảm 20% cho tất cả khách sạn tại Hà Nội.', hotelId: 103, img: 'https://via.placeholder.com/400x250?text=Early+Bird+Hanoi' },
];

function PromotionListPage() {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Chương Trình Khuyến Mãi</h1>
          <p>Đừng bỏ lỡ những ưu đãi hấp dẫn nhất từ chúng tôi</p>
        </div>
        <div className={styles.grid}>
          {mockPromotions.map(promo => (
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