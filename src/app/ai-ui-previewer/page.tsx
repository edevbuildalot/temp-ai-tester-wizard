"use client";

import Link from "next/link";
import { useState, useEffect, FormEvent } from "react";

const SAMPLES: Record<string, string> = {
  "Chat Widget": `<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;background:#1a1a2e;padding:2rem;min-height:100vh;margin:0;display:flex;align-items:center;justify-content:center">
  <div style="background:#16213e;border-radius:16px;width:380px;padding:1.5rem;box-shadow:0 8px 32px rgba(0,0,0,0.4)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1.5rem">
      <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#0f3460,#e94560);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold">AI</div>
      <div>
        <div style="color:#e0e0e0;font-weight:600">AI Assistant</div>
        <div style="color:#888;font-size:13px">Online</div>
      </div>
    </div>
    <div style="background:#0f3460;border-radius:12px 12px 12px 4px;padding:12px;margin-bottom:12px;color:#ccc;font-size:14px;line-height:1.5">
      Hello! How can I help you today?
    </div>
    <div style="background:#e94560;border-radius:12px 12px 4px 12px;padding:12px;margin-bottom:12px;color:white;font-size:14px;line-height:1.5;margin-left:auto;width:fit-content;max-width:80%">
      Can you review my code?
    </div>
    <div style="background:#0f3460;border-radius:12px 12px 12px 4px;padding:12px;margin-bottom:1.5rem;color:#ccc;font-size:14px;line-height:1.5">
      Sure! I\'d be happy to help review your code. What language are you using?
    </div>
    <div style="display:flex;gap:8px">
      <input type="text" placeholder="Type a message..." style="flex:1;padding:10px 14px;border-radius:8px;border:1px solid #333;background:#1a1a2e;color:#e0e0e0;font-size:14px;outline:none">
      <button style="padding:10px 16px;border-radius:8px;border:none;background:#e94560;color:white;font-weight:600;cursor:pointer;font-size:14px">Send</button>
    </div>
  </div>
</body>
</html>`,

  "Dashboard UI": `<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;background:#0a0a1a;padding:2rem;min-height:100vh;margin:0">
  <div style="max-width:900px;margin:0 auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem">
      <h1 style="color:white;font-size:1.5rem;margin:0">Dashboard</h1>
      <div style="display:flex;gap:8px">
        <span style="background:#10b981;color:white;padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600">Live</span>
        <span style="background:#1e1e3a;color:#888;padding:6px 14px;border-radius:8px;font-size:13px">v2.4.1</span>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:2rem">
      <div style="background:#12122a;border-radius:12px;padding:1.25rem;border:1px solid #1e1e3a">
        <div style="color:#666;font-size:13px;margin-bottom:4px">Total Users</div>
        <div style="color:white;font-size:2rem;font-weight:bold">12,847</div>
        <div style="color:#10b981;font-size:13px">\u2191 12% this week</div>
      </div>
      <div style="background:#12122a;border-radius:12px;padding:1.25rem;border:1px solid #1e1e3a">
        <div style="color:#666;font-size:13px;margin-bottom:4px">Revenue</div>
        <div style="color:white;font-size:2rem;font-weight:bold">$48,230</div>
        <div style="color:#10b981;font-size:13px">\u2191 8% this week</div>
      </div>
      <div style="background:#12122a;border-radius:12px;padding:1.25rem;border:1px solid #1e1e3a">
        <div style="color:#666;font-size:13px;margin-bottom:4px">Tests Passed</div>
        <div style="color:white;font-size:2rem;font-weight:bold">2,401</div>
        <div style="color:#10b981;font-size:13px">\u2191 99.8% rate</div>
      </div>
    </div>
    <div style="background:#12122a;border-radius:12px;padding:1.5rem;border:1px solid #1e1e3a">
      <h2 style="color:white;font-size:1rem;margin:0 0 1rem">Recent Activity</h2>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1e1e3a">
          <span style="color:#ccc">UI test suite completed</span><span style="color:#666;font-size:13px">2m ago</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1e1e3a">
          <span style="color:#ccc">New deployment to staging</span><span style="color:#666;font-size:13px">15m ago</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1e1e3a">
          <span style="color:#ccc">Environment #8472 destroyed</span><span style="color:#666;font-size:13px">1h ago</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px 0">
          <span style="color:#ccc">Environment #8471 created</span><span style="color:#666;font-size:13px">2h ago</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`,

  "AI Form": `<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);min-height:100vh;margin:0;display:flex;align-items:center;justify-content:center;padding:2rem">
  <div style="background:rgba(255,255,255,0.05);backdrop-filter:blur(20px);border-radius:20px;padding:2.5rem;width:400px;border:1px solid rgba(255,255,255,0.1);box-shadow:0 8px 32px rgba(0,0,0,0.3)">
    <div style="text-align:center;margin-bottom:2rem">
      <div style="font-size:2.5rem;margin-bottom:8px">\u26a1</div>
      <h1 style="color:white;font-size:1.5rem;margin:0 0 4px">Create Environment</h1>
      <p style="color:#888;font-size:14px;margin:0">Configure your disposable browser test</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div>
        <label style="color:#aaa;font-size:13px;display:block;margin-bottom:6px;font-weight:500">Environment Name</label>
        <input type="text" value="UI Test #8473" style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.3);color:white;font-size:14px;box-sizing:border-box;outline:none">
      </div>
      <div>
        <label style="color:#aaa;font-size:13px;display:block;margin-bottom:6px;font-weight:500">Browser</label>
        <select style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.3);color:white;font-size:14px;box-sizing:border-box;outline:none;cursor:pointer">
          <option>Chromium (Latest)</option>
          <option>Firefox (Latest)</option>
          <option>WebKit (Latest)</option>
        </select>
      </div>
      <div>
        <label style="color:#aaa;font-size:13px;display:block;margin-bottom:6px;font-weight:500">Timeout</label>
        <select style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.3);color:white;font-size:14px;box-sizing:border-box;outline:none;cursor:pointer">
          <option>5 minutes</option>
          <option>15 minutes</option>
          <option>30 minutes</option>
        </select>
      </div>
      <button style="width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:white;font-size:15px;font-weight:600;cursor:pointer;margin-top:8px">Launch Environment \u2192</button>
    </div>
    <p style="color:#555;font-size:12px;text-align:center;margin-top:1.5rem">Disposable \u00b7 Ephemeral \u00b7 Secure</p>
  </div>
</body>
</html>`,
};

const DEFAULT_CODE = SAMPLES["Chat Widget"];

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
      setMessage(data.message || "You\'re on the list!");
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
        {status === "loading" ? "Joining\u2026" : "Join Waitlist"}
      </button>
      {message && (
        <p className={`text-sm col-span-full ${status === "success" ? "text-emerald-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </form>
  );
}

export default function AIPreviewerPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [activeSample, setActiveSample] = useState("Chat Widget");
  const [iframeKey, setIframeKey] = useState(0);

  function loadSample(name: string) {
    setActiveSample(name);
    setCode(SAMPLES[name]);
    setIframeKey((k) => k + 1);
  }

  function handleCodeChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCode(e.target.value);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIframeKey((k) => k + 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [code]);

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <Link href="/" className="text-lg font-bold tracking-tight hover:text-emerald-400 transition-colors">
          TATW
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
            Home
          </Link>
          <a
            href="#waitlist"
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Join Waitlist
          </a>
        </div>
      </nav>

      <main className="flex-1">
        <section className="px-6 pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-900/30 px-4 py-1.5 text-xs text-emerald-400 mb-6">
            Free Tool \u00b7 No Signup Required
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            AI UI Previewer
          </h1>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Paste any HTML, CSS, and JavaScript to see it rendered live. A glimpse of what
            you&apos;ll be able to test with disposable browser environments.
          </p>
        </section>

        <section className="px-6 pb-6 max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(SAMPLES).map((name) => (
              <button
                key={name}
                onClick={() => loadSample(name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSample === name
                    ? "bg-emerald-500 text-black"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        <section className="px-6 pb-12 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">HTML / Code</h2>
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Refresh Preview
                </button>
              </div>
              <textarea
                value={code}
                onChange={handleCodeChange}
                spellCheck={false}
                className="w-full h-[500px] rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm font-mono text-zinc-200 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Live Preview</h2>
                <span className="text-xs text-zinc-600">sandboxed iframe</span>
              </div>
              <div className="flex-1 rounded-xl border border-zinc-800 bg-white overflow-hidden min-h-[500px]">
                <iframe
                  key={iframeKey}
                  srcDoc={code}
                  title="Live Preview"
                  sandbox="allow-scripts"
                  className="w-full h-full min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="border-t border-zinc-800 px-6 py-24">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-4">
              How the AI UI Previewer works
            </h2>
            <p className="text-zinc-400 mb-16 max-w-2xl mx-auto">
              This free tool gives you a taste of the disposable browser environments
              we&apos;re building. Edit the HTML on the left and see the result instantly on the right.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="text-emerald-400 text-lg font-bold mb-2">1.</div>
                <h3 className="font-semibold mb-2">Paste or edit code</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Write or paste any HTML, CSS, and JavaScript into the code editor.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="text-emerald-400 text-lg font-bold mb-2">2.</div>
                <h3 className="font-semibold mb-2">See it render live</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  The preview panel updates automatically with a 300ms debounce.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="text-emerald-400 text-lg font-bold mb-2">3.</div>
                <h3 className="font-semibold mb-2">Try sample UIs</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Click any sample to load a pre-built AI-generated UI and see what&apos;s possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-zinc-800 px-6 py-24 text-center" id="waitlist">
          <h2 className="text-2xl font-semibold mb-4">
            Ready for full browser environments?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Join the waitlist and be the first to know when you can spin up disposable
            browser environments for your AI features.
          </p>
          <WaitlistForm />
        </section>
      </main>

      <footer className="border-t border-zinc-800 px-6 py-6 text-center text-xs text-zinc-600">
        Temp AI Tester Wizard — AI UI Previewer
      </footer>
    </>
  );
}