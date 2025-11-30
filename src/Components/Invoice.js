import React from 'react';
import styles from '../Assets/CSS/ComponentsCSS/Invoice.module.css';

const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const Invoice = ({ tourDetails, numberOfGuests, totalPrice, memberDiscount, promoDiscountAmount, finalPrice, promotionCode, handleApplyPromotion, setPromotionCode, discountError, children, totalDiscount }) => {
    return (
        <aside className={styles.summary}>
            <h3>Hóa đơn</h3>
            <div className={styles.summaryItem}><p>{tourDetails.name}</p><span>{formatPrice(tourDetails.price)}</span></div>
            <div className={styles.summaryItem}><p>Số lượng khách</p><span>x {numberOfGuests}</span></div>
            <div className={styles.summaryItem}><p>Tạm tính</p><span>{formatPrice(totalPrice)}</span></div>
            <hr />

            {totalDiscount ? (
                <div className={`${styles.summaryItem} ${styles.discount}`}>
                    <p>Tổng giảm giá</p>
                    <span>- {formatPrice(totalDiscount)}</span>
                </div>
            ) : (
                <>
                    {memberDiscount > 0 && (
                        <div className={`${styles.summaryItem} ${styles.discount}`}>
                            <p>Giảm giá thành viên</p>
                            <span>- {formatPrice(memberDiscount)}</span>
                        </div>
                    )}

                    {handleApplyPromotion && (
                        <div className={styles.promotionSection}>
                            <h4>Áp dụng mã giảm giá</h4>
                            <div className={styles.promotionInput}>
                                <input type="text" placeholder="Nhập mã giảm giá" value={promotionCode} onChange={(e) => setPromotionCode(e.target.value)} />
                                <button type="button" onClick={handleApplyPromotion}>Xác nhận</button>
                            </div>
                            {discountError && <p className={styles.errorMessage}>{discountError}</p>}
                        </div>
                    )}
                
                    {promoDiscountAmount > 0 && (
                        <div className={`${styles.summaryItem} ${styles.discount}`}>
                            <p>Số tiền giảm (Mã)</p>
                            <span>- {formatPrice(promoDiscountAmount)}</span>
                        </div>
                    )}
                </>
            )}

            <hr />

            <div className={`${styles.summaryItem} ${styles.total}`}><p>Tổng cộng</p><span>{formatPrice(finalPrice)}</span></div>
            
            {/* Render children, which can be the payment button or other controls */}
            {children}
        </aside>
    );
};

export default Invoice;
