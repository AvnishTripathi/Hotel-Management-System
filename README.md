# 🏨 Royal Grand Hotel & Suites - Full-Stack Luxury Hotel Management System

[![React](https://img.shields.io/badge/React-19.2.6-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0.16-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.3-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, full-stack **Hotel Management & Online Booking System** featuring a 5-star luxury guest booking portal, multi-method payment gateway (Card, UPI, NetBanking, Pay at Hotel), official GST tax invoice generation, and a comprehensive staff operations management dashboard.

---

## 🌟 Key Features

### 👑 Guest Experience & Public Website
- **Luxury Aesthetic**: Deep obsidian and gold theme with responsive glassmorphism navigation.
- **Real-Time Booking & Availability Widget**: Live search widget filtering by check-in/out dates, guest count, and suite categories.
- **Interactive Suite Showcase**: High-resolution gallery, room specifications, view types, occupancy counters, and modal previews.
- **Seasonal Offers & Promo Codes**: Dynamic discount calculation (e.g. `ROYAL20`, `ROMANCE25`).
- **Add-On Curated Services**: Airport transfers, Ayurvedic spa therapies, candlelight dining, and late check-outs.
- **Multi-Method Real-Time Payment Gateway**:
  - 💳 **Credit / Debit Cards**: Automatic card brand detection (Visa, Mastercard, RuPay, Amex) & live 3D card preview.
  - 📱 **UPI Instant Settlement**: Dynamic NPCI QR Code + 1-Tap mobile app launchers (GPay, PhonePe, Paytm, CRED).
  - 🏦 **Net Banking**: Top national/private banks directory + 2FA OTP simulation modal.
  - 🛎️ **Pay at Hotel**: Guaranteed reservation hold with front-desk settlement.
- **Official GST Tax Invoice & Voucher**: SAC Code `996311`, itemized CGST/SGST, check-in QR pass, printable PDF invoice, and Google Calendar export.
- **Self-Service Guest Portal ("My Bookings")**: Reservation history, voucher reprint, and cancellation management.

### 🏢 Staff & Administration Portal
- **Dashboard & Analytics**: Occupancy rates, total revenue, bookings overview, and active stays.
- **Suite & Room Inventory**: Manage room statuses, pricing, categories, and maintenance.
- **Reservation & Check-In / Check-Out**: Guest stay tracking, check-in automation, and billing.
- **Housekeeping & Cleaning Tasks**: Room readiness management.
- **Role-Based Access Control**: Super Admin, Front Desk, Housekeeping, and Manager roles secured via JWT & Bcrypt.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router 7, Material UI / React Icons, Axios, Modern CSS3 |
| **Backend** | Python 3.12, Flask, Flask-CORS, Flask-Bcrypt, PyJWT, Python-Dotenv |
| **Database** | MySQL 8.0+ / MariaDB |
| **Payment & Invoicing** | Dynamic UPI QR Engine, Card Brand Detectors, PDF Print Engine |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **MySQL Server** (Optional for live DB persistence)

### 2. Backend Setup
```bash
cd "Hotel Management System New"

# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\activate      # Windows
source .venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run the Flask backend
python app.py
```
> The API will be available at `http://127.0.0.1:5000`

### 3. Frontend Setup
```bash
cd "hotel-management-frontend"

# Install NPM packages
npm install

# Start development server
npm run dev
```
> The web application will launch at `http://localhost:5173`

---

## 📁 Project Structure

```
├── app.py                          # Flask entry point & blueprint router
├── requirements.txt                # Python backend dependencies
├── .env.example                    # Environment variable template
├── DEPLOYMENT.md                   # Production deployment guide
├── hotel_management_api/           # Modular REST API endpoints
│   ├── view.py                     # Route registrations
│   ├── login_api.py / register_api.py
│   └── dashboard/                  # Management subsystem endpoints
└── hotel-management-frontend/      # React client application
    ├── src/
    │   ├── api/                    # Axios client with interceptors
    │   ├── website/                # Public 5-star hotel portal
    │   │   ├── components/         # Navbar, Hero, Rooms, Amenities, Footer...
    │   │   ├── pages/              # Home, Rooms, Booking, Payment, Invoices...
    │   │   └── data/               # Centralized suites & amenities data
    │   ├── pages/                  # Admin & Staff management views
    │   └── routes/                 # AppRoutes.jsx
    ├── package.json
    └── vite.config.js
```

---

## 📄 License
This project is licensed under the MIT License.
