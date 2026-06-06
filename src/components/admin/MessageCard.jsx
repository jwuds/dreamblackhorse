import React from 'react';
import { Tag, Clock } from 'lucide-react';

const MessageCard = ({ message, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${isActive ? 'bg-white/10' : ''} ${message.unread ? 'bg-white/[0.03]' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`font-medium ${message.unread ? 'text-white' : 'text-gray-300'}`}>{message.sender}</span>
        <span className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" /> {message.time}
        </span>
      </div>
      <p className={`text-sm truncate mb-3 ${message.unread ? 'text-gray-300' : 'text-gray-500'}`}>{message.preview}</p>
      
      <div className="flex gap-2 flex-wrap">
        {message.tags.map(tag => (
          <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/20">
            <Tag className="w-3 h-3 mr-1" /> {tag}
          </span>
        ))}
        {message.status === 'Responded' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/20 text-green-300 border border-green-500/20">
            Replied
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageCard;