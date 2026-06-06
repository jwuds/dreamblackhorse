import React, { useState, useRef, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Menu, X, User, ChevronDown, LogOut, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const LOGO_URL = "https://horizons-cdn.hostinger.com/1ee4ac76-1453-4dcc-a280-1aeb1d67f81b/9a6ccfbea5cec07ff7085d5e702c493d.jpg";

const AdminLayout = ({ sidebar, children }) => {
  const { currentUser, logout } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#111] text-white flex overflow-hidden font-['Plus_Jakarta_Sans']">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-[#1a1a1a] border-r border-white/10 
        transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Render the passed Sidebar component */}
        {sidebar && React.cloneElement(sidebar, { 
          setActiveSection: (section) => {
            sidebar.props.setActiveSection(section);
            if (isMobile) setIsSidebarOpen(false);
          }
        })}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-[#1a1a1a]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 lg:px-8 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 -ml-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Logo" className="h-8 w-8 rounded-full object-cover border border-white/20 hidden sm:block" />
              <h1 className="text-xl font-bold text-white font-['Playfair_Display']">Dream Black Horse</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 relative" ref={profileRef}>
            <Link to="/" target="_blank" className="hidden sm:flex items-center gap-2 text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
              <ExternalLink size={16} /> View Site
            </Link>

            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 bg-[#111] px-2 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 hover:border-white/30 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
                <User size={16} />
              </div>
              <div className="flex-col items-start hidden sm:flex">
                <span className="text-sm font-semibold text-white leading-none">Admin</span>
                <span className="text-xs text-gray-500 mt-0.5 max-w-[120px] truncate">{currentUser?.email}</span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-3 w-64 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-6 py-4 border-b border-white/10 bg-[#111]">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">{currentUser?.email}</p>
                  </div>
                  <div className="p-2">
                    <button onClick={() => logout(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                      <LogOut size={16} />
                      Secure Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;