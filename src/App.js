import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/User/HomePage';
import SearchResultsPage from './Pages/User/SearchResultsPage';
import TourDetailPage from './Pages/User/TourDetailPage';
import HotelDetailPage from './Pages/User/HotelDetailPage';
import BookingPage from './Pages/User/BookingPage';
import BookingConfirmationPage from './Pages/User/BookingConfirmationPage';
import UserProfilePage from './Pages/User/UserProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/tours/:tourId" element={<TourDetailPage />} />
        <Route path="/hotels/:hotelId" element={<HotelDetailPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/confirmation" element={<BookingConfirmationPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;