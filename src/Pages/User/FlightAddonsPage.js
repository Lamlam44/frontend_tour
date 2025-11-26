import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';

// Mock addon data
const ADDONS = [
    { id: 'baggage_23kg', name: 'Hành lý ký gửi 23kg', price: 550000 },
    { id: 'insurance', name: 'Bảo hiểm du lịch', price: 99000 },
];

function FlightAddonsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { passengers, contactInfo, flightDetails, fareDetails } = location.state || {};
    
    const [selectedAddons, setSelectedAddons] = useState([]);

    const handleAddonToggle = (addonId) => {
        setSelectedAddons(prev => 
            prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
        );
    };

    const calculateTotal = () => {
        const basePrice = parseInt(fareDetails.price.replace(/[^0-9]/g, ''), 10);
        const addonsPrice = selectedAddons.reduce((total, addonId) => {
            const addon = ADDONS.find(a => a.id === addonId);
            return total + (addon ? addon.price : 0);
        }, 0);
        const totalPrice = (basePrice * passengers.length) + addonsPrice;
        return totalPrice.toLocaleString('vi-VN') + 'đ';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const chosenAddons = ADDONS.filter(a => selectedAddons.includes(a.id));
        navigate('/payment/flight', {
            state: {
                passengers,
                contactInfo,
                flightDetails,
                fareDetails,
                addons: chosenAddons,
                totalPrice: calculateTotal()
            }
        });
    };

    if (!passengers || !flightDetails || !fareDetails) {
        return (
            <div>
                <Header />
                <div className={styles.container}><h1>Lỗi</h1><p>Không tìm thấy thông tin đặt vé. Vui lòng thử lại.</p></div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1>Dịch vụ bổ sung</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.layout}>
                        <div className={styles.customerInfoForm}>
                            <h3>Chọn dịch vụ cộng thêm</h3>
                             <div className={styles.addOnSection}>
                                {ADDONS.map(addon => (
                                    <label key={addon.id}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedAddons.includes(addon.id)}
                                            onChange={() => handleAddonToggle(addon.id)}
                                        /> 
                                        {addon.name} ({addon.price.toLocaleString('vi-VN')}đ)
                                    </label>
                                ))}
                            </div>
                        </div>

                        <aside className={styles.summary}>
                            <h3>Tóm tắt đơn hàng</h3>
                            <div className={styles.summaryItem}>
                                <p>{passengers.length} hành khách</p>
                            </div>
                            <hr />
                            <div className={`${styles.summaryItem} ${styles.total}`}>
                                <p>Tổng cộng</p>
                                <span>{calculateTotal()}</span>
                            </div>
                            <button type="submit" className={styles.confirmBtn}>Tiếp tục thanh toán</button>
                        </aside>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default FlightAddonsPage;
