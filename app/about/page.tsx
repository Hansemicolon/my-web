import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | 60 Second Chat Room",
  description:
    "Learn why 60 Second Chat Room exists and how short-lived, private conversations work.",
};

export default function AboutPage() {
  return (
    <main className="min-h-[100dvh] bg-zinc-950 px-5 py-14 text-zinc-100 sm:px-8">
      <article className="mx-auto w-full max-w-3xl space-y-8 leading-relaxed">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About 60 Second Chat Room</h1>
          <p className="text-zinc-300">
            60 Second Chat Room is a lightweight messaging space built for short conversations that should not live forever.
            It was created for moments when people need to coordinate quickly, exchange a thought, or share a private note
            without adding more permanent history to social apps.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-100">Why this service exists</h2>
          <p className="text-zinc-300">
            Most chat products are designed to preserve every message. That works for long projects, but not every conversation
            needs to become a searchable archive. 60 Second Chat Room takes the opposite approach: each message is temporary,
            readable in real time, and removed automatically after sixty seconds. This gives users a clear expectation that the
            room is for now, not forever.
          </p>
          <p className="text-zinc-300">
            The goal is simple: help people talk with less pressure. Friends can decide where to meet, classmates can ask a quick
            question, teammates can confirm a one-time code phrase, and families can share a short update. Because messages fade
            away quickly, participants focus on immediate communication instead of building a permanent record.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-100">What makes it different</h2>
          <p className="text-zinc-300">
            The product is intentionally minimal. There is no account wall, no social profile, no complicated onboarding, and no
            retention system that encourages endless scrolling. A room is created instantly, shared with a link or room ID, and
            used for a short session. The interface is designed to keep attention on the conversation itself.
          </p>
          <p className="text-zinc-300">
            Under the hood, the service keeps active room state in memory only and does not keep a permanent message database.
            That architecture supports the product promise: short, private, and temporary chat for practical everyday use.
          </p>
        </section>
      </article>
    </main>
  );
}
