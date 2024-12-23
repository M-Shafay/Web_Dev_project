import React from "react";
import "../Styles/Footer.css"; // Adjust the path as needed

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Safety Information</a></li>
              <li><a href="#">Cancellation Options</a></li>
              <li><a href="#">Our COVID-19 Response</a></li>
              <li><a href="#">Supporting People with Disabilities</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Community</h4>
            <ul>
              <li><a href="#">Airbnb.org: disaster relief housing</a></li>
              <li><a href="#">Combating Discrimination</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Hosting</h4>
            <ul>
              <li><a href="#">Try Hosting</a></li>
              <li><a href="#">AirCover for Hosts</a></li>
              <li><a href="#">Explore Hosting Resources</a></li>
              <li><a href="#">Visit our Community Forum</a></li>
              <li><a href="#">How to Host Responsibly</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>About</h4>
            <ul>
              <li><a href="#">Newsroom</a></li>
              <li><a href="#">Learn about new features</a></li>
              <li><a href="#">Letter from our founders</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Investors</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Airbnb Clone. All rights reserved.</p>
          <div className="footer-social">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
