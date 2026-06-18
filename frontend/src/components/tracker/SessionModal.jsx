import React, { useState, useEffect } from 'react';
import { X, Loader2, Building2, User, MessageSquare, Target, FileText } from 'lucide-react';

const SessionModal = ({ isOpen, onClose, onSubmit, session = null }) => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [totalQuestions, setTotalQuestions] = useState('');
  const [attemptedQuestions, setAttemptedQuestions] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(50);
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Determine if this is completing an existing session
  const isCompleting = session && session.status === 'in_progress';
  const isViewingCompleted = session && session.status === 'completed';

  useEffect(() => {
    if (session) {
      setCompany(session.company || '');
      setRole(session.role || '');
      setTotalQuestions(session.totalQuestions || '');
      setAttemptedQuestions(session.attemptedQuestions || '');
      setConfidenceScore(session.confidenceScore || 50);
      setNotes(session.notes || '');
    } else {
      setCompany('');
      setRole('');
      setTotalQuestions('');
      setAttemptedQuestions('');
      setConfidenceScore(50);
      setNotes('');
    }
    setError('');
  }, [session, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session && (!company || !role)) {
      setError('Company and role are required');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const data = session
        ? {
            attemptedQuestions: Number(attemptedQuestions) || 0,
            totalQuestions: Number(totalQuestions) || 0,
            confidenceScore: Number(confidenceScore),
            notes
          }
        : {
            company,
            role,
            totalQuestions: Number(totalQuestions) || 0
          };

      await onSubmit(data, isCompleting ? 'complete' : session ? 'update' : 'create');
      onClose();
    } catch (err) {
      console.error('[SessionModal] Submit error:', err);
      setError(err.message || 'Failed to save session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConfidenceLabel = (score) => {
    if (score >= 80) return { text: 'Very Confident', color: 'text-emerald-400' };
    if (score >= 60) return { text: 'Fairly Confident', color: 'text-blue-400' };
    if (score >= 40) return { text: 'Needs Practice', color: 'text-amber-400' };
    return { text: 'Not Confident', color: 'text-rose-400' };
  };

  const confidenceLabel = getConfidenceLabel(confidenceScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl overflow-hidden shadow-2xl animate-fade-in my-8">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isViewingCompleted ? 'Session Summary' : isCompleting ? 'Complete Session' : session ? 'Update Session' : 'Start Practice Session'}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              {isViewingCompleted ? 'Review your completed session' : isCompleting ? 'Record your final results' : 'Prepare for your target company interview'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-6 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm p-4 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Company & Role (only for new sessions) */}
          {!session && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-400" /> Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Google, Microsoft..."
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-400" /> Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Software Engineer..."
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                  required
                />
              </div>
            </div>
          )}

          {/* Session info for existing sessions */}
          {session && (
            <div className="flex items-center gap-4 p-4 bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-white">{session.company}</p>
                <p className="text-xs text-slate-400">{session.role}</p>
              </div>
              <span className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                session.status === 'completed'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {session.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
              </span>
            </div>
          )}

          {/* Questions count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-brand-400" /> Total Questions
              </label>
              <input
                type="number"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(e.target.value)}
                placeholder="10"
                disabled={isViewingCompleted}
                className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors disabled:opacity-50"
              />
            </div>
            {(session) && (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Attempted
                </label>
                <input
                  type="number"
                  value={attemptedQuestions}
                  onChange={(e) => setAttemptedQuestions(e.target.value)}
                  placeholder="0"
                  disabled={isViewingCompleted}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors disabled:opacity-50"
                />
              </div>
            )}
          </div>

          {/* Confidence Score Slider */}
          {(session) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-brand-400" /> Confidence Score
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${confidenceLabel.color}`}>{confidenceScore}%</span>
                  <span className={`text-[10px] font-semibold ${confidenceLabel.color}`}>({confidenceLabel.text})</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={confidenceScore}
                onChange={(e) => setConfidenceScore(Number(e.target.value))}
                disabled={isViewingCompleted}
                className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-500 disabled:opacity-50"
              />
              <div className="flex justify-between text-[9px] text-slate-600 font-semibold">
                <span>Not Ready</span>
                <span>Moderate</span>
                <span>Very Ready</span>
              </div>
            </div>
          )}

          {/* Notes */}
          {(session) && (
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-400" /> Session Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Topics covered, weak areas, key learnings..."
                disabled={isViewingCompleted}
                className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors resize-none disabled:opacity-50"
              />
            </div>
          )}

          {/* Buttons */}
          {!isViewingCompleted && (
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-600 hover:bg-brand-500 disabled:bg-brand-600/60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-brand-500/10 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {isCompleting ? 'Complete Session' : session ? 'Save Progress' : 'Start Session'}
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SessionModal;
