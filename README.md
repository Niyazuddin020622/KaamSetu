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

### 3. Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run dev   # Starts Vite dev server on http://localhost:5174
```

---

## 🐳 Docker Deployment (1-Command Full Stack)

KaamSetu is fully Dockerized with production multi-stage builds and Nginx reverse proxies.

### Quick Start with Docker Compose:
```bash
# Build and run all 4 services (Mongo + Backend + Frontend + Admin) in background
docker compose up -d --build

# Seed initial workers & test data into MongoDB container
docker compose exec backend node seed.js

# Check logs
docker compose logs -f

# Stop all containers
docker compose down
```

### Service URLs in Docker:
- 📱 **Frontend App (Customer & Worker)**: [http://localhost:5173](http://localhost:5173)
- 🔐 **Admin Dashboard**: [http://localhost:5174](http://localhost:5174)
- ⚡ **Backend API**: [http://localhost:5000](http://localhost:5000)
- 🗄️ **MongoDB**: `localhost:27017` (Persistent Volume `mongo_data`)
- **Admin PIN**: `admin123`

---

## ⚡ Performance Optimization & Fast Data Loading Architecture

KaamSetu features a multi-tiered performance architecture delivering sub-second response times across both mobile and admin experiences:

### 1. Response Compression (Gzip / Brotli)
- Express `compression` middleware is active on all API endpoints.
- JSON responses (workers directory, categories, ledger) are compressed by **70% to 80%**, drastically reducing network latency over 3G/4G connections.

### 2. In-Memory Micro-Caching (`node-cache`)
- **Zero Latency (1ms - 5ms)**: Server-side memory caching via `backend/utils/cache.js`.
- **Categories Cache**: Cached for 10 minutes with `stale-while-revalidate` HTTP headers.
- **Worker Directory Cache**: Filter combinations and search queries cached for 120 seconds.
- **Admin Stats & Ledgers**: Cached for 60 seconds.
- **Smart Cache Invalidation**: Caches automatically purge (`delCachePrefix`) instantly when a worker registers, updates profile, or when a booking is created/modified.

### 3. Lean Database Projections (`.select(...)`)
- Directory card queries (`/api/workers`) omit heavy fields (`reviews`, `portfolio`, `pin`), transferring only lightweight card data.
- Full reviews and portfolio are only queried when opening a worker's detail modal (`/api/workers/:id`).

### 4. Client-Side SWR Caching
- **Frontend App (`frontend/src/api.js`)**: Categories are fetched once and cached in-memory with a 5-minute TTL. Filter toggling does not trigger repeated network requests.
- **Admin Dashboard (`admin-dashboard/src/api.js`)**: Tab switching between Overview, Workers, Employers, and Bookings renders instantly without spinner delays.

### 5. Client-Side Canvas Image Compression
- `WorkerRegisterModal.jsx` auto-compresses camera and gallery photos to max 320x320 pixels at 82% JPEG quality via HTML5 Canvas before uploading.
- Reduces raw 5MB photo uploads down to ~35KB, preventing database bloat and speeding up card rendering.

---

## 🛡️ Enterprise-Grade Backend & Data Security Architecture

Security is baked into every API layer to protect customer and worker privacy:

### 1. Worker & Customer PIN Leakage Prevention
- Both `Worker.js` and `User.js` models enforce `select: false` on the `pin` field.
- Public directory listings (`/api/workers`) and profile queries (`/api/workers/:id`) will **never** return hashed PINs in response payloads.
- Dedicated authentication routes explicitly request `.select('+pin')` for bcrypt comparison only.

### 2. Super Admin JWT Authentication (`verifyAdmin`)
- `/api/admin/login` issues cryptographically signed JWT tokens with role `admin` and an 8-hour expiry.
- All admin management endpoints (`/api/admin/stats`, `/api/admin/workers-ledger`, `/api/admin/employers`, worker CRUD, booking CRUD) are protected by `verifyToken` and `requireAdmin` middleware.
- `admin-dashboard` automatically injects `Authorization: Bearer <token>` on all requests.

### 3. Customer & Booking Privacy Scoping
- Public access to `GET /api/bookings` is blocked.
- Authenticated requests are strictly scoped by role:
  - **Customers** can only see their own booking requests.
  - **Workers** can only see jobs assigned to them.
  - **Admins** have full ledger visibility.
- Public worker histories mask customer names (`A***`) and omit phone numbers.

### 4. Anti-Brute-Force Rate Limiting
- Dedicated `authLimiter` applied on `/api/auth/customer/login`, `/api/auth/worker/login`, and `/api/admin/login`.
- Restricts attempts to **max 15 requests per 15 minutes** per IP address, preventing 4-digit PIN automated brute force attacks.

### 5. NoSQL Injection & ReDoS Protection
- `express-mongo-sanitize` middleware sanitizes all request bodies, params, and queries, stripping malicious MongoDB operators (`$gt`, `$ne`, etc.).
- Regex search inputs are safely escaped (`escapeRegex`) before query compilation to eliminate Regular Expression Denial of Service (ReDoS) risks.


