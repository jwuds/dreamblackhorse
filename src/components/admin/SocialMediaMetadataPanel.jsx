import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Image as ImageIcon, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SocialMediaMetadataPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('global');

  const handleSave = () => {
    toast({ title: "Metadata Saved", description: "Your social media configurations have been updated." });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Social Media Metadata</h2>
          <p className="text-gray-400">Configure Open Graph, Twitter Cards, and social profiles.</p>
        </div>
        <Button onClick={handleSave} className="bg-white text-black hover:bg-gray-200 rounded-xl font-semibold px-6">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-px">
        {['global', 'profiles', 'overrides'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            className={`pb-4 px-2 text-sm font-medium transition-colors relative capitalize ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            {tab} Settings
            {activeTab === tab && <motion.div layoutId="socialTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
          </button>
        ))}
      </div>

      <div className="bg-[#222] rounded-2xl border border-white/5 p-6 shadow-xl">
        {activeTab === 'global' && (
          <div className="space-y-6 max-w-4xl">
            <h3 className="text-xl font-bold text-white mb-6">Default Open Graph Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Default OG Title</label>
                <input type="text" defaultValue="Dream Black Horse Farm" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-white/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Default Site Name</label>
                <input type="text" defaultValue="DreamBlackHorse" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-white/30" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Default OG Description</label>
                <textarea rows="3" defaultValue="Premium Friesian horse breeding and sales. Experience the elegance of black horses." className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-white/30 resize-none"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Default Share Image</label>
                <div className="flex gap-4 items-center p-4 border border-white/10 rounded-xl bg-[#111]">
                  <div className="w-24 h-24 bg-[#222] rounded-lg border border-dashed border-white/20 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-2">Recommended size: 1200 x 630 pixels</p>
                    <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">Upload Image</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mt-10 mb-6 border-t border-white/10 pt-8">Twitter Card Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Card Type</label>
                <select className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-white/30">
                  <option>summary_large_image</option>
                  <option>summary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Twitter Site Handle</label>
                <input type="text" defaultValue="@dreamblackhorse" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-white/30" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profiles' && (
          <div className="space-y-4">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-white">Connected Profiles</h3>
               <Button onClick={() => toast({title:"Add Profile", description:"🚧 This feature isn't implemented yet!"})} size="sm" variant="outline" className="border-white/10 text-white"><Plus className="w-4 h-4 mr-2"/> Add Profile</Button>
             </div>
             {['Facebook', 'Instagram', 'Twitter', 'YouTube'].map(network => (
               <div key={network} className="flex items-center gap-4 p-4 bg-[#111] rounded-xl border border-white/5">
                 <Share2 className="w-5 h-5 text-gray-500" />
                 <div className="w-32 text-sm font-medium text-white">{network}</div>
                 <input type="text" defaultValue={`https://${network.toLowerCase()}.com/dreamblackhorse`} className="flex-1 bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
               </div>
             ))}
          </div>
        )}
        
        {activeTab === 'overrides' && (
           <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
             <p>Page-level metadata overrides loading...</p>
             <p className="text-sm mt-2">Prepared for Supabase integration.</p>
           </div>
        )}
      </div>
    </motion.div>
  );
};

export default SocialMediaMetadataPanel;