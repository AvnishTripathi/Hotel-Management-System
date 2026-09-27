# 🚀 Royal Grand Hotel & Suites - Production Deployment Guide

This guide details how to deploy the **Hotel Management & Booking Platform** for real-world production.

---

## 🏗️ Architecture Overview

- **Frontend**: React 19 + Vite + React Router 7 + Modern Luxury CSS + Axios
- **Backend API**: Python 3.12 + Flask + Flask-CORS + PyJWT + Bcrypt
- **Database**: MySQL 8.0+

---

## 📦 Deployment Options

### Option 1: Frontend on Vercel / Netlify (Recommended for Frontend)

1. **Deploying to Vercel**:
   - Install Vercel CLI: `npm install -g vercel`
   - Navigate to `hotel-management-frontend`:
     ```bash
     cd hotel-management-frontend
     vercel
     ```
   - Set Environment Variable in Vercel Project Settings:
     - `VITE_API_BASE_URL`: `https://your-backend-api.onrender.com` (your deployed Flask backend URL)

2. **Deploying to Netlify**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Add single page app redirect rule in `public/_redirects`:
     ```text
     /*    /index.html   200
     ```

---

### Option 2: Backend on Render / Railway / PythonAnywhere

1. **Deploying to Render (Web Service)**:
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT`
   - Add Environment Variables:
     - `DB_HOST`: Your MySQL host (e.g., Aiven, PlanetScale, or AWS RDS)
     - `DB_USER`: Your MySQL username
     - `DB_PASSWORD`: Your MySQL password
     - `DB_NAME`: `hotel_management1`
     - `JWT_SECRET`: `your-super-secure-production-secret-key`

---

## 💳 Real-World Payment Gateway Activation

### UPI & Direct Bank Transfers:
- Active by default with dynamic NPCI QR codes (`upi://pay?pa=...`) and direct intent links for Google Pay, PhonePe, Paytm, and CRED.

### Razorpay Live Card & NetBanking Gateway:
1. Obtain your Live Key ID & Secret from [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Add to frontend `.env`:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_live_your_actual_key
   ```

---

## 📑 Official GST Invoicing & Compliance

- **SAC / HSN Code**: `996311` (Hotel Accommodation Services)
- **GST Rate**: 12% Hospitality Slab (Itemized as 6% CGST + 6% SGST)
- **Invoice Numbering**: Automatic sequence `INV-RG-YYYY-XXXXX`
- **Printable Vouchers**: Optimized with `@media print` CSS for one-click PDF invoices and check-in desk QR verification.
