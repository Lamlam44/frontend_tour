import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
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
import NewAdminDashboard from './Admin/views/NewAdminDashboard';
import AdminLayout from './Admin/layouts/AdminLayout';
import theme from './Admin/theme';

// Import new pages for booking flows
import PaymentMethodPage from './Pages/User/PaymentMethodPage'; 
import HotelPaymentPage from './Pages/User/HotelPaymentPage';
import FlightAddonsPage from './Pages/User/FlightAddonsPage';
import FlightPaymentPage from './Pages/User/FlightPaymentPage';
import PaymentReturnPage from './Pages/User/PaymentReturnPage';



function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          {/* Main User Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tours" element={<TourListPage />} />
          <Route path="/tours/:tourId" element={<TourDetailPage />} />
          <Route path="/hotels" element={<HotelListPage />} />
          <Route path="/hotels/:hotelId" element={<HotelDetailPage />} />
          <Route path="/flights" element={<FlightListPage />} />
          <Route path="/flights/:flightId" element={<FlightDetailPage />} />
          <Route path="/promotions" element={<PromotionListPage />} />
          
          {/* --- Booking and Payment Flows --- */}
          {/* Tour Flow */}
          <Route path="/booking/:tourId" element={<TourBookingPage />} />
          <Route path="/payment" element={<PaymentMethodPage />} />

          {/* Hotel Flow */}
          <Route path="/booking/hotel/:hotelId" element={<HotelBookingPage />} />
          <Route path="/payment/hotel" element={<HotelPaymentPage />} />

          {/* Flight Flow */}
          <Route path="/booking/flight/:flightId" element={<FlightBookingPage />} />
          <Route path="/booking/flight/addons" element={<FlightAddonsPage />} />
          <Route path="/payment/flight" element={<FlightPaymentPage />} />
          <Route path="/payment-return" element={<PaymentReturnPage />} />
          
          {/* Universal Confirmation Page */}
          <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
          
          {/* User Account */}
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route path="/dashboard" element={<NewAdminDashboard />} />
          <Route path="/admin/*" element={<AdminLayout />} />

        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;