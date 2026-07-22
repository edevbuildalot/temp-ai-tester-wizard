"use client";

import { useState, useCallback, useRef } from "react";
import { analytics } from "@launchfury/analytics";

interface TestResult {
  name: string;
  code: string;
}

interface GenerateResponse {
  tests: TestResult[];
  framework: string;
  summary: string;
  error?: string;
}

const EXAMPLE_CODE = `function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function applyDiscount(total, discountPercent) {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount must be between 0 and 100");
  }
  return total * (1 - discountPercent / 100);
}`;

export default function Home() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = useCallback(async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    analytics.capture("generate_started", {
      codeLength: code.length,
    });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data: GenerateResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate tests");
      }

      setResult(data);
      analytics.capture("generate_completed", {
        testCount: data.tests?.length,
        framework: data.framework,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      analytics.capture("generate_failed", { error: message });
    } finally {
      setLoading(false);
    }
  }, [code]);

  const handleCopy = useCallback(async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const handleLoadExample = useCallback(() => {
    setCode(EXAMPLE_CODE);
    setResult(null);
    setError(null);
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">
            Temp AI Tester Wizard
          </h1>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Paste code. Get tests. Ship faster.
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          <section className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="code-input"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Paste your code
              </label>
              <button
                type="button"
                onClick={handleLoadExample}
                className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Load example
              </button>
            </div>
            <textarea
              ref={textareaRef}
              id="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="flex-1 min-h-[300px] w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 font-mono text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-zinc-400"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !code.trim()}
              className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Tests"
              )}
            </button>
          </section>

          <section className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Generated tests
              </h2>
              {result && (
                <span className="text-xs text-zinc-500">
                  {result.framework} &middot; {result.tests.length} test
                  {result.tests.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="flex-1 min-h-[300px] rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <svg
                      className="animate-spin h-6 w-6 text-indigo-500 mx-auto mb-3"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <p className="text-sm text-zinc-500">
                      Analyzing code and generating tests...
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-6">
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {result.summary && (
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {result.summary}
                      </p>
                    </div>
                  )}
                  {result.tests.map((test, i) => (
                    <div key={i} className="group relative">
                      <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          {test.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(test.code, i)}
                          className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedIndex === i ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <pre className="p-4 text-sm font-mono leading-relaxed overflow-x-auto">
                        <code>{test.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {!result && !loading && !error && (
                <div className="flex items-center justify-center h-full p-8">
                  <p className="text-sm text-zinc-400 text-center">
                    Paste your code on the left and click Generate Tests to get
                    started
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className="mt-12 text-center text-xs text-zinc-400">
          Temp AI Tester Wizard &middot; Tests are generated by AI &mdash;
          review before using
        </footer>
      </main>
    </div>
  );
}
