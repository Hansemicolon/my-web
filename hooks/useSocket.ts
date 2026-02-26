"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import type { ChatMessage } from "@/types/socket";

export type ChatPhase = "lobby" | "chat";

export function useSocket() {
  const [phase, setPhase] = useState<ChatPhase>("lobby");
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [clientCount, setClientCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref so callbacks always see fresh messages
  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // ------------------------------------------------------------------
  // Connection lifecycle
  // ------------------------------------------------------------------
  useEffect(() => {
    const socket = getSocket();

    function onConnect() {
      setIsConnected(true);
      setError(null);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    function onMessage(msg: ChatMessage) {
      setMessages((prev) => [...prev, msg]);
    }
    function onMessageExpired(messageId: string) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    }
    function onUserJoined({ clientCount: c }: { clientCount: number }) {
      setClientCount(c);
    }
    function onUserLeft({ clientCount: c }: { clientCount: number }) {
      setClientCount(c);
    }
    function onRoomError({ message }: { message: string }) {
      setError(message);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);
    socket.on("message-expired", onMessageExpired);
    socket.on("user-joined", onUserJoined);
    socket.on("user-left", onUserLeft);
    socket.on("room-error", onRoomError);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
      socket.off("message-expired", onMessageExpired);
      socket.off("user-joined", onUserJoined);
      socket.off("user-left", onUserLeft);
      socket.off("room-error", onRoomError);
      socket.disconnect();
    };
  }, []);

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------
  const createRoom = useCallback(() => {
    const socket = getSocket();
    setError(null);
    socket.emit("create-room", (res) => {
      setRoomId(res.roomId);
      setClientCount(1);
      setPhase("chat");
    });
  }, []);

  const joinRoom = useCallback((id: string) => {
    const socket = getSocket();
    setError(null);
    socket.emit("join-room", id, (res) => {
      if (res.success) {
        setRoomId(id);
        setPhase("chat");
      } else {
        setError(res.error ?? "Failed to join room.");
      }
    });
  }, []);

  const sendMessage = useCallback((content: string) => {
    const socket = getSocket();
    socket.emit("send-message", { content });
  }, []);

  const leaveRoom = useCallback(() => {
    const socket = getSocket();
    socket.disconnect();
    socket.connect();
    setRoomId(null);
    setMessages([]);
    setClientCount(0);
    setError(null);
    setPhase("lobby");
  }, []);

  return {
    phase,
    isConnected,
    roomId,
    clientCount,
    messages,
    error,
    socketId: getSocket().id ?? null,
    createRoom,
    joinRoom,
    sendMessage,
    leaveRoom,
  };
}
