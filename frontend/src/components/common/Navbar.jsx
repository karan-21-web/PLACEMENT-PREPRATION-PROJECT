import React from 'react';
import useAuth from '../../hooks/useAuth';
import { Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6">
      {/* Left side - hamburger menu for mobile */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* App title on mobile */}
      <h2 className="md:hidden text-lg font-semibold text-gray-800 dark:text-white">PrepPilot</h2>

      {/* Spacer for desktop */}
      <div className="hidden md:block" />

      {/* Right side - user info */}
      <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
          {user?.name || 'User'}
        </span>
      </Link>
    </header>
  );
};

export default Navbar;
