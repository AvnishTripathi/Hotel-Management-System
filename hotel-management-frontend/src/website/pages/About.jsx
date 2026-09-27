import { useNavigate } from "react-router-dom";
import { FaAward, FaCrown, FaLeaf, FaUtensils, FaArrowRight } from "react-icons/fa";
import WebsiteNavbar from "../components/WebsiteNavbar";
import Footer from "../components/Footer";
import { hotelStats } from "../data/hotelData";
import heroImg from "../../assets/website/hero.jpg";
import room2 from "../../assets/website/room2.jpg";

export default function About() {
  const navigate = useNavigate();

  return (
    <>
      <WebsiteNavbar />

      <div className="page-hero">
        <span className="hero-badge">A Legacy of Distinction</span>
        <h1>The Royal Grand Heritage</h1>
        <p>
          Founded on principles of aristocratic hospitality and contemporary elegance, we craft unforgettable memories for the world&apos;s most distinguished guests.
        </p>
      </div>

      {/* Stats Counter Bar */}
      <div className="stats-grid">
        {hotelStats.map((stat, idx) => (
          <div className="stat-card" key={idx}>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Story Section */}
      <section style={{ padding: "0 5% 80px" }}>
        <div className="story-grid">
          <div className="story-content">
            <span className="section-subtitle">Our Heritage & Story</span>
            <h2>Where Timeless Elegance Meets Modern Perfection</h2>
            <p>
              Royal Grand Hotel & Suites was born from a visionary dream: to revive the royal Indian palace hospitality tradition while integrating the world&apos;s most advanced contemporary luxuries.
            </p>
            <p>
              Every corridor, grand archway, and handcrafted chandelier tells a story of artistry. From our custom-designed Italian marble suites to our rooftop Michelin-inspired gastronomy, every aspect of your stay is curated by our dedicated hospitality artisans.
            </p>
            <button
              className="hero-btn"
              onClick={() => navigate("/hotel-rooms")}
            >
              Explore Our Suites <FaArrowRight />
            </button>
          </div>

          <div className="story-image-group">
            <img src={heroImg} alt="Royal Grand Heritage" className="story-main-img" />
            <div className="story-badge-card">
              <h3>5-Star</h3>
              <p>Luxury Hotel of the Year</p>
            </div>
          </div>
        </div>

        {/* Pillars of Hospitality */}
        <div className="section-header" style={{ marginTop: "60px" }}>
          <span className="section-subtitle">Our Guiding Philosophy</span>
          <h2 className="section-title">The Four Pillars of Royal Grand</h2>
          <p className="section-desc">
            We operate with unwavering devotion to comfort, artistry, and environmental sustainability.
          </p>
        </div>

        <div className="amenities-grid" style={{ marginBottom: "80px" }}>
          <div className="amenity-card">
            <div className="amenity-icon-wrap">
              <FaCrown />
            </div>
            <span className="amenity-category">Artisan Craft</span>
            <h3>Palatial Grandeur</h3>
            <p>
              Hand-carved woodwork, gilded ceilings, and curated museum-quality art installations throughout the property.
            </p>
          </div>

          <div className="amenity-card">
            <div className="amenity-icon-wrap">
              <FaUtensils />
            </div>
            <span className="amenity-category">Gastronomy</span>
            <h3>Culinary Excellence</h3>
            <p>
              Master chefs blending centuries-old royal secret recipes with contemporary global gastronomy and organic farm-to-table produce.
            </p>
          </div>

          <div className="amenity-card">
            <div className="amenity-icon-wrap">
              <FaAward />
            </div>
            <span className="amenity-category">Service</span>
            <h3>Bespoke Concierge</h3>
            <p>
              24/7 dedicated personal butlers, private helicopter transfers, custom city art tours, and seamless itinerary creation.
            </p>
          </div>

          <div className="amenity-card">
            <div className="amenity-icon-wrap">
              <FaLeaf />
            </div>
            <span className="amenity-category">Sustainability</span>
            <h3>Eco-Conscious Luxury</h3>
            <p>
              100% solar-assisted energy, zero single-use plastics, water recycling, and organic certified spa treatments.
            </p>
          </div>
        </div>

        {/* Leadership & Hospitality Team */}
        <div
          style={{
            background: "linear-gradient(135deg, #111a2e 0%, #18233c 100%)",
            borderRadius: "20px",
            padding: "50px 40px",
            color: "white",
            textAlign: "center",
            maxWidth: "1000px",
            margin: "0 auto",
            border: "1px solid rgba(212, 175, 55, 0.3)",
          }}
        >
          <span className="section-subtitle">Private Concierge</span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", margin: "10px 0 16px 0" }}>
            Ready to Experience the Royal Grand Difference?
          </h2>
          <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "0 auto 30px auto" }}>
            Our reservation specialists and private concierges are on standby 24 hours a day to tailor your luxury stay.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
            <button
              className="hero-btn"
              onClick={() => navigate("/hotel-rooms")}
            >
              Book Your Suite
            </button>
            <button
              className="hero-secondary-btn"
              onClick={() => navigate("/contact")}
            >
              Contact Concierge Desk
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}