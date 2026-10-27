import React, { useState } from 'react';
import api from '../../services/api';

/**
 * LeetCodeConnect
 *
 * Lets the user enter their public LeetCode username, fetches their
 * profile stats + recent solved problems via the PrepPilot backend,
 * and syncs those problems into the DSA Tracker.
 *
 * Props:
 *  - onSyncDone(addedCount) : called after a successful sync so the
 *    parent page can refresh its problem list.
 */
const LeetCodeConnect = ({ onSyncDone }) => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);   // fetched data
  const [fetchLoading, setFetchLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [syncResult, setSyncResult] = useState('');  // success message

  const inputClass =
    'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm ' +
    'bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500';

  // ── Step 1: Fetch LeetCode profile ──
  const handleFetch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setFetchLoading(true);
    setFetchError('');
    setProfile(null);
    setSyncResult('');

    try {
      const res = await api.get(`/dsa/leetcode/${username.trim()}`);
      setProfile(res.data);
    } catch (err) {
      setFetchError(err.message || 'Failed to fetch LeetCode profile. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  // ── Step 2: Sync problems into DSA Tracker ──
  const handleSync = async () => {
    if (!profile || profile.problems.length === 0) return;

    setSyncLoading(true);
    setSyncResult('');

    try {
      const res = await api.post('/dsa/leetcode/sync', {
        problems: profile.problems,
      });
      setSyncResult(res.data.message);
      onSyncDone(res.data.added);   // tell parent to refresh
    } catch (err) {
      setSyncResult('❌ Sync failed: ' + (err.message || 'Please try again.'));
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">🔗 Connect LeetCode</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Enter your public LeetCode username to view your stats and import recent solved problems.
        </p>
      </div>

      {/* Username input */}
      <form onSubmit={handleFetch} className="flex gap-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your LeetCode username"
          className={inputClass + ' flex-1'}
          required
        />
        <button
          type="submit"
          disabled={fetchLoading || !username.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          {fetchLoading ? 'Fetching...' : 'Connect'}
        </button>
      </form>

      {/* Fetch error */}
      {fetchError && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-200 dark:border-red-800">
          {fetchError}
        </div>
      )}

      {/* Profile panel — shown after successful fetch */}
      {profile && (
        <div className="space-y-4">

          {/* Stats card */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">LeetCode</p>
            <p className="font-semibold text-gray-800 dark:text-white">@{profile.username}</p>

            <div className="grid grid-cols-4 gap-3 mt-3">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800 dark:text-white">{profile.stats.total}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Solved</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-600">{profile.stats.easy}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Easy</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-yellow-600">{profile.stats.medium}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Medium</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-red-600">{profile.stats.hard}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hard</p>
              </div>
            </div>
          </div>

          {/* Recent problems list + sync */}
          {profile.problems.length > 0 ? (
            <div className="space-y-3">
              {/* API limitation note */}
              {profile.note && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-3 py-2">
                  ⚠️ {profile.note}
                </p>
              )}

              {/* Sync result message */}
              {syncResult && (
                <div className="text-sm p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                  ✅ {syncResult}
                </div>
              )}

              {/* Sync button + count */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recent solved — {profile.problems.length} problem{profile.problems.length !== 1 ? 's' : ''} available
                </p>
                <button
                  onClick={handleSync}
                  disabled={syncLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
                >
                  {syncLoading ? 'Syncing...' : `⬇ Sync ${profile.problems.length} Problems`}
                </button>
              </div>

              {/* Problem list */}
              <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                {profile.problems.map((problem) => (
                  <div
                    key={problem.titleSlug}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <p className="text-sm text-gray-800 dark:text-white truncate pr-3">{problem.title}</p>
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                    >
                      Open ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recent accepted submissions found for this profile.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LeetCodeConnect;
