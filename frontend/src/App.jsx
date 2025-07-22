import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Members from './pages/Members';
import Dashboard from './pages/Dashboard';

// Components
import Sidebar from './components/Sidebar';

/**
 * Main App Component
 * Handles routing and global layout state
 */
export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      setIsMobile(mobile);

      // Auto-collapse sidebar on mobile and small tablets
      if (mobile) {
        setSidebarCollapsed(true);
      } else if (tablet) {
        // On tablets, start with collapsed sidebar to give more space
        setSidebarCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        isMobile={isMobile}
      />

      {/* Mobile overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
          aria-label="Close sidebar"
        />
      )}

      {/* Main content */}
      <main
        className={`
          flex-1 
          transition-all 
          duration-300 
          ease-in-out
          overflow-auto
          flex
          flex-col
          ${sidebarCollapsed
            ? 'ml-0 md:ml-16'
            : 'ml-0 md:ml-64'
          }
        `}
      >
        {/* Mobile Header */}
        {isMobile && sidebarCollapsed && (
          <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden z-10">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="
                  p-2 
                  rounded-lg 
                  hover:bg-gray-100 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500 
                  focus:ring-offset-2
                  transition-colors
                  duration-200
                  mr-3
                "
                aria-label="Open sidebar menu"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">SKUS ProFile</h1>
            </div>

            {/* Mobile user avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
          </header>
        )}

        <div className="flex-1 w-full h-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            {/* Add more routes as needed */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
