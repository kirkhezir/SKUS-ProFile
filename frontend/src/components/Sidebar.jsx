import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`h-screen bg-white fixed left-0 top-0 z-30 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      } flex flex-col border-r border-gray-200 shadow-sm`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">SKUS ProFile</span>
          </div>
        )}
        <button
          className="p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 text-gray-500 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          <li>
            <Link
              to="/"
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                isActive('/') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {!collapsed && <span className="ml-3 font-medium">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/members"
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                isActive('/members')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`w-6 h-6 ${isActive('/members') ? 'text-blue-600' : 'text-gray-400'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {!collapsed && <span className="ml-3 font-medium">Members</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/events"
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                isActive('/events')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`w-6 h-6 ${isActive('/events') ? 'text-blue-600' : 'text-gray-400'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {!collapsed && <span className="ml-3 font-medium">Events</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                isActive('/settings')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`w-6 h-6 ${isActive('/settings') ? 'text-blue-600' : 'text-gray-400'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {!collapsed && <span className="ml-3 font-medium">Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className={`border-t border-gray-200 p-4 ${collapsed ? 'items-center' : ''}`}>
        <div className={`flex ${collapsed ? 'justify-center' : 'items-center space-x-3'}`}>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            A
          </div>
          {!collapsed && (
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-700">Admin User</h3>
              <p className="text-xs text-gray-500">admin@memberhub.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
