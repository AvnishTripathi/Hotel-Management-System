import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { hotelInfo } from "../data/hotelData";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-top-grid">
        {/* Col 1: Brand */}
        <div className="footer-brand">
          <h3>ROYAL GRAND HOTEL</h3>
          <p>
            An iconic destination for connoisseurs of luxury, heritage grandeur, and impeccable hospitality. Located in the capital district.
          </p>

          <div className="footer-social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="footer-col">
          <h4>Explore</h4>
          <ul className="footer-links-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/hotel-rooms">Suites & Rooms</Link></li>
            <li><Link to="/about">Our Heritage</Link></li>
            <li><Link to="/contact">Contact Concierge</Link></li>
            <li><Link to="/my-bookings">Guest Portal</Link></li>
          </ul>
        </div>

        {/* Col 3: Accommodations */}
        <div className="footer-col">
          <h4>Suites & Stays</h4>
          <ul className="footer-links-list">
            <li><Link to="/hotel-rooms">Deluxe King Suites</Link></li>
            <li><Link to="/hotel-rooms">Presidential Royal</Link></li>
            <li><Link to="/hotel-rooms">Oceanfront Villas</Link></li>
            <li><Link to="/hotel-rooms">Heritage Suites</Link></li>
            <li><Link to="/hotel-rooms">Skyline Penthouse</Link></li>
          </ul>
        </div>

        {/* Col 4: Newsletter & Contact */}
        <div className="footer-col">
          <h4>Royal Newsletter</h4>
          <p style={{ fontSize: "0.9rem", color: "#94a3b8", margin: "0 0 12px 0" }}>
            Subscribe for exclusive private member invitations, secret seasonal tariffs, and culinary showcases.
          </p>

          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">
              Join
            </button>
          </form>

          {subscribed && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#10b981", fontSize: "0.85rem", marginTop: "8px" }}>
              <FaCheckCircle /> Thank you for subscribing!
            </div>
          )}

          <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.88rem", color: "#cbd5e1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaMapMarkerAlt style={{ color: "var(--primary-gold)" }} />
              <span>{hotelInfo.address}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaPhoneAlt style={{ color: "var(--primary-gold)" }} />
              <span>{hotelInfo.phone}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaEnvelope style={{ color: "var(--primary-gold)" }} />
              <span>{hotelInfo.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} Royal Grand Hotel & Suites. All rights reserved. Real-Time Hotel Operations Platform.
        </div>

        <div className="payment-partners">
          <span>🔒 256-Bit SSL Encrypted</span>
          <span>•</span>
          <span>VISA</span>
          <span>Mastercard</span>
          <span>RuPay</span>
          <span>UPI</span>
          <span>Amex</span>
        </div>
      </div>
    </footer>
  );
}