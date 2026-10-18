# KaamSetu - Production Deployment & Docker Operations Guide

This document outlines the standard operating procedures for deploying KaamSetu in staging and production environments using Docker, Docker Compose, and Nginx.

---

## 1. Prerequisites
- Docker Engine `>= 24.0`
- Docker Compose v2 (`docker compose`)
- Domain Name & DNS A-Records pointing to server IP
- Node.js 20+ (for local bare-metal builds)

---

## 2. Environment Configuration
Create a production `.env` in the root directory:
```bash
cp .env.example .env
```
Key variables:
```ini
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://mongo:27017/worker_finder_db
JWT_SECRET=your_super_strong_production_jwt_secret_key_32_chars
ADMIN_PIN=your_custom_admin_pin_here
VITE_API_BASE_URL=/api
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://yourdomain.com/admin
COOKIE_DOMAIN=yourdomain.com
```

---

## 3. Production Deployment with Docker Compose & Nginx

The production setup uses `docker-compose.prod.yml`, which orchestrates:
1. `mongo`: MongoDB 7 database with healthcheck and volume persistence.
2. `backend`: Node.js Express API running as non-root user.
3. `frontend`: React SPA built into static assets.
4. `admin-dashboard`: Admin React SPA built into static assets.
5. `nginx-proxy`: Unified reverse proxy listening on port 80/443.

### Start the production stack:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### View container status:
```bash
docker compose -f docker-compose.prod.yml ps
```

### Seed initial dataset (if starting fresh):
```bash
docker compose -f docker-compose.prod.yml exec backend node seed.js
```

### Monitor real-time logs:
```bash
docker compose -f docker-compose.prod.yml logs -f --tail=100
```

---

## 4. Single-Domain Nginx Routing Table

| Request Path | Destination Service | Strategy |
|---|---|---|
| `GET /` | `frontend` | SPA routing with fallback to `index.html` |
| `GET /admin` | `admin-dashboard` | Admin SPA routing |
| `ALL /api/*` | `backend:5000` | Reverse proxy with connection keep-alive |
| Static Assets | Edge / Nginx Cache | 30-day cache with immutable cache-control |

---

## 5. Security Checklist
- [x] Non-root user in all Dockerfiles.
- [x] HTTP-only secure cookie session storage.
- [x] Rate limiting enabled on authentication endpoints (15 req / 15 min).
- [x] NoSQL query injection sanitization active.
- [x] Helmet security headers with CSP active.
- [x] Gzip compression active.
