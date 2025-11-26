import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';
import { isLoggedIn, getCurrentUser } from '../../services/auth';
import { getUserProfile } from '../../services/api';


function TourBookingPage() {
    const { tourId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { tourDetails } = location.state || {}; // Nhận thông tin tour từ trang chi tiết

    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (isLoggedIn()) {
                const response = await getUserProfile();
                if (response.success) {
                    setCustomerInfo(response.data);
                }
            }
            setIsLoading(false);
        };
        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Chuyển đến trang chọn phương thức thanh toán, mang theo thông tin khách hàng và tour
        navigate('/payment', { 
            state: { 
                bookingDetails: customerInfo, 
                tourDetails: tourDetails || { id: tourId, name: `Tour #${tourId}`, price: 'N/A' } 
            } 
        });
    };

    if (!tourDetails) {
         // Fallback in case state is not passed, though in a real app you might fetch it again
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
    
    if (isLoading) {
        return <div><Header /><div className={styles.container}><p>Đang tải...</p></div><Footer/></div>;
    }

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
                                <input name="name" type="text" placeholder="Họ và tên*" value={customerInfo.name} onChange={handleInputChange} required />
                                <input name="email" type="email" placeholder="Email*" value={customerInfo.email} onChange={handleInputChange} required />
                                <input name="phone" type="tel" placeholder="Số điện thoại*" value={customerInfo.phone} onChange={handleInputChange} required />
                                <input name="address" type="text" placeholder="Địa chỉ" value={customerInfo.address} onChange={handleInputChange} />
                            </div>
                        </div>

                        <aside className={styles.summary}>
                            <h3>Tóm tắt chuyến đi</h3>
                            <div className={styles.summaryItem}>
                                <p>{tourDetails.name}</p>
                                <span>{tourDetails.price}</span>
                            </div>
                            <hr/>
                            <div className={`${styles.summaryItem} ${styles.total}`}>
                                <p>Tổng cộng</p>
                                <span>{tourDetails.price}</span>
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