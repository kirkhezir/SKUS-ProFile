import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Pages
import Members from './pages/Members';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Settings from './pages/Settings';

// Components
import Sidebar from './components/Sidebar';

/**
 * Main App Component
 * Handles routing and global layout state
 */
export default function App() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Initialize from localStorage or default to false for desktop
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobile, setIsMobile] = useState(false);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    // Only save preference on desktop to avoid mobile states being persisted
    if (window.innerWidth >= 1024) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }
  }, [sidebarCollapsed]);

  // Handle responsive behavior with better breakpoints
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640; // sm breakpoint
      const tablet = window.innerWidth >= 640 && window.innerWidth < 1024; // lg breakpoint
      const isSmallScreen = window.innerWidth < 1024;

      setIsMobile(mobile);

      // Auto-collapse sidebar on mobile and tablets for better UX
      if (mobile) {
        setSidebarCollapsed(true);
      } else if (tablet) {
        // On tablets, start with collapsed sidebar to maximize content space
        setSidebarCollapsed(true);
      } else {
        // On desktop, default to expanded but respect user preference
        // Only auto-expand if user hasn't manually collapsed
        const userCollapsedPreference = localStorage.getItem('sidebarCollapsed');
        if (userCollapsedPreference === null) {
          setSidebarCollapsed(false);
        }
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

      {/* Mobile/Tablet overlay */}
      {(isMobile || window.innerWidth < 1024) && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
          onTouchStart={() => setSidebarCollapsed(true)}
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
          min-h-screen
          ${sidebarCollapsed
            ? 'ml-0 sm:ml-0 lg:ml-16'
            : 'ml-0 sm:ml-0 lg:ml-64'
          }
        `}
      >
        {/* Mobile/Tablet Header - Minimal navigation only */}
        {(isMobile || window.innerWidth < 1024) && sidebarCollapsed && (
          <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between lg:hidden z-10 sticky top-0 shadow-sm">
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
                  flex-shrink-0
                  -ml-1
                "
                aria-label="Open navigation menu"
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
              {/* Page title - dynamic based on current route */}
              <h1 className="ml-2 text-lg font-semibold text-gray-900 truncate">
                {location.pathname === '/' ? 'Dashboard' :
                  location.pathname === '/members' ? 'Members' :
                    location.pathname === '/events' ? 'Events' :
                      location.pathname === '/settings' ? 'Settings' :
                        'Dashboard'}
              </h1>
            </div>

            {/* Mobile user profile */}
            <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm">
                A
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </header>
        )}

        <div className="flex-1 w-full h-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/events" element={<Events />} />
            <Route path="/settings" element={<Settings />} />
            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
