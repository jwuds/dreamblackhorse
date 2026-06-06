import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { BarChartMock, LineChartMock, PieChartMock } from './AnalyticsCharts';

const AnalyticsPanel = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('30d');

  const trafficData = [{ label: 'Mon', value: 120 }, { label: 'Tue', value: 200 }, { label: 'Wed', value: 150 }, { label: 'Thu', value: 300 }, { label: 'Fri', value: 250 }, { label: 'Sat', value: 400 }, { label: 'Sun', value: 350 }];
  const horseViews = [{ label: 'Apollo', value: 1200 }, { label: 'Midnight', value: 850 }, { label: 'Luna', value: 640 }, { label: 'Shadow', value: 420 }];
  const inquiryTypes = [{ label: 'Sales', value: 40 }, { label: 'Breeding', value: 35 }, { label: 'General', value: 25 }];

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Analytics & Reports</h2>
          <p className="text-gray-400">Track your farm's digital performance and engagement.</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-[#222] border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-white/30"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button onClick={handleExport} className="bg-white text-black hover:bg-gray-200 rounded-xl font-semibold">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#222] p-6 rounded-2xl border border-white/5 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl"><TrendingUp className="w-6 h-6 text-blue-400" /></div>
            <span className="text-green-400 text-sm font-medium flex items-center">+12.5%</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">24,592</h3>
          <p className="text-gray-400 text-sm">Total Page Views</p>
        </div>
        {/* Additional stat cards can go here */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#222] p-6 rounded-2xl border border-white/5 shadow-xl">
          <LineChartMock title="Traffic Trends" />
        </div>
        <div className="bg-[#222] p-6 rounded-2xl border border-white/5 shadow-xl">
          <BarChartMock data={horseViews} title="Top Performing Horses (Views)" />
        </div>
        <div className="bg-[#222] p-6 rounded-2xl border border-white/5 shadow-xl lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PieChartMock data={inquiryTypes} title="Inquiry Demographics" />
            <div className="bg-[#111] p-6 rounded-xl border border-white/5">
              <h4 className="text-white font-medium mb-6">Blog Engagement</h4>
              <div className="space-y-4">
                {['Choosing a Friesian', 'Winter Care Tips', 'Breeding Standards'].map((post, i) => (
                  <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg border border-white/5">
                    <span className="text-gray-300 text-sm">{post}</span>
                    <span className="text-white text-sm font-medium">{1200 - (i*300)} reads</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPanel;