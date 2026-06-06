import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Star, Link as LinkIcon, Settings, LogOut, Menu, X, Rabbit as Horse, Search, Image as ImageIcon, Briefcase, FileCode, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'horses', label: 'Horses', icon: Horse },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'affiliates', label: 'Affiliates', icon: LinkIcon },
    { id: 'team', label: 'Team', icon: Briefcase },
    { id: 'about', label: 'About Page', icon: Info },
    { id: 'seo', label: 'SEO Settings', icon: Search },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'carousel', label: 'Carousels', icon: ImageIcon },
    { id: 'content', label: 'Content Blocks', icon: FileCode },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#111] border-r border-white/10 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="text-xl font-['Playfair_Display'] font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-[#d4af37] rounded-lg flex items-center justify-center text-black">D</span>
            Dream Black
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-[#d4af37] text-black font-semibold shadow-lg' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors duration-200"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;