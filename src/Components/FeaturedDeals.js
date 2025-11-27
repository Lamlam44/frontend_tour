import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Assets/CSS/ComponentsCSS/FeaturedDeals.module.css';
import { getTours } from '../services/api'; // Import API function

// Helper function to format currency
const formatPrice = (price) => {
  if (typeof price !== 'number') {
    return price;
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

function DealCard({ tour }) {
  // Component này giờ nhận prop là 'tour' với cấu trúc từ API
  return (
    <Link to={`/tours/${tour.tourId}`} className={styles.card}>
      <img src={tour.tourImage} alt={tour.tourName} />
      <h3>{tour.tourName}</h3>
      <p>Chỉ từ: <strong>{formatPrice(tour.tourPrice)}</strong></p>
    </Link>
  );
}

function FeaturedDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setLoading(true);
        const allTours = await getTours();
        // Lấy 3 tour đầu tiên làm "nổi bật" và lọc các tour đã hủy
        const featured = allTours
            .filter(tour => tour.tourStatus !== 'CANCELLED' && tour.tourStatus !== 'Canceled')
            .slice(0, 3);
        setDeals(featured);
      } catch (err) {
        setError('Không thể tải các ưu đãi nổi bật.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []); // useEffect sẽ chạy 1 lần khi component mount

  const renderContent = () => {
    if (loading) {
      return <p>Đang tải ưu đãi...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }
    if (deals.length === 0) {
      return <p>Không có ưu đãi nào hiện có.</p>;
    }
    return (
      <div className={styles.grid}>
        {deals.map(deal => <DealCard key={deal.tourId} tour={deal} />)}
      </div>
    );
  };

  return (
    <section className={styles.section}>
      <h2>Ưu đãi nổi bật không thể bỏ lỡ</h2>
      {renderContent()}
    </section>
  );
}

export default FeaturedDeals;