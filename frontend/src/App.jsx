import Members from './pages/Members';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
        </Routes>
      </div>
    </div>
  );
}
