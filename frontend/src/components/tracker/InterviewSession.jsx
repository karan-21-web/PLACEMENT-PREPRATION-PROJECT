import React, { useState } from 'react';
import api from '../../services/api';

/**
 * InterviewSession
 * Shows questions one at a time, collects answers in local state,
 * then saves the session to the backend when finished.
 *
 * Props:
 *  - questions  : string[]  — list of question texts from AI
 *  - company    : string
 *  - role       : string
 *  - category   : string
 *  - onFinish   : (sessionData) => void  — called with saved session info
 *  - onCancel   : () => void
 */
const InterviewSession = ({ questions, company, role, category, onFinish, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // answers[i] stores the user's typed answer for question i
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(''));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const total = questions.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  const handleAnswerChange = (value) => {
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);
  };

  const handleFinish = async () => {
    setSaving(true);
    setError('');

    // Count how many questions the user actually typed something for
    const attempted = answers.filter((a) => a.trim().length > 0).length;

    try {
      // Step 1: Create the session
      const createRes = await api.post('/interviews/sessions', {
        company,
        role,
        totalQuestions: total,
      });
      const session = createRes.data;

      // Step 2: Mark it as completed with final stats
      const completeRes = await api.put(`/interviews/sessions/${session._id}/complete`, {
        attemptedQuestions: attempted,
        totalQuestions: total,
        // confidenceScore is not collected in this simple flow; backend defaults to 0
      });

      onFinish(completeRes.data);
    } catch (err) {
      setError(err.message || 'Failed to save session. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Session header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
              Practice Session
            </p>
            <p className="font-semibold text-gray-800 dark:text-white">
              {company} — {role}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Category: {category}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Progress</p>
            <p className="text-lg font-bold text-blue-600">
              {currentIndex + 1} / {total}
            </p>
          </div>
        </div>

        {/* Simple progress bar */}
        <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Question {currentIndex + 1} of {total}
        </p>

        <p className="text-base font-medium text-gray-800 dark:text-white leading-relaxed">
          {questions[currentIndex]}
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Answer
          </label>
          <textarea
            rows={5}
            value={answers[currentIndex]}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here... (optional)"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          {answers[currentIndex].trim() === '' && (
            <p className="text-xs text-gray-400 mt-1">
              Leave blank to mark this question as skipped.
            </p>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          ✕ Cancel Session
        </button>

        <div className="flex gap-3">
          {!isFirst && (
            <button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              disabled={saving}
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              ← Previous
            </button>
          )}

          {!isLast ? (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              {saving ? '⏳ Saving...' : '✅ Finish Interview'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
