// Shared types for Socket.IO events — used by both server and client.
// Contains only TS interfaces (erased at compile time), no runtime code.

/** A chat message visible to both server and client. */
export interface ChatMessage {
  id: string;
  roomId: string;
  sender: string; // socket.id (anonymous)
  content: string;
  createdAt: number; // Date.now()
  expiresAt: number; // createdAt + 60_000
  clientMessageId?: string; // Client-generated UUID for deduplication
}

/** Server-only room state. */
export interface Room {
  id: string;
  createdAt: number;
  lastActiveAt: number;
  clients: Set<string>; // socket IDs
}

/** Events emitted from server to client. */
export interface ServerToClientEvents {
  message: (msg: ChatMessage) => void;
  "message-expired": (messageId: string) => void;
  "room-created": (data: { roomId: string }) => void;
  "room-joined": (data: { roomId: string; clientCount: number }) => void;
  "room-error": (data: { message: string }) => void;
  "user-joined": (data: { clientCount: number }) => void;
  "user-left": (data: { clientCount: number }) => void;
}

/** Events emitted from client to server. */
export interface ClientToServerEvents {
  "create-room": (
    callback: (res: { roomId: string }) => void,
  ) => void;
  "join-room": (
    roomId: string,
    callback: (res: { success: boolean; error?: string }) => void,
  ) => void;
  "send-message": (data: { content: string; clientMessageId: string }) => void;
}

/** Inter-server events (unused in single-server setup). */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InterServerEvents {}

/** Per-socket data stored on the server. */
export interface SocketData {
  roomId: string | null;
}
