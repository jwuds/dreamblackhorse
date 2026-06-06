import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Twitter, Facebook, Linkedin } from 'lucide-react';

const SocialMediaPreviewPanel = () => {
  const [platform, setPlatform] = useState('facebook');
  
  const mockData = {
    title: 'Majestic Friesian Stallion For Sale',
    description: 'Discover Apollo, our premium 5-year-old Friesian stallion with exceptional pedigree and training. Perfect for dressage.',
    url: 'dreamblackhorse.com/horse/apollo',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=1200&h=630'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Social Preview</h2>
          <p className="text-gray-400">See how your links appear when shared on social networks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-[#222] rounded-2xl border border-white/5 p-6 shadow-xl space-y-6">
          <h3 className="text-xl font-bold text-white mb-4">Live Editor</h3>
          
          <div>
             <label className="flex justify-between text-sm font-medium text-gray-400 mb-2">
               <span>Title</span>
               <span className={mockData.title.length > 60 ? 'text-red-400' : 'text-green-400'}>{mockData.title.length}/60</span>
             </label>
             <input type="text" value={mockData.title} readOnly className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white" />
          </div>

          <div>
             <label className="flex justify-between text-sm font-medium text-gray-400 mb-2">
               <span>Description</span>
               <span className={mockData.description.length > 160 ? 'text-red-400' : 'text-green-400'}>{mockData.description.length}/160</span>
             </label>
             <textarea rows="4" value={mockData.description} readOnly className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white resize-none"></textarea>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#222] rounded-2xl border border-white/5 p-6 shadow-xl flex flex-col">
          <div className="flex gap-2 mb-8">
            {[
              { id: 'facebook', icon: Facebook, label: 'Facebook' },
              { id: 'twitter', icon: Twitter, label: 'Twitter' },
              { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  platform === p.id ? 'bg-white text-black' : 'bg-[#111] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                <p.icon className="w-4 h-4" /> {p.label}
              </button>
            ))}
          </div>

          <div className="flex-1 flex items-center justify-center bg-[#111] rounded-xl border border-white/5 p-4 md:p-12">
            {/* Mock Preview Cards */}
            {platform === 'facebook' && (
              <div className="w-full max-w-[500px] bg-[#242526] rounded-xl overflow-hidden border border-white/10 font-sans">
                <img src={mockData.image} alt="Preview" className="w-full h-[260px] object-cover" />
                <div className="p-4 bg-[#3a3b3c]">
                  <p className="text-[#b0b3b8] text-xs uppercase mb-1 truncate">{mockData.url}</p>
                  <h4 className="text-[#e4e6eb] font-semibold text-base leading-tight mb-1 truncate">{mockData.title}</h4>
                  <p className="text-[#b0b3b8] text-sm line-clamp-2">{mockData.description}</p>
                </div>
              </div>
            )}
            {platform === 'twitter' && (
              <div className="w-full max-w-[500px] bg-black rounded-2xl overflow-hidden border border-gray-800 font-sans">
                <img src={mockData.image} alt="Preview" className="w-full h-[260px] object-cover border-b border-gray-800" />
                <div className="p-4">
                  <p className="text-gray-500 text-sm mb-1 truncate">{mockData.url}</p>
                  <h4 className="text-white font-bold text-base leading-tight mb-1 truncate">{mockData.title}</h4>
                  <p className="text-gray-500 text-sm line-clamp-2">{mockData.description}</p>
                </div>
              </div>
            )}
            {platform === 'linkedin' && (
              <div className="w-full max-w-[500px] bg-[#1d2226] rounded-xl overflow-hidden border border-white/10 font-sans">
                <img src={mockData.image} alt="Preview" className="w-full h-[260px] object-cover" />
                <div className="p-4 bg-[#1d2226] border-t border-white/10">
                  <h4 className="text-[#e9e9e9] font-semibold text-base leading-tight mb-1 truncate">{mockData.title}</h4>
                  <p className="text-[#bfbfbf] text-xs uppercase truncate">{mockData.url}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SocialMediaPreviewPanel;