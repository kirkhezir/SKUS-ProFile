import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div
        className={`h-screen bg-white fixed left-0 top-0 z-30 transition-all duration-300 overflow-hidden ${
          collapsed ? 'w-16' : 'w-64'
        } ${
          isMobile && collapsed ? '-translate-x-full' : 'translate-x-0'
        } flex flex-col border-r border-gray-200 shadow-lg`}
      >
        {/* Logo Section */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} h-16 px-4 border-b border-gray-200 bg-white`}>
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-800">SKUS ProFile</span>
            </div>
          )}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={`group relative flex items-center px-3 py-3 rounded-lg transition-all duration-200 min-h-[48px] ${
                  isActive('/') 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => isMobile && setCollapsed(true)}
              >
                <div className={`p-2 rounded-md ${isActive('/') ? 'bg-blue-100' : 'group-hover:bg-gray-100'} flex-shrink-0`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`w-5 h-5 ${isActive('/') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                {!collapsed && <span className="ml-3 font-medium text-sm sm:text-base">Dashboard</span>}
                {collapsed && (
                  <div className="fixed left-16 rounded-md px-3 py-2 ml-2 bg-gray-900 text-white text-sm invisible opacity-0 scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap shadow-lg z-50">
                    Dashboard
                  </div>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/members"
                className={`group relative flex items-center px-3 py-3 rounded-lg transition-all duration-200 min-h-[48px] ${
                  isActive('/members')
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => isMobile && setCollapsed(true)}
              >
                <div className={`p-2 rounded-md ${isActive('/members') ? 'bg-blue-100' : 'group-hover:bg-gray-100'} flex-shrink-0`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`w-5 h-5 ${isActive('/members') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                {!collapsed && <span className="ml-3 font-medium text-sm sm:text-base">Members</span>}
                {collapsed && (
                  <div className="fixed left-16 rounded-md px-3 py-2 ml-2 bg-gray-900 text-white text-sm invisible opacity-0 scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap shadow-lg z-50">
                    Members
                  </div>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className={`group relative flex items-center px-3 py-3 rounded-lg transition-all duration-200 min-h-[48px] ${
                  isActive('/events')
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => isMobile && setCollapsed(true)}
              >
                <div className={`p-2 rounded-md ${isActive('/events') ? 'bg-blue-100' : 'group-hover:bg-gray-100'} flex-shrink-0`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`w-5 h-5 ${isActive('/events') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {!collapsed && <span className="ml-3 font-medium text-sm sm:text-base">Events</span>}
                {collapsed && (
                  <div className="fixed left-16 rounded-md px-3 py-2 ml-2 bg-gray-900 text-white text-sm invisible opacity-0 scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap shadow-lg z-50">
                    Events
                  </div>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`group relative flex items-center px-3 py-3 rounded-lg transition-all duration-200 min-h-[48px] ${
                  isActive('/settings')
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => isMobile && setCollapsed(true)}
              >
                <div className={`p-2 rounded-md ${isActive('/settings') ? 'bg-blue-100' : 'group-hover:bg-gray-100'} flex-shrink-0`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`w-5 h-5 ${isActive('/settings') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                {!collapsed && <span className="ml-3 font-medium text-sm sm:text-base">Settings</span>}
                {collapsed && (
                  <div className="fixed left-16 rounded-md px-3 py-2 ml-2 bg-gray-900 text-white text-sm invisible opacity-0 scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap shadow-lg z-50">
                    Settings
                  </div>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className={`border-t border-gray-200 p-4 ${collapsed ? 'items-center' : ''}`}>
          <div className={`flex ${collapsed ? 'justify-center' : 'items-center space-x-3'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm flex-shrink-0">
              A
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-700 truncate">Admin User</h3>
                <p className="text-xs text-gray-500 truncate">admin@memberhub.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Button */}
      {isMobile && collapsed && (
        <button
          className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setCollapsed(false)}
          aria-label="Open menu"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </>
  );
};

export default Sidebar;
