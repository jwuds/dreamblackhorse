import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Link as LinkIcon, ShoppingBag, Mail } from 'lucide-react';

const InternalLinks = ({ links = [] }) => {
  if (!links || links.length === 0) return null;

  const getIcon = (type) => {
    switch(type) {
      case 'product': return ShoppingBag;
      case 'page': return Mail;
      default: return LinkIcon;
    }
  };

  return (
    <div className="my-10 bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/10 rounded-2xl p-6 md:p-8">
      <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-6">Related Links & Resources</h3>
      <div className="flex flex-col gap-3">
        {links.map((link, idx) => {
          const Icon = getIcon(link.type);
          return (
            <Link 
              key={idx} 
              to={link.url} 
              className="flex items-center justify-between p-4 bg-[#222] rounded-xl hover:bg-[#2a2a2a] border border-white/5 hover:border-[#d4af37]/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-black/50 rounded-lg text-gray-400 group-hover:text-[#d4af37] transition-colors">
                  <Icon size={20} />
                </div>
                <span className="text-gray-200 font-medium group-hover:text-white transition-colors">{link.label}</span>
              </div>
              <ArrowRight size={18} className="text-gray-500 group-hover:text-[#d4af37] transform group-hover:translate-x-1 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default InternalLinks;