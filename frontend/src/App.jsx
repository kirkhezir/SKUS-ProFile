import Members from './pages/Members';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import React from 'react';

export default function App() {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard collapsed={collapsed} />} />
          <Route path="/members" element={<Members />} />
        </Routes>
      </div>
    </div>
  );
}
