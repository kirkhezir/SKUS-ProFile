import Members from './pages/Members'
import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1">
        <Members />
      </div>
    </div>
  )
}
