import { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await api.joinWaitlist(email);
      setMessage(res.message);
      setStatus('success');
    } catch (err: any) {
      setMessage(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="landing">
      <h1>Temp AI<br />Tester Wizard</h1>
      <p className="subtitle">
        Describe what a working page looks like. Our AI visits the URL, inspects the page,
        and tells you if it passes or fails — no test scripts required.
      </p>

      {status === 'success' ? (
        <div className="waitlist-success">
          <p>{message}</p>
        </div>
      ) : (
        <form className="waitlist-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-primary" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
          </button>
          {status === 'error' && <p className="waitlist-error">{message}</p>}
        </form>
      )}

      <div className="actions">
        {user ? (
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        ) : (
          <>
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>
              Get started free
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/login')}>
              Sign in
            </button>
          </>
        )}
      </div>
      <div className="features">
        <div className="feature">
          <h3>Natural language</h3>
          <p>Write tests in plain English. "The login button should be blue and clickable."</p>
        </div>
        <div className="feature">
          <h3>AI-driven</h3>
          <p>Our agent visits your page, inspects content, console, and network — then evaluates.</p>
        </div>
        <div className="feature">
          <h3>Instant results</h3>
          <p>Get a pass/fail verdict with a detailed report and screenshot in seconds.</p>
        </div>
      </div>
    </div>
  );
}