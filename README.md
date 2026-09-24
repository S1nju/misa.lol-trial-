# misa.lol — Mini Profile Editor

Full-stack mini profile editor built with **FastAPI** (Python backend), **Vite + React + TypeScript** (frontend), and **Docker Compose** containerization with Nginx.

---

## Quick Start & Run Commands

### Option A: Running via Docker Compose (Recommended)

**Requirements:** Docker 20.10+ & Docker Compose v2+

```bash
# 1. Clone or extract repository and navigate into folder
cd misa.trial

# 2. Build and start containers in detached mode
docker-compose up --build -d

# 3. Access the application:
# Frontend: http://localhost:5173 (or http://localhost:80)
# Backend API: http://localhost:8000/api/profile
# OpenAPI Interactive Docs: http://localhost:8000/docs
```

To stop containers:
```bash
docker-compose down
```

---

### Option B: Running Locally (Development Mode without Docker)

**Requirements:** Python 3.10+ and Node.js 18+

#### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
Backend API will run at `http://localhost:8000`.

#### 2. Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
Frontend app will run at `http://localhost:5173`.

#### 3. Run Backend Automated API Test Suite
```bash
cd backend
python -m pytest test_api.py
```

---

## Summary & Time Allocation

- **Time Spent:** ~45 minutes total (10 min architecture/setup, 25 min implementation, 10 min testing & dockerization).
- **What Works:**
  - `GET /api/profile` and `PUT /api/profile` API endpoints following contract.
  - Strict server-side validation for types, character lengths, and `https://` URLs.
  - Live profile card preview updating in real-time as user types.
  - Client-side URL validity check toggling clickable link button vs disabled invalid URL badge.
  - Save button with pending spinner, submission locking, and success confirmation banner.
  - Form state preservation on save failure so users can correct entries easily.
  - Data persistence across browser refresh (loads saved state from FastAPI memory store).
  - Floating glassmorphism design with weightlessness hover dynamics and dark theme.
  - Full mobile responsiveness and accessible keyboard navigation.
  - 100% passing automated test suite (`backend/test_api.py`).
- **Unfinished:** None. All specified requirements and backend contract rules are complete.

---

## Validation & Verification Results

### 1. Successful Save & Browser Refresh Check
- **Action:** Updated profile to `displayName: "Nova Star"`, `bio: "Creating music and code."`, `link.label: "Portfolio"`, `link.url: "https://nova.dev"`, and clicked **Save Changes**.
- **Result:** Backend returned `200 OK` with saved object. Success banner displayed. Refreshed browser window (`F5`), and `GET /api/profile` reloaded saved data (`Nova Star`).

### 2. Invalid Request Sent Directly to API
- **Action:** Sent direct `PUT /api/profile` request with invalid scheme `http://example.com` and `displayName` > 40 characters:
  ```bash
  curl -X PUT http://localhost:8000/api/profile \
    -H "Content-Type: application/json" \
    -d '{"displayName": "Very Long Name That Exceeds Forty Characters Limit", "bio": "Bio", "link": {"label": "Site", "url": "http://example.com"}}'
  ```
- **Result:** API responded with `400 Bad Request`:
  ```json
  {
    "error": "Validation failed",
    "details": {
      "displayName": "Display name must be between 1 and 40 characters after trimming.",
      "link.url": "Link URL must start with 'https://'."
    }
  }
  ```
- **State Check:** Performed `GET /api/profile`. The stored profile remained **unchanged** (`Nova`).

---

## Implementation Tradeoffs & Future Production Improvements

### Tradeoff Chosen
- **In-Memory Backend Storage:** Storing the profile in Python module memory (`dict`) simplified server startup and eliminated external DB dependencies for a 75-minute trial scope, while satisfying the requirement to persist data across browser refreshes during server runtime.

### First Improvement for Production
- **Database Persistence & Auth:** Replace in-memory store with PostgreSQL / SQLite using SQLAlchemy async ORM, and add user authentication (JWT / OAuth2) to support multiple profiles and multi-link management securely.

---

## Libraries & Tools Used

- **Backend:** FastAPI, Pydantic, Uvicorn, Pytest, HTTPX.
- **Frontend:** React 18, TypeScript, Vite, Nginx, Lucide React icons, Tailwind CSS / Custom Glassmorphism styles.
- **Orchestration:** Docker & Docker Compose.
- **AI Assistant:** Used for rapid scaffolding and test suite generation.
