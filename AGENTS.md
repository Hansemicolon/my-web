# Ephemeral Room Chat (No Login)

## Goal
- User1 creates a room -> returns a UUID.
- User2 joins by pasting the UUID.
- Both meet in a single shared chat space.
- Messages are visible for 60 seconds only.
- No database, no persistence, no logs of chat content.

## Hard constraints (must obey)
- Never store chat messages in any DB or file.
- Server must keep only in-memory state.
- Message TTL = 60 seconds (hard).
- Client UI must fade text out smoothly, then remove it.

## Stack
- Next.js (TypeScript)
- Socket.IO for realtime transport
- In-memory Map for rooms/messages

## Local dev commands
- Install: `npm install`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`

## Architecture notes
- Room is identified by UUID v4.
- Server state:
  - rooms: Map<roomId, { createdAt, lastActiveAt, clients, ... }>
  - messages: per-room list with expiresAt
- Cleanup:
  - periodic sweep to remove expired messages and empty rooms
- Client state:
  - render message with createdAt/expiresAt
  - animate opacity from 1 to 0 over 60s (CSS transition or animation)
  - remove message from UI after expiresAt

## UX requirements
- Minimal UI:
  - Create room button -> shows roomId and copy button
  - Join room input -> enter roomId and join
  - Chat window + input
- Fade-out effect:
  - text becomes gradually transparent ("스르륵") before disappearing
  - optional slight blur near the end (subtle)