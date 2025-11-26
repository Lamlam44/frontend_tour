import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';
import { isLoggedIn, getCurrentUser } from '../../services/auth';
import { getUserProfile } from '../../services/api';

function HotelBookingPage() {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { hotelDetails } = location.state || {};

    const [guestInfo, setGuestInfo] = useState({
        name: '',
        email: '',
        phone: '',
        specialRequest: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (isLoggedIn()) {
                const response = await getUserProfile();
                if (response.success) {
                    // Only pre-fill core contact info, not special requests
                    setGuestInfo(prev => ({
                        ...prev,
                        name: response.data.name,
                        email: response.data.email,
                        phone: response.data.phone
                    }));
                }
            }
            setIsLoading(false);
        };
        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuestInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Navigate to a new, hotel-specific payment page
        navigate('/payment/hotel', { 
            state: { 
                bookingDetails: guestInfo, 
                hotelDetails: hotelDetails || { id: hotelId, name: `Hotel #${hotelId}`, price: 'N/A' } 
            } 
        });
    };
    
    if (!hotelDetails) {
        return (
            <div>
                <Header />
                <div className={styles.container}><h1>Lỗi</h1><p>Không tìm thấy thông tin khách sạn. Vui lòng quay lại và thử lại.</p></div>
                <Footer/>
            </div>
        );
    }
    
    if (isLoading) {
        return <div><Header /><div className={styles.container}><p>Đang tải...</p></div><Footer/></div>;
    }

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1>Hoàn tất thông tin đặt phòng</h1>
                <p>Cung cấp thông tin người nhận phòng để chúng tôi có thể liên hệ khi cần.</p>
                <form onSubmit={handleSubmit}>
                    <div className={styles.layout}>
                        <div className={styles.customerInfoForm}>
                            <h3>Thông tin khách nhận phòng</h3>
                            <div className={styles.formGrid}>
                                <input name="name" type="text" placeholder="Họ và tên người nhận phòng*" value={guestInfo.name} onChange={handleInputChange} required />
                                <input name="email" type="email" placeholder="Email liên hệ*" value={guestInfo.email} onChange={handleInputChange} required />
                                <input name="phone" type="tel" placeholder="Số điện thoại liên hệ*" value={guestInfo.phone} onChange={handleInputChange} required />
                            </div>
                            <h3>Yêu cầu đặc biệt (tùy chọn)</h3>
                            <textarea name="specialRequest" className={styles.specialRequest} value={guestInfo.specialRequest} onChange={handleInputChange} placeholder="Ví dụ: Phòng không hút thuốc, tầng cao..."></textarea>
                        </div>

                        <aside className={styles.summary}>
                            <h3>Tóm tắt đặt phòng</h3>
                            <div className={styles.summaryItem}>
                                <p>{hotelDetails.name}</p>
                                <span>{hotelDetails.price}</span>
                            </div>
                            <hr/>
                            <div className={`${styles.summaryItem} ${styles.total}`}>
                                <p>Tổng cộng / đêm</p>
                                <span>{hotelDetails.price}</span>
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

export default HotelBookingPage;