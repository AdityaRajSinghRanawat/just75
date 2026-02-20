# Smart Attendance

Smart Attendance is a React + Vite frontend with a small Express + MongoDB API for semester and holiday planning.

## Goals
- Fast perceived performance
- Clean and readable structure
- Low infra complexity

## What is optimized
- Route-level code splitting in frontend (`React.lazy` + `Suspense`)
- Shared admin auth helper (`src/lib/auth.js`) to remove duplicated logic
- Short-lived in-memory API cache for GET calls in `src/lib/api.js`
- Targeted holiday fetching by `semesterId` to avoid over-fetching
- Lean MongoDB reads and indexes for high-traffic API paths
- Optional single-service production mode: backend serves `dist/` if present

## Local development
1. Install dependencies at repo root:
```bash
npm install
```
2. Set env files:
- `backend/.env`: set `MONGODB_URI`, optional `MONGODB_DB_NAME`, `PORT`
- `.env.local`: set `VITE_API_BASE_URL` and Clerk vars if used
3. Start app:
```bash
npm run dev:all
```

## Production (single service)
1. Build frontend:
```bash
npm run build
```
2. Start backend:
```bash
npm start
```

When `NODE_ENV=production` and `dist/` exists, Express serves frontend and API from one process.
