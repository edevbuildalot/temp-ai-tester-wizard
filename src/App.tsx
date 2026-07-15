import { useState, type FormEvent } from 'react'
import './App.css'

const WAITLIST_API = import.meta.env.VITE_WAITLIST_API || '/api/waitlist'

function App() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    setStatus('idle')
    setErrorMsg('')

    try {
      const res = await fetch(WAITLIST_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="container">
        <nav className="navbar">
          <div className="navbar-brand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10h-10V2Z" />
              <path d="M12 12 2 8" />
              <path d="M12 12 8 22" />
            </svg>
            Tester Wizard
          </div>
        </nav>

        <section className="hero">
          <div className="hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Pre-launch — join the waitlist
          </div>
          <h1>
            Disposable browser environments for{' '}
            <span className="highlight">AI-driven QA testing</span>
          </h1>
          <p>
            Spin up a fresh browser in seconds, run your AI tests, and throw it away.
            No infrastructure, no cleanup, no flaky state between runs.
          </p>

          <form className="waitlist-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
            <button type="submit" className="btn btn-primary" disabled={submitting || !email.trim()}>
              {submitting ? 'Joining...' : 'Join the waitlist'}
              {!submitting && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
            {status === 'success' && (
              <p className="form-status success">You're on the list! We'll be in touch soon.</p>
            )}
            {status === 'error' && (
              <p className="form-status error">{errorMsg}</p>
            )}
          </form>
        </section>

        <section className="social-proof">
          <p>Built for modern QA teams</p>
          <div className="social-proof-logos">
            <span>Playwright</span>
            <span>Puppeteer</span>
            <span>BrowserStack</span>
            <span>Selenium</span>
          </div>
        </section>
      </div>

      <section className="features">
        <div className="container">
          <div className="features-header">
            <h2>Everything you need for AI testing</h2>
            <p>No more shared environments, flaky state, or infrastructure management.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3>Ephemeral by design</h3>
              <p>Each test run gets a pristine browser. No shared cookies, no localStorage bleed, no state pollution between runs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3>Spin up in seconds</h3>
              <p>Provision a full browser environment in under 3 seconds. No queues, no cold starts, no waiting around.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>AI-agent ready</h3>
              <p>REST API designed for AI agents. Provide instructions, get back screenshots, console logs, and network traces.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22 6 12 13 2 6" />
                </svg>
              </div>
              <h3>Webhook results</h3>
              <p>Get test results pushed to your CI/CD pipeline, Slack, or any webhook endpoint automatically.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3>Usage-based pricing</h3>
              <p>Pay only for the seconds you use. No monthly minimums, no per-seat licenses, no surprise bills.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3>Isolated & secure</h3>
              <p>Every environment runs in an isolated container with no access to your infrastructure. Auto-destroyed after your test.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>How it works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Describe your test</h3>
              <p>Tell the AI what to test in plain English. No scripts needed.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>We spin up a browser</h3>
              <p>A fresh, isolated browser environment is created in seconds.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>AI runs the test</h3>
              <p>The AI navigates, clicks, fills forms, and captures results.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get results</h3>
              <p>Screenshots, logs, and pass/fail are delivered to your workflow.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to simplify your QA?</h2>
          <p>Join the waitlist and be the first to try Temp AI Tester Wizard.</p>
          <form className="waitlist-form" onSubmit={handleSubmit} style={{ margin: '0 auto' }}>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
            <button type="submit" className="btn btn-primary" disabled={submitting || !email.trim()}>
              {submitting ? 'Joining...' : 'Join the waitlist'}
            </button>
            {status === 'success' && (
              <p className="form-status success">You're on the list! We'll be in touch soon.</p>
            )}
            {status === 'error' && (
              <p className="form-status error">{errorMsg}</p>
            )}
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span>&copy; {new Date().getFullYear()} Temp AI Tester Wizard. All rights reserved.</span>
          <div className="footer-links">
            <a href="mailto:hello@testerwizard.com">Contact</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App