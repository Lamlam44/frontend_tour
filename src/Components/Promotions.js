import React, { useState, useEffect } from 'react';
import styles from '../Assets/CSS/ComponentsCSS/Promotions.module.css';
import { getPromotions } from '../services/api'; // Import API function

function PromotionCard({ promotion }) {
  // Giả sử API trả về đối tượng promotion có các trường:
  // promotionName, description, và có thể là imageUrl
  
  // Tạo một lớp màu phủ lên ảnh nền để chữ dễ đọc hơn
  const cardStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${promotion.imageUrl || 'https://via.placeholder.com/400x300?text=Promotion'})`
  };

  return (
    // Thêm một link để có thể click vào, ví dụ: dẫn đến trang khuyến mãi
    <a href="/promotions" className={styles.card} style={cardStyle}>
      <div className={styles.content}>
        <h3>{promotion.promotionName}</h3>
        <p>{promotion.description}</p>
      </div>
    </a>
  );
}

function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const allPromotions = await getPromotions();
        // Lấy 3 khuyến mãi đầu tiên
        setPromotions(allPromotions.slice(0, 3));
      } catch (err) {
        setError('Không thể tải danh sách khuyến mãi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p>Đang tải khuyến mãi...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }
    if (promotions.length === 0) {
      return <p>Không có chương trình khuyến mãi nào hiện có.</p>;
    }
    return (
      <div className={styles.grid}>
        {promotions.map(promo => <PromotionCard key={promo.promotionId} promotion={promo} />)}
      </div>
    );
  };


  return (
    <section className={styles.section}>
      <h2>Khám phá thế giới theo cách riêng của bạn</h2>
      {renderContent()}
    </section>
  );
}

export default Promotions;