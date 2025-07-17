import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`h-screen bg-gray-800 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col`}
    >
      <button
        className="p-2 focus:outline-none hover:bg-gray-700"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <span>&#9776;</span>
        ) : (
          <span>&#10005;</span>
        )}
      </button>
      <nav className="flex-1 mt-4">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded justify-center md:justify-start">
              <span className="material-icons" title="Home">🏠</span>
              {!collapsed && <span className="ml-3">Home</span>}
            </Link>
          </li>
          <li>
            <Link to="/members" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded justify-center md:justify-start">
              <span className="material-icons" title="Members">👥</span>
              {!collapsed && <span className="ml-3">Members</span>}
            </Link>
          </li>
          {/* Add more links as needed */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
