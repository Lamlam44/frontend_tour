import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/User/HomePage';
import TourDetailPage from './Pages/User/TourDetailPage';
import HotelDetailPage from './Pages/User/HotelDetailPage';
import BookingConfirmationPage from './Pages/User/BookingConfirmationPage';
import UserProfilePage from './Pages/User/UserProfilePage';
import TourListPage from './Pages/User/TourListPage';
import HotelListPage from './Pages/User/HotelListPage';
import FlightListPage from './Pages/User/FlightListPage';
import PromotionListPage from './Pages/User/PromotionListPage';
import FlightDetailPage from './Pages/User/FlightDetailPage';
import FlightBookingPage from './Pages/User/FlightBookingPage';
import TourBookingPage from './Pages/User/TourBookingPage';
import HotelBookingPage from './Pages/User/HotelBookingPage';
import LoginPage from './Pages/User/LoginPage';
import RegisterPage from './Pages/User/RegisterPage';
import AdminDashboard from './Pages/Admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tours" element={<TourListPage />} />
        <Route path="/tours/:tourId" element={<TourDetailPage />} />
        <Route path="/hotels" element={<HotelListPage />} />
        <Route path="/hotels/:hotelId" element={<HotelDetailPage />} />
        <Route path="/flights" element={<FlightListPage />} />
        <Route path="/flights/:flightId" element={<FlightDetailPage />} />
        <Route path="/promotions" element={<PromotionListPage />} />
        <Route path="/booking/tour/:tourId" element={<TourBookingPage />} />
        <Route path="/booking/hotel/:hotelId" element={<HotelBookingPage />} />
        <Route path="/booking/flight/:flightId" element={<FlightBookingPage />} />
        <Route path="/confirmation" element={<BookingConfirmationPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;