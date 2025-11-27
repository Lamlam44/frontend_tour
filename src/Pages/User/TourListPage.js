// FileName: TourListPage.js

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/ListPage.module.css';
import { getTours, getTouristDestinations, getTravelVehicles } from '../../services/api';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Chọn ngày';
    const date = new Date(dateString + 'T00:00:00'); // Thêm giờ để tránh lỗi múi giờ
    return new Intl.DateTimeFormat('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

// Helper function to render destinations
const renderDestinations = (destinations) => {
    if (!destinations || destinations.length === 0) {
        return 'N/A';
    }
    return destinations.map(d => d.destinationName).join(', ');
};

// Helper function to render vehicles
const renderVehicles = (vehicles) => {
    if (!vehicles || vehicles.length === 0) {
        return 'N/A';
    }
    return vehicles.map(v => v.vehicleType).join(', ');
};


function TourListPage() {
    const [allTours, setAllTours] = useState([]);
    const [allTouristDestinations, setAllTouristDestinations] = useState([]);
    const [filteredTours, setFilteredTours] = useState([]);
    const [selectedDeparture, setSelectedDeparture] = useState('Tất cả'); 
    const [selectedDestination, setSelectedDestination] = useState('Tất cả'); 
    const [selectedDepartureDate, setSelectedDepartureDate] = useState(''); 
    const [selectedTourType, setSelectedTourType] = useState([]); 
    const [selectedVehicle, setSelectedVehicle] = useState([]); 
    const [selectedBudget, setSelectedBudget] = useState(''); 

    const departureDateInputRef = useRef(null);

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

    useEffect(() => {
        let tours = [...allTours];

        // 1. Lọc theo Điểm đến (touristDestinations là danh sách)
        if (selectedDestination !== 'Tất cả' && selectedDestination) {
            tours = tours.filter(tour => 
                tour.touristDestinations && 
                tour.touristDestinations.some(dest => dest.destinationId === selectedDestination)
            );
        }

        // 2. Lọc theo Ngày đi (tourStartDate)
        if (selectedDepartureDate) {
            tours = tours.filter(tour => 
                tour.tourStartDate && tour.tourStartDate.toString().startsWith(selectedDepartureDate)
            );
        }

        // 4. Lọc theo Phương tiện
        if (selectedVehicle.length > 0) {
            tours = tours.filter(tour => {
                if (!tour.travelVehicles || tour.travelVehicles.length === 0) return false;
                return tour.travelVehicles.some(veh => {
                    const dbName = veh.vehicleType.toLowerCase();
                    return selectedVehicle.some(keyword => dbName.includes(keyword.toLowerCase()));
                });
            });
        }

        // 5. Lọc theo Ngân sách (tourPrice)
        if (selectedBudget) {
            const budgetRange = budgetOptions.find(b => b.value === selectedBudget);
            if (budgetRange) {
                tours = tours.filter(tour => tour.tourPrice >= budgetRange.min && tour.tourPrice <= budgetRange.max);
            }
        }
        
        tours = tours.filter(t => t.tourStatus !== 'CANCELLED' && t.tourStatus !== 'Canceled');
        
        setFilteredTours(tours);

    }, [allTours, selectedDestination, selectedDepartureDate, selectedVehicle, selectedBudget, budgetOptions]);
    
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
        // Logic is in useEffect
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

                    <main className={styles.mainContent}>
                        <div className={styles.grid}>
                            {filteredTours.length > 0 ? (
                                filteredTours.map(tour => (
                                    <Link to={`/tours/${tour.tourId}`} key={tour.tourId} className={styles.card}>
                                        <img src={tour.tourImage} alt={tour.tourName} />
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