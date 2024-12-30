import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './Components/Auth/SignUp';
import SignIn from './Components/Auth/SignIn';
import Profile from './Components/page/Profile';
import Navbar from './Components/Navbar';
import HostDashboard from './Components/listings/HostDashboard';
import ListingsPage from './Components/page/HomeListings';
import ListingDetailsPage from './Components/listings/ListingDetailsPage';
import BookingPage from './Components/Bookings/BookingPage';
import BookingList from './Components/Bookings/BookingList';
import HostBookings from './Components/Bookings/HostBookings';
import './Styles/Packet.css'
import Footer from './Components/Footer';
function App() {
  return (
    <Router>
      <div className='packet'>
      <Navbar/>
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/bookinglist" element={<BookingList />} />
        <Route path="/listing/:id" element={<ListingDetailsPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/book/:listingId" element={<BookingPage />} />
        <Route path="/host/bookings" element={<HostBookings />} />
        <Route path="/hostdashboard" element={<HostDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
