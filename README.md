# KaamSetu (कामसेतु) - On-Demand Skilled Worker & Trade Marketplace

India's dedicated mobile-first platform connecting home and business owners with verified tradesmen (**Plumbers, Welders, Electricians, Carpenters, Painters, Masons, and more**) with zero commission and direct phone/WhatsApp contact.

---

## 🌟 Key Features

1. **Mobile-First 1-Thumb Navigation**:
   - Built specifically for smartphones since blue-collar workers and clients rely primarily on mobile devices.
   - Fixed **Mobile Bottom Navigation Bar** (🏠 Home, 👷 Workers, ➕ Join as Worker, 📋 My Bookings, 📞 Direct Help).
   - Big, tap-friendly 48px touch targets for direct Calling, WhatsApp chatting, and Instant Booking.

2. **Smart & Simple for Every User (सरल व आसान)**:
   - High-contrast visual trade icons (Wrench, Flame, Bulb, Hammer, Paintbrush, Brick).
   - Clear bilingual labels in Hindi and English (उदा. *कॉल करें*, *व्हाट्सएप*, *तुरंत इमरजेंसी*, *खाली हैं*).
   - Even users with limited reading ability can recognize trade symbols and connect in 1 tap.

3. **Worker Profile Photo & Camera Upload**:
   - Real photo uploads from mobile camera or gallery using native image reader (up to 5MB, base64 stored).
   - Preset trade avatars for instant 1-click photo selection.
   - Clean, verified badge and online green indicator on all worker cards.

4. **Ahmedabad & Multi-City Support**:
   - **Ahmedabad (अहमदाबाद - SG Highway, Maninagar, Satellite)** added as a primary city.
   - Pre-seeded with certified local Plumbers and Welders.
   - Delhi NCR, Noida, Gurugram, Mumbai, and Bengaluru also supported.

5. **🔐 Super Admin Control Dashboard (एडमिन कंट्रोल पैनल)**:
   - Secure PIN Protection (Default PIN: `admin123` or support phone `8825135461`).
   - **Platform Analytics**: Total workers, active bookings, revenue generated (0% commission), category & city distribution.
   - **Worker Management**: 1-click Verify/Unverify badge toggle, Online/Offline availability toggle, worker profile deletion.
   - **Booking Management**: View all customer bookings, change status (`Pending`, `Accepted`, `In Progress`, `Completed`, `Cancelled`), direct customer calling, and delete spam bookings.
   - Accessible via Header `🔐 एडमिन` button, Mobile header icon, or Footer link.

6. **Security, Protection & SEO**:
   - **Helmet Security Headers**: Active on both API server and frontend meta tags.
   - **API Rate Limiter**: Protects against automated abuse, scraping, and brute force requests.
   - **Payload Sanitization & Protection**: Safe CORS and controlled JSON limits.
   - **React Helmet SEO**: Dynamic meta tags, OpenGraph preview, Twitter card, canonical tags.

7. **Direct Support & Credits**:
   - **Direct Support Phone**: [+91 8825135461](tel:+918825135461)
   - **Direct Support Email**: [ansariniyazuddin87@gmail.com](mailto:ansariniyazuddin87@gmail.com)
   - **Developed by**: [Niyazuddin Ansari](https://nansari06.vercel.app)

---

## 🚀 How to Run Locally

### 1. Backend Server
```bash
cd backend
npm install
npm run dev   # Starts server on http://localhost:5000
```
*To reseed demo workers anytime:*
```bash
npm run seed
```

### 2. Frontend Web App
```bash
cd frontend
npm install
npm run dev   # Starts Vite dev server on http://localhost:5173
```

Open your browser and visit: **[http://localhost:5173](http://localhost:5173)**
Admin PIN: `admin123`
