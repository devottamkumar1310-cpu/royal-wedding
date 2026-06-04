import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  const { session, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-blue flex items-center justify-center text-champagne-gold font-serif">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>Loading...</motion.div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-[100dvh] bg-[#071e2c] text-ivory flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-royal-blue/80 border-b md:border-b-0 md:border-r border-champagne-gold/20 p-6 flex flex-col shrink-0">
        <h2 className="text-xl font-serif text-champagne-gold uppercase tracking-widest mb-8">Royal Admin</h2>
        
        <nav className="flex-1 space-y-2">
          {[
            { name: 'Dashboard', path: '/admin' },
            { name: 'Blessings', path: '/admin/blessings' },
            { name: 'Gallery', path: '/admin/gallery' },
            { name: 'RSVPs', path: '/admin/rsvps' },
            { name: 'Content', path: '/admin/content' }
          ].map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `w-full block text-left px-4 py-3 rounded uppercase tracking-wider text-sm font-sans transition-colors ${isActive ? 'bg-champagne-gold/20 text-champagne-gold' : 'text-ivory/70 hover:text-champagne-gold hover:bg-white/5'}`}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <button 
          onClick={signOut}
          className="mt-auto px-4 py-3 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded uppercase tracking-wider text-sm transition-colors text-left"
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
