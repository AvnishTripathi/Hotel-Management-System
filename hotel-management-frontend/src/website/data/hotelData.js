import room1 from "../../assets/website/room1.jpg";
import room2 from "../../assets/website/room2.jpg";
import pool from "../../assets/website/pool.jpg";
import restaurant from "../../assets/website/restaurant.jpg";
import spa from "../../assets/website/spa.jpg";
import heroImg from "../../assets/website/hero.jpg";

export const hotelInfo = {
  name: "Royal Grand Hotel & Suites",
  tagline: "Unrivaled Luxury & Timeless Elegance",
  description:
    "Nestled in the heart of the royal district, Royal Grand Hotel is a sanctuary of refined elegance, world-class hospitality, and curated luxury experiences. Discover five-star opulence designed for the discerning traveler.",
  phone: "+91 98765 43210",
  altPhone: "+91 11 2345 6789",
  email: "reservations@royalgrandhotel.com",
  conciergeEmail: "concierge@royalgrandhotel.com",
  address: "101 Grand Boulevard, Palace Road, New Delhi, 110001, India",
  checkInTime: "2:00 PM",
  checkOutTime: "12:00 PM",
  rating: 4.9,
  reviewsCount: 1420,
};

export const roomsData = [
  {
    id: 1,
    name: "Deluxe King Suite",
    category: "Deluxe",
    tag: "Most Popular",
    image: room1,
    gallery: [room1, room2, spa],
    price: 8999,
    originalPrice: 10999,
    rating: 4.8,
    reviewsCount: 312,
    size: "520 sq ft",
    capacity: "2 Adults, 1 Child",
    bed: "1 Ultra-Plush King Bed",
    view: "Panoramic City View",
    description:
      "A serene retreat featuring custom mahogany furnishings, floor-to-ceiling windows with panoramic city vistas, an Italian marble en-suite bathroom with deep soaking tub, and state-of-the-art entertainment.",
    amenities: [
      "High-speed Starlink Wi-Fi",
      "Complimentary Gourmet Breakfast",
      "4K Smart TV & Surround Sound",
      "Italian Marble Bathtub & Rain Shower",
      "Nespresso Coffee Machine & Mini Bar",
      "24-Hour In-Room Dining",
      "Luxury Bathrobes & Diptyque Toiletries",
      "Climate Control & Soundproofing",
    ],
    availableRooms: 5,
  },
  {
    id: 2,
    name: "Presidential Royal Suite",
    category: "Presidential",
    tag: "Signature Suite",
    image: room2,
    gallery: [room2, room1, pool],
    price: 14999,
    originalPrice: 18500,
    rating: 5.0,
    reviewsCount: 184,
    size: "1,150 sq ft",
    capacity: "4 Adults, 2 Children",
    bed: "2 Royal King Beds",
    view: "Infinity Pool & Skyline View",
    description:
      "The pinnacle of luxury living. Features a separate grand living lounge, private dining salon, dedicated 24/7 personal butler service, whirlpool jacuzzi, and exclusive access to the VIP Executive Lounge.",
    amenities: [
      "24/7 Dedicated Personal Butler",
      "Private Whirlpool Jacuzzi",
      "VIP Executive Lounge Access",
      "Chauffeured Airport Luxury Transfer",
      "Complimentary Champagne on Arrival",
      "Private Balcony with Skyline Views",
      "Walk-in Dressing Suite",
      "Curated Pillow & Aromatherapy Menu",
    ],
    availableRooms: 2,
  },
  {
    id: 3,
    name: "Executive Oceanfront Villa",
    category: "Villa",
    tag: "Luxury Retreat",
    image: pool,
    gallery: [pool, room1, spa],
    price: 19999,
    originalPrice: 24000,
    rating: 4.9,
    reviewsCount: 96,
    size: "1,450 sq ft",
    capacity: "4 Adults, 2 Children",
    bed: "2 King Beds + Daybed",
    view: "Private Pool & Botanical Gardens",
    description:
      "An exclusive private haven with your own private plunge pool, secluded landscaped sun deck, open-air rainforest shower, and bespoke concierge catering to every requirement.",
    amenities: [
      "Private Heated Plunge Pool",
      "Sunken Garden & Private Sun Deck",
      "Open-Air Rainforest Shower",
      "In-Villa Spa Treatment Session",
      "Daily Sundowner Cocktails & Canapés",
      "High-speed Wi-Fi & Smart Controls",
      "Bespoke Chef-Crafted Dining",
      "Luxury Golf Cart Service",
    ],
    availableRooms: 3,
  },
  {
    id: 4,
    name: "Heritage Luxury Suite",
    category: "Heritage",
    tag: "Cultural Classic",
    image: restaurant,
    gallery: [restaurant, room2, spa],
    price: 11499,
    originalPrice: 13999,
    rating: 4.9,
    reviewsCount: 220,
    size: "680 sq ft",
    capacity: "2 Adults, 1 Child",
    bed: "1 Hand-Carved Royal Bed",
    view: "Historic Courtyard View",
    description:
      "Infused with royal Indian craftsmanship, antique brass decor, hand-woven silk tapestries, and contemporary modern comfort. Overlooks the tranquil palace courtyard.",
    amenities: [
      "Handcrafted Royal Furnishings",
      "Complimentary Palace Heritage Tour",
      "Traditional High-Tea Experience",
      "Deep Soaking Clawfoot Bathtub",
      "High-speed Starlink Wi-Fi",
      "Artisan Welcome Sweets & Drinks",
      "24/7 Concierge Support",
      "Plush Velvet Seating Area",
    ],
    availableRooms: 4,
  },
  {
    id: 5,
    name: "Skyline Panorama Penthouse",
    category: "Penthouse",
    tag: "VIP Exclusive",
    image: heroImg,
    gallery: [heroImg, room1, pool],
    price: 26999,
    originalPrice: 32000,
    rating: 5.0,
    reviewsCount: 88,
    size: "2,200 sq ft",
    capacity: "6 Adults",
    bed: "3 King Bedrooms",
    view: "360° Panoramic City Skyline",
    description:
      "Perched on the top floor, this architectural triumph offers 360-degree skyline views, private rooftop terrace, wrap-around floor-to-ceiling glass, full designer kitchen, and private elevator access.",
    amenities: [
      "Private Rooftop Terrace & Observatory",
      "Private Elevator Access",
      "Private Bar & Dedicated Bartender",
      "Full Gourmet Kitchen & Private Chef",
      "Master Spa Bathroom with Sauna",
      "Chauffeured Rolls-Royce City Tour",
      "Unlimited Spa Treatments",
      "24-Hour VIP Security & Butler",
    ],
    availableRooms: 1,
  },
  {
    id: 6,
    name: "Premier Garden Suite",
    category: "Deluxe",
    tag: "Tranquil Garden",
    image: spa,
    gallery: [spa, room2, restaurant],
    price: 7499,
    originalPrice: 9200,
    rating: 4.7,
    reviewsCount: 175,
    size: "480 sq ft",
    capacity: "2 Adults",
    bed: "1 Queen / Twin Beds",
    view: "Lush Tropical Garden",
    description:
      "Immerse yourself in nature with a private ground-floor garden patio, soothing green views, modern minimalist wooden interior, and premium wellness amenities.",
    amenities: [
      "Private Garden Verandah",
      "Aromatherapy Diffuser & Essential Oils",
      "Complimentary Yoga Mat & Morning Classes",
      "Walk-in Rain Shower",
      "Free High-speed Wi-Fi",
      "Gourmet Breakfast Buffet Included",
      "Smart Room Automation",
      "Eco-friendly Organic Toiletries",
    ],
    availableRooms: 6,
  },
];

export const amenitiesData = [
  {
    icon: "FaSwimmingPool",
    title: "Temperature-Controlled Infinity Pool",
    category: "Leisure",
    desc: "Perched above the city with poolside cabanas, chilled cocktails, and panoramic sunset views.",
  },
  {
    icon: "FaUtensils",
    title: "Michelin-Star Dining & Sky Lounge",
    category: "Dining",
    desc: "Three signature restaurants serving contemporary world cuisine, authentic royal recipes, and fine wine pairings.",
  },
  {
    icon: "FaSpa",
    title: "Royal Ayurvedic Spa & Wellness",
    category: "Wellness",
    desc: "Holistic wellness therapies, revitalizing Swedish massages, steam rooms, and detoxifying sauna rituals.",
  },
  {
    icon: "FaWifi",
    title: "Ultra-Fast Starlink Wi-Fi",
    category: "Connectivity",
    desc: "High-speed seamless internet across every corner of the property, perfect for remote executive work.",
  },
  {
    icon: "FaConciergeBell",
    title: "24/7 Dedicated Concierge & Butler",
    category: "Service",
    desc: "Personalized itinerary planning, luxury airport transfers, theater bookings, and private dining arrangements.",
  },
  {
    icon: "FaDumbbell",
    title: "State-of-the-Art Fitness Center",
    category: "Fitness",
    desc: "Equipped with Technogym machines, personal trainers, pilates reformers, and daily morning yoga sessions.",
  },
  {
    icon: "FaCocktail",
    title: "Artisan Cocktail & Cigar Lounge",
    category: "Dining",
    desc: "Handcrafted cocktails by master mixologists, premium single malts, and curated live jazz evenings.",
  },
  {
    icon: "FaCar",
    title: "Valet Parking & EV Charging",
    category: "Convenience",
    desc: "Complimentary secure valet parking with superfast EV charging stations for guests.",
  },
];

export const testimonialsData = [
  {
    id: 1,
    name: "Dr. Alistair Sterling",
    role: "International Traveler & Architect",
    rating: 5,
    date: "February 2026",
    comment:
      "The architectural detailing and impeccable hospitality at Royal Grand are unmatched. From the private check-in to the presidential suite butler service, every detail was perfection.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    room: "Presidential Royal Suite",
  },
  {
    id: 2,
    name: "Priya & Rohan Mehta",
    role: "Honeymoon Couple",
    rating: 5,
    date: "January 2026",
    comment:
      "We spent 5 nights in the Oceanfront Villa for our honeymoon. The private pool, candlelight dinner on the terrace, and bespoke spa treatments made it truly unforgettable!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    room: "Executive Oceanfront Villa",
  },
  {
    id: 3,
    name: "Elena Rostova",
    role: "Global Executive Director",
    rating: 5,
    date: "March 2026",
    comment:
      "As someone who stays in 5-star hotels globally, Royal Grand stands out for its high-speed Starlink connectivity, gourmet dining, and quiet luxury. The staff anticipates your every need.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    room: "Deluxe King Suite",
  },
];

export const galleryData = [
  { id: 1, title: "Grand Infinity Pool", category: "Pool", image: pool },
  { id: 2, title: "Signature Gourmet Dining", category: "Dining", image: restaurant },
  { id: 3, title: "Royal Wellness Spa", category: "Spa", image: spa },
  { id: 4, title: "Deluxe Suite Interior", category: "Rooms", image: room1 },
  { id: 5, title: "Presidential Lounge", category: "Suites", image: room2 },
  { id: 6, title: "Palace Exterior & Gardens", category: "Exterior", image: heroImg },
];

export const specialOffersData = [
  {
    id: 1,
    badge: "Limited Time",
    code: "ROYAL20",
    discount: "20% OFF",
    title: "Royal Grand Winter Getaway",
    desc: "Enjoy 20% off all luxury suites including complimentary champagne on arrival and daily gourmet breakfast.",
    validTill: "Valid till end of month",
  },
  {
    id: 2,
    badge: "Honeymoon Special",
    code: "ROMANCE25",
    discount: "25% OFF",
    title: "Romantic Couples Retreat",
    desc: "Includes candlelit 4-course dinner, couples aromatherapy massage, late checkout, and luxury villa upgrade.",
    validTill: "Minimum 3 nights stay",
  },
  {
    id: 3,
    badge: "Early Bird",
    code: "EARLY15",
    discount: "15% OFF",
    title: "Advance Booking Privilege",
    desc: "Book 14 days in advance and save 15% with free cancellation up to 48 hours prior to check-in.",
    validTill: "All year round",
  },
];

export const faqsData = [
  {
    question: "What are the standard Check-In and Check-Out timings?",
    answer:
      "Our standard check-in time is 2:00 PM and check-out is 12:00 PM noon. Early check-in and express late check-out can be requested and are subject to suite availability.",
  },
  {
    question: "Is airport transportation provided by the hotel?",
    answer:
      "Yes, we provide luxury airport transfers in executive BMW / Mercedes / Rolls-Royce sedans upon request. Transfers are complimentary for Presidential Suite & Penthouse guests.",
  },
  {
    question: "What is the cancellation policy for reservations?",
    answer:
      "We offer free cancellation up to 48 hours prior to your scheduled check-in date. Cancellations made within 48 hours are subject to a one-night room charge.",
  },
  {
    question: "Are breakfast and Wi-Fi included in the room tariff?",
    answer:
      "Yes, all bookings made directly on our website include complimentary ultra-fast Starlink Wi-Fi and our signature lavish breakfast buffet at The Grand Pavilion restaurant.",
  },
  {
    question: "Are pets allowed at the property?",
    answer:
      "We offer pet-friendly accommodation in designated Garden and Villa suites, complete with custom pet beds, gourmet pet menus, and walking services.",
  },
];

export const hotelStats = [
  { number: "25+", label: "Years of Luxury Excellence" },
  { number: "150+", label: "Elegantly Crafted Suites" },
  { number: "99.4%", label: "Guest Satisfaction Rate" },
  { number: "38+", label: "Global Hospitality Awards" },
];
