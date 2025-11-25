import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Assets/CSS/ComponentsCSS/FeaturedDeals.module.css';

const deals = [
  { id: 1, title: 'Tour Phú Quốc 3N2Đ', price: '2,990,000đ', img: 'https://placehold.co/300x200/1e88e5/ffffff?text=Phu+Quoc' },
  { id: 2, title: 'Khám phá Đà Nẵng - Hội An', price: '3,500,000đ', img: 'https://placehold.co/300x200/43a047/ffffff?text=Da+Nang' },
  { id: 3, title: 'Nghỉ dưỡng tại Resort Vũng Tàu', price: '1,800,000đ', img: 'https://placehold.co/300x200/fb8c00/ffffff?text=Vung+Tau' },
];

function DealCard({ deal }) {
  return (
    <Link to={`/tours/${deal.id}`} className={styles.card}>
      <img src={deal.img} alt={deal.title} />
      <h3>{deal.title}</h3>
      <p>Chỉ từ: <strong>{deal.price}</strong></p>
    </Link>
  );
}

function FeaturedDeals() {
  return (
    <section className={styles.section}>
      <h2>Ưu đãi nổi bật không thể bỏ lỡ</h2>
      <div className={styles.grid}>
        {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
      </div>
    </section>
  );
}

export default FeaturedDeals;