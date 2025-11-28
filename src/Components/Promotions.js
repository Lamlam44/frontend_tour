import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import để chuyển trang
import styles from '../Assets/CSS/ComponentsCSS/Promotions.module.css';
import { getPromotions } from '../services/api';

// Hàm helper để xử lý link ảnh (Local vs Online)
const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image'; // Ảnh fallback
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8080${imagePath}`;
};

function PromotionCard({ promotion }) {
    const navigate = useNavigate();

    // Logic lấy ảnh:
    // 1. Kiểm tra xem khuyến mãi có áp dụng cho tour nào không?
    // 2. Nếu có, lấy ảnh của tour ĐẦU TIÊN trong danh sách.
    // 3. Nếu không, dùng ảnh mặc định.
    let bgImage = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070'; // Ảnh mặc định đẹp
    
    if (promotion.appliedTours && promotion.appliedTours.length > 0) {
        // appliedTours là mảng các Map, mỗi Map có key "tourImage"
        // Vì Backend trả về Set nên ở đây nó là Array, lấy phần tử đầu tiên [0]
        const firstTour = promotion.appliedTours[0];
        if (firstTour.tourImage) {
            bgImage = getImageUrl(firstTour.tourImage);
        }
    }

    const handleClick = () => {
        // Chuyển hướng sang trang Tour List
        // Truyền ID khuyến mãi qua state để trang kia lọc
        navigate('/tours', { 
            state: { 
                filterByPromotionId: promotion.promotionId,
                promotionName: promotion.promotionName 
            } 
        });
    };

    const cardStyle = {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url('${bgImage}')`
    };

    return (
        <div className={styles.card} style={cardStyle} onClick={handleClick}>
            <div className={styles.content}>
                <div className={styles.badge}>-{promotion.discountPercentage}%</div>
                <div className={styles.info}>
                    <h3 className={styles.title}>{promotion.promotionName}</h3>
                    <p className={styles.description}>
                        {promotion.description || "Ưu đãi hấp dẫn đang chờ bạn khám phá."}
                    </p>
                    <button className={styles.btn}>Xem Tours Áp Dụng ➝</button>
                </div>
            </div>
        </div>
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
                // Lấy tối đa 3-4 khuyến mãi để hiển thị trang chủ
                setPromotions(allPromotions.slice(0, 4));
            } catch (err) {
                console.error(err);
                setError('Không thể tải ưu đãi.');
            } finally {
                setLoading(false);
            }
        };
        fetchPromotions();
    }, []);

    if (loading) return null; // Hoặc loading spinner
    if (error) return null;
    if (promotions.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2>Ưu đãi độc quyền</h2>
                <p>Khám phá các điểm đến với mức giá tốt nhất</p>
            </div>
            <div className={styles.grid}>
                {promotions.map(promo => (
                    <PromotionCard key={promo.promotionId} promotion={promo} />
                ))}
            </div>
        </section>
    );
}

export default Promotions;