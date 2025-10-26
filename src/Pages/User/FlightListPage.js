import React from 'react';
import { Link } from 'react-router-dom'; // <-- IMPORT LINK
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import FilterSidebar from '../../Components/FilterSidebar';
import styles from '../../Assets/CSS/PageCSS/ListPage.module.css';

const flightFilterGroups = [
    { title: 'Điểm dừng', type: 'checkbox', name: 'stops', options: ['Bay thẳng', '1 điểm dừng'] },
    { title: 'Hãng bay', type: 'checkbox', name: 'airlines', options: ['Vietnam Airlines', 'VietJet Air', 'Bamboo Airways'] },
    { title: 'Thời gian bay', type: 'checkbox', name: 'time', options: ['Sáng sớm (00:00 - 06:00)', 'Buổi sáng (06:00 - 12:00)', 'Buổi chiều (12:00 - 18:00)', 'Buổi tối (18:00 - 24:00)'] }
];

const mockFlights = [
    { id: 201, airline: 'Vietnam Airlines', from: 'SGN', to: 'HAN', departureTime: '08:00', arrivalTime: '10:10', duration: '2h 10m', stops: 'Bay thẳng', price: '1,550,000đ', logo: 'https://i.ibb.co/6g3b2m9/vna-logo.png' },
    { id: 202, airline: 'VietJet Air', from: 'SGN', to: 'HAN', departureTime: '09:30', arrivalTime: '11:40', duration: '2h 10m', stops: 'Bay thẳng', price: '1,200,000đ', logo: 'https://i.ibb.co/k3t0k3G/vietjet-logo.png' },
    { id: 203, airline: 'Bamboo Airways', from: 'SGN', to: 'HAN', departureTime: '11:00', arrivalTime: '13:10', duration: '2h 10m', stops: 'Bay thẳng', price: '1,450,000đ', logo: 'https://i.ibb.co/q0wjy2b/bamboo-logo.png' },
];

function FlightListPage() {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Chuyến Bay Từ Sài Gòn (SGN) đến Hà Nội (HAN)</h1>
          <p>Giá vé một chiều, đã bao gồm thuế và phí</p>
        </div>
        <div className={styles.layout}>
            <FilterSidebar filterGroups={flightFilterGroups} />
            <main className={styles.mainContent}>
                <div className={styles.list}>
                {mockFlights.map(flight => (
                    <div key={flight.id} className={styles.flightCard}>
                    <div className={styles.airlineInfo}>
                        <img src={flight.logo} alt={flight.airline} />
                        <span>{flight.airline}</span>
                    </div>
                    <div className={styles.flightDetails}>
                        <div className={styles.departure}>
                            <p className={styles.time}>{flight.departureTime}</p>
                            <p>{flight.from}</p>
                        </div>
                        <div className={styles.flightPath}>
                            <p>{flight.duration}</p>
                            <svg width="100" height="20" viewBox="0 0 100 20"><line x1="0" y1="10" x2="90" y2="10" stroke="#ccc" strokeWidth="2"></line><polygon points="85,5 100,10 85,15" fill="#ccc"></polygon></svg>
                            <p>{flight.stops}</p>
                        </div>
                        <div className={styles.arrival}>
                            <p className={styles.time}>{flight.arrivalTime}</p>
                            <p>{flight.to}</p>
                        </div>
                    </div>
                    <div className={styles.flightPrice}>
                        <p>{flight.price}</p>
                        <Link to={`/booking/flight/${flight.id}`}>
                            <button>Chọn chuyến bay</button>
                        </Link>
                    </div>
                    </div>
                ))}
                </div>
            </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FlightListPage;