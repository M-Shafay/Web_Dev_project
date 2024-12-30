import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../Styles/Profile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [formFields, setFormFields] = useState({
    dob: "",
    contact: "",
    bio: "",
  });
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data);
        setFormFields({
          dob: response.data.dob,
          contact: response.data.contact,
          bio: response.data.bio,
        });
      } catch (error) {
        setError("Error loading profile data. Please try again.");
        navigate('/signin');
      }
    };

    loadUserProfile();
  }, []);

  const handleFieldChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordFields({ ...passwordFields, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
        formFields,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage("Profile updated successfully");
    } catch (error) {
      setError("Error updating profile. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile/update-password`,
        {
          currentPassword: passwordFields.currentPassword,
          newPassword: passwordFields.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage("Password updated successfully");
      setPasswordFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setError("Error updating password. Please try again.");

    }
  };

  const handleGuestNavigate = () => {
    navigate('/bookinglist');
  };

  const handleHostDashboardNavigate = () => {
    navigate('/hostdashboard');
  };

  const handleHostBookingNavigate = () => {
    navigate('/host/bookings');
  };

  return (
    <div className="profile-container">
      <div className="profile-actions">
        {userData.role === 'Guest' ?  
          <button onClick={handleGuestNavigate} className="action-btn">View Reservations</button>
        :
          <div>
            <button onClick={handleHostBookingNavigate} className="action-btn">Host Bookings</button>
            <button onClick={handleHostDashboardNavigate} className="action-btn">Host Dashboard</button>
          </div>
        }
      </div>

      <div className="profile-header">
        <h1 className="profile-username">{userData.username}</h1>
        <p className="profile-email"><strong>Email:</strong> {userData.email}</p>
        <p className="profile-role"><strong>Role:</strong> {userData.role}</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="form-container">
        <form onSubmit={handleFormSubmit} className="profile-form">
          <h3>Update Profile</h3>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formFields.dob || ""}
              onChange={handleFieldChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Contact</label>
            <input
              type="text"
              name="contact"
              value={formFields.contact || ""}
              onChange={handleFieldChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formFields.bio || ""}
              onChange={handleFieldChange}
              className="form-textarea"
            />
          </div>
          <button type="submit" className="submit-btn">Update Profile</button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="password-form">
          <h3>Update Password</h3>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordFields.currentPassword || ""}
              onChange={handlePasswordChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordFields.newPassword || ""}
              onChange={handlePasswordChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordFields.confirmPassword || ""}
              onChange={handlePasswordChange}
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-btn">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
