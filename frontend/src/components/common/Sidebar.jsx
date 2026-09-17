import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Briefcase,
  Code2,
  FileText,
  MessageSquare,
  BarChart3,
  User,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Sidebar navigation items
const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Companies', path: '/companies', icon: Briefcase },
  { name: 'DSA Tracker', path: '/dsa', icon: Code2 },
  { name: 'Resumes', path: '/resumes', icon: FileText },
  { name: 'Interviews', path: '/interviews', icon: MessageSquare },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ open, onClose }) => {
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay - dark background when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          ${isCollapsed ? 'md:w-[70px] w-64' : 'w-64'}
          flex flex-col
        `}
      >
        {/* Logo and Collapse Toggle */}
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 dark:border-gray-700 h-16 min-h-[64px]">
          <div className="flex items-center justify-center">
            {isCollapsed ? (
              <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg">
                <span className="text-white font-bold text-lg">P</span>
              </div>
            ) : (
              <h1 className="text-xl font-bold text-blue-600 truncate flex items-center gap-2">
                <div className="w-7 h-7 flex items-center justify-center bg-blue-600 rounded-md">
                   <span className="text-white font-bold text-sm">P</span>
                </div>
                PrepPilot
              </h1>
            )}
          </div>
          
          <div className="flex items-center">
            {/* Collapse button on desktop */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className={`hidden md:flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${isCollapsed ? 'absolute -right-3 top-[18px] bg-white border border-gray-200 rounded-full w-6 h-6 items-center justify-center shadow-sm z-50' : ''}`}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            {/* Close button on mobile */}
            <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 relative right-[-8px]">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="relative group">
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center ${isCollapsed ? 'md:justify-center md:px-0 px-3' : 'px-3'} py-2.5 
                    rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`
                  }
                >
                  <Icon className={`w-5 h-5 shrink-0 ${!isCollapsed ? 'mr-3' : 'md:mr-0 mr-3'}`} />
                  
                  {/* Text */}
                  <span className={`truncate ${isCollapsed ? 'md:hidden' : ''}`}>{item.name}</span>
                </NavLink>

                {/* Tooltip on hover when collapsed */}
                {isCollapsed && (
                  <div className="absolute inset-y-0 left-12 hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    <div className="bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap ml-2">
                       {item.name}
                       <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-gray-900"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout button at bottom */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 relative group">
          <button
            onClick={logout}
            className={`flex items-center ${isCollapsed ? 'md:justify-center md:px-0 px-3' : 'px-3'} py-2.5 w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200`}
          >
            <LogOut className={`w-5 h-5 shrink-0 ${!isCollapsed ? 'mr-3' : 'md:mr-0 mr-3'}`} />
            
            <span className={`truncate ${isCollapsed ? 'md:hidden' : ''}`}>Logout</span>
          </button>
           
          {/* Logout Tooltip */}
          {isCollapsed && (
            <div className="absolute top-[18px] left-12 hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              <div className="bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap ml-2">
                Logout
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-gray-900"></div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
