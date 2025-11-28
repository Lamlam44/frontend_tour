import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import HomePage from './Pages/User/HomePage';
import TourDetailPage from './Pages/User/TourDetailPage';
import BookingConfirmationPage from './Pages/User/BookingConfirmationPage';
import UserProfilePage from './Pages/User/UserProfilePage';
import TourListPage from './Pages/User/TourListPage';
import PromotionListPage from './Pages/User/PromotionListPage';
import TourBookingPage from './Pages/User/TourBookingPage';
import LoginPage from './Pages/User/LoginPage';
import RegisterPage from './Pages/User/RegisterPage';
import NewAdminDashboard from './Admin/views/NewAdminDashboard';
import AdminLayout from './Admin/layouts/AdminLayout';
import theme from './Admin/theme';
import ProtectedRoute from './Components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import new pages for booking flows
import PaymentMethodPage from './Pages/User/PaymentMethodPage'; 
import PaymentReturnPage from './Pages/User/PaymentReturnPage';



function App() {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            {/* Main User Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/tours" element={<TourListPage />} />
            <Route path="/tours/:tourId" element={<TourDetailPage />} />
            <Route path="/promotions" element={<PromotionListPage />} />
            
            {/* --- Booking and Payment Flows --- */}
            {/* Tour Flow */}
            <Route path="/booking/:tourId" element={<TourBookingPage />} />
            <Route path="/payment" element={<PaymentMethodPage />} />
            <Route path="/payment-return" element={<PaymentReturnPage />} />
            
            {/* Universal Confirmation Page */}
            <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
            
            {/* User Account */}
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <NewAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;