import {
  FaSwimmingPool,
  FaUtensils,
  FaSpa,
  FaWifi,
  FaConciergeBell,
  FaDumbbell,
  FaCocktail,
  FaCar,
  FaShieldAlt,
  FaAward,
  FaRegClock,
  FaPercent,
} from "react-icons/fa";
import { amenitiesData } from "../data/hotelData";

export default function Amenities() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "FaSwimmingPool":
        return <FaSwimmingPool />;
      case "FaUtensils":
        return <FaUtensils />;
      case "FaSpa":
        return <FaSpa />;
      case "FaWifi":
        return <FaWifi />;
      case "FaConciergeBell":
        return <FaConciergeBell />;
      case "FaDumbbell":
        return <FaDumbbell />;
      case "FaCocktail":
        return <FaCocktail />;
      case "FaCar":
        return <FaCar />;
      default:
        return <FaSpa />;
    }
  };

  return (
    <>
      {/* Amenities Grid */}
      <section className="section-dark">
        <div className="section-header">
          <span className="section-subtitle">World-Class Facilities</span>
          <h2 className="section-title">Exclusive Hotel Amenities</h2>
          <p className="section-desc">
            Indulge in a curated collection of ultra-luxury comforts, tailored wellness therapies, and Michelin-standard gastronomy.
          </p>
        </div>

        <div className="amenities-grid">
          {amenitiesData.map((item, index) => (
            <div className="amenity-card" key={index}>
              <div className="amenity-icon-wrap">{getIcon(item.icon)}</div>
              <span className="amenity-category">{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="section-light" style={{ padding: "60px 5%" }}>
        <div className="pillars-grid">
          <div className="pillar-item">
            <div className="pillar-icon">
              <FaPercent />
            </div>
            <div>
              <h4>Best Rate Guarantee</h4>
              <p>Direct bookings receive lowest guaranteed tariff and complimentary room upgrade.</p>
            </div>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">
              <FaRegClock />
            </div>
            <div>
              <h4>Flexible Cancellation</h4>
              <p>Free cancellation up to 48 hours prior to check-in with 100% instant refund.</p>
            </div>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">
              <FaAward />
            </div>
            <div>
              <h4>Five-Star Accolades</h4>
              <p>Voted India&apos;s leading luxury heritage resort for three consecutive years.</p>
            </div>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">
              <FaShieldAlt />
            </div>
            <div>
              <h4>24/7 Royal Security</h4>
              <p>State-of-the-art surveillance and private round-the-clock concierge services.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}