import React, { useState, useEffect } from 'react';

const TOPICS = ['Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs', 'DP', 'Greedy', 'Backtracking', 'Sorting', 'Searching', 'Stack', 'Queue', 'Hashing', 'Math', 'Bit Manipulation', 'Other'];
const PLATFORMS = ['LeetCode', 'GFG', 'Coding Ninjas', 'Codeforces', 'HackerRank', 'Other'];

const DSAProblemModal = ({ isOpen, onClose, onSubmit, problem = null }) => {
  const [formData, setFormData] = useState({
    title: '', difficulty: 'Medium', topic: 'Arrays',
    platform: 'LeetCode', notes: '', link: '',
    solvedAt: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fill form for editing
  useEffect(() => {
    if (problem) {
      setFormData({
        title: problem.title || '',
        difficulty: problem.difficulty || 'Medium',
        topic: problem.topic || 'Arrays',
        platform: problem.platform || 'LeetCode',
        notes: problem.notes || '',
        link: problem.link || '',
        solvedAt: problem.solvedAt ? new Date(problem.solvedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        title: '', difficulty: 'Medium', topic: 'Arrays',
        platform: 'LeetCode', notes: '', link: '',
        solvedAt: new Date().toISOString().split('T')[0],
      });
    }
    setError('');
  }, [problem, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Problem title is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {problem ? 'Edit Problem' : 'Log Problem'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        {error && (
          <div className="mx-5 mt-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Two Sum" className={inputClass} required />
          </div>

          {/* Difficulty buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
            <div className="flex gap-2">
              {['Easy', 'Medium', 'Hard'].map(d => (
                <button key={d} type="button" onClick={() => setFormData({ ...formData, difficulty: d })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    formData.difficulty === d
                      ? d === 'Easy' ? 'bg-green-100 border-green-300 text-green-700' : d === 'Medium' ? 'bg-yellow-100 border-yellow-300 text-yellow-700' : 'bg-red-100 border-red-300 text-red-700'
                      : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic</label>
              <select name="topic" value={formData.topic} onChange={handleChange} className={inputClass}>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform</label>
              <select name="platform" value={formData.platform} onChange={handleChange} className={inputClass}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem Link</label>
              <input type="url" name="link" value={formData.link} onChange={handleChange} placeholder="https://leetcode.com/..." className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Solved Date</label>
              <input type="date" name="solvedAt" value={formData.solvedAt} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} placeholder="Approach, time complexity..." className={inputClass + ' resize-none'} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">
              {loading ? 'Saving...' : (problem ? 'Save Changes' : 'Log Problem')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DSAProblemModal;
