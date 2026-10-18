# KaamSetu - Enterprise REST API Documentation

Base URL: `/api` (Production: `https://kaamsetu.in/api` or configured domain)

## Authentication Model
The API supports dual authentication modes:
1. **HTTP-only Cookie**: Set automatically via `Set-Cookie: kaamsetu_session=...; HttpOnly; SameSite=Lax; Path=/`
2. **Bearer Token**: `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Auth Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/customer/register` | Register new customer (Phone, 4-digit PIN, Address) | No |
| `POST` | `/api/auth/customer/login` | Authenticate customer with PIN & issue session cookie | No |
| `GET` | `/api/auth/customer/me` | Fetch active customer profile | Customer (Cookie/Token) |
| `PUT` | `/api/auth/customer/profile` | Update customer address and profile details | Customer (Cookie/Token) |
| `POST` | `/api/auth/worker/login` | Authenticate worker with PIN & issue session cookie | No |
| `POST` | `/api/auth/worker/set-pin` | Set or reset 4-digit PIN for worker profile | No |
| `GET` | `/api/auth/worker/me` | Fetch current worker profile | Worker (Cookie/Token) |
| `PATCH`| `/api/auth/worker/availability` | Toggle worker online/busy status | Worker (Cookie/Token) |
| `POST` | `/api/auth/logout` | Invalidate and clear all session cookies | Yes |

---

## 2. Worker Endpoints (`/api/workers`)

| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/api/workers` | `category`, `city`, `search`, `availableOnly`, `emergencyOnly`, `minRating`, `maxRate`, `sortBy`, `lat`, `lon` | Paginated and filtered worker directory (Cached, ETag enabled) |
| `GET` | `/api/workers/:id` | None | Fetch single worker detail with review ledger |
| `POST` | `/api/workers` | Worker Payload | Register new trade worker profile |
| `PUT` | `/api/workers/:id` | Worker Payload | Update worker details |
| `POST` | `/api/workers/:id/reviews` | `rating`, `comment`, `customerName`, `customerPhone` | Submit review & recalculate rating |

---

## 3. Booking Endpoints (`/api/bookings`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bookings` | Create new service booking (Validates slot conflict) |
| `GET` | `/api/bookings/my-history` | Fetch customer booking history (Secured) |
| `GET` | `/api/bookings/worker-history` | Fetch worker assigned jobs (Secured) |
| `GET` | `/api/bookings/worker-slots/:workerId` | Check booked/unavailable slots for date |
| `PATCH`| `/api/bookings/:id/status` | Update booking status (`pending`, `accepted`, `in_progress`, `completed`, `cancelled`) |
| `DELETE`| `/api/bookings/:id` | Cancel/delete booking record |

---

## 4. Admin Control Endpoints (`/api/admin`)

| Method | Endpoint | Description | Role Required |
|---|---|---|---|
| `POST` | `/api/admin/login` | Admin authentication with PIN | None |
| `GET` | `/api/admin/stats` | High-level analytics and KPI metrics (Cached 60s) | Admin |
| `GET` | `/api/admin/workers-ledger` | Comprehensive master ledger of all trade workers with earnings | Admin |
| `GET` | `/api/admin/employers` | Full employer hiring ledger with aggregated expenditure | Admin |
| `POST` | `/api/admin/workers` | Create verified worker directly from dashboard | Admin |
| `PUT` | `/api/admin/workers/:id` | Full admin edit on worker record | Admin |
| `DELETE`| `/api/admin/workers/:id` | Soft/Hard delete worker from platform | Admin |
| `PATCH`| `/api/admin/bookings/:id` | Override booking status or assign worker | Admin |
| `DELETE`| `/api/admin/bookings/:id` | Remove booking from ledger | Admin |
