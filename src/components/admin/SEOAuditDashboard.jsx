import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SEOAuditDashboard = () => {
  const { toast } = useToast();

  const handleFix = (issue) => {
    toast({
      title: `Fixing: ${issue}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#222] p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#333" strokeWidth="10" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="50.24" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">80</span>
              <span className="text-xs text-gray-400">/ 100</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Overall SEO Score</h3>
          <p className="text-sm text-gray-400">Good, but has room for improvement</p>
        </div>

        <div className="md:col-span-2 bg-[#222] p-6 rounded-2xl border border-white/5 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" /> Action Items
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-white text-sm font-medium">3 Broken Links Found</p>
                  <p className="text-xs text-gray-400">Pages returning 404 errors</p>
                </div>
              </div>
              <Button onClick={() => handleFix('Broken Links')} size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5">Review</Button>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-white text-sm font-medium">Missing Alt Text on 12 Images</p>
                  <p className="text-xs text-gray-400">Affects accessibility and image search</p>
                </div>
              </div>
              <Button onClick={() => handleFix('Alt Text')} size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5">Review</Button>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white text-sm font-medium">Mobile Responsiveness</p>
                  <p className="text-xs text-gray-400">All pages passed mobile-friendly test</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOAuditDashboard;