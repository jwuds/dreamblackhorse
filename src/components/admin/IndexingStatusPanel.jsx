import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Search, Activity } from 'lucide-react';
import { LineChartMock } from './AnalyticsCharts';

const IndexingStatusPanel = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Indexing Status</h2>
          <p className="text-gray-400">Monitor search engine visibility and crawl coverage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Indexed', value: '118', icon: Search, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { title: 'Not Indexed', value: '6', icon: Activity, color: 'text-gray-400', bg: 'bg-white/5' },
          { title: 'Pending', value: '2', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { title: 'Crawl Errors', value: '0', icon: AlertTriangle, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#222] p-6 rounded-2xl border border-white/5 shadow-xl">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
            <span className="text-3xl font-bold text-white">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#222] p-6 rounded-2xl border border-white/5 shadow-xl">
        <LineChartMock title="Indexing Progress Over Time" />
      </div>

      <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-2xl">
         <h3 className="text-lg font-bold text-white mb-4">Coverage Issues</h3>
         <p className="text-sm text-gray-400">No critical coverage issues detected. All primary farm pages and horse listings are successfully indexed by major search engines.</p>
      </div>
    </motion.div>
  );
};

export default IndexingStatusPanel;