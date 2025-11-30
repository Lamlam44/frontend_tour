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
import OAuth2RedirectHandler from './Pages/User/OAuth2RedirectHandler'; 
import { WebSocketProvider } from './context/WebSocketContext';

// Import new pages for booking flows
import PaymentMethodPage from './Pages/User/PaymentMethodPage'; 
import PaymentReturnPage from './Pages/User/PaymentReturnPage';



function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
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
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* THÊM ROUTE NÀY: Route để nhận Redirect từ Backend */}
              <Route path="/callback" element={<OAuth2RedirectHandler />} />

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
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;