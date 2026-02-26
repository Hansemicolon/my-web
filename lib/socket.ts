"use client";

import { io, type Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@/types/socket";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

/** Lazily create and return a typed Socket.IO client (singleton). */
export function getSocket(): AppSocket {
  if (!socket) {
    socket = io({ autoConnect: false });
  }
  return socket;
}
