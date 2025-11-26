import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/BookingPage.module.css';
import { getUserProfile } from '../../services/api';
import { isLoggedIn } from '../../services/auth';

const initialPassenger = { fullName: '', gender: 'MALE', dob: '' };

function FlightBookingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { flightId } = useParams();
    const { flightDetails, fareDetails } = location.state || {};

    const [passengers, setPassengers] = useState([initialPassenger]);
    const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (await isLoggedIn()) {
                const response = await getUserProfile();
                if (response.success) {
                    setContactInfo({ email: response.data.email, phone: response.data.phone });
                }
            }
            setIsLoading(false);
        };
        fetchUserData();
    }, []);
    
    const handlePassengerChange = (index, event) => {
        const values = [...passengers];
        values[index][event.target.name] = event.target.value;
        setPassengers(values);
    };

    const handleContactChange = (event) => {
        setContactInfo({ ...contactInfo, [event.target.name]: event.target.value });
    };

    const addPassenger = () => {
        setPassengers([...passengers, { ...initialPassenger }]);
    };

    const removePassenger = (index) => {
        if (passengers.length > 1) {
            const values = [...passengers];
            values.splice(index, 1);
            setPassengers(values);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Navigate to the addons page, passing all data
        navigate(`/booking/flight/addons`, {
            state: {
                passengers,
                contactInfo,
                flightDetails,
                fareDetails
            }
        });
    };

    if (!flightDetails || !fareDetails) {
        return (
             <div>
                <Header />
                <div className={styles.container}><h1>Lỗi</h1><p>Không tìm thấy thông tin chuyến bay. Vui lòng quay lại và thử lại.</p></div>
                <Footer/>
            </div>
        );
    }
    
    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1>Thông tin hành khách</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.layout}>
                        <div className={styles.customerInfoForm}>
                            {passengers.map((passenger, index) => (
                                <div key={index} className={styles.passengerForm}>
                                    <div className={styles.passengerHeader}>
                                        <h4>Hành khách {index + 1}</h4>
                                        {index > 0 && <button type="button" onClick={() => removePassenger(index)} className={styles.removeBtn}>Xóa</button>}
                                    </div>
                                    <div className={styles.formGrid}>
                                        <input type="text" name="fullName" placeholder="Họ và Tên (như trên giấy tờ)*" value={passenger.fullName} onChange={e => handlePassengerChange(index, e)} required />
                                        <select name="gender" value={passenger.gender} onChange={e => handlePassengerChange(index, e)}>
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                        </select>
                                        <input type="date" name="dob" value={passenger.dob} onChange={e => handlePassengerChange(index, e)} required/>
                                    </div>
                                </div>
                            ))}
                             <button type="button" onClick={addPassenger} className={styles.addBtn}>+ Thêm hành khách</button>
                            
                            <h3 className={styles.sectionTitle}>Thông tin liên hệ (để nhận vé)</h3>
                            <div className={styles.formGrid}>
                                <input type="email" name="email" placeholder="Email*" value={contactInfo.email} onChange={handleContactChange} required />
                                <input type="tel" name="phone" placeholder="Số điện thoại*" value={contactInfo.phone} onChange={handleContactChange} required />
                            </div>
                        </div>

                        <aside className={styles.summary}>
                            <h3>Tóm tắt chuyến bay</h3>
                            <div className={styles.summaryItem}>
                                <p>{flightDetails.airline}: {flightDetails.from} - {flightDetails.to}</p>
                            </div>
                            <div className={styles.summaryItem}>
                                <p>Hạng vé</p>
                                <span>{fareDetails.class}</span>
                            </div>
                             <div className={styles.summaryItem}>
                                <p>Hành khách</p>
                                <span>{passengers.length}</span>
                            </div>
                            <hr/>
                            <div className={`${styles.summaryItem} ${styles.total}`}>
                                <p>Tạm tính</p>
                                <span>{fareDetails.price} x {passengers.length}</span>
                            </div>
                            <button type="submit" className={styles.confirmBtn}>Tiếp tục</button>
                        </aside>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default FlightBookingPage;