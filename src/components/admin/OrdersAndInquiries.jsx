import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Search, Eye, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const OrdersAndInquiries = () => {
  const { toast } = useToast();

  const handleAction = (action) => {
    toast({
      title: action,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const mockInquiries = [
    { id: 1, name: 'Eleanor Vance', subject: 'Inquiry about Apollo', date: 'Oct 24, 2023', status: 'New' },
    { id: 2, name: 'Arthur Pendelton', subject: 'Viewing appointment', date: 'Oct 22, 2023', status: 'Responded' },
    { id: 3, name: 'Sarah Jenkins', subject: 'Shipping to Texas', date: 'Oct 20, 2023', status: 'Archived' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Orders & Inquiries</h2>
          <p className="text-gray-400">Manage customer inquiries and purchase requests.</p>
        </div>
      </div>

      <div className="bg-[#222] rounded-2xl border border-white/5 shadow-xl luxury-border overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
              className="w-full bg-[#111] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Subject</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-white/[0.02] transition-colors group text-gray-300">
                  <td className="p-4 font-medium text-white">{inquiry.name}</td>
                  <td className="p-4">{inquiry.subject}</td>
                  <td className="p-4 text-sm text-gray-500">{inquiry.date}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      inquiry.status === 'New' ? 'bg-blue-500/20 text-blue-400' : 
                      inquiry.status === 'Responded' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleAction('View Inquiry')} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleAction('Archive Inquiry')} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
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

export default OrdersAndInquiries;