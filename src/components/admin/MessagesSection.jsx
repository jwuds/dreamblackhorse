import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Search, Reply, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const MessagesSection = () => {
  const { toast } = useToast();

  const handleAction = (action) => {
    toast({
      title: action,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const mockMessages = [
    { id: 1, sender: 'John Doe', email: 'john@example.com', preview: 'I am interested in visiting the farm...', time: '10:30 AM', unread: true },
    { id: 2, sender: 'Alice Smith', email: 'alice@example.com', preview: 'Do you offer international shipping?', time: 'Yesterday', unread: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Messages</h2>
          <p className="text-gray-400">Direct contact messages from the website.</p>
        </div>
      </div>

      <div className="bg-[#222] rounded-2xl border border-white/5 shadow-xl luxury-border overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Message List Sidebar */}
        <div className="w-full md:w-1/3 border-r border-white/5 bg-[#1a1a1a]">
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full bg-[#222] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-white/30"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-full">
            {mockMessages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => handleAction(`Open message from ${msg.sender}`)}
                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${msg.unread ? 'bg-white/[0.03]' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-medium ${msg.unread ? 'text-white' : 'text-gray-300'}`}>{msg.sender}</span>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                <p className={`text-sm truncate ${msg.unread ? 'text-gray-300' : 'text-gray-500'}`}>{msg.preview}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Detail View */}
        <div className="flex-1 p-8 flex flex-col bg-[#222]">
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/5">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Visiting the farm</h3>
              <p className="text-gray-400">From: <span className="text-white">John Doe</span> (john@example.com)</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleAction('Reply to message')} variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl">
                <Reply className="w-4 h-4 mr-2" /> Reply
              </Button>
              <Button onClick={() => handleAction('Delete message')} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 text-gray-300 space-y-4">
            <p>Hello,</p>
            <p>I am interested in visiting the farm to see your current selection of Friesian stallions. I am an experienced rider looking for a top-tier breeding prospect.</p>
            <p>Could you let me know your availability for next week?</p>
            <p>Best regards,<br/>John Doe</p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5">
            <textarea 
              rows="4" 
              placeholder="Type your reply here..."
              className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 transition-colors resize-none mb-4"
            ></textarea>
            <Button onClick={() => handleAction('Send Reply')} className="bg-white text-black hover:bg-gray-200 rounded-xl font-semibold px-8">
              Send Reply
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessagesSection;