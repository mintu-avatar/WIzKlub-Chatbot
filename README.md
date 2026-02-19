# WizKlub Chatbot 🤖

A fully functional, production-ready chatbot prototype for **WizKlub.com** that engages website visitors, qualifies leads, and drives demo bookings for **Parents** and **School Partnerships**.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🧠 Smart flow engine | Rule-based state machine, zero latency |
| 👨‍👩‍👧 Parent flow | Age → Interest → Goal → Lead capture → Demo booking |
| 🏫 School flow | Type → Size → Program → Contact details |
| 📋 Lead capture | Name · Phone · Email · User type + all qualification answers |
| 📊 Leads Dashboard | View, filter & delete leads; CSV export |
| 💅 Professional UI | Framer Motion animations, WizKlub brand colours |
| 📱 Fully responsive | Works on mobile & desktop |
| 🔗 Shareable | Single URL — `/` for chatbot, `/dashboard` for leads |

---

## 🗂 Project Structure

```
PravanChatbot/
├── README.md
├── .gitignore
├── .env.example
├── package.json          ← root monorepo (runs both)
├── backend/
│   ├── package.json
│   ├── server.js         ← Express API server
│   ├── routes/
│   │   └── leads.js      ← CRUD + CSV export
│   └── data/
│       └── leads.json    ← File-based storage (auto-created)
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.jsx               ← Routes: / and /dashboard
        ├── main.jsx
        ├── index.css
        ├── flows/
        │   └── chatFlow.js       ← State machine (all bot logic)
        ├── hooks/
        │   └── useChat.js        ← Chat engine hook
        ├── utils/
        │   └── api.js            ← Backend API calls
        └── components/
            ├── ChatWidget.jsx    ← Floating button + panel
            ├── ChatWindow.jsx    ← Full chat UI
            ├── ChatMessage.jsx   ← Individual message bubble
            ├── TypingIndicator.jsx
            ├── QuickReply.jsx    ← Option pill buttons
            └── LeadsDashboard.jsx
```

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm v9+

### 1 — Install everything

```bash
# From the PravanChatbot root folder
npm run install:all
```

### 2 — Configure environment

```bash
cp .env.example .env     # backend will use PORT=3001 by default
```

### 3 — Run in development

```bash
npm run dev
```

This concurrently starts:

| Service | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Backend (Express) | http://localhost:3001 |
| Leads Dashboard | http://localhost:5173/dashboard |

---

## 🌐 Shareable / Deployment

### Option A — Deploy to [Render](https://render.com)

1. Push this repo to GitHub.
2. Create a **Web Service** on Render pointing to the repo root.
3. Build command: `npm run install:all && npm run build`
4. Start command: `NODE_ENV=production npm start`
5. Add env var: `NODE_ENV=production`

One URL serves the full app — backend API + built React frontend.

### Option B — Vercel (frontend) + Railway (backend)

1. Deploy `frontend/` to Vercel.
2. Deploy `backend/` to Railway.
3. Set `VITE_API_URL` in Vercel to point to your Railway URL.

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/leads` | List all leads (newest first) |
| POST | `/api/leads` | Create a new lead |
| DELETE | `/api/leads/:id` | Delete a lead |
| GET | `/api/leads/export` | Download leads as CSV |

---

## 🤖 Chat Flow Overview

```
WELCOME
  └─ Parent ──→ Age → Interest → Goal → Name → Phone → Email → Booking → ✅ Done
  └─ School ──→ School Type → Size → Program → Name → School → Phone → Email → ✅ Done
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Icons | Lucide React |
| Routing | React Router v6 |
| Backend | Node.js, Express |
| Storage | JSON file (zero-config; swap for DB in prod) |
| DevTools | concurrently, nodemon |

---

## 📝 License

MIT — Built for WizKlub.com demo purposes.
