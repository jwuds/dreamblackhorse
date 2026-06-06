import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Server, Shield, Mail, Bell, Activity, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SiteSettingsPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email Templates', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System Health', icon: Activity },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Platform Settings</h2>
          <p className="text-gray-400">Configure global site settings, emails, and system operations.</p>
        </div>
        <Button onClick={handleSave} className="bg-white text-black hover:bg-gray-200 rounded-xl font-semibold px-6">
          <Save className="w-4 h-4 mr-2" /> Save Configuration
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-2 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === tab.id 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-[#222] rounded-2xl border border-white/5 p-6 shadow-xl">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">General Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Site Name</label>
                  <input type="text" defaultValue="Dream Black Horse Farm" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-white/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Support Email</label>
                  <input type="email" defaultValue="support@dreamblackhorse.com" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-white/30" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Global Notice Bar (Optional)</label>
                  <input type="text" placeholder="e.g., Free shipping on all international orders this week!" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-white/30" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">System Operations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#111] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-medium">Cache Management</h4>
                    <p className="text-xs text-gray-500">Clear site cache to reflect latest changes</p>
                  </div>
                  <Button onClick={() => handleSave()} size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/10">Clear Cache</Button>
                </div>
                <div className="bg-[#111] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-medium">Database Optimization</h4>
                    <p className="text-xs text-gray-500">Reindex DB for faster queries</p>
                  </div>
                  <Button onClick={() => handleSave()} size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/10">Optimize</Button>
                </div>
                <div className="md:col-span-2 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mt-4">
                  <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2"><Server className="w-4 h-4"/> System Health</h4>
                  <p className="text-sm text-gray-300">All systems operational. Uptime: 99.9%. Last backup completed 2 hours ago.</p>
                </div>
              </div>
            </div>
          )}

          {['security', 'email', 'notifications'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="w-12 h-12 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Module Loading</h3>
              <p className="text-gray-400 text-sm max-w-md">This configuration module is being prepared for the Supabase backend integration.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SiteSettingsPanel;