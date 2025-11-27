import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/ListPage.module.css'; // Có thể cần CSS riêng, tạm dùng chung
import { getPromotions } from '../../services/api';

function PromotionListPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const data = await getPromotions();
        setPromotions(data);
      } catch (error) {
        setError('Không thể tải danh sách khuyến mãi.');
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p>Đang tải dữ liệu...</p>;
    }

    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (promotions.length === 0) {
      return <p>Không có chương trình khuyến mãi nào.</p>;
    }

    return (
      <div className={styles.grid}>
        {promotions.map(promo => (
          // Bỏ Link đi vì không rõ promotion này dành cho tour/hotel nào cụ thể
          <div key={promo.promotionId} className={styles.card}>
            {/* Giả sử promo có trường imageUrl, nếu không sẽ dùng ảnh mặc định */}
            <img src={promo.imageUrl || 'https://via.placeholder.com/300x200?text=Promotion'} alt={promo.promotionName} />
            <div className={styles.cardContent}>
              {/* Sử dụng đúng tên trường từ API */}
              <h3>{promo.promotionName}</h3>
              <p>{promo.description}</p>
              {promo.discountPercentage && (
                <p className={styles.price}>
                  Giảm giá: <strong>{promo.discountPercentage}%</strong>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Chương Trình Khuyến Mãi</h1>
          <p>Đừng bỏ lỡ những ưu đãi hấp dẫn nhất từ chúng tôi</p>
        </div>
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
}

export default PromotionListPage;