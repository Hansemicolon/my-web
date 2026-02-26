"use client";

import { useSocket } from "@/hooks/useSocket";
import Lobby from "./components/Lobby";
import ChatRoom from "./components/ChatRoom";

export default function Home() {
  const {
    phase,
    isConnected,
    roomId,
    clientCount,
    messages,
    error,
    socketId,
    createRoom,
    joinRoom,
    sendMessage,
    leaveRoom,
  } = useSocket();

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-zinc-950">
      {phase === "lobby" ? (
        <Lobby
          isConnected={isConnected}
          error={error}
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
        />
      ) : (
        <ChatRoom
          roomId={roomId!}
          messages={messages}
          clientCount={clientCount}
          socketId={socketId}
          onSendMessage={sendMessage}
          onLeave={leaveRoom}
        />
      )}
    </div>
  );
}
