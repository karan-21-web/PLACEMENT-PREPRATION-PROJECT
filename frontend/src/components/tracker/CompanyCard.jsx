import React from 'react';

// Simple company card component
const CompanyCard = ({ company, onEdit, onDelete }) => {
  // Color for status badge
  const getStatusColor = (status) => {
    const colors = {
      wishlist: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
      applied: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      preparing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      interviewing: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      offered: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || colors.wishlist;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
      {/* Status badge and company name */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(company.status)}`}>
            {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
          </span>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-2">{company.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{company.role}</p>
        </div>
      </div>

      {/* Package */}
      {company.packageLpa > 0 && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          💰 {company.packageLpa} LPA
        </p>
      )}

      {/* Interview date */}
      {company.interviewDate && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          📅 Interview: {new Date(company.interviewDate).toLocaleDateString()}
        </p>
      )}

      {/* Notes */}
      {company.notes && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 line-clamp-2">{company.notes}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={onEdit}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-sm text-red-600 hover:underline"
        >
          Delete
        </button>
        {company.applicationLink && (
          <a
            href={company.applicationLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-gray-500 hover:underline ml-auto"
          >
            Apply Link ↗
          </a>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;
