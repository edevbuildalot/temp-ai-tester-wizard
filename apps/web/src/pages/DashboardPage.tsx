import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { api, TestRun, TestResult } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [history, setHistory] = useState<TestRun[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getTests().then(d => setHistory(d.runs)).catch(() => {});
  }, []);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setRunning(true);
    try {
      const res = await api.runTest(url, prompt);
      setResult(res);
      const updated = await api.getTests();
      setHistory(updated.runs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <nav className="nav">
        <span className="nav-brand">Temp AI Tester Wizard</span>
        <div className="nav-links">
          <span className="text-muted" style={{ fontSize: '0.8125rem' }}>{user?.name}</span>
          <button className="btn btn-ghost" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }} onClick={() => { logout(); navigate('/'); }}>
            Sign out
          </button>
        </div>
      </nav>

      <div className="page">
        <div className="container">
          <h2 className="mb-2">New test</h2>
          <form className="test-form" onSubmit={handleRun}>
            <input
              className="input"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
            />
            <textarea
              className="input mt-1"
              placeholder='Describe what the page should look like. E.g. "The page title should say Welcome. There should be a blue Sign Up button in the top right."'
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              required
            />
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.8125rem' }} className="mt-1">{error}</p>}
            <button className="btn btn-primary mt-2" type="submit" disabled={running}>
              {running ? <><span className="spinner" /> Running test…</> : 'Run test'}
            </button>
          </form>

          {result && (
            <div className="card result-card">
              <div className="result-header">
                <span className={`badge ${result.passed ? 'badge-success' : 'badge-danger'}`}>
                  {result.passed ? 'PASS' : 'FAIL'}
                </span>
                <span style={{ fontWeight: 600 }}>{result.summary}</span>
              </div>
              <div className="result-details">{result.details}</div>
            </div>
          )}

          <div className="mt-4">
            <h2 className="mb-2">Test history</h2>
            {history.length === 0 ? (
              <div className="empty-state">
                <p>No tests yet. Run your first test above!</p>
              </div>
            ) : (
              <div className="history-list">
                {history.map(run => (
                  <div key={run.id} className="history-item" onClick={() => navigate(`/dashboard?run=${run.id}`)}>
                    <div>
                      <div className="history-item-url">{run.url}</div>
                      <div className="history-item-date">{new Date(run.created_at).toLocaleString()}</div>
                    </div>
                    <span className={`badge ${run.status === 'completed' ? (run.result?.passed ? 'badge-success' : 'badge-danger') : 'badge-pending'}`}>
                      {run.status === 'completed' ? (run.result?.passed ? 'PASS' : 'FAIL') : run.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}