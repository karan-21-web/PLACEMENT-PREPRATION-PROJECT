import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Analytics = () => {
  const [dsaStats, setDsaStats] = useState(null);
  const [companyStats, setCompanyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dsaRes, companyRes] = await Promise.all([
          api.get('/dsa/stats'),
          api.get('/companies/dashboard/stats'),
        ]);
        setDsaStats(dsaRes.data);
        setCompanyStats(companyRes.data);
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading analytics...</div>;
  }

  // Pie chart data - DSA by difficulty
  const pieData = [
    { name: 'Easy', value: dsaStats?.difficultyCounts?.Easy || 0 },
    { name: 'Medium', value: dsaStats?.difficultyCounts?.Medium || 0 },
    { name: 'Hard', value: dsaStats?.difficultyCounts?.Hard || 0 },
  ];
  const PIE_COLORS = ['#22c55e', '#eab308', '#ef4444']; // green, yellow, red

  // Bar chart data - Companies by status
  const barData = companyStats?.statusCounts
    ? Object.entries(companyStats.statusCounts).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        count: value,
      }))
    : [];

  const totalDSA = dsaStats?.totalSolved || 0;
  const totalCompanies = companyStats?.totalCompanies || 0;
  const offers = companyStats?.statusCounts?.offered || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your preparation statistics</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">DSA Solved</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalDSA}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Companies</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalCompanies}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Offers</p>
          <p className="text-2xl font-bold text-green-600">{offers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Interviews</p>
          <p className="text-2xl font-bold text-blue-600">{companyStats?.upcomingInterviews?.length || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart - DSA by Difficulty */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">DSA by Difficulty</h3>
          {totalDSA > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-16">No DSA data yet. Start solving problems!</p>
          )}
        </div>

        {/* Bar Chart - Companies by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Companies by Status</h3>
          {totalCompanies > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <XAxis dataKey="name" fontSize={12} tick={{ fill: '#6b7280' }} />
                <YAxis allowDecimals={false} tick={{ fill: '#6b7280' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-16">No company data yet. Start tracking!</p>
          )}
        </div>
      </div>

      {/* Top DSA topics */}
      {dsaStats?.topicDistribution && Object.keys(dsaStats.topicDistribution).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top DSA Topics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(dsaStats.topicDistribution)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([topic, count]) => (
                <div key={topic} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{topic}</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
