import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaConciergeBell, FaCalendarCheck } from "react-icons/fa";
import logo from "../../assets/hotel-logo.png";

export default function WebsiteNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guestUser, setGuestUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("guest_token");
    const storedGuest = localStorage.getItem("guest_user");
    if (token && storedGuest) {
      try {
        setGuestUser(JSON.parse(storedGuest));
      } catch {
        setGuestUser({ first_name: "Guest" });
      }
    } else if (token) {
      setGuestUser({ first_name: "Guest" });
    } else {
      setGuestUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("guest_token");
    localStorage.removeItem("guest_user");
    setGuestUser(null);
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className={`website-navbar ${isScrolled ? "scrolled" : ""}`}>
      <Link to="/" className="website-logo" onClick={() => setMobileMenuOpen(false)}>
        <img src={logo} alt="Royal Grand Hotel" />
        <div className="website-logo-text">
          <span className="website-logo-title">ROYAL GRAND</span>
          <span className="website-logo-sub">Hotel & Luxury Suites</span>
        </div>
      </Link>

      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle Navigation"
      >
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`website-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <Link
          to="/"
          className={isActive("/")}
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </Link>

        <Link
          to="/hotel-rooms"
          className={isActive("/hotel-rooms")}
          onClick={() => setMobileMenuOpen(false)}
        >
          Suites & Rooms
        </Link>

        <Link
          to="/about"
          className={isActive("/about")}
          onClick={() => setMobileMenuOpen(false)}
        >
          About Us
        </Link>

        <Link
          to="/contact"
          className={isActive("/contact")}
          onClick={() => setMobileMenuOpen(false)}
        >
          Contact & Concierge
        </Link>

        {guestUser ? (
          <div className="user-menu-badge">
            <div className="user-avatar">
              {guestUser.first_name ? guestUser.first_name.charAt(0).toUpperCase() : "G"}
            </div>
            <span>Hi, {guestUser.first_name}</span>
            <Link
              to="/my-bookings"
              style={{ color: "var(--primary-gold)", display: "flex", alignItems: "center", gap: "4px" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaCalendarCheck /> Bookings
            </Link>
            <button className="logout-link-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/guest-login"
              className={isActive("/guest-login")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Guest Login
            </Link>

            <Link
              to="/guest-register"
              className="nav-cta-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaUserCircle /> Join Privileges
            </Link>
          </>
        )}

        <Link
          to="/hotel-rooms"
          className="nav-cta-btn"
          style={{ background: "linear-gradient(135deg, #d4af37 0%, #b89028 100%)" }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <FaConciergeBell /> Book Now
        </Link>

        <Link
          to="/login"
          className="nav-admin-btn"
          title="Staff & Management Portal"
          onClick={() => setMobileMenuOpen(false)}
        >
          Staff Portal
        </Link>
      </div>
    </nav>
  );
}