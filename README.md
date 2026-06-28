# BrainWars

Real-time multiplayer quiz tournament app. Players join rooms, answer questions under time pressure, and compete on a live leaderboard with HP, speed scoring, streaks, and a trophy-based league system.

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Socket.IO client, Zod |
| Backend | Node.js, Express 5, Socket.IO, MongoDB (Mongoose) |
| Auth | JWT (15 min access tokens + 7-day httpOnly refresh cookies) |

---

## Getting Started (local development)

Both the server and client need their own `.env` file. The defaults are designed so that a fresh checkout with minimal configuration runs end-to-end without any changes.

### 1 — Clone and install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2 — Configure the server

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in:

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | **Yes** | MongoDB connection string. Local: `mongodb://localhost:27017/brainwars` |
| `JWT_SECRET` | **Yes** | Long random string. Never reuse between environments. |
| Everything else | No | Defaults work out of the box for local dev. |

### 3 — Configure the client

```bash
cd client
cp .env.example .env
```

The default `VITE_API_URL=http://localhost:5050` already matches the server's default `PORT=5050`. **You don't need to change anything** unless you changed the server port.

### 4 — Seed sample questions (optional)

```bash
cd server && npm run seed
```

### 5 — Run the app

In two separate terminals:

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Default Port Agreement

The server defaults to **port 5050** (`PORT=5050` in `server/.env`) and the client defaults to connecting to **http://localhost:5050** (`VITE_API_URL` in `client/.env`). These values intentionally agree so a fresh checkout with both `.env` files copied from `.env.example` works end-to-end with no manual port changes.

If you change `PORT` in `server/.env`, update `VITE_API_URL` in `client/.env` to match.

---

## Environment Variables

Full reference: see [`server/.env.example`](server/.env.example) and [`client/.env.example`](client/.env.example). Every variable is documented there with its default value.

---

## Game Config

All gameplay tuning constants (HP values, trophy deltas, tier thresholds, daily bonus amount, etc.) live in **`server/config/gameConfig.js`**. Trophy tier thresholds are mirrored in **`client/src/utils/leagues.js`** for display purposes — a `TIER_DATA_VERSION` string in both files must match, and the server validates this at startup.
