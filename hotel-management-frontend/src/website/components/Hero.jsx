import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserFriends, FaBed, FaSearch, FaStar } from "react-icons/fa";
import heroImage from "../../assets/website/hero.jpg";

export default function Hero() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [searchParams, setSearchParams] = useState({
    checkIn: today,
    checkOut: tomorrow,
    guests: "2",
    category: "All",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/hotel-rooms", {
      state: { searchParams },
    });
  };

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-badge">
          <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar /> Five-Star Luxury Experience
        </div>

        <h1>Unrivaled Luxury & Timeless Hospitality</h1>

        <p>
          Immerse yourself in world-class opulence, Michelin-inspired dining, and panoramic skyline vistas at Royal Grand Hotel & Suites.
        </p>

        <div className="hero-cta-group">
          <Link to="/hotel-rooms" className="hero-btn">
            Explore Suites & Book
          </Link>
          <Link to="/about" className="hero-secondary-btn">
            Discover Our Heritage
          </Link>
        </div>
      </div>

      <form className="booking-search-bar" onSubmit={handleSearch}>
        <div className="search-field">
          <label>
            <FaCalendarAlt /> Check-In
          </label>
          <input
            type="date"
            min={today}
            value={searchParams.checkIn}
            onChange={(e) =>
              setSearchParams({ ...searchParams, checkIn: e.target.value })
            }
            required
          />
        </div>

        <div className="search-field">
          <label>
            <FaCalendarAlt /> Check-Out
          </label>
          <input
            type="date"
            min={searchParams.checkIn || today}
            value={searchParams.checkOut}
            onChange={(e) =>
              setSearchParams({ ...searchParams, checkOut: e.target.value })
            }
            required
          />
        </div>

        <div className="search-field">
          <label>
            <FaUserFriends /> Guests
          </label>
          <select
            value={searchParams.guests}
            onChange={(e) =>
              setSearchParams({ ...searchParams, guests: e.target.value })
            }
          >
            <option value="1">1 Guest (Solo)</option>
            <option value="2">2 Guests (Couple)</option>
            <option value="3">3 Guests (Family)</option>
            <option value="4">4+ Guests (Group)</option>
          </select>
        </div>

        <div className="search-field">
          <label>
            <FaBed /> Room Category
          </label>
          <select
            value={searchParams.category}
            onChange={(e) =>
              setSearchParams({ ...searchParams, category: e.target.value })
            }
          >
            <option value="All">All Luxury Suites</option>
            <option value="Deluxe">Deluxe King</option>
            <option value="Presidential">Presidential</option>
            <option value="Villa">Oceanfront Villa</option>
            <option value="Heritage">Heritage Suite</option>
            <option value="Penthouse">Skyline Penthouse</option>
          </select>
        </div>

        <button type="submit" className="search-submit-btn">
          <FaSearch /> Check Availability
        </button>
      </form>
    </section>
  );
}