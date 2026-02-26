import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  ChatMessage,
  Room,
} from "./types/socket";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// ---------------------------------------------------------------------------
// Next.js app
// ---------------------------------------------------------------------------
const app = next({ dev, hostname, port, turbopack: false, webpack: true });
const handle = app.getRequestHandler();

// ---------------------------------------------------------------------------
// In-memory state — never persisted
// ---------------------------------------------------------------------------
const rooms = new Map<string, Room>();
const messages = new Map<string, ChatMessage[]>(); // roomId → messages

// ---------------------------------------------------------------------------
// UUID v4 validation regex
// ---------------------------------------------------------------------------
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MESSAGE_TTL = 60_000; // 60 seconds
const MAX_MESSAGE_LENGTH = 500;
const MAX_CLIENTS_PER_ROOM = 2; // 1:1 chat
const CLEANUP_INTERVAL = 5_000; // sweep every 5 s
const ROOM_IDLE_TIMEOUT = 5 * 60_000; // remove empty rooms after 5 min

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
app.prepare().then(() => {
  const httpServer = createServer(handle);

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer);

  // -----------------------------------------------------------------------
  // Socket.IO event handlers
  // -----------------------------------------------------------------------
  io.on("connection", (socket) => {
    socket.data.roomId = null;

    // --- create-room ---
    socket.on("create-room", (callback) => {
      const roomId = uuidv4();
      rooms.set(roomId, {
        id: roomId,
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
        clients: new Set([socket.id]),
      });
      messages.set(roomId, []);

      socket.data.roomId = roomId;
      void socket.join(roomId);
      callback({ roomId });
    });

    // --- join-room ---
    socket.on("join-room", (roomId, callback) => {
      // Validate UUID format
      if (!UUID_RE.test(roomId)) {
        callback({ success: false, error: "Invalid room ID format." });
        return;
      }

      const room = rooms.get(roomId);
      if (!room) {
        callback({ success: false, error: "Room not found." });
        return;
      }
      if (room.clients.size >= MAX_CLIENTS_PER_ROOM) {
        callback({ success: false, error: "Room is full (max 2)." });
        return;
      }

      // Join
      room.clients.add(socket.id);
      room.lastActiveAt = Date.now();
      socket.data.roomId = roomId;
      void socket.join(roomId);

      // Send existing non-expired messages to the new joiner
      const existing = (messages.get(roomId) ?? []).filter(
        (m) => m.expiresAt > Date.now(),
      );
      for (const msg of existing) {
        socket.emit("message", msg);
      }

      callback({ success: true });
      // Notify room
      io.to(roomId).emit("user-joined", { clientCount: room.clients.size });
    });

    // --- send-message ---
    socket.on("send-message", ({ content }) => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      const room = rooms.get(roomId);
      if (!room) return;

      const trimmed = content.trim();
      if (trimmed.length === 0 || trimmed.length > MAX_MESSAGE_LENGTH) return;

      const now = Date.now();
      const msg: ChatMessage = {
        id: uuidv4(),
        roomId,
        sender: socket.id,
        content: trimmed,
        createdAt: now,
        expiresAt: now + MESSAGE_TTL,
      };

      const roomMessages = messages.get(roomId);
      if (roomMessages) {
        roomMessages.push(msg);
      }
      room.lastActiveAt = now;

      io.to(roomId).emit("message", msg);
    });

    // --- disconnect ---
    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      const room = rooms.get(roomId);
      if (!room) return;

      room.clients.delete(socket.id);
      room.lastActiveAt = Date.now();

      io.to(roomId).emit("user-left", { clientCount: room.clients.size });
    });
  });

  // -----------------------------------------------------------------------
  // Periodic TTL cleanup — prevents memory leaks
  // -----------------------------------------------------------------------
  setInterval(() => {
    const now = Date.now();

    for (const [roomId, roomMessages] of messages) {
      // Find expired messages and notify clients
      const expired = roomMessages.filter((m) => m.expiresAt <= now);
      for (const msg of expired) {
        io.to(roomId).emit("message-expired", msg.id);
      }

      // Keep only live messages
      const alive = roomMessages.filter((m) => m.expiresAt > now);
      if (alive.length > 0) {
        messages.set(roomId, alive);
      } else {
        messages.set(roomId, []);
      }
    }

    // Remove idle empty rooms
    for (const [roomId, room] of rooms) {
      if (
        room.clients.size === 0 &&
        now - room.lastActiveAt > ROOM_IDLE_TIMEOUT
      ) {
        rooms.delete(roomId);
        messages.delete(roomId);
      }
    }
  }, CLEANUP_INTERVAL);

  // -----------------------------------------------------------------------
  // Start listening
  // -----------------------------------------------------------------------
  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
