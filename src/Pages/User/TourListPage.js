// FileName: TourListPage.js

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/ListPage.module.css';
import { getTours } from '../../services/api';
// Loại bỏ import FilterSidebar không còn dùng đến

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Chọn ngày';
    const date = new Date(dateString + 'T00:00:00'); // Thêm giờ để tránh lỗi múi giờ
    return new Intl.DateTimeFormat('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

function TourListPage() {
    const [allTours, setAllTours] = useState([]);
    const [filteredTours, setFilteredTours] = useState([]);
    const [selectedDeparture, setSelectedDeparture] = useState('Tất cả'); 
    const [selectedDestination, setSelectedDestination] = useState('Tất cả'); 
    const [selectedDepartureDate, setSelectedDepartureDate] = useState(''); 
    const [selectedTourType, setSelectedTourType] = useState([]); 
    const [selectedVehicle, setSelectedVehicle] = useState([]); 
    const [selectedBudget, setSelectedBudget] = useState(''); 

    const departureDateInputRef = useRef(null);

    const departureOptions = ['Tất cả', 'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'];
    const tourTypeOptions = ['Cao cấp', 'Tiêu chuẩn', 'Tiết kiệm', 'Giá tốt'];
    const vehicleOptions = ['Xe', 'Máy bay', 'Tàu']; 

    const budgetOptions = useMemo(() => [
        { label: 'Dưới 4 triệu', value: 'under4', min: 0, max: 4000000 },
        { label: 'Từ 4 - 8 triệu', value: '4-8', min: 4000001, max: 8000000 },
        { label: 'Trên 8 triệu', value: 'over8', min: 8000001, max: Infinity },
    ], []);


    useEffect(() => {
      const fetchTours = async () => {
        try {
          const data = await getTours();
          setAllTours(data);
          setFilteredTours(data.filter(t => t.tourStatus !== 'Canceled'));
        } catch (error) {
          console.error('Error fetching tours:', error);
        }
      };
  
      fetchTours();
    }, []);

    useEffect(() => {
        let tours = [...allTours];

        // 1. Lọc theo Điểm đến
        if (selectedDestination !== 'Tất cả' && selectedDestination) {
            tours = tours.filter(tour => tour.destination === selectedDestination);
        }

        // 2. Lọc theo Ngày đi
        if (selectedDepartureDate) {
            tours = tours.filter(tour => tour.departureDate === selectedDepartureDate);
        }

        // 3. Lọc theo Dòng tour
        if (selectedTourType.length > 0) {
            tours = tours.filter(tour => selectedTourType.includes(tour.tourType));
        }

        // 4. Lọc theo Phương tiện
        if (selectedVehicle.length > 0) {
            const actualVehicles = selectedVehicle.map(v => {
                if (v === 'Xe') return 'Ô tô'; 
                return v;
            });
            tours = tours.filter(tour => actualVehicles.includes(tour.vehicle));
        }

        // 5. Lọc theo Ngân sách
        if (selectedBudget) {
            const budgetRange = budgetOptions.find(b => b.value === selectedBudget);
            if (budgetRange) {
                tours = tours.filter(tour => tour.tourPrice >= budgetRange.min && tour.tourPrice <= budgetRange.max);
            }
        }
        
        // Mặc định vẫn lọc bỏ tour đã hủy
        tours = tours.filter(t => t.tourStatus !== 'Canceled');

        // Bỏ qua logic Sắp xếp (sort) cho đơn giản, chỉ tập trung vào Lọc
        
        setFilteredTours(tours);

    }, [allTours, selectedDestination, selectedDepartureDate, selectedTourType, selectedVehicle, selectedBudget, budgetOptions]);

    // --- Handlers cho các bộ lọc ---
    const handleToggleSelection = (state, setState, value) => {
        if (state.includes(value)) {
            setState(state.filter(item => item !== value));
        } else {
            setState([...state, value]);
        }
    };

    const handleBudgetSelect = (value) => {
        setSelectedBudget(value === selectedBudget ? '' : value); // Toggle chọn
    };

    const handleClearTourType = () => setSelectedTourType([]);
    const handleClearVehicle = () => setSelectedVehicle([]);

    const handleDateDropdownClick = () => {
        if (departureDateInputRef.current) {
            departureDateInputRef.current.showPicker();
        }
    };

    // Hàm áp dụng tất cả các bộ lọc (giữ lại để khớp với nút Áp dụng)
    const handleApplyFilters = () => {
        // Mọi logic đã nằm trong useEffect, nút này chỉ đơn thuần kích hoạt lại useEffect (nếu có state khác)
        // hoặc gọi API trong thực tế.
    };

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1>Tour Du Lịch Hàng Đầu</h1>
                    <p>Tìm thấy {filteredTours.length} tour phù hợp với tiêu chí của bạn</p>
                </div>
                <div className={styles.layout}>
                    
                    {/* SỬ DỤNG CẢ HAI CLASS: styles.sidebar (layout chung) + styles.tourSidebar (màu nền xám) */}
                    <aside className={`${styles.sidebar} ${styles.tourSidebar}`}> 
                        <h3>Bộ lọc tìm kiếm</h3>

                        {/* NGÂN SÁCH (BUTTONS) */}
                        <div className={styles.filterGroup}>
                             <h4>Ngân sách</h4>
                            <div className={styles.priceRangeButtons}>
                                {budgetOptions.map(option => (
                                    <button
                                        key={option.value}
                                        className={`${styles.priceRangeButton} ${selectedBudget === option.value ? styles.active : ''}`}
                                        onClick={() => handleBudgetSelect(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ĐIỂM KHỞI HÀNH (DROPDOWN GIẢ) */}
                        <div className={styles.filterGroup}>
                            <h4>Điểm khởi hành</h4>
                            {/* Dùng select HTML để đơn giản hóa logic, nhưng vẫn style như dropdown */}
                            <select 
                                className={styles.dropdownFilter} 
                                value={selectedDeparture} 
                                onChange={(e) => setSelectedDeparture(e.target.value)}
                            >
                                {departureOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        {/* ĐIỂM ĐẾN (DROPDOWN GIẢ) */}
                        <div className={styles.filterGroup}>
                            <h4>Điểm đến</h4>
                            <select 
                                className={styles.dropdownFilter} 
                                value={selectedDestination} 
                                onChange={(e) => setSelectedDestination(e.target.value)}
                            >
                                {['Tất cả', ...new Set(allTours.map(t => t.destination))].map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        {/* NGÀY ĐI (DROPDOWN GIẢ + INPUT DATE HIDDEN) */}
                        <div className={styles.filterGroup}>
                            <h4>Ngày đi</h4>
                            <div className={`${styles.dropdownFilter} ${selectedDepartureDate ? styles.active : ''}`} onClick={handleDateDropdownClick}>
                                <span>{formatDateForDisplay(selectedDepartureDate)}</span>
                                <i className="fas fa-calendar-alt"></i> {/* Sử dụng icon lịch */}
                                <input
                                    type="date"
                                    ref={departureDateInputRef}
                                    value={selectedDepartureDate}
                                    onChange={(e) => setSelectedDepartureDate(e.target.value)}
                                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '100%' }} // Ẩn input
                                />
                            </div>
                        </div>

                        {/* DÒNG TOUR (BUTTONS) */}
                        <div className={styles.filterGroup}>
                            <h4>
                                Dòng tour
                                {selectedTourType.length > 0 && (
                                    <button className={styles.clearButton} onClick={handleClearTourType}>Xóa ({selectedTourType.length})</button>
                                )}
                            </h4>
                            <div className={styles.optionButtons}>
                                {tourTypeOptions.map(type => (
                                    <button
                                        key={type}
                                        className={`${styles.optionButton} ${selectedTourType.includes(type) ? styles.active : ''}`}
                                        onClick={() => handleToggleSelection(selectedTourType, setSelectedTourType, type)}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* PHƯƠNG TIỆN (BUTTONS) */}
                        <div className={styles.filterGroup}>
                            <h4>
                                Phương tiện
                                {selectedVehicle.length > 0 && (
                                    <button className={styles.clearButton} onClick={handleClearVehicle}>Xóa ({selectedVehicle.length})</button>
                                )}
                            </h4>
                            <div className={styles.optionButtons}>
                                {vehicleOptions.map(vehicle => (
                                    <button
                                        key={vehicle}
                                        className={`${styles.optionButton} ${selectedVehicle.includes(vehicle) ? styles.active : ''}`}
                                        onClick={() => handleToggleSelection(selectedVehicle, setSelectedVehicle, vehicle)}
                                    >
                                        {vehicle}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* NÚT ÁP DỤNG */}
                        <button className={styles.applyButton} onClick={handleApplyFilters}>
                            Áp dụng bộ lọc
                        </button>

                    </aside>

                    <main className={styles.mainContent}>
                        <div className={styles.grid}>
                            {filteredTours.length > 0 ? (
                                filteredTours.map(tour => (
                                    <Link to={`/tours/${tour.id}`} key={tour.id} className={styles.card}>
                                        <img src={tour.tourImage} alt={tour.tourName} />
                                        <div className={styles.cardContent}>
                                            <h3>{tour.tourName}</h3>
                                            <p className={styles.description}>
                                                **Điểm đến:** {tour.destination} | **Phương tiện:** {tour.vehicle}
                                            </p>
                                            <p className={styles.description}>
                                                Trạng thái: {tour.tourStatus} (Còn {tour.tourRemainingSlots} chỗ)
                                            </p>
                                            <p className={styles.price}>Từ {formatPrice(tour.tourPrice)}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p>Không tìm thấy tour nào phù hợp với bộ lọc của bạn.</p>
                            )}
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default TourListPage;