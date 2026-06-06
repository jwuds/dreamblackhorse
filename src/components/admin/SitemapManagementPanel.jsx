import React from 'react';
import { motion } from 'framer-motion';
import { Map, RefreshCw, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SitemapManagementPanel = () => {
  const { toast } = useToast();

  const handleAction = (action) => {
    toast({ title: action, description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };

  const mockSitemap = [
    { url: '/', priority: '1.0', changefreq: 'daily', lastmod: '2026-02-21' },
    { url: '/horses', priority: '0.9', changefreq: 'daily', lastmod: '2026-02-21' },
    { url: '/about', priority: '0.6', changefreq: 'monthly', lastmod: '2026-01-15' },
    { url: '/blog', priority: '0.8', changefreq: 'weekly', lastmod: '2026-02-18' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Sitemap Management</h2>
          <p className="text-gray-400">Control search engine crawling and index submission.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleAction('Regenerate Sitemap')} variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
          </Button>
          <Button onClick={() => handleAction('Download Sitemap')} className="bg-white text-black hover:bg-gray-200">
            <Download className="w-4 h-4 mr-2" /> Download XML
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#222] p-6 rounded-2xl border border-white/5 shadow-xl">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-xl font-bold text-white">Valid & Active</span>
          </div>
        </div>
        <div className="bg-[#222] p-6 rounded-2xl border border-white/5 shadow-xl">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Total URLs</h3>
          <span className="text-2xl font-bold text-white">124</span>
        </div>
        <div className="bg-[#222] p-6 rounded-2xl border border-white/5 shadow-xl">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Last Submitted</h3>
          <span className="text-xl font-bold text-white">Feb 21, 2026</span>
        </div>
      </div>

      <div className="bg-[#222] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1a1a1a]">
          <h3 className="text-lg font-bold text-white">Sitemap Entries (sitemap.xml)</h3>
          <input type="text" placeholder="Search URLs..." className="bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#111] text-gray-400">
                <th className="p-4 font-medium">URL Path</th>
                <th className="p-4 font-medium">Priority</th>
                <th className="p-4 font-medium">Change Freq</th>
                <th className="p-4 font-medium">Last Modified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockSitemap.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] text-gray-300 transition-colors">
                  <td className="p-4 font-medium text-white">{row.url}</td>
                  <td className="p-4">{row.priority}</td>
                  <td className="p-4">{row.changefreq}</td>
                  <td className="p-4">{row.lastmod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-blue-400 shrink-0" />
          <div>
            <h4 className="text-blue-400 font-bold mb-2">Search Console Integration</h4>
            <p className="text-blue-200/80 text-sm mb-4">
              Connect your Google Search Console and Bing Webmaster Tools to automatically submit sitemaps when significant content changes occur.
            </p>
            <Button onClick={() => handleAction('Connect Webmaster Tools')} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Connect Tools</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SitemapManagementPanel;