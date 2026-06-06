import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Reply, Archive, Trash2, Filter, MoreVertical, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import MessageCard from './MessageCard';

const AdvancedMessagingCenter = () => {
  const { toast } = useToast();
  const [activeMessage, setActiveMessage] = useState(1);
  const [replyText, setReplyText] = useState('');

  const mockMessages = [
    { id: 1, sender: 'John Doe', email: 'john@example.com', preview: 'I am interested in visiting the farm to see Apollo.', time: '10:30 AM', unread: true, tags: ['Horse Inquiry', 'Viewing Request'], status: 'New' },
    { id: 2, sender: 'Alice Smith', email: 'alice@example.com', preview: 'Do you offer international shipping to Europe?', time: 'Yesterday', unread: false, tags: ['Shipping', 'General'], status: 'Responded' },
    { id: 3, sender: 'Mark Johnson', email: 'mark@test.com', preview: 'Is the Friesian mare still available?', time: 'Oct 24', unread: false, tags: ['Horse Inquiry'], status: 'Archived' },
  ];

  const handleAction = (action) => {
    toast({
      title: action,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
    setReplyText('');
  };

  const selectedMsg = mockMessages.find(m => m.id === activeMessage);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Inbox</h2>
          <p className="text-gray-400">Manage all customer communications and inquiries.</p>
        </div>
      </div>

      <div className="bg-[#222] rounded-2xl border border-white/5 shadow-xl flex flex-col md:flex-row flex-1 overflow-hidden min-h-[600px] h-[calc(100vh-250px)]">
        {/* Sidebar List */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-white/5 bg-[#1a1a1a] flex flex-col">
          <div className="p-4 border-b border-white/5 space-y-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full bg-[#222] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 border-white/10 text-xs text-white hover:bg-white/5"><Filter className="w-3 h-3 mr-1"/> Filter</Button>
              <Button size="sm" variant="outline" className="border-white/10 text-xs text-white hover:bg-white/5"><MoreVertical className="w-3 h-3"/></Button>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {mockMessages.map((msg) => (
              <MessageCard 
                key={msg.id} 
                message={msg} 
                isActive={activeMessage === msg.id}
                onClick={() => setActiveMessage(msg.id)} 
              />
            ))}
          </div>
        </div>

        {/* Message Content */}
        {selectedMsg ? (
          <div className="flex-1 flex flex-col bg-[#222]">
            <div className="p-6 border-b border-white/5 shrink-0 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{selectedMsg.tags.join(', ')}</h3>
                <p className="text-sm text-gray-400">From: <span className="text-white font-medium">{selectedMsg.sender}</span> &lt;{selectedMsg.email}&gt;</p>
                <p className="text-xs text-gray-500 mt-1">{selectedMsg.time}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleAction('Archive Thread')} size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5"><Archive className="w-4 h-4" /></Button>
                <Button onClick={() => handleAction('Delete Thread')} size="sm" variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Message Bubble */}
              <div className="flex flex-col items-start max-w-2xl">
                <div className="bg-[#111] border border-white/5 rounded-2xl rounded-tl-none p-4 text-gray-300 text-sm">
                  <p>Hello,</p>
                  <p className="mt-2">{selectedMsg.preview}</p>
                  <p className="mt-2">Looking forward to your reply!</p>
                </div>
                <span className="text-xs text-gray-500 mt-2 ml-1">{selectedMsg.time}</span>
              </div>
            </div>
            
            <div className="p-4 border-t border-white/5 bg-[#1a1a1a] shrink-0">
              <div className="relative rounded-xl border border-white/10 bg-[#111] focus-within:border-blue-500/50 transition-colors overflow-hidden">
                <textarea 
                  rows="3" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${selectedMsg.sender}...`}
                  className="w-full bg-transparent py-3 px-4 text-sm text-white focus:outline-none resize-none"
                ></textarea>
                <div className="flex justify-between items-center px-4 py-2 bg-[#222] border-t border-white/5">
                  <span className="text-xs text-gray-500">Press Cmd+Enter to send</span>
                  <Button onClick={() => handleAction('Send Reply')} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    <Send className="w-4 h-4 mr-2" /> Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a message to read
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdvancedMessagingCenter;