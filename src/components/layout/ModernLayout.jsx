import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaHeart, FaHistory, FaHome, FaInfoCircle } from 'react-icons/fa';

const SidebarLink = ({ icon: Icon, label, active, onClick }) => (
  <motion.button
    whileHover={{ x: 5 }}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all
      ${active ? 'bg-accent-500/20 text-accent-500' : 'text-white/60 hover:text-white'}`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </motion.button>
);

const ModernLayout = ({ children }) => {
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-primary-900/50 backdrop-blur-xl border-r border-white/5 p-4 hidden md:block"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-400 to-highlight-500 bg-clip-text text-transparent">
            CosmicLens
          </h1>
          <p className="text-sm text-white/60">Explore the Universe</p>
        </div>

        <nav className="space-y-2">
          <SidebarLink 
            icon={FaHome} 
            label="Home" 
            active={activePage === 'home'}
            onClick={() => setActivePage('home')}
          />
          <SidebarLink 
            icon={FaHistory} 
            label="History" 
            active={activePage === 'history'}
            onClick={() => setActivePage('history')}
          />
          <SidebarLink 
            icon={FaHeart} 
            label="Favorites" 
            active={activePage === 'favorites'}
            onClick={() => setActivePage('favorites')}
          />
          <SidebarLink 
            icon={FaInfoCircle} 
            label="About" 
            active={activePage === 'about'}
            onClick={() => setActivePage('about')}
          />
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ModernLayout; 