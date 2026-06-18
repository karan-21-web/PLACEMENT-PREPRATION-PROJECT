import React, { useState, useEffect } from 'react';

const CompanyModal = ({ isOpen, onClose, onSubmit, company = null }) => {
  const [formData, setFormData] = useState({
    name: '', role: '', packageLpa: '', status: 'wishlist',
    aptitudeStatus: 'pending', dsaStatus: 'pending',
    resumeStatus: 'pending', interviewStatus: 'pending',
    applicationLink: '', notes: '', interviewDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fill form when editing existing company
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        role: company.role || '',
        packageLpa: company.packageLpa || '',
        status: company.status || 'wishlist',
        aptitudeStatus: company.aptitudeStatus || 'pending',
        dsaStatus: company.dsaStatus || 'pending',
        resumeStatus: company.resumeStatus || 'pending',
        interviewStatus: company.interviewStatus || 'pending',
        applicationLink: company.applicationLink || '',
        notes: company.notes || '',
        interviewDate: company.interviewDate ? new Date(company.interviewDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        name: '', role: '', packageLpa: '', status: 'wishlist',
        aptitudeStatus: 'pending', dsaStatus: 'pending',
        resumeStatus: 'pending', interviewStatus: 'pending',
        applicationLink: '', notes: '', interviewDate: '',
      });
    }
    setError('');
  }, [company, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      setError('Company name and role are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit({
        ...formData,
        packageLpa: formData.packageLpa ? Number(formData.packageLpa) : 0,
        interviewDate: formData.interviewDate || null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  // Simple select component to reduce repetition
  const SelectField = ({ label, name, options }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <select name={name} value={formData[name]} onChange={handleChange}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );

  const inputClass = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {company ? 'Edit Company' : 'Add Company'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        {error && (
          <div className="mx-5 mt-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Google" className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="SDE" className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Package (LPA)</label>
              <input type="number" name="packageLpa" value={formData.packageLpa} onChange={handleChange} placeholder="12" className={inputClass} />
            </div>
          </div>

          {/* Status fields */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <SelectField label="Status" name="status" options={[
              { value: 'wishlist', label: 'Wishlist' }, { value: 'applied', label: 'Applied' },
              { value: 'preparing', label: 'Preparing' }, { value: 'interviewing', label: 'Interviewing' },
              { value: 'offered', label: 'Offered' }, { value: 'rejected', label: 'Rejected' },
            ]} />
            <SelectField label="Aptitude" name="aptitudeStatus" options={[
              { value: 'pending', label: 'Pending' }, { value: 'completed', label: 'Completed' },
              { value: 'failed', label: 'Failed' }, { value: 'n/a', label: 'N/A' },
            ]} />
            <SelectField label="DSA" name="dsaStatus" options={[
              { value: 'pending', label: 'Pending' }, { value: 'completed', label: 'Completed' },
              { value: 'failed', label: 'Failed' }, { value: 'n/a', label: 'N/A' },
            ]} />
            <SelectField label="Resume" name="resumeStatus" options={[
              { value: 'pending', label: 'Pending' }, { value: 'submitted', label: 'Submitted' },
              { value: 'shortlisted', label: 'Shortlisted' }, { value: 'rejected', label: 'Rejected' },
            ]} />
            <SelectField label="Interview" name="interviewStatus" options={[
              { value: 'pending', label: 'Pending' }, { value: 'round_1', label: 'Round 1' },
              { value: 'round_2', label: 'Round 2' }, { value: 'hr', label: 'HR' },
              { value: 'completed', label: 'Completed' },
            ]} />
          </div>

          {/* Extra fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interview Date</label>
              <input type="date" name="interviewDate" value={formData.interviewDate} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Application Link</label>
              <input type="url" name="applicationLink" value={formData.applicationLink} onChange={handleChange} placeholder="https://..." className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Any notes..." className={inputClass + ' resize-none'} />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">
              {loading ? 'Saving...' : (company ? 'Save Changes' : 'Add Company')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyModal;
