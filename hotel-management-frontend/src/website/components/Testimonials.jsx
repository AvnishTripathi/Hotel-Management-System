import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { testimonialsData } from "../data/hotelData";

export default function Testimonials() {
  return (
    <section className="section-light">
      <div className="section-header">
        <span className="section-subtitle">Guest Stories</span>
        <h2 className="section-title">Enduring Memories of Royalty</h2>
        <p className="section-desc">
          Hear from our esteemed guests, luxury connoisseurs, and dignitaries about their unforgettable stays.
        </p>
      </div>

      <div className="testimonials-grid">
        {testimonialsData.map((item) => (
          <div className="testimonial-card" key={item.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="testimonial-stars">
                {[...Array(item.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <FaQuoteLeft style={{ color: "var(--primary-gold)", opacity: 0.35, fontSize: "1.4rem" }} />
            </div>

            <p className="testimonial-text">&ldquo;{item.comment}&rdquo;</p>

            <div className="testimonial-user">
              <img
                src={item.avatar}
                alt={item.name}
                className="testimonial-avatar"
              />
              <div className="testimonial-info">
                <h4>{item.name}</h4>
                <p>{item.role}</p>
                <div className="testimonial-room-tag">Stayed in: {item.room}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
