import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';
import { useAuth } from '../../context/AuthContext'; // Updated import
import { getTourById, applyPromotion } from '../../services/api';

const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

function TourBookingPage() {
    const { tourId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth(); // Using AuthContext

    const [fetchedTourDetails, setFetchedTourDetails] = useState(null);
    const [currentGuestCount, setCurrentGuestCount] = useState(location.state?.guestCount || 1);
    const [customerInfo, setCustomerInfo] = useState({
        fullName: '', email: '', phoneNumber: '', address: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State for promotion code
    const [promotionCode, setPromotionCode] = useState('');
    const [promoDiscountAmount, setPromoDiscountAmount] = useState(0);
    const [discountError, setDiscountError] = useState('');
    const [appliedPromotionId, setAppliedPromotionId] = useState(null);

    // State for member discount
    const [memberDiscount, setMemberDiscount] = useState(0);

    useEffect(() => {
        const loadTourAndUserData = async () => {
            setIsLoading(true);
            let tourDataFromState = location.state?.tourDetails;

            try {
                const tourData = tourDataFromState || await getTourById(tourId);
                setFetchedTourDetails(tourData);

                // Auto-fill user info and apply member discount if logged in
                if (isAuthenticated && user) {
                    setCustomerInfo({
                        fullName: user.fullName || '',
                        email: user.email || '',
                        phoneNumber: user.phoneNumber || '',
                        address: user.address || ''
                    });
                    // Apply 1,000,000 VND discount for logged-in users
                    setMemberDiscount(1000000);
                }
            } catch (err) {
                console.error("Failed to load data:", err);
                setError('Không thể tải thông tin. Vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        };
        loadTourAndUserData();
    }, [tourId, location.state, isAuthenticated, user]);

    const tourDetails = fetchedTourDetails; 
    const guestCount = currentGuestCount;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyPromotion = async () => {
        if (!promotionCode) {
            setDiscountError('Vui lòng nhập mã giảm giá.');
            return;
        }
        try {
            const currentTourId = tourDetails.tourId || tourDetails.id;
            const response = await applyPromotion(promotionCode, currentTourId);
            
            const percentage = response.discountPercentage || 0;
            const totalBeforeDiscount = (tourDetails.price || 0) * (guestCount || 1);
            const discountValue = (totalBeforeDiscount * percentage) / 100;
            
            setPromoDiscountAmount(discountValue);
            setDiscountError(''); 
            setAppliedPromotionId(response.promotionId); 

        } catch (err) {
            setPromoDiscountAmount(0);
            setAppliedPromotionId(null);
            setDiscountError(err.response?.data?.message || 'Mã giảm giá không hợp lệ.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const totalAmount = (tourDetails?.price || 0) * (guestCount || 1);
        const finalPrice = totalAmount - promoDiscountAmount - memberDiscount;

        navigate('/payment', { 
            state: { 
                bookingDetails: {
                    ...customerInfo,
                    guestCount: guestCount || 1,
                }, 
                itemDetails: tourDetails,
                displayTotalAmount: finalPrice, 
                displayDiscountAmount: promoDiscountAmount + memberDiscount, // Total discount
                transactionData: {
                    tourId: tourDetails.tourId || tourDetails.id,
                    quantity: guestCount || 1,
                    promotionIds: appliedPromotionId ? [appliedPromotionId] : [] 
                }
            } 
        });
    };

    if (isLoading) {
        return <div><Header /><div className={styles.container}><p>Đang tải...</p></div><Footer/></div>;
    }

    if (error || !tourDetails) {
        return (
            <div>
                <Header />
                <div className={styles.container}><h1>Lỗi</h1><p>{error || 'Không tìm thấy thông tin tour'}</p></div>
                <Footer/>
            </div>
        );
    }

    const numberOfGuests = guestCount || 1;
    const totalPrice = (tourDetails.price || 0) * numberOfGuests;
    const finalPrice = totalPrice - promoDiscountAmount - memberDiscount;

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
                                <input name="fullName" type="text" placeholder="Họ và tên*" value={customerInfo.fullName || ''} onChange={handleInputChange} required />
                                <input name="email" type="email" placeholder="Email*" value={customerInfo.email || ''} onChange={handleInputChange} required />
                                <input name="phoneNumber" type="tel" placeholder="Số điện thoại*" value={customerInfo.phoneNumber || ''} onChange={handleInputChange} required />
                                <input name="address" type="text" placeholder="Địa chỉ" value={customerInfo.address || ''} onChange={handleInputChange} />
                            </div>
                        </div>

                        <aside className={styles.summary}>
                            <h3>Tóm tắt chuyến đi</h3>
                            <div className={styles.summaryItem}><p>{tourDetails.name}</p><span>{formatPrice(tourDetails.price)}</span></div>
                            <div className={styles.summaryItem}><p>Số lượng khách</p><span>x {numberOfGuests}</span></div>
                            <div className={styles.summaryItem}><p>Tạm tính</p><span>{formatPrice(totalPrice)}</span></div>
                            <hr/>
                            
                            {memberDiscount > 0 && (
                                <div className={`${styles.summaryItem} ${styles.discount}`}>
                                    <p>Giảm giá thành viên</p>
                                    <span>- {formatPrice(memberDiscount)}</span>
                                </div>
                            )}

                            <div className={styles.promotionSection}>
                                <h4>Áp dụng mã giảm giá</h4>
                                <div className={styles.promotionInput}>
                                    <input type="text" placeholder="Nhập mã giảm giá" value={promotionCode} onChange={(e) => setPromotionCode(e.target.value)} />
                                    <button type="button" onClick={handleApplyPromotion}>Xác nhận</button>
                                </div>
                                {discountError && <p className={styles.errorMessage}>{discountError}</p>}
                            </div>
                            
                            {promoDiscountAmount > 0 && (
                                <div className={`${styles.summaryItem} ${styles.discount}`}>
                                    <p>Số tiền giảm (Mã)</p>
                                    <span>- {formatPrice(promoDiscountAmount)}</span>
                                </div>
                            )}

                            <hr/>

                            <div className={`${styles.summaryItem} ${styles.total}`}><p>Tổng cộng</p><span>{formatPrice(finalPrice)}</span></div>
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