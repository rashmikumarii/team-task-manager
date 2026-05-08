# Team Task Manager — Frontend

Modern, responsive React + Vite + Tailwind CSS frontend for the Team Task Manager.

## Stack
- React 18 (Vite)
- Tailwind CSS (white + green theme)
- React Router DOM
- Axios (with JWT interceptor)
- Context API for auth state
- react-hot-toast for notifications

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # adjust VITE_API_URL if needed
npm run dev
```

Dev server: http://localhost:5173
Default API base URL: `http://localhost:4000/api`

## Build

```bash
npm run build
npm run preview
```

## Folder structure

```
src/
  components/     Reusable UI (Navbar, Layout, Modal, Spinner, ...)
  pages/          Login, Signup, Dashboard, Projects, Tasks, NotFound
  context/        AuthContext (user + token)
  services/       Axios instance & API endpoints
  App.jsx         Routes
  main.jsx        Entry
```

## Routing

Public: `/login`, `/signup`
Protected: `/` (Dashboard), `/projects`, `/tasks`

Token is stored in `localStorage` under `token` and attached as
`Authorization: Bearer <token>` to every request.

## Deploy on Vercel

1. Set project root to `frontend/`
2. Build command: `npm run build` — Output: `dist`
3. Add env var `VITE_API_URL` pointing to your deployed backend `/api` URL
