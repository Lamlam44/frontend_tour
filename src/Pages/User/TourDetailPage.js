import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/TourDetailPage.module.css';
import { getTourById } from '../../services/api';

function TourDetailPage() {
  const { tourId } = useParams();
  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guestCount, setGuestCount] = useState(1); // State lưu số khách đặt

  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getTourById(tourId);
        setTourData(data);
      } catch (err) {
        console.error(`Error fetching tour with id ${tourId}:`, err);
        setError('Không thể tải thông tin tour. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  // --- CÁC TRẠNG THÁI GIAO DIỆN ---
  if (loading) {
    return (
        <div>
            <Header />
            <div className={styles.statusMessage}>Đang tải thông tin tour...</div>
            <Footer />
        </div>
    );
  }

  if (error) {
    return <div className={styles.statusMessage}>{error}</div>;
  }

  if (!tourData) {
    return <div className={styles.statusMessage}>Không tìm thấy thông tin tour.</div>;
  }

  // --- 1. HÀM XỬ LÝ LỊCH TRÌNH (Tách chuỗi bằng dấu |) ---
  const itineraryList = tourData.tourDescription?.split('|') || [];

  // --- 2. HÀM FORMAT TIỀN TỆ & NGÀY THÁNG ---
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        
        {/* --- HEADER TOUR --- */}
        <div className={styles.header}>
          <h1>{tourData.tourName}</h1>
          <div className={styles.metaInfo}>
            <span className={`${styles.tagStatus} ${tourData.tourStatus === 'OPEN' ? styles.open : styles.closed}`}>
                {tourData.tourStatus === 'OPEN' ? 'Đang nhận khách' : 'Đã đóng'}
            </span>
            <span>Mã tour: {tourData.tourId}</span>
            {tourData.accommodation?.accommodationName && (
               <span>⭐ Khách sạn: {tourData.accommodation.accommodationName} ({tourData.accommodation.rating || 'N/A'} sao)</span>
            )}
          </div>
        </div>

        {/* --- HÌNH ẢNH --- */}
        <div className={styles.gallery}>
          {/* Vì Database lưu 1 ảnh dạng String, nên hiển thị trực tiếp */}
          <img src={tourData.tourImage} alt={tourData.tourName} className={styles.mainPhoto} />
        </div>

        <div className={styles.body}>
          <div className={styles.content}>
            
            {/* --- THÔNG TIN CHI TIẾT --- */}
            <div className={styles.infoSection}>
                <h2>Thông tin hành trình</h2>
                <ul className={styles.infoList}>
                    <li><strong>📅 Khởi hành:</strong> {formatDate(tourData.tourStartDate)}</li>
                    <li><strong>🔚 Kết thúc:</strong> {formatDate(tourData.tourEndDate)}</li>
                    <li><strong>🚌 Phương tiện:</strong> {tourData.travelVehicles?.map(v => v.vehicleType).join(', ') || 'Đang cập nhật'}</li>
                    <li><strong>📍 Điểm đến:</strong> {Array.from(tourData.touristDestinations || []).map(d => d.destinationName).join(' - ')}</li>
                    <li><strong>👤 Hướng dẫn viên:</strong> {tourData.tourGuide?.tourGuideName || 'Đang cập nhật'}</li>
                    <li><strong>🎫 Số chỗ còn lại:</strong> <span style={{color: 'red', fontWeight: 'bold'}}>{tourData.tourRemainingSlots}</span></li>
                </ul>
            </div>

            {/* --- LỊCH TRÌNH (Đã tách chuỗi) --- */}
            <h2>Lịch trình chi tiết</h2>
            <div className={styles.itineraryContainer}>
                {itineraryList.length > 0 ? (
                    itineraryList.map((item, index) => (
                    <div key={index} className={styles.itineraryItem}>
                        <h3 className={styles.dayTitle}>Ngày {index + 1}</h3>
                        <p className={styles.dayContent}>{item.trim()}</p>
                    </div>
                    ))
                ) : (
                    <p>Đang cập nhật lịch trình...</p>
                )}
            </div>
          </div>

          {/* --- SIDEBAR ĐẶT VÉ --- */}
          <aside className={styles.bookingSidebar}>
            <h3>Giá trọn gói</h3>
            <p className={styles.priceLarge}>{formatCurrency(tourData.tourPrice)} <small>/ khách</small></p>
            
            <div className={styles.bookingForm}>
              <div className={styles.formGroup}>
                <label>Ngày khởi hành:</label>
                {/* Hiển thị ngày cố định từ DB, không cho chọn lung tung */}
                <input type="text" value={formatDate(tourData.tourStartDate)} readOnly disabled className={styles.readOnlyInput} />
              </div>

              <div className={styles.formGroup}>
                <label>Số lượng khách:</label>
                <input 
                    type="number" 
                    value={guestCount} 
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    min="1" 
                    max={tourData.tourRemainingSlots} // Không cho đặt quá số chỗ còn lại
                />
              </div>

              {/* Tính tạm tính */}
              <div className={styles.totalPreview}>
                  <span>Tạm tính:</span>
                  <strong>{formatCurrency(tourData.tourPrice * guestCount)}</strong>
              </div>

              {/* Nút đặt ngay: Truyền dữ liệu sang trang Booking */}
              <Link 
                to={`/booking/${tourId}`} 
                state={{ 
                    tourDetails: { 
                        id: tourData.tourId, 
                        name: tourData.tourName, 
                        price: tourData.tourPrice,
                        image: tourData.tourImage,
                        startDate: tourData.tourStartDate
                    },
                    guestCount: guestCount
                }}
              >
                  <button 
                    className={styles.bookNowBtn}
                    disabled={tourData.tourRemainingSlots <= 0 || tourData.tourStatus !== 'OPEN'}
                  >
                    {tourData.tourRemainingSlots > 0 ? 'ĐẶT TOUR NGAY' : 'HẾT CHỖ'}
                  </button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TourDetailPage;