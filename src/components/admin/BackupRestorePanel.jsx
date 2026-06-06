import React from 'react';
import { motion } from 'framer-motion';
import { DatabaseBackup, DownloadCloud, UploadCloud, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const BackupRestorePanel = () => {
  const { toast } = useToast();

  const handleAction = (action) => {
    toast({
      title: action,
      description: "🚧 This feature requires the Supabase integration to be fully completed! 🚀",
    });
  };

  const backups = [
    { id: 1, date: '2026-02-21 03:00 AM', size: '45.2 MB', type: 'Automated' },
    { id: 2, date: '2026-02-20 03:00 AM', size: '44.8 MB', type: 'Automated' },
    { id: 3, date: '2026-02-19 14:30 PM', size: '44.5 MB', type: 'Manual' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Backup & Restore</h2>
          <p className="text-gray-400">Safeguard your farm's data and manage restore points.</p>
        </div>
        <Button onClick={() => handleAction('Create Manual Backup')} className="bg-white text-black hover:bg-gray-200 rounded-xl font-semibold px-6">
          <DatabaseBackup className="w-4 h-4 mr-2" /> Create Backup Now
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#222] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-xl font-bold text-white">Restore Points</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/20 text-gray-400 text-sm">
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Size</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-white/[0.02] text-gray-300">
                    <td className="p-4 text-white font-medium">{backup.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${backup.type === 'Automated' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        {backup.type}
                      </span>
                    </td>
                    <td className="p-4">{backup.size}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <Button onClick={() => handleAction('Download Backup')} size="sm" variant="outline" className="border-white/10 text-gray-300 hover:text-white"><DownloadCloud className="w-4 h-4" /></Button>
                      <Button onClick={() => handleAction('Restore Backup')} size="sm" variant="outline" className="border-orange-500/20 text-orange-400 hover:bg-orange-500/10"><RefreshCw className="w-4 h-4 mr-1" /> Restore</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#222] rounded-2xl border border-white/5 p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Backup Schedule</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Status</span>
                <span className="text-green-400 text-sm font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Frequency</span>
                <span className="text-white text-sm font-medium">Daily</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Next Run</span>
                <span className="text-white text-sm font-medium">03:00 AM</span>
              </div>
              <Button onClick={() => handleAction('Change Schedule')} variant="outline" className="w-full border-white/10 mt-2 text-white">Edit Schedule</Button>
            </div>
          </div>

          <div className="bg-red-500/10 rounded-2xl border border-red-500/20 p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-bold mb-1">Important Notice</h3>
                <p className="text-red-200/70 text-sm leading-relaxed">
                  Restoring from a backup will overwrite all current database records. This operation cannot be undone. Please ensure you download a manual backup before performing any restorations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BackupRestorePanel;