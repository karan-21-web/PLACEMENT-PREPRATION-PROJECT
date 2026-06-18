import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600">404</h1>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
