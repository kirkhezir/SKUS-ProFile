import Members from './pages/Members';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div 
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
        </Routes>
      </div>
    </div>
  );
}
