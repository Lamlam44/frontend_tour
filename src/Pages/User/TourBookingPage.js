import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';
import { isLoggedIn } from '../../services/auth';
import { getUserProfile, getTourById, applyPromotion } from '../../services/api';

const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

function TourBookingPage() {
    const { tourId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [fetchedTourDetails, setFetchedTourDetails] = useState(null);
    const [currentGuestCount, setCurrentGuestCount] = useState(location.state?.guestCount || 1);
    const [customerInfo, setCustomerInfo] = useState({
        name: '', email: '', phone: '', address: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State cho khuyến mãi
    const [promotionCode, setPromotionCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountError, setDiscountError] = useState('');
    
    // State lưu ID khuyến mãi để gửi đi thanh toán (QUAN TRỌNG)
    const [appliedPromotionId, setAppliedPromotionId] = useState(null);

    useEffect(() => {
        const loadTourAndUserData = async () => {
            let tourDataFromState = location.state?.tourDetails;
            let fetchedData = null;

            if (!tourDataFromState && tourId) {
                try {
                    fetchedData = await getTourById(tourId);
                    setFetchedTourDetails(fetchedData);
                } catch (err) {
                    console.error("Failed to fetch tour details:", err);
                    setError('Không thể tải thông tin tour. Vui lòng thử lại.');
                    setIsLoading(false);
                    return;
                }
            } else {
                setFetchedTourDetails(tourDataFromState);
            }
            
            if (isLoggedIn()) {
                try {
                    const userData = await getUserProfile();
                    setCustomerInfo(userData);
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                }
            }
            setIsLoading(false);
        };
        loadTourAndUserData();
    }, [tourId, location.state]);

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
            // Lấy ID của tour để gửi kèm mã giảm giá (Để backend check xem mã này có áp dụng cho tour này ko)
            const currentTourId = tourDetails.tourId || tourDetails.id;
            
            // Gọi API: POST /api/promotions/apply?code=...&tourId=...
            const response = await applyPromotion(promotionCode, currentTourId);
            
            // 1. Tính toán hiển thị (Display Only)
            const percentage = response.discountPercentage || 0;
            const totalBeforeDiscount = (tourDetails.price || 0) * (guestCount || 1);
            const discountValue = (totalBeforeDiscount * percentage) / 100;
            
            // 2. Cập nhật UI
            setDiscountAmount(discountValue);
            setDiscountError(''); 
            
            // 3. LƯU ID KHUYẾN MÃI (Để gửi sang trang thanh toán)
            setAppliedPromotionId(response.promotionId); 

        } catch (err) {
            setDiscountAmount(0);
            setAppliedPromotionId(null); // Reset ID nếu lỗi
            // Hiển thị lỗi từ Backend trả về (VD: "Mã không áp dụng cho tour này")
            setDiscountError(err.response?.data?.message || 'Mã giảm giá không hợp lệ.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Tính toán hiển thị (Frontend tính)
        const totalAmount = (tourDetails?.price || 0) * (guestCount || 1);
        const finalPrice = totalAmount - discountAmount;

        navigate('/payment', { 
            state: { 
                bookingDetails: {
                    ...customerInfo,
                    guestCount: guestCount || 1,
                }, 
                itemDetails: tourDetails,
                
                // Dữ liệu hiển thị (Chỉ để xem)
                displayTotalAmount: finalPrice, 
                displayDiscountAmount: discountAmount,

                // DỮ LIỆU GIAO DỊCH (Quan trọng)
                transactionData: {
                    tourId: tourDetails.tourId || tourDetails.id,
                    quantity: guestCount || 1,
                    // Gửi danh sách ID khuyến mãi (dạng mảng vì DTO backend nhận Set<String>)
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
                <div className={styles.container}>
                    <h1>Lỗi</h1>
                    <p>{error || 'Không tìm thấy thông tin tour'}</p>
                </div>
                <Footer/>
            </div>
        );
    }

    const numberOfGuests = guestCount || 1;
    const totalPrice = (tourDetails.price || 0) * numberOfGuests;
    const finalPrice = totalPrice - discountAmount;

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
                             <div className={styles.summaryItem}>
                                <p>Tạm tính</p>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>

                            <hr/>
                            
                            {/* Khu vực nhập mã giảm giá */}
                            <div className={styles.promotionSection}>
                                <h4>Áp dụng mã giảm giá</h4>
                                <div className={styles.promotionInput}>
                                    <input 
                                        type="text" 
                                        placeholder="Nhập mã giảm giá" 
                                        value={promotionCode}
                                        onChange={(e) => setPromotionCode(e.target.value)}
                                    />
                                    <button type="button" onClick={handleApplyPromotion}>Xác nhận</button>
                                </div>
                                {discountError && <p className={styles.errorMessage}>{discountError}</p>}
                            </div>
                            
                            {discountAmount > 0 && (
                                <div className={`${styles.summaryItem} ${styles.discount}`}>
                                    <p>Số tiền giảm (Dự kiến)</p>
                                    <span>- {formatPrice(discountAmount)}</span>
                                </div>
                            )}

                            <hr/>

                            <div className={`${styles.summaryItem} ${styles.total}`}>
                                <p>Tổng cộng</p>
                                <span>{formatPrice(finalPrice)}</span>
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