"use client";

import { useState, FormEvent } from "react";

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("success");
      setEmail("");
      setMessage(data.message || "You're on the list!");
    } else {
      setStatus("error");
      setMessage(data.error || "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 h-12 rounded-lg border border-zinc-700 bg-zinc-800 px-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-12 rounded-lg bg-emerald-500 px-6 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-50 transition-colors shrink-0"
      >
        {status === "loading" ? "Joining…" : "Join Waitlist"}
      </button>
      {message && (
        <p
          className={`text-sm col-span-full ${
            status === "success" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default function Home() {
  return (
    <>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <span className="text-lg font-bold tracking-tight">TATW</span>
        <a
          href="#waitlist"
          className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Join Waitlist
        </a>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center px-6 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-1.5 text-xs text-zinc-400 mb-8">
            Pre-launch · Limited spots
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight max-w-3xl">
            Disposable Browser QA
            <br />
            <span className="text-emerald-400">for AI Features</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-xl">
            Spin up temporary browser environments on demand. Test your AI-generated
            UIs, copilot outputs, and LLM-driven interfaces without the setup
            overhead.
          </p>
          <div className="mt-10" id="waitlist">
            <WaitlistForm />
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-zinc-800 px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-16">
              Why Temp AI Tester Wizard?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Instant Environments",
                  desc: "Provision a disposable headless or headed browser in seconds. No Docker, no VMs, no waiting.",
                },
                {
                  title: "AI-Native",
                  desc: "Built for the AI era. Perfect for testing LLM-generated HTML, copilot components, and agent-driven UIs.",
                },
                {
                  title: "Zero Persistence",
                  desc: "Environments are ephemeral by design. Run your test, get the results, and the browser vanishes.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
                >
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-zinc-800 px-6 py-24 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Ready to simplify your QA workflow?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Join the waitlist and be the first to know when we launch.
          </p>
          <WaitlistForm />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-6 text-center text-xs text-zinc-600">
        Temp AI Tester Wizard — Pre-launch
      </footer>
    </>
  );
}