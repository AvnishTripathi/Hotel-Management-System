import WebsiteNavbar from "../components/WebsiteNavbar";
import Hero from "../components/Hero";
import FeaturedRooms from "../components/FeaturedRooms";
import Amenities from "../components/Amenities";
import SpecialOffers from "../components/SpecialOffers";
import Gallery from "../components/Gallery";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <WebsiteNavbar />
      <Hero />
      <FeaturedRooms />
      <Amenities />
      <SpecialOffers />
      <Gallery />
      <Testimonials />
      <Footer />
    </>
  );
}