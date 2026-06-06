import React from 'react';
import { motion } from 'framer-motion';
import { Save, Shield, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SettingsSection = () => {
  const { toast } = useToast();

  const handleAction = (action) => {
    toast({
      title: action,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Settings</h2>
          <p className="text-gray-400">Configure global site settings and admin access.</p>
        </div>
        <Button onClick={() => handleAction('Save Global Settings')} className="bg-white text-black hover:bg-gray-200 rounded-xl font-semibold px-6">
          <Save className="w-4 h-4 mr-2" /> Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#222] rounded-2xl border border-white/5 p-6 shadow-xl luxury-border">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <SettingsIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-xl font-bold text-white font-['Playfair_Display']">Site Options</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Site Name</label>
                  <input type="text" defaultValue="Dream Black Horse Farm" className="w-full bg-[#111] border border-white/10 rounded-xl py-2 px-4 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
                  <input type="email" defaultValue="info@dreamblackhorse.com" className="w-full bg-[#111] border border-white/10 rounded-xl py-2 px-4 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Site Description</label>
                <textarea rows="2" defaultValue="Premium Friesian horse breeder" className="w-full bg-[#111] border border-white/10 rounded-xl py-2 px-4 text-white resize-none"></textarea>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="maintenance" className="w-4 h-4 rounded bg-[#111] border-gray-600" />
                <label htmlFor="maintenance" className="text-sm text-gray-300">Enable Maintenance Mode</label>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-[#222] rounded-2xl border border-white/5 p-6 shadow-xl luxury-border h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <Shield className="w-5 h-5 text-gray-400" />
              <h3 className="text-xl font-bold text-white font-['Playfair_Display']">Admin Users</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-[#111] rounded-lg border border-white/5">
                <div>
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-gray-500">admin@farm.com</p>
                </div>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Superadmin</span>
              </div>
              <Button onClick={() => handleAction('Add New Admin')} variant="outline" className="w-full border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 rounded-xl">
                + Add User
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsSection;