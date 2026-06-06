import React from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CanonicalURLPanel = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Configuration Saved", description: "Canonical URL settings have been updated." });
  };

  const mockData = [
    { path: '/horses/friesian-apollo', canonical: 'https://dreamblackhorse.com/horse/apollo', status: 'custom' },
    { path: '/horses?category=dressage', canonical: 'https://dreamblackhorse.com/horses', status: 'auto' },
    { path: '/blog/care-tips-2026', canonical: 'https://dreamblackhorse.com/blog/care-tips', status: 'custom' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Canonical URLs</h2>
          <p className="text-gray-400">Manage duplicate content routing and canonical tags.</p>
        </div>
        <Button onClick={handleSave} className="bg-white text-black hover:bg-gray-200 rounded-xl font-semibold px-6">
          <Save className="w-4 h-4 mr-2" /> Save Settings
        </Button>
      </div>

      <div className="bg-[#222] p-6 rounded-2xl border border-white/5 shadow-xl mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Global Configuration</h3>
        <div className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
          <div>
            <p className="font-medium text-white">Auto-generate Canonical Tags</p>
            <p className="text-sm text-gray-400">Automatically set self-referencing canonical URLs for all new pages.</p>
          </div>
          <div className="relative inline-block w-12 h-6 rounded-full bg-blue-600">
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform translate-x-6"></span>
          </div>
        </div>
      </div>

      <div className="bg-[#222] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1a1a1a]">
          <h3 className="text-lg font-bold text-white">Custom Canonical Rules</h3>
          <Button onClick={() => toast({title: "Add Rule", description: "Not implemented yet"})} size="sm" variant="outline" className="border-white/10 text-white">Add Rule</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#111] text-gray-400">
                <th className="p-4 font-medium">Page Path</th>
                <th className="p-4 font-medium">Canonical URL Target</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockData.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] text-gray-300">
                  <td className="p-4 font-medium text-white">{row.path}</td>
                  <td className="p-4 text-gray-400 flex items-center gap-2"><LinkIcon className="w-3 h-3"/> {row.canonical}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${row.status === 'auto' ? 'bg-gray-800 text-gray-300' : 'bg-blue-900/40 text-blue-300'}`}>{row.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <Button onClick={() => toast({title:"Edit", description: "Not implemented"})} size="sm" variant="ghost" className="text-gray-400 hover:text-white">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default CanonicalURLPanel;