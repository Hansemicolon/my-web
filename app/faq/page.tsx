import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | 60 Second Chat Room",
  description:
    "Frequently asked questions about anonymity, storage, room sharing, and 60-second message behavior.",
};

export default function FaqPage() {
  return (
    <main className="min-h-[100dvh] bg-zinc-950 px-5 py-14 text-zinc-100 sm:px-8">
      <article className="mx-auto w-full max-w-3xl space-y-8 leading-relaxed">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Frequently Asked Questions</h1>
          <p className="text-zinc-300">
            This page answers common questions about how 60 Second Chat Room works. The service is designed for short,
            practical conversations and avoids unnecessary complexity.
          </p>
        </header>

        <section className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-zinc-100">Are chats stored permanently?</h2>
            <p className="text-zinc-300">
              No. Messages are temporary and expire automatically after sixty seconds. The product is built for ephemeral
              conversation, not long-term archives.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-zinc-100">Is the service anonymous?</h2>
            <p className="text-zinc-300">
              You do not need to create a profile or publish personal details to use the room. Conversations are based on room
              access rather than social identities.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-zinc-100">Do I need an account?</h2>
            <p className="text-zinc-300">
              No account is required. You can create or join a room directly from the homepage, which keeps the experience fast
              and simple.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-zinc-100">Can I share the room link with others?</h2>
            <p className="text-zinc-300">
              Yes. Room access depends on the shared room ID or link. Share it only with people you trust, because anyone with
              that room information may be able to join while the room is active.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-zinc-100">How long does the chat last?</h2>
            <p className="text-zinc-300">
              Each message remains visible for up to sixty seconds and then disappears. This keeps chats focused on immediate
              coordination and reduces permanent message buildup.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-zinc-100">Can I recover a message after it fades out?</h2>
            <p className="text-zinc-300">
              No. Expired messages are removed as part of the product design. If information is critical, users should confirm it
              quickly or use a platform meant for persistent records.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
