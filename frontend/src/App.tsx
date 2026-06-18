import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import { Leaf, LayoutDashboard, Map as MapIcon, UploadCloud, Settings, Menu, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Field Monitoring', path: '/monitor', icon: <UploadCloud size={20} /> },
    { name: 'Farm Zones', path: '/zones', icon: <MapIcon size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-agri-card border-r border-slate-700 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 text-agri-primary">
          <Leaf size={28} className="animate-pulse" />
          <span className="text-xl font-bold text-white tracking-wide">AgriVision AI</span>
        </div>
        <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === item.path 
                ? 'bg-agri-primary/20 text-agri-primary border border-agri-primary/30' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-agri-primary to-agri-secondary p-[2px]">
              <div className="w-full h-full rounded-full bg-agri-card flex items-center justify-center font-bold text-sm">FA</div>
            </div>
            <div>
              <p className="text-sm font-semibold">Farmer Admin</p>
              <p className="text-xs text-slate-400">Green Acres Farm</p>
            </div>
         </div>
      </div>
    </div>
  );
};

const Header = ({ setIsOpen }: { setIsOpen: (val: boolean) => void }) => (
  <header className="sticky top-0 z-40 bg-agri-dark/80 backdrop-blur-md border-b border-slate-700 px-4 py-3 flex items-center justify-between">
    <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsOpen(true)}>
      <Menu size={24} />
    </button>
    <div className="ml-auto flex items-center gap-4">
       <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agri-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-agri-primary"></span>
      </span>
      <span className="text-sm font-medium text-slate-300">System Online</span>
    </div>
  </header>
);

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-agri-dark">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Decorative background gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-agri-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-agri-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <Header setIsOpen={setSidebarOpen} />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 z-10">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/monitor" element={
                <div className="glass-card p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <UploadCloud size={64} className="text-agri-primary mb-4" />
                  <h2 className="text-2xl font-bold mb-2">AI Field Monitoring</h2>
                  <p className="text-slate-400 max-w-md mb-6">Upload drone or smartphone images of your crops to run the full AI diagnostic pipeline (Disease, Weeds, Health, Moisture).</p>
                  <button className="btn-primary">Upload Field Image</button>
                </div>
              } />
              <Route path="/zones" element={<div className="glass-card p-8"><h2>Farm Zones Map (Leaflet Integration Here)</h2></div>} />
              <Route path="/settings" element={<div className="glass-card p-8"><h2>System Settings</h2></div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
