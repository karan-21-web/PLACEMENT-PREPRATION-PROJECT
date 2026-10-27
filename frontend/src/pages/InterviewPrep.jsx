import React, { useState, useEffect } from 'react';
import api from '../services/api';
import InterviewSession from '../components/tracker/InterviewSession';

const CATEGORIES = ['HR', 'Technical', 'DSA', 'OOPs', 'DBMS', 'OS', 'CN', 'Projects'];

// ──────────────────────────────────────────────
// Small result screen shown after finishing
// ──────────────────────────────────────────────
const SessionResult = ({ session, onStartNew }) => {
  const attempted = session.attemptedQuestions || 0;
  const total = session.totalQuestions || 0;
  const percent = total > 0 ? Math.round((attempted / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Interview Preparation</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Session complete</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎉</span>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Session Complete!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Great job finishing the practice session.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Company</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{session.company}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Role</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{session.role}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Questions</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {attempted}/{total}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Completed</p>
            <p className="text-lg font-bold text-blue-600">{percent}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${session.status === 'completed'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
              }`}
          >
            {session.status === 'completed' ? '✓ Completed' : 'In Progress'}
          </span>
        </div>

        <button
          onClick={onStartNew}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          ✨ Practice Again
        </button>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Session History row
// ──────────────────────────────────────────────
const HistoryRow = ({ session }) => {
  const attempted = session.attemptedQuestions || 0;
  const total = session.totalQuestions || 0;
  const percent = total > 0 ? Math.round((attempted / total) * 100) : 0;
  const date = new Date(session.createdAt).toLocaleDateString();
  const isCompleted = session.status === 'completed';

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 dark:text-white text-sm">{session.company}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{session.role} · {date}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">
          {attempted}/{total} questions
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{percent}% answered</p>
      </div>
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${isCompleted
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
          }`}
      >
        {isCompleted ? 'Completed' : 'In Progress'}
      </span>
    </div>
  );
};

// ──────────────────────────────────────────────
// Main page
// ──────────────────────────────────────────────
const InterviewPrep = () => {
  // ── AI generation state (unchanged from original) ──
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState('Technical');
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Session flow state ──
  // 'idle' | 'preview' | 'active' | 'result'
  const [phase, setPhase] = useState('idle');
  const [finishedSession, setFinishedSession] = useState(null);

  // ── History state ──
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');

  // Fetch past sessions once on mount
  useEffect(() => {
    const fetchHistory = async () => {
      setHistoryLoading(true);
      setHistoryError('');
      try {
        const res = await api.get('/interviews/sessions');
        setHistory(res.data);
      } catch (err) {
        setHistoryError('Could not load session history.');
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // ── AI generation handler (unchanged logic) ──
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!company || !role) return;

    setLoading(true);
    setError('');
    setQuestions([]);
    setSource('');
    setPhase('idle');

    try {
      const response = await api.post('/interviews/ai/generate', {
        company,
        role,
        category,
        count,
      });
      setQuestions(response.data.questions);
      setSource(response.data.source);
      setPhase('preview'); // show questions + "Start Session" button
    } catch (err) {
      setError(err.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  // Called by InterviewSession when the session is saved
  const handleSessionFinish = (savedSession) => {
    setFinishedSession(savedSession);
    setPhase('result');
    // Add to history at top
    setHistory((prev) => [savedSession, ...prev]);
  };

  // Reset everything to start fresh
  const handleStartNew = () => {
    setPhase('idle');
    setQuestions([]);
    setSource('');
    setError('');
    setFinishedSession(null);
  };

  const inputClass =
    'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500';

  // ── Show result screen ──
  if (phase === 'result' && finishedSession) {
    return <SessionResult session={finishedSession} onStartNew={handleStartNew} />;
  }

  // ── Show active interview (one question at a time) ──
  if (phase === 'active') {
    return (
      <InterviewSession
        questions={questions}
        company={company}
        role={role}
        category={category}
        onFinish={handleSessionFinish}
        onCancel={() => setPhase('preview')}
      />
    );
  }

  // ── Default view: generator form + preview + history ──
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Interview Preparation</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Generate interview questions using AI, then practice one question at a time.
        </p>
      </div>

      {/* ── AI Generation form (unchanged) ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">🤖 AI Question Generator</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Enter company and role details to generate practice interview questions.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company *</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Google"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Software Engineer"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Questions</label>
              <select value={count} onChange={(e) => setCount(Number(e.target.value))} className={inputClass}>
                {[3, 5, 7, 10].map((n) => (
                  <option key={n} value={n}>{n} questions</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !company || !role}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {loading ? '⏳ Generating...' : '✨ Generate Questions'}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* ── Generated questions preview + Start Session ── */}
      {phase === 'preview' && questions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Generated Questions</h2>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${source === 'ai'
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
              >
                {source === 'ai' ? '🤖 AI Generated' : '📚 Curated Questions'}
              </span>
            </div>

            {/* Start Session button */}
            <button
              onClick={() => setPhase('active')}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              ▶ Start Practice Session
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, index) => (
              <div key={index} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 shrink-0 w-6">
                  {index + 1}.
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-200">{q}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setPhase('active')}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              ▶ Start Practice Session ({questions.length} questions)
            </button>
          </div>
        </div>
      )}

      {/* ── Session History ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📋 Session History</h2>

        {historyError && (
          <p className="text-sm text-red-600 dark:text-red-400">{historyError}</p>
        )}

        {historyLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-400">No sessions yet. Generate questions above and start your first session!</p>
        ) : (
          <div className="space-y-3">
            {history.map((session) => (
              <HistoryRow key={session._id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;
