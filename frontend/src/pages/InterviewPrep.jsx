import React, { useState } from 'react';
import api from '../services/api';

// Simple interview prep page - just generates questions using Gemini AI
const CATEGORIES = ['HR', 'Technical', 'DSA', 'OOPs', 'DBMS', 'OS', 'CN', 'Projects'];

const InterviewPrep = () => {
  // Form state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState('Technical');
  const [count, setCount] = useState(5);

  // Result state
  const [questions, setQuestions] = useState([]);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate questions using AI
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!company || !role) return;

    setLoading(true);
    setError('');
    setQuestions([]);
    setSource('');

    try {
      const response = await api.post('/interviews/ai/generate', {
        company,
        role,
        category,
        count,
      });
      setQuestions(response.data.questions);
      setSource(response.data.source); // 'ai' or 'fallback'
    } catch (err) {
      setError(err.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Interview Preparation</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Generate interview questions using AI</p>
      </div>

      {/* Generation form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">🤖 AI Question Generator</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Enter company and role details to generate practice interview questions.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company *</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Google" className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Software Engineer" className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Questions</label>
              <select value={count} onChange={(e) => setCount(Number(e.target.value))} className={inputClass}>
                {[3, 5, 7, 10].map(n => <option key={n} value={n}>{n} questions</option>)}
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

      {/* Generated questions */}
      {questions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Generated Questions</h2>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              source === 'ai' 
                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {source === 'ai' ? '🤖 AI Generated' : '📚 Curated Questions'}
            </span>
          </div>

          <div className="space-y-3">
            {questions.map((q, index) => (
              <div key={index} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 shrink-0 w-6">{index + 1}.</span>
                <p className="text-sm text-gray-700 dark:text-gray-200">{q}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
