import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | 60 Second Chat Room",
  description:
    "Terms of service for using 60 Second Chat Room, including acceptable use and disclaimers.",
};

export default function TermsPage() {
  return (
    <main className="min-h-[100dvh] bg-zinc-950 px-5 py-14 text-zinc-100 sm:px-8">
      <article className="mx-auto w-full max-w-3xl space-y-8 leading-relaxed">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Terms of Service</h1>
          <p className="text-zinc-300">
            These terms describe basic rules for using 60 Second Chat Room. By using the website, you agree to use it
            responsibly and in line with applicable law.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-100">Acceptable use</h2>
          <p className="text-zinc-300">
            You agree not to use the service for abuse, harassment, illegal activity, spam, malicious automation, or attempts to
            disrupt platform availability. You must not use the site to impersonate others, distribute harmful material, or test
            attacks against infrastructure. Access may be limited or blocked when usage creates risk to users or service stability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-100">Service nature</h2>
          <p className="text-zinc-300">
            60 Second Chat Room is an ephemeral communication tool. Message visibility is intentionally temporary, and features may
            change as the product evolves. We may update, pause, or discontinue parts of the service at any time to maintain
            safety, performance, or legal compliance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-100">User responsibility</h2>
          <p className="text-zinc-300">
            Users are responsible for how they share room links and for the content they post while a room is active. If a
            conversation includes sensitive details, you should use additional safeguards and exercise good judgment. This service
            is intended for quick, practical chat and does not replace professional communication or recordkeeping systems.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-100">Disclaimer and limitation</h2>
          <p className="text-zinc-300">
            The site is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of uninterrupted operation. To the
            maximum extent permitted by law, we are not liable for indirect or consequential damages resulting from use,
            interruption, or inability to access the service.
          </p>
          <p className="text-zinc-300">
            These terms may be updated over time. Continued use after updates indicates acceptance of the revised terms.
          </p>
        </section>
      </article>
    </main>
  );
}
