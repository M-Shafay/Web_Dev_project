import { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import "../../Styles/HostBookings.css"; // Airbnb-style CSS

const HostReservations = () => {
  
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReservations = async () => {
      const authToken = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin-bookings/bookings`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setReservations(response.data);
      } catch (error) {
        setError("Failed to load reservations. Please try again later.");
        console.error("Error loading reservations:", error);
        navigate("/signin"); // Redirect to sign-in page if unauthenticated
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  return (
    <div className="host-reservations-container">
      <h1 className="heading">Your Reservations</h1>

      {loading ? (
        <p className="status-message">Loading reservations...</p>
      ) : error ? (
        <p className="status-message error">{error}</p>
      ) : reservations.length > 0 ? (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Location</th>
              <th>Guest Name</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Guests</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation.listingId?.title || "N/A"}</td>
                <td>{reservation.listingId?.location || "N/A"}</td>
                <td>{reservation.guestId?.username || "Unknown"}</td>
                <td>{new Date(reservation.checkIn).toLocaleString()}</td>
                <td>{new Date(reservation.checkOut).toLocaleString()}</td>
                <td>{reservation.numGuests}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="status-message">No reservations found for your properties.</p>
      )}
    </div>
  );
};

export default HostReservations;
