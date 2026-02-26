# Ephemeral Chat

Private 1:1 chat rooms. No login. No logs. Messages vanish in 60 seconds.

## Features

- **No signup** — Create a room, share the UUID, start chatting.
- **Ephemeral messages** — Every message self-destructs after 60 seconds.
- **Fade-out effect** — Messages visually dissolve ("스르륵") before disappearing.
- **No persistence** — Nothing stored in any database or file. In-memory only.
- **1:1 rooms** — Each room supports exactly two participants.
- **Real-time** — Powered by Socket.IO over WebSocket.

## Getting Started

### Prerequisites

- Node.js 18+

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

1. Click **Create Room** — you get a UUID.
2. Send the UUID to someone.
3. They paste it into **Join Room**.
4. Chat. Messages fade out over 60 seconds and are gone forever.

## Architecture

- **Custom server** (`server.ts`) — Node.js HTTP server running both Next.js and Socket.IO on port 3000.
- **In-memory state** — `Map<roomId, Room>` and `Map<roomId, Message[]>`. No database.
- **TTL cleanup** — Server sweeps expired messages every 5 seconds. Empty idle rooms are removed after 5 minutes.
- **Client animation** — CSS keyframe animation fades each message from opacity 1→0 over its remaining lifetime, with subtle blur at the end.

## Stack

- Next.js 16 (App Router)
- React 19
- Socket.IO 4
- Tailwind CSS 4
- TypeScript (strict)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build (Next.js only) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Limitations

- Custom server — not deployable on Vercel (no WebSocket support). Use a VPS, Railway, Render, or similar.
- Messages are lost on server restart (by design).
