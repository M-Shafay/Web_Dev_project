import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../Styles/ReservationPage.css";  // Importing the new CSS for styling

const ReservationPage = () => {
  const [reservationData, setReservationData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guestCount: 1,
  });
  const [statusMessage, setStatusMessage] = useState("");
  const { listingId } = useParams();

  const handleInputChange = (e) =>
    setReservationData({ ...reservationData, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("token");
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/Booking/create-booking`,
        { ...reservationData, listingId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setStatusMessage(response.data.message); // Show success message
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Booking failed, please try again.";
      setStatusMessage(errorMessage); // Show error message
    }
  };
  

  return (
    <div className="reservation-container">
      <h2 className="reservation-title">Book Your Stay</h2>
      <form onSubmit={handleFormSubmit} className="reservation-form">
        <div className="input-group">
          <label>Check-in Date</label>
          <input
            type="date"
            name="checkInDate"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Check-out Date</label>
          <input
            type="date"
            name="checkOutDate"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Number of Guests</label>
          <input
            type="number"
            name="guestCount"
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        <button type="submit" className="book-now-button">Book Now</button>
      </form>

      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};

export default ReservationPage;
