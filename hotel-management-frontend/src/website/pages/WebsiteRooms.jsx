import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBed,
  FaUsers,
  FaVectorSquare,
  FaStar,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaEye,
  FaFire,
} from "react-icons/fa";
import WebsiteNavbar from "../components/WebsiteNavbar";
import Footer from "../components/Footer";
import { roomsData } from "../data/hotelData";

export default function WebsiteRooms() {
  const navigate = useNavigate();
  const location = useLocation();

  const preselectedCategory =
    location.state?.searchParams?.category && location.state?.searchParams?.category !== "All"
      ? location.state.searchParams.category
      : "All";

  const [activeCategory, setActiveCategory] = useState(preselectedCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const categories = ["All", "Deluxe", "Presidential", "Villa", "Heritage", "Penthouse"];

  const filteredAndSortedRooms = useMemo(() => {
    let result = roomsData.filter((room) => {
      const matchesCategory =
        activeCategory === "All" || room.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.amenities.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  const handleBookingClick = (room) => {
    const token = localStorage.getItem("guest_token");
    if (!token) {
      navigate("/guest-login", {
        state: { room, searchParams: location.state?.searchParams },
      });
      return;
    }

    navigate("/booking", {
      state: { room, searchParams: location.state?.searchParams },
    });
  };

  return (
    <>
      <WebsiteNavbar />

      <div className="page-hero">
        <span className="hero-badge">Curated Living Spaces</span>
        <h1>Our Suites & Sanctuaries</h1>
        <p>
          Discover refined comfort designed for restorative getaways, executive stays, and family retreats.
        </p>
      </div>

      <section className="rooms-page" style={{ paddingTop: "50px" }}>
        {/* Filters and Search Bar */}
        <div className="filter-bar-container">
          <div className="filter-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="filter-controls">
            <div className="search-input-wrap">
              <FaSearch className="search-input-icon" />
              <input
                type="text"
                placeholder="Search rooms & amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Guest Rating</option>
            </select>
          </div>
        </div>

        {/* Rooms Listing Grid */}
        {filteredAndSortedRooms.length > 0 ? (
          <div className="room-grid">
            {filteredAndSortedRooms.map((room) => (
              <div className="room-card" key={room.id}>
                <div
                  className="room-image-wrap"
                  onClick={() => setSelectedRoom(room)}
                >
                  <img src={room.image} alt={room.name} />
                  <div className="room-badge">{room.tag}</div>
                  <div className="room-rating-badge">
                    <FaStar /> {room.rating} ({room.reviewsCount})
                  </div>
                </div>

                <div className="room-info">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="room-category">{room.category} Suite</span>
                    {room.availableRooms <= 3 && (
                      <span style={{ color: "#e11d48", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaFire /> Only {room.availableRooms} left!
                      </span>
                    )}
                  </div>

                  <h3>{room.name}</h3>
                  <p className="room-description">{room.description}</p>

                  <div className="room-specs">
                    <div className="room-spec-item">
                      <FaBed /> {room.bed}
                    </div>
                    <div className="room-spec-item">
                      <FaUsers /> {room.capacity}
                    </div>
                    <div className="room-spec-item">
                      <FaVectorSquare /> {room.size}
                    </div>
                  </div>

                  <div className="room-footer">
                    <div className="room-pricing">
                      {room.originalPrice && (
                        <span className="room-original-price">
                          ₹{room.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <div className="room-price">
                        ₹{room.price.toLocaleString()}{" "}
                        <span>/ night</span>
                      </div>
                    </div>

                    <div className="room-card-actions">
                      <button
                        className="btn-details"
                        onClick={() => setSelectedRoom(room)}
                        title="View Full Details"
                      >
                        <FaEye /> View
                      </button>
                      <button
                        className="btn-book-now"
                        onClick={() => handleBookingClick(room)}
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <h3 style={{ fontSize: "1.5rem", color: "#334155" }}>No suites match your criteria</h3>
            <p style={{ color: "#64748b" }}>Try adjusting your search query or selecting a different category.</p>
            <button
              className="hero-btn"
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div
          className="room-modal-overlay"
          onClick={() => setSelectedRoom(null)}
        >
          <div className="room-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setSelectedRoom(null)}
            >
              <FaTimes />
            </button>

            <img
              src={selectedRoom.image}
              alt={selectedRoom.name}
              className="modal-hero-img"
            />

            <div className="modal-body">
              <span className="room-category">{selectedRoom.category} Collection</span>
              <h2 style={{ fontFamily: "var(--font-serif)", margin: "4px 0 12px 0" }}>
                {selectedRoom.name}
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}
              >
                <span><strong>Bed:</strong> {selectedRoom.bed}</span>
                <span><strong>Size:</strong> {selectedRoom.size}</span>
                <span><strong>View:</strong> {selectedRoom.view}</span>
                <span><strong>Occupancy:</strong> {selectedRoom.capacity}</span>
              </div>

              <p style={{ color: "#475569", lineHeight: "1.65", marginBottom: "20px" }}>
                {selectedRoom.description}
              </p>

              <h4 style={{ margin: "0 0 10px 0" }}>Included Luxury Inclusions</h4>
              <div className="amenities-tag-list">
                {selectedRoom.amenities.map((item, idx) => (
                  <span className="amenity-tag" key={idx}>
                    <FaCheckCircle style={{ color: "var(--primary-gold)", marginRight: "6px" }} />
                    {item}
                  </span>
                ))}
              </div>

              <div
                className="room-footer"
                style={{
                  marginTop: "24px",
                  paddingTop: "20px",
                  borderTop: "1px solid var(--border-color)",
                }}
              >
                <div className="room-pricing">
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Total Tariff</span>
                  <div className="room-price">
                    ₹{selectedRoom.price.toLocaleString()} <span>/ night (all taxes included)</span>
                  </div>
                </div>

                <button
                  className="btn-book-now"
                  style={{ padding: "14px 32px", fontSize: "1rem" }}
                  onClick={() => handleBookingClick(selectedRoom)}
                >
                  Reserve This Suite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}