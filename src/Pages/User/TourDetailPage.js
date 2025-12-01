import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/TourDetailPage.module.css';
import { getTourById, getAccommodations } from '../../services/api'; // Thêm getAccommodations

function TourDetailPage() {
  const { tourId } = useParams();
  const navigate = useNavigate();

  // --- State ---
  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  
  // State mới cho các tính năng mới
  const [selectedImage, setSelectedImage] = useState(null);
  const [allAccommodations, setAllAccommodations] = useState([]);
  const [selectedAccommodationId, setSelectedAccommodationId] = useState('');

  // --- Effects ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError('');
      try {
        // Gọi API song song để tải nhanh hơn
        const [tour, accommodations] = await Promise.all([
          getTourById(tourId),
          getAccommodations()
        ]);

        setTourData(tour);
        setAllAccommodations(accommodations);

        // Thiết lập giá trị mặc định sau khi có dữ liệu
        if (tour.tourImages && tour.tourImages.length > 0) {
          setSelectedImage(tour.tourImages[0].imageUrl);
        }
        if (tour.accommodation) {
          setSelectedAccommodationId(tour.accommodation.accommodationId);
        } else {
          // Nếu tour không có ks mặc định, chọn cái đầu tiên trong danh sách
          if (accommodations.length > 0) {
            setSelectedAccommodationId(accommodations[0].accommodationId);
          }
        }

      } catch (err) {
        console.error(`Error fetching data for tour ${tourId}:`, err);
        setError('Không thể tải thông tin tour. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [tourId]);

  // --- Helpers ---
  const getImageUrl = (imageInput) => {
    // 1. Ảnh thế thân (Fallback) nếu dữ liệu null
    // Sử dụng placehold.co (ổn định hơn via.placeholder.com)
    const PLACEHOLDER_IMG = 'https://placehold.co/600x400?text=No+Image';

    if (!imageInput) return PLACEHOLDER_IMG;
    
    // 2. Lấy đường dẫn (Xử lý cả trường hợp String lẫn Object)
    let path = (typeof imageInput === 'string') ? imageInput : imageInput.imageUrl;

    if (!path) return PLACEHOLDER_IMG;

    // 3. Nếu là ảnh Online (bắt đầu bằng http) -> Giữ nguyên
    if (path.startsWith('http')) {
        return path;
    }
    
    // 4. Nếu là ảnh Local -> Thêm domain backend
    // Đảm bảo không bị thừa dấu / (ví dụ: path là "/Images/..." thì cộng chuỗi bình thường)
    return `http://localhost:8080${path}`;
  };

  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

  // --- Handlers ---
  const handleBooking = () => {
    // Chuyển hướng bằng navigate và truyền state
    navigate(`/booking/${tourId}`, {
      state: {
        tourDetails: {
          id: tourData.tourId,
          name: tourData.tourName,
          price: tourData.tourPrice,
          image: tourData.tourImages && tourData.tourImages.length > 0 ? tourData.tourImages[0].imageUrl : null,
          startDate: tourData.tourStartDate
        },
        guestCount: guestCount,
        accommodationId: selectedAccommodationId // GỬI ID KHÁCH SẠN ĐÃ CHỌN
      }
    });
  };

  // --- Render Logic ---
  if (loading) {
    return (
        <div>
            <Header />
            <div className={styles.statusMessage}>Đang tải thông tin tour...</div>
            <Footer />
        </div>
    );
  }

  if (error) return <div className={styles.statusMessage}>{error}</div>;
  if (!tourData) return <div className={styles.statusMessage}>Không tìm thấy thông tin tour.</div>;
  
  const itineraryList = tourData.tourDescription?.split('|') || [];

  return (
    <div>
      <Header />
      <div className={styles.container}>
        
        <div className={styles.header}>
          <h1>{tourData.tourName}</h1>
          <div className={styles.metaInfo}>
            <span className={`${styles.tagStatus} ${tourData.tourStatus === 'OPEN' || 'Available' ? styles.open : styles.closed}`}>
                {tourData.tourStatus === 'OPEN' || 'Available' ? 'Đang nhận khách' : 'Đã đóng'}
            </span>
            <span>Mã tour: {tourData.tourId}</span>
          </div>
        </div>

        {/* === THƯ VIỆN ẢNH MỚI === */}
        <div className={styles.gallery}>
          <div className={styles.mainPhotoContainer}>
            <img src={getImageUrl(selectedImage)} alt="Selected view" className={styles.mainPhoto} />
          </div>
          <div className={styles.thumbnailContainer}>
            {tourData.tourImages?.map((image) => (
              <img
                key={image.id}
                src={getImageUrl(image.imageUrl)}
                alt={`Thumbnail ${image.id}`}
                className={`${styles.thumbnail} ${selectedImage === image.imageUrl ? styles.activeThumbnail : ''}`}
                onClick={() => setSelectedImage(image.imageUrl)}
              />
            ))}
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.content}>
            
            <div className={styles.infoSection}>
                <h2>Thông tin hành trình</h2>
                <ul className={styles.infoList}>
                    <li><strong>📅 Khởi hành:</strong> {formatDate(tourData.tourStartDate)}</li>
                    <li><strong>🔚 Kết thúc:</strong> {formatDate(tourData.tourEndDate)}</li>
                    {/* THÊM ĐIỂM TẬP TRUNG */}
                    <li><strong>📍 Điểm tập trung:</strong> {tourData.tourMeetingPoint || 'Đang cập nhật'}</li>
                    <li><strong>🚌 Phương tiện:</strong> {tourData.travelVehicles?.map(v => v.vehicleType).join(', ') || 'Đang cập nhật'}</li>
                    <li><strong>🏞️ Điểm đến:</strong> {Array.from(tourData.touristDestinations || []).map(d => d.destinationName).join(' - ')}</li>
                    <li><strong>👤 Hướng dẫn viên:</strong> {tourData.tourGuide?.tourGuideName || 'Đang cập nhật'}</li>
                    <li><strong>🎫 Số chỗ còn lại:</strong> <span style={{color: 'red', fontWeight: 'bold'}}>{tourData.tourRemainingSlots}</span></li>
                </ul>
            </div>

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

          {/* === SIDEBAR ĐẶT VÉ MỚI === */}
          <aside className={styles.bookingSidebar}>
            <h3>Giá trọn gói</h3>
            <p className={styles.priceLarge}>{formatCurrency(tourData.tourPrice)} <small>/ khách</small></p>
            
            <div className={styles.bookingForm}>
              <div className={styles.formGroup}>
                <label>Ngày khởi hành:</label>
                <input type="text" value={formatDate(tourData.tourStartDate)} readOnly disabled className={styles.readOnlyInput} />
              </div>

              {/* THÊM CHỌN KHÁCH SẠN */}
              <div className={styles.formGroup}>
                <label htmlFor="accommodation-select">Chọn khách sạn:</label>
                <select 
                  id="accommodation-select"
                  value={selectedAccommodationId}
                  onChange={(e) => setSelectedAccommodationId(e.target.value)}
                  className={styles.selectInput}
                >
                  {allAccommodations.map(acc => (
                    <option key={acc.accommodationId} value={acc.accommodationId}>
                      {acc.accommodationName} ({acc.rating} ⭐)
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Số lượng khách:</label>
                <input 
                    type="number" 
                    value={guestCount} 
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    min="1" 
                    max={tourData.tourRemainingSlots}
                />
              </div>

              <div className={styles.totalPreview}>
                  <span>Tạm tính:</span>
                  <strong>{formatCurrency(tourData.tourPrice * guestCount)}</strong>
              </div>
              
              {/* SỬ DỤNG ONCLICK THAY VÌ LINK */}
              <button 
                onClick={handleBooking}
                className={styles.bookNowBtn}
                disabled={tourData.tourRemainingSlots <= 0 || (tourData.tourStatus !== 'OPEN' && tourData.tourStatus !== 'Available')}
              >
                {tourData.tourRemainingSlots > 0 ? 'ĐẶT TOUR NGAY' : 'HẾT CHỖ'}
              </button>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TourDetailPage;