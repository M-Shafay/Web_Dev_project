import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "../Styles/Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Function to decode JWT and check expiration
  const validateToken = (token) => {
    if (!token) return false;

    try {
      const payloadBase64 = token.split('.')[1]; // Extract payload
      const decodedPayload = JSON.parse(atob(payloadBase64)); // Decode payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decodedPayload.exp > currentTime; // Check if token is still valid
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  // Validate token on component mount and when token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsTokenValid(validateToken(token));
  }, []);

  // Close mobile menu when the screen size exceeds 768px (desktop view)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false); // Close the menu when switching to desktop view
      }
    };
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from storage
    setIsTokenValid(false); // Update state to reflect logout
    navigate("/signin"); // Navigate to sign-in page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          <img src="/logo.png" alt="Airbnb Logo" />
          <NavLink to="/">Airbnb</NavLink>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div
          className="menu-toggle"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${isMobileMenuOpen ? "show" : ""}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
          </li>
          {!isTokenValid ? (
            <>
              <li>
                <NavLink to="/signup" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Sign Up
                </NavLink>
              </li>
              <li>
                <NavLink to="/signin" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Sign In
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Profile
                </NavLink>
              </li>
              <li>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
