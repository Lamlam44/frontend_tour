import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/FlightDetailPage.module.css';

// Dữ liệu giả cho một chuyến bay chi tiết
const mockFlightData = {
    id: 201,
    airline: 'Vietnam Airlines',
    logo: 'https://i.ibb.co/6g3b2m9/vna-logo.png',
    aircraft: 'Airbus A321',
    from: { code: 'SGN', city: 'TP. Hồ Chí Minh' },
    to: { code: 'HAN', city: 'Hà Nội' },
    departure: { time: '08:00', date: 'Thứ Hai, 27/10/2025', airport: 'Sân bay Tân Sơn Nhất' },
    arrival: { time: '10:10', date: 'Thứ Hai, 27/10/2025', airport: 'Sân bay Nội Bài' },
    duration: '2h 10m',
    stops: 'Bay thẳng',
    baggage: { carryOn: '12kg', checked: '23kg' },
    fares: [
        { class: 'Phổ thông', price: '1,550,000đ', details: ['Hành lý xách tay 12kg', 'Suất ăn nhẹ'] },
        { class: 'Thương gia', price: '4,250,000đ', details: ['Hành lý xách tay 18kg', 'Phòng chờ thương gia', 'Suất ăn nóng'] }
    ]
};

function FlightDetailPage() {
    const { flightId } = useParams();
    // Trong thực tế, bạn sẽ dùng flightId để fetch dữ liệu từ API
    const flight = mockFlightData;

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1>Chi tiết chuyến bay: {flight.from.city} - {flight.to.city}</h1>
                    <p>Mã chuyến bay: VNA-{flight.id}</p>
                </div>

                <div className={styles.flightInfoCard}>
                    <div className={styles.timeline}>
                        <div className={styles.point}>
                            <p className={styles.time}>{flight.departure.time}</p>
                            <p className={styles.airportCode}>{flight.from.code}</p>
                            <p className={styles.airportName}>{flight.departure.airport}</p>
                            <p className={styles.date}>{flight.departure.date}</p>
                        </div>
                        <div className={styles.path}>
                            <p>{flight.duration}</p>
                            <div className={styles.line}></div>
                            <p>{flight.stops}</p>
                        </div>
                        <div className={styles.point}>
                            <p className={styles.time}>{flight.arrival.time}</p>
                            <p className={styles.airportCode}>{flight.to.code}</p>
                            <p className={styles.airportName}>{flight.arrival.airport}</p>
                            <p className={styles.date}>{flight.arrival.date}</p>
                        </div>
                    </div>
                    <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Hãng bay</span>
                            <span className={styles.value}><img src={flight.logo} alt={flight.airline}/> {flight.airline}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Máy bay</span>
                            <span className={styles.value}>{flight.aircraft}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Hành lý xách tay</span>
                            <span className={styles.value}>{flight.baggage.carryOn}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Hành lý ký gửi</span>
                            <span className={styles.value}>{flight.baggage.checked}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.fareSection}>
                    <h2>Chọn hạng vé</h2>
                    <div className={styles.fareOptions}>
                        {flight.fares.map(fare => (
                            <div key={fare.class} className={styles.fareCard}>
                                <h3>{fare.class}</h3>
                                <p className={styles.price}>{fare.price}</p>
                                <ul>
                                    {fare.details.map(detail => <li key={detail}>✅ {detail}</li>)}
                                </ul>
                                <Link to={`/booking/flight/${flight.id}`} state={{ 
                                    flightDetails: { 
                                        id: flight.id, 
                                        airline: flight.airline,
                                        from: flight.from.code,
                                        to: flight.to.code,
                                        departureTime: flight.departure.time,
                                    },
                                    fareDetails: {
                                        class: fare.class,
                                        price: fare.price
                                    }
                                }}>
                                    <button className={styles.selectFareBtn}>Chọn vé</button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default FlightDetailPage;