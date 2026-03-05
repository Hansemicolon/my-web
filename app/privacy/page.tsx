import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | 60 Second Chat Room",
  description:
    "Privacy overview for 60 Second Chat Room, including temporary messages and limited data handling.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-[100dvh] bg-zinc-950 px-5 py-14 text-zinc-100 sm:px-8">
      <article className="mx-auto w-full max-w-3xl space-y-8 leading-relaxed">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="text-zinc-300">
            60 Second Chat Room is designed for temporary communication. This policy explains what data is and is not handled when
            people use the service.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-100">Conversation data</h2>
          <p className="text-zinc-300">
            Chat messages are intended to be short-lived. The service does not provide a permanent conversation archive for users,
            and it does not offer long-term history features. Messages disappear automatically after their time limit as part of
            the core product behavior.
          </p>
          <p className="text-zinc-300">
            Because this is an ephemeral product, users should avoid sending sensitive personal details that they would not want to
            share in any online environment. Temporary visibility does not replace responsible communication practices.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-100">Personal information</h2>
          <p className="text-zinc-300">
            We do not require account creation for basic room access. The service is built to minimize unnecessary personal data
            collection and keeps the experience focused on quick room-based communication.
          </p>
          <p className="text-zinc-300">
            Like most web services, limited technical information may be processed to deliver and secure the site, such as request
            metadata, connectivity diagnostics, and abuse-prevention signals. This operational use is intended to keep the service
            available and stable, not to build personal profiles for chat history products.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-100">Third-party services and ads</h2>
          <p className="text-zinc-300">
            The website may display advertising and use third-party services that operate under their own policies. If ads are
            shown, those providers may use technologies described in their privacy documentation. Users should review third-party
            privacy pages for details about their data practices.
          </p>
        </section>
      </article>
    </main>
  );
}
