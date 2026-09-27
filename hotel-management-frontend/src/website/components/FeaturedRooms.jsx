import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBed, FaUsers, FaVectorSquare, FaStar, FaTimes, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { roomsData } from "../data/hotelData";

export default function FeaturedRooms() {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Take top 3 featured rooms for homepage
  const featured = roomsData.slice(0, 3);

  const handleBookingClick = (room) => {
    const token = localStorage.getItem("guest_token");
    if (!token) {
      navigate("/guest-login", { state: { room } });
    } else {
      navigate("/booking", { state: { room } });
    }
  };

  return (
    <section className="section-light">
      <div className="section-header">
        <span className="section-subtitle">Handpicked Accommodations</span>
        <h2 className="section-title">Featured Suites & Sanctuaries</h2>
        <p className="section-desc">
          Every suite is meticulously curated with custom furnishings, Italian marble finishes, and panoramic views designed for absolute relaxation.
        </p>
      </div>

      <div className="room-grid">
        {featured.map((room) => (
          <div className="room-card" key={room.id}>
            <div
              className="room-image-wrap"
              onClick={() => setSelectedRoom(room)}
            >
              <img src={room.image} alt={room.name} />
              <div className="room-badge">{room.tag}</div>
              <div className="room-rating-badge">
                <FaStar /> {room.rating}
              </div>
            </div>

            <div className="room-info">
              <span className="room-category">{room.category} Collection</span>
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
                    ₹{room.price.toLocaleString()} <span>/ night</span>
                  </div>
                </div>

                <div className="room-card-actions">
                  <button
                    className="btn-details"
                    onClick={() => setSelectedRoom(room)}
                  >
                    Details
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

      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <button
          className="hero-btn"
          style={{ background: "#0b111e", color: "var(--primary-gold)", border: "1px solid var(--primary-gold)" }}
          onClick={() => navigate("/hotel-rooms")}
        >
          View All {roomsData.length} Suites <FaArrowRight />
        </button>
      </div>

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

              <div style={{ display: "flex", gap: "20px", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "16px" }}>
                <span><strong>Bed:</strong> {selectedRoom.bed}</span>
                <span><strong>Size:</strong> {selectedRoom.size}</span>
                <span><strong>View:</strong> {selectedRoom.view}</span>
              </div>

              <p style={{ color: "#475569", lineHeight: "1.65", marginBottom: "20px" }}>
                {selectedRoom.description}
              </p>

              <h4 style={{ margin: "0 0 10px 0" }}>Complimentary Luxury Amenities</h4>
              <div className="amenities-tag-list">
                {selectedRoom.amenities.map((item, idx) => (
                  <span className="amenity-tag" key={idx}>
                    <FaCheckCircle style={{ color: "var(--primary-gold)", marginRight: "6px" }} />
                    {item}
                  </span>
                ))}
              </div>

              <div className="room-footer" style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
                <div className="room-pricing">
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Total Tariff</span>
                  <div className="room-price">
                    ₹{selectedRoom.price.toLocaleString()} <span>/ night (tax incl.)</span>
                  </div>
                </div>

                <button
                  className="btn-book-now"
                  style={{ padding: "14px 32px", fontSize: "1rem" }}
                  onClick={() => handleBookingClick(selectedRoom)}
                >
                  Proceed to Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}