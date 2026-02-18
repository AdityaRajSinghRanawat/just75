# Smart Attendance

Smart Attendance is a lightweight attendance planning app with a small Express + MongoDB backend and a React + Vite frontend. It focuses on semester and holiday management and student attendance projection.

Core goals
- Minimal, readable code for beginners
- Small backend CRUD for semesters & holidays
- Frontend admin UI gated by Clerk (frontend)
- Pure utility functions for attendance calculations

Features
- Admin: create/update/delete semesters and holidays
- Student: select semester, view official holidays, add adjustments, compute attendance projection
- Small, explicit Mongoose models for clarity

Quick start (local)
1. Copy env templates:
	- Backend: copy `.env.example` → `backend/.env` and set `MONGODB_URI` and `PORT`.
	- Frontend: copy `.env.example` → `.env.local` and set `VITE_API_BASE_URL` (e.g. `http://localhost:4000`) and Clerk keys if used.
2. Install dependencies:
```bash
# from repo root
npm install
cd backend && npm install
```
3. Start dev servers:
```bash
# start frontend (vite)
npm run dev

# in another shell: start backend
cd backend && npm run dev
```

API endpoints (important)
- `GET /api/semesters` — list semesters
- `POST /api/semesters` — create semester
- `PUT /api/semesters/:id` — update semester
- `DELETE /api/semesters/:id` — delete semester
- `GET /api/holidays?semesterId=` — list holidays
- `POST /api/holidays` — create holiday
- `PUT /api/holidays/:id` — update holiday
- `DELETE /api/holidays/:id` — delete holiday

Project layout
- `backend/src/index.js` — Express server with routes
- `backend/src/db.js` — Mongoose connection
- `backend/src/models` — `Semester` and `Holiday`
- `src/pages/AdminDashboard.jsx` — Admin UI
- `src/pages/StudentPage.jsx` — Student UI
- `src/components/Modal.jsx` — modal forms
- `src/lib/api.js` — client API wrapper
- `src/utils/calculations.js` — pure calculation helpers

Cleanup performed
- Removed deprecated placeholder controllers, routes, and a seed script that were duplicated or unused.
- Removed deprecated frontend pages that duplicated `AdminDashboard`.

Security note
- Admin UI is gated on the frontend with Clerk but the server currently lacks server-side admin verification. Add server-side checks before using in production.

Next steps I can help with
- Add server-side admin protection (Clerk middleware)
- Split large components (e.g. `Modal.jsx`) into smaller files for readability
- Add a safe, idempotent seed script to populate sample data

If you want me to proceed with any of the above, tell me which task to prioritize.
