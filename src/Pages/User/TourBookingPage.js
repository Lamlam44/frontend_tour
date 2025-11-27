import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';
import { isLoggedIn } from '../../services/auth';
import { getUserProfile } from '../../services/api';
import { getTourById } from '../../services/api';


const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

function TourBookingPage() {
    const { tourId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [fetchedTourDetails, setFetchedTourDetails] = useState(null); // State for fetched tour data
    const [currentGuestCount, setCurrentGuestCount] = useState(location.state?.guestCount || 1); // State for guest count
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(''); // State for error messages

    useEffect(() => {
        const loadTourAndUserData = async () => {
            let tourDataFromState = location.state?.tourDetails;
            let fetchedData = null;

            if (!tourDataFromState && tourId) { // If tourDetails not in state, fetch it
                try {
                    fetchedData = await getTourById(tourId);
                    setFetchedTourDetails(fetchedData);
                    tourDataFromState = fetchedData; // Use fetched data
                } catch (err) {
                    console.error("Failed to fetch tour details:", err);
                    setError('Không thể tải thông tin tour. Vui lòng thử lại.');
                    setIsLoading(false);
                    return;
                }
            } else {
                setFetchedTourDetails(tourDataFromState); // Use data from state
            }
            
            // Fetch user profile if logged in
            if (isLoggedIn()) {
                try {
                    const userData = await getUserProfile();
                    setCustomerInfo(userData);
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    // Continue without user data, let user fill form
                }
            }
            setIsLoading(false);
        };
        loadTourAndUserData();
    }, [tourId, location.state]); // Re-run effect if tourId or location.state changes

    // Reference to the actual tour details and guest count to be used in the component
    const tourDetails = fetchedTourDetails; 
    const guestCount = currentGuestCount;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Chuyển đến trang chọn phương thức thanh toán, mang theo thông tin khách hàng và tour
        navigate('/payment', { 
            state: { 
                bookingDetails: {
                    ...customerInfo,
                    guestCount: guestCount || 1, // Đảm bảo guestCount được truyền đi
                }, 
                itemDetails: tourDetails, // Đổi tên cho nhất quán
                totalAmount: (tourDetails?.price || 0) * (guestCount || 1) // Tính và truyền tổng tiền
            } 
        });
    };

    if (isLoading) {
        return <div><Header /><div className={styles.container}><p>Đang tải...</p></div><Footer/></div>;
    }

    if (error) {
        return (
            <div>
                <Header />
                <div className={styles.container}>
                    <h1>Lỗi</h1>
                    <p>{error}</p>
                </div>
                <Footer/>
            </div>
        );
    }

    if (!tourDetails) {
        return (
            <div>
                <Header />
                <div className={styles.container}>
                    <h1>Không tìm thấy thông tin tour</h1>
                    <p>Vui lòng quay lại trang chi tiết và chọn lại tour.</p>
                </div>
                <Footer/>
            </div>
        );
    }


    const numberOfGuests = guestCount || 1;
    const totalPrice = (tourDetails.price || 0) * numberOfGuests;

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1>Hoàn tất thông tin đặt Tour</h1>
                <p>Vui lòng cung cấp thông tin người liên hệ để chúng tôi hỗ trợ bạn tốt nhất.</p>
                <form onSubmit={handleSubmit}>
                    <div className={styles.layout}>
                        <div className={styles.customerInfoForm}>
                            <h3>Thông tin người liên hệ</h3>
                            <div className={styles.formGrid}>
                                <input name="name" type="text" placeholder="Họ và tên*" value={customerInfo.name || ''} onChange={handleInputChange} required />
                                <input name="email" type="email" placeholder="Email*" value={customerInfo.email || ''} onChange={handleInputChange} required />
                                <input name="phone" type="tel" placeholder="Số điện thoại*" value={customerInfo.phone || ''} onChange={handleInputChange} required />
                                <input name="address" type="text" placeholder="Địa chỉ" value={customerInfo.address || ''} onChange={handleInputChange} />
                            </div>
                        </div>

                        <aside className={styles.summary}>
                            <h3>Tóm tắt chuyến đi</h3>
                            <div className={styles.summaryItem}>
                                <p>{tourDetails.name}</p>
                                <span>{formatPrice(tourDetails.price)}</span>
                            </div>
                             <div className={styles.summaryItem}>
                                <p>Số lượng khách</p>
                                <span>x {numberOfGuests}</span>
                            </div>
                            <hr/>
                            <div className={`${styles.summaryItem} ${styles.total}`}>
                                <p>Tổng cộng</p>
                                {/* SỬA LỖI 2: Hiển thị tổng tiền đã tính */}
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                            <button type="submit" className={styles.confirmBtn}>Tiếp tục đến thanh toán</button>
                        </aside>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default TourBookingPage;