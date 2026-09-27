import { useNavigate } from "react-router-dom";
import { FaTag, FaArrowRight } from "react-icons/fa";
import { specialOffersData } from "../data/hotelData";

export default function SpecialOffers() {
  const navigate = useNavigate();

  const handleApplyOffer = (offer) => {
    navigate("/hotel-rooms", {
      state: { promoCode: offer.code },
    });
  };

  return (
    <section className="section-dark">
      <div className="section-header">
        <span className="section-subtitle">Exclusive Privileges</span>
        <h2 className="section-title">Seasonal Offers & Packages</h2>
        <p className="section-desc">
          Take advantage of our limited-time luxury packages, romantic getaways, and early bird benefits.
        </p>
      </div>

      <div className="offers-grid">
        {specialOffersData.map((offer) => (
          <div className="offer-card" key={offer.id}>
            <span className="offer-badge">{offer.badge}</span>
            <div className="offer-discount">{offer.discount}</div>
            <h3>{offer.title}</h3>
            <p>{offer.desc}</p>

            <div className="offer-footer">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaTag style={{ color: "var(--primary-gold)" }} />
                <span className="promo-code-pill">{offer.code}</span>
              </div>

              <button
                className="btn-book-now"
                style={{ padding: "8px 16px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}
                onClick={() => handleApplyOffer(offer)}
              >
                Claim <FaArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
