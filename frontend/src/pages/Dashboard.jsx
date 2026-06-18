import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [dsaStats, setDsaStats] = useState(null);
  const [resumeStats, setResumeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all dashboard stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [companyRes, dsaRes, resumeRes] = await Promise.all([
          api.get('/companies/dashboard/stats'),
          api.get('/dsa/stats'),
          api.get('/resumes/stats'),
        ]);
        setStats(companyRes.data);
        setDsaStats(dsaRes.data);
        setResumeStats(resumeRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {getGreeting()}, {user?.name || 'Student'}! 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Here's your placement preparation overview
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Applications</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
            {stats?.totalCompanies || 0}
          </p>
          <Link to="/companies" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
            View all →
          </Link>
        </div>

        {/* DSA Solved */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">DSA Solved</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
            {dsaStats?.totalSolved || 0}
          </p>
          <div className="flex gap-2 mt-2 text-xs">
            <span className="text-green-600">E: {dsaStats?.difficultyCounts?.Easy || 0}</span>
            <span className="text-yellow-600">M: {dsaStats?.difficultyCounts?.Medium || 0}</span>
            <span className="text-red-600">H: {dsaStats?.difficultyCounts?.Hard || 0}</span>
          </div>
        </div>

        {/* Resumes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Resumes</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
            {resumeStats?.totalResumes || 0}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {resumeStats?.totalResumes > 0 ? `Latest: v${resumeStats.latestVersion}` : 'No uploads yet'}
          </p>
        </div>

        {/* Interviews */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Interviews</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
            {stats?.upcomingInterviews?.length || 0}
          </p>
          <Link to="/companies" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
            View schedule →
          </Link>
        </div>
      </div>

      {/* Upcoming Interviews list */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Upcoming Interviews</h2>
        {stats?.upcomingInterviews?.length > 0 ? (
          <div className="space-y-3">
            {stats.upcomingInterviews.map((interview) => (
              <div
                key={interview._id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{interview.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{interview.role}</p>
                </div>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {new Date(interview.interviewDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No upcoming interviews. Add interview dates in Company Tracker.</p>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to="/companies" className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">+ Add Company</p>
        </Link>
        <Link to="/dsa" className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">+ Log DSA Problem</p>
        </Link>
        <Link to="/resumes" className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Upload Resume</p>
        </Link>
        <Link to="/interviews" className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-center hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Practice Interview</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
