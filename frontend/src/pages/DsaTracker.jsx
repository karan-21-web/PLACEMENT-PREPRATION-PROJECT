import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DSAProblemModal from '../components/tracker/DSAProblemModal';

const TOPICS = ['All Topics', 'Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs', 'DP', 'Greedy', 'Backtracking', 'Sorting', 'Searching', 'Stack', 'Queue', 'Hashing', 'Math', 'Bit Manipulation', 'Other'];
const PLATFORMS = ['All Platforms', 'LeetCode', 'GFG', 'Coding Ninjas', 'Codeforces', 'HackerRank', 'Other'];

const DsaTracker = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [topic, setTopic] = useState('All Topics');
  const [platform, setPlatform] = useState('All Platforms');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Fetch problems from API
  const fetchProblems = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (difficulty !== 'all') params.difficulty = difficulty;
      if (topic !== 'All Topics') params.topic = topic;
      if (platform !== 'All Platforms') params.platform = platform;
      const response = await api.get('/dsa', { params });
      setProblems(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  // Fetch when filters change
  useEffect(() => {
    fetchProblems();
  }, [difficulty, topic, platform]);

  // Debounced search - waits 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) fetchProblems(); // skip initial duplicate call
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // CRUD operations
  const handleAdd = async (data) => {
    const response = await api.post('/dsa', data);
    setProblems([response.data, ...problems]);
  };

  const handleUpdate = async (data) => {
    const response = await api.put(`/dsa/${selectedProblem._id}`, data);
    setProblems(problems.map(p => p._id === selectedProblem._id ? response.data : p));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this problem?')) {
      await api.delete(`/dsa/${id}`);
      setProblems(problems.filter(p => p._id !== id));
    }
  };

  const handleModalSubmit = async (formData) => {
    if (selectedProblem) {
      await handleUpdate(formData);
    } else {
      await handleAdd(formData);
    }
  };

  // Difficulty badge color
  const getDiffColor = (d) => {
    if (d === 'Easy') return 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400';
    if (d === 'Medium') return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">DSA Tracker</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your solved problems</p>
        </div>
        <button
          onClick={() => { setSelectedProblem(null); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Log Problem
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{problems.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
          <p className="text-xs text-green-600">Easy</p>
          <p className="text-xl font-bold text-green-600">{problems.filter(p => p.difficulty === 'Easy').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
          <p className="text-xs text-yellow-600">Medium</p>
          <p className="text-xl font-bold text-yellow-600">{problems.filter(p => p.difficulty === 'Medium').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
          <p className="text-xs text-red-600">Hard</p>
          <p className="text-xl font-bold text-red-600">{problems.filter(p => p.difficulty === 'Hard').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search problem..."
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
          <option value="all">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select value={topic} onChange={(e) => setTopic(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
          {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
          {error} <button onClick={fetchProblems} className="ml-2 underline">Retry</button>
        </div>
      )}

      {/* Problem list */}
      {loading ? (
        <p className="text-center py-20 text-gray-500">Loading problems...</p>
      ) : problems.length > 0 ? (
        <div className="space-y-3">
          {problems.map((problem) => (
            <div key={problem._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-gray-800 dark:text-white">{problem.title}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDiffColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <div className="flex gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{problem.topic}</span>
                  <span>{problem.platform}</span>
                  <span>{new Date(problem.solvedAt).toLocaleDateString()}</span>
                </div>
                {problem.notes && <p className="text-xs text-gray-400 mt-1 truncate">{problem.notes}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                {problem.link && (
                  <a href={problem.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Link</a>
                )}
                <button onClick={() => { setSelectedProblem(problem); setIsModalOpen(true); }} className="text-xs text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(problem._id)} className="text-xs text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-20 text-gray-500">No problems found. Start logging your DSA practice!</p>
      )}

      {/* Modal */}
      <DSAProblemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} problem={selectedProblem} />
    </div>
  );
};

export default DsaTracker;
