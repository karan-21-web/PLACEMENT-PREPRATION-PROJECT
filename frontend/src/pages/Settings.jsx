import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

const Settings = () => {
  const { logout } = useAuth();

  // Dark mode state - read from current DOM
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage app preferences</p>
      </div>

      {/* Dark Mode Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white">🌙 Dark Mode</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Switch between light and dark theme
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              darkMode ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                darkMode ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Account section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-medium text-gray-800 dark:text-white mb-4">Account</h3>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          🚪 Logout
        </button>
        <p className="text-xs text-gray-400 mt-2">You will be redirected to the login page.</p>
      </div>
    </div>
  );
};

export default Settings;
