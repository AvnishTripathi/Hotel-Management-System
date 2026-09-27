import { useState } from "react";
import { FaTimes, FaExpand } from "react-icons/fa";
import { galleryData } from "../data/hotelData";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxImg, setLightboxImg] = useState(null);

  const categories = ["All", "Pool", "Dining", "Spa", "Rooms", "Suites", "Exterior"];

  const filtered =
    activeCategory === "All"
      ? galleryData
      : galleryData.filter((item) => item.category === activeCategory);

  return (
    <section className="section-light">
      <div className="section-header">
        <span className="section-subtitle">Visual Experience</span>
        <h2 className="section-title">A Glimpse Into Royal Opulence</h2>
        <p className="section-desc">
          Explore the captivating architecture, serene poolside settings, gourmet kitchens, and private suites of Royal Grand.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "40px" }}>
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

      <div className="gallery-grid">
        {filtered.map((item) => (
          <div
            className="gallery-item"
            key={item.id}
            onClick={() => setLightboxImg(item)}
          >
            <img src={item.image} alt={item.title} />
            <div className="gallery-overlay">
              <span>{item.category}</span>
              <h4>{item.title}</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#fce79a" }}>
                <FaExpand /> Click to view
              </div>
            </div>
          </div>
        ))}
      </div>

      {lightboxImg && (
        <div
          className="room-modal-overlay"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="room-modal"
            style={{ maxWidth: "850px", background: "transparent", border: "none", boxShadow: "none" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setLightboxImg(null)}
            >
              <FaTimes />
            </button>
            <img
              src={lightboxImg.image}
              alt={lightboxImg.title}
              style={{ width: "100%", borderRadius: "16px", maxHeight: "80vh", objectFit: "contain" }}
            />
            <div style={{ textAlign: "center", color: "white", marginTop: "16px" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", margin: "0 0 4px 0", fontSize: "1.4rem" }}>
                {lightboxImg.title}
              </h3>
              <p style={{ color: "var(--primary-gold)", margin: 0, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px" }}>
                {lightboxImg.category} Collection
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}