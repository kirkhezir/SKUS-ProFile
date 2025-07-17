import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = (props) => {
  // Accept collapsed and setCollapsed as props, fallback to local state if not provided
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const collapsed = props && props.collapsed !== undefined ? props.collapsed : localCollapsed;
  const setCollapsed = props && props.setCollapsed ? props.setCollapsed : setLocalCollapsed;

  return (
    <div
      className={`h-screen bg-white text-gray-800 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col border-r shadow-md fixed top-0 left-0 z-30`}
    >
      <button
        className="p-2 focus:outline-none hover:bg-gray-100 rounded"
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
            <Link to="/" className="flex items-center px-4 py-2 hover:bg-gray-100 rounded justify-center md:justify-start">
              {/* Heroicons: Squares2x2 for Dashboard */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75h6.5v6.5h-6.5v-6.5zm10 0h6.5v6.5h-6.5v-6.5zm-10 10h6.5v6.5h-6.5v-6.5zm10 0h6.5v6.5h-6.5v-6.5z" />
              </svg>
              {!collapsed && <span className="ml-3">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link to="/members" className="flex items-center px-4 py-2 hover:bg-gray-100 rounded justify-center md:justify-start">
              {/* Flaticon group icon for Members */}
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor">
                <g data-name="Capa 3" id="Capa_3">
                  <path d="M382.54,386.41H129.76a6,6,0,0,1-6-6A131.08,131.08,0,0,1,152,298.71a132.39,132.39,0,0,1,236.57,81.7A6,6,0,0,1,382.54,386.41Zm-246.63-12H376.39a120.37,120.37,0,0,0-215-68.29A119,119,0,0,0,135.91,374.41Z"/>
                  <path d="M256.15,255.52a65,65,0,1,1,65-65A65,65,0,0,1,256.15,255.52Zm0-117.93a53,53,0,1,0,53,53A53,53,0,0,0,256.15,137.59Z"/>
                  <path d="M156.69,308.42H68.45a6,6,0,0,1-6-6,89.75,89.75,0,0,1,166-47.27,6,6,0,0,1-3.55,9,121.22,121.22,0,0,0-63.52,42A6,6,0,0,1,156.69,308.42Zm-82-12h79.13a133.52,133.52,0,0,1,60-41.46A77.75,77.75,0,0,0,74.68,296.42Z"/>
                  <path d="M152.19,221.69a45.07,45.07,0,1,1,45.06-45.06A45.11,45.11,0,0,1,152.19,221.69Zm0-78.13a33.07,33.07,0,1,0,33.06,33.07A33.1,33.1,0,0,0,152.19,143.56Z"/>
                  <path d="M443.55,307.11h-89a6,6,0,0,1-4.67-2.23,121.14,121.14,0,0,0-63.44-41,6,6,0,0,1-3.63-8.9,89.74,89.74,0,0,1,166.72,46.13A6,6,0,0,1,443.55,307.11Zm-86.15-12h79.92a77.75,77.75,0,0,0-139.83-40.49A133.61,133.61,0,0,1,357.4,295.11Z"/>
                  <path d="M359.81,220.39a45.07,45.07,0,1,1,45.07-45.07A45.11,45.11,0,0,1,359.81,220.39Zm0-78.14a33.07,33.07,0,1,0,33.07,33.07A33.1,33.1,0,0,0,359.81,142.25Z"/>
                </g>
              </svg>
              {!collapsed && <span className="ml-3">Members</span>}
            </Link>
          </li>
          {/* Add more links as needed */}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
