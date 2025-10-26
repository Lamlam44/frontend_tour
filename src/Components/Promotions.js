import React from 'react';
import styles from '../Assets/CSS/ComponentsCSS/Promotions.module.css';

const promotionsData = [
  { id: 1, title: 'Ưu đãi giờ chót', description: 'Giảm đến 40% cho các tour khởi hành trong tháng này!', imageUrl: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=1965' },
  { id: 2, title: 'Khám phá Di sản Thế giới', description: 'Trọn gói các tour đến những địa danh được UNESCO công nhận.', imageUrl: 'https://images.unsplash.com/photo-1543053359-4275eb5355a2?q=80&w=1974' },
  { id: 3, title: 'Du lịch cho cặp đôi', description: 'Những điểm đến lãng mạn với ưu đãi đặc biệt.', imageUrl: 'https://images.unsplash.com/photo-1502208327471-d5dde4d78995?q=80&w=2070' }
];

function PromotionCard({ promotion }) {
  const cardStyle = {
    backgroundImage: `url(${promotion.imageUrl})`
  };
  return (
    <div className={styles.card} style={cardStyle}>
      <div className={styles.content}>
        <h3>{promotion.title}</h3>
        <p>{promotion.description}</p>
      </div>
    </div>
  );
}

function Promotions() {
  return (
    <section className={styles.section}>
      <h2>Khám phá thế giới theo cách riêng của bạn</h2>
      <div className={styles.grid}>
        {promotionsData.map(promo => <PromotionCard key={promo.id} promotion={promo} />)}
      </div>
    </section>
  );
}

export default Promotions;