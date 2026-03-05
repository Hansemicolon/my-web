import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use | 60 Second Chat Room",
  description:
    "Step-by-step guide for creating a temporary room, sharing it, and chatting for 60 seconds.",
};

export default function HowToUsePage() {
  return (
    <main className="min-h-[100dvh] bg-zinc-950 px-5 py-14 text-zinc-100 sm:px-8">
      <article className="mx-auto w-full max-w-3xl space-y-8 leading-relaxed">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">How to Use 60 Second Chat Room</h1>
          <p className="text-zinc-300">
            Getting started takes less than a minute. You do not need to install an app, create an account, or set up a profile.
            Open the homepage, create a room, and share it with someone you trust.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-100">Quick steps</h2>
          <ol className="list-decimal space-y-2 pl-6 text-zinc-300">
            <li>Click <strong>Create Room</strong> to generate a temporary room ID.</li>
            <li>Share the room link or room ID with your friend.</li>
            <li>Join the same room and chat in real time for 60 seconds per message.</li>
            <li>Messages disappear automatically as their timer ends.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-100">Detailed walkthrough</h2>
          <p className="text-zinc-300">
            Start by creating a room from the lobby. The service gives you a unique room identifier. Send that identifier to the
            person you want to talk with. They can paste it into the join field and enter the same room. Once both people are in,
            messages appear instantly. Each message has a strict sixty-second life span and fades before removal.
          </p>
          <p className="text-zinc-300">
            This flow is useful when you need temporary communication: arranging a meeting point, coordinating a pickup time,
            sharing a one-time reminder, or discussing something that does not need long-term storage. If you need persistent
            history, use a different platform. This service is intentionally optimized for short-lived conversations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-100">Tips for best experience</h2>
          <p className="text-zinc-300">
            Use a stable network connection, keep room links private, and open the room in a modern browser. Because chat content
            is temporary by design, important information should be confirmed quickly. Treat each room like a fast conversation
            channel rather than a notebook. That mindset helps users get the most value from the product.
          </p>
        </section>
      </article>
    </main>
  );
}
