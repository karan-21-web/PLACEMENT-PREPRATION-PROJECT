import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CompanyCard from '../components/tracker/CompanyCard';
import CompanyModal from '../components/tracker/CompanyModal';

const CompanyTracker = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Fetch companies from API
  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // CRUD operations
  const handleCreate = async (data) => {
    const response = await api.post('/companies', data);
    setCompanies([response.data, ...companies]);
  };

  const handleUpdate = async (data) => {
    const response = await api.put(`/companies/${selectedCompany._id}`, data);
    setCompanies(companies.map(c => c._id === selectedCompany._id ? response.data : c));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this company?')) {
      await api.delete(`/companies/${id}`);
      setCompanies(companies.filter(c => c._id !== id));
    }
  };

  const handleModalSubmit = async (formData) => {
    if (selectedCompany) {
      await handleUpdate(formData);
    } else {
      await handleCreate(formData);
    }
  };

  // Filter companies based on search and status
  const filteredCompanies = companies.filter(company => {
    const matchesSearch =
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['all', 'wishlist', 'applied', 'preparing', 'interviewing', 'offered', 'rejected'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Company Tracker</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your job applications</p>
        </div>
        <button
          onClick={() => { setSelectedCompany(null); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Company
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company or role..."
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statuses.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
          {error}
          <button onClick={fetchCompanies} className="ml-2 underline">Retry</button>
        </div>
      )}

      {/* Company list */}
      {loading ? (
        <p className="text-center py-20 text-gray-500">Loading companies...</p>
      ) : filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCompanies.map(company => (
            <CompanyCard
              key={company._id}
              company={company}
              onEdit={() => { setSelectedCompany(company); setIsModalOpen(true); }}
              onDelete={() => handleDelete(company._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">
            {companies.length === 0 ? "No companies added yet. Click 'Add Company' to start." : 'No companies match your filters.'}
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        company={selectedCompany}
      />
    </div>
  );
};

export default CompanyTracker;
