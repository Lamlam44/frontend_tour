// FileName: TourListPage.js

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/ListPage.module.css';
import { getTours, getTouristDestinations, getTravelVehicles, searchTours } from '../../services/api';

// --- Helper Functions ---
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Chọn ngày';
    const date = new Date(dateString + 'T00:00:00'); // Thêm giờ để tránh lỗi múi giờ
    return new Intl.DateTimeFormat('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const renderDestinations = (destinations) => {
    if (!destinations || destinations.length === 0) {
        return 'N/A';
    }
    return destinations.map(d => d.destinationName).join(', ');
};

const renderVehicles = (vehicles) => {
    if (!vehicles || vehicles.length === 0) {
        return 'N/A';
    }
    return vehicles.map(v => v.vehicleType).join(', ');
};

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

// --- Main Component ---
function TourListPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    
    const budgetOptions = useMemo(() => [
        { label: 'Dưới 4 triệu', value: 'under4', range: '0-4000000', min: 0, max: 4000000 },
        { label: 'Từ 4 - 8 triệu', value: '4-8', range: '4000000-8000000', min: 4000001, max: 8000000 },
        { label: 'Trên 8 triệu', value: 'over8', range: '8000000-Infinity', min: 8000001, max: Infinity },
    ], []);

    const getBudgetOptionFromRange = (range) => {
        if (!range) return '';
        const option = budgetOptions.find(b => b.range === range);
        return option ? option.value : '';
    };

    const initialSearchKeyword = queryParams.get('keyword') || '';
    const initialDate = queryParams.get('date') || '';
    const initialBudgetRange = queryParams.get('budget') || '';
    const initialBudgetValue = getBudgetOptionFromRange(initialBudgetRange);

    // --- State ---
    const [allTours, setAllTours] = useState([]);
    const [allTouristDestinations, setAllTouristDestinations] = useState([]);
    const [filteredTours, setFilteredTours] = useState([]);
    
    // Filters State
    const [selectedDestination, setSelectedDestination] = useState('Tất cả'); 
    const [selectedDepartureDate, setSelectedDepartureDate] = useState(initialDate); 
    const [selectedVehicle, setSelectedVehicle] = useState([]); 
    const [selectedBudget, setSelectedBudget] = useState(initialBudgetValue); 
    const [currentSearchKeyword, setCurrentSearchKeyword] = useState(initialSearchKeyword);

    const departureDateInputRef = useRef(null);

    // Options
    const vehicleOptions = ['Xe', 'Máy bay', 'Tàu']; 

    // --- Effects ---
    useEffect(() => {
        const fetchAndFilterTours = async () => {
            try {
                let data;
                if (initialSearchKeyword) {
                    data = await searchTours(initialSearchKeyword);
                } else {
                    data = await getTours();
                }
                setAllTours(data);
                
                // Initial filter (remove canceled tours)
                let currentFiltered = data.filter(t => t.tourStatus !== 'Canceled' && t.tourStatus !== 'CANCELLED');
                setFilteredTours(currentFiltered);
            } catch (error) {
                console.error('Error fetching tours:', error);
            }
        };
        fetchAndFilterTours();
    }, [initialSearchKeyword]); 

    useEffect(() => {
        const fetchTourDestinations = async () => {
            try {
                const destinations = await getTouristDestinations();
                setAllTouristDestinations(destinations);
            } catch (error) {
                console.error('Error fetching tour destinations:', error);
            }
        };
        fetchTourDestinations();
    }, []);

    // Filter Logic
    useEffect(() => {
        let tours = [...allTours];

        // 1. Lọc theo Điểm đến
        if (selectedDestination !== 'Tất cả' && selectedDestination) {
            tours = tours.filter(tour => 
                tour.touristDestinations && 
                tour.touristDestinations.some(dest => dest.destinationId === selectedDestination)
            );
        }

        // 2. Lọc theo Ngày đi
        if (selectedDepartureDate) {
            tours = tours.filter(tour => 
                tour.tourStartDate && tour.tourStartDate.toString().startsWith(selectedDepartureDate)
            );
        }

        // 3. Lọc theo Phương tiện
        if (selectedVehicle.length > 0) {
            tours = tours.filter(tour => {
                if (!tour.travelVehicles || tour.travelVehicles.length === 0) return false;
                return tour.travelVehicles.some(veh => {
                    const dbName = veh.vehicleType.toLowerCase();
                    return selectedVehicle.some(keyword => dbName.includes(keyword.toLowerCase()));
                });
            });
        }

        // 4. Lọc theo Ngân sách
        if (selectedBudget) {
            const budgetRange = budgetOptions.find(b => b.value === selectedBudget);
            if (budgetRange) {
                tours = tours.filter(tour => tour.tourPrice >= budgetRange.min && tour.tourPrice <= budgetRange.max);
            }
        }
        
        // Luôn loại bỏ tour bị hủy
        tours = tours.filter(t => t.tourStatus !== 'CANCELLED' && t.tourStatus !== 'Canceled');
        
        setFilteredTours(tours);

    }, [allTours, selectedDestination, selectedDepartureDate, selectedVehicle, selectedBudget, budgetOptions]);

    // --- Handlers ---
    const handleToggleSelection = (state, setState, value) => {
        if (state.includes(value)) {
            setState(state.filter(item => item !== value));
        } else {
            setState([...state, value]);
        }
    };

    const handleBudgetSelect = (value) => {
        setSelectedBudget(value === selectedBudget ? '' : value);
    };

    const handleClearVehicle = () => setSelectedVehicle([]);

    const handleDateDropdownClick = () => {
        if (departureDateInputRef.current) {
            departureDateInputRef.current.showPicker();
        }
    };

    const handleApplyFilters = () => {
        // Logic lọc đã nằm trong useEffect, nút này chủ yếu mang tính chất UX
        console.log("Filters applied");
    };

    // QUAN TRỌNG: Hàm này đã được di chuyển lên đây (trong vùng logic), TRƯỚC return
    const handleSearchSubmit = () => {
        if (currentSearchKeyword.trim()) {
            navigate(`/tours?keyword=${encodeURIComponent(currentSearchKeyword.trim())}`);
        } else {
            navigate('/tours'); // Navigate to base tour list if search is cleared
        }
    };

    // --- Render JSX ---
    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1>Tour Du Lịch Hàng Đầu</h1>
                    <p>Tìm thấy {filteredTours.length} tour phù hợp với tiêu chí của bạn</p>
                </div>
                <div className={styles.layout}>
                    
                    {/* SIDEBAR */}
                    <aside className={`${styles.sidebar} ${styles.tourSidebar}`}> 
                        <h3>Bộ lọc tìm kiếm</h3>

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

                        <div className={styles.filterGroup}>
                            <h4>Điểm đến</h4>
                            <select 
                                className={styles.dropdownFilter} 
                                value={selectedDestination} 
                                onChange={(e) => setSelectedDestination(e.target.value)}
                            >
                                <option value="Tất cả">Tất cả</option>
                                {allTouristDestinations.map((destination) => (
                                    <option 
                                        key={destination.destinationId} 
                                        value={destination.destinationId}
                                    >
                                        {destination.destinationName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <h4>Ngày đi</h4>
                            <div className={`${styles.dropdownFilter} ${selectedDepartureDate ? styles.active : ''}`} onClick={handleDateDropdownClick}>
                                <span>{formatDateForDisplay(selectedDepartureDate)}</span>
                                <i className="fas fa-calendar-alt"></i>
                                <input
                                    type="date"
                                    ref={departureDateInputRef}
                                    value={selectedDepartureDate}
                                    onChange={(e) => setSelectedDepartureDate(e.target.value)}
                                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '100%' }}
                                />
                            </div>
                        </div>

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

                        <button className={styles.applyButton} onClick={handleApplyFilters}>
                            Áp dụng bộ lọc
                        </button>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className={styles.mainContent}>
                        <div className={styles.searchBarContainer}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm tour..."
                                value={currentSearchKeyword}
                                onChange={(e) => setCurrentSearchKeyword(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearchSubmit();
                                    }
                                }}
                                className={styles.searchInput}
                            />
                            <button onClick={handleSearchSubmit} className={styles.searchButton}>Tìm kiếm</button>
                        </div>
                        <div className={styles.grid}>
                            {filteredTours.length > 0 ? (
                                filteredTours.map(tour => (
                                    <Link to={`/tours/${tour.tourId}`} key={tour.tourId} className={styles.card}>
                                        <img 
                                            src={getImageUrl(tour.tourImages && tour.tourImages.length > 0 ? tour.tourImages[0] : null)} 
                                            alt={tour.tourName} 
                                        />
                                        <div className={styles.cardContent}>
                                            <h3>{tour.tourName}</h3>
                                            <p className={styles.description}>
                                                <strong>Điểm đến:</strong> {renderDestinations(tour.touristDestinations)}
                                            </p>
                                            <p className={styles.description}>
                                                <strong>Phương tiện:</strong> {renderVehicles(tour.travelVehicles)}
                                            </p>
                                            <p className={styles.description}>
                                                Còn {tour.tourRemainingSlots} chỗ
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