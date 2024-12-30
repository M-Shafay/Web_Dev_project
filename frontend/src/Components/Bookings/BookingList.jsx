import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Styles/Bookinglist.css"; // Import Airbnb-style CSS

const BookingsPage = () => {
  const navigate = useNavigate();
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      const authToken = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/Booking/get-bookings`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setUserBookings(response.data);
      } catch (error) {
        setFetchError("Failed to fetch your bookings. Please try again later.");
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) return <div className="status-message">Loading your bookings...</div>;

  if (fetchError) return <div className="status-message error">{fetchError}</div>;

  return (
    <div className="bookings-page">
      <h2 className="page-title">Your Bookings</h2>
      {userBookings.length === 0 ? (
        <p className="status-message">No bookings found.</p>
      ) : (
        <div className="bookings-container">
          {userBookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <img
                src={booking.listingId.image_url || "/placeholder.jpg"}
                alt={booking.listingId.title || "Booking image"}
                className="booking-image"
              />
              <div className="booking-details">
                <h3 className="booking-title">{booking.listingId.title || "Unknown Property"}</h3>
                <p className="booking-location">
                  <strong>Location:</strong> {booking.listingId.location || "N/A"}
                </p>
                <p>
                  <strong>Price:</strong> {booking.listingId.price} / night
                </p>
                <p>
                  <strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}
                </p>
                <p>
                  <strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total Price:</strong> {booking.totalPrice} $
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
