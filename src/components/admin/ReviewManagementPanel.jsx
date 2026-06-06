import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, MessageSquare, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReviews } from '@/contexts/ReviewsContext';
import ReviewForm from './ReviewForm';
import MatchForm from './MatchForm';

const ReviewManagementPanel = () => {
  const { reviews, matches, addReview, updateReview, deleteReview, togglePublishReview, addMatch, updateMatch, deleteMatch, togglePublishMatch } = useReviews();
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'matches'
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(id);
    }
  };

  const handleDeleteMatch = (id) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      deleteMatch(id);
    }
  };

  const handleSaveReview = (data) => {
    if (editingItem) updateReview(editingItem.id, data);
    else addReview(data);
    setIsFormOpen(false);
  };

  const handleSaveMatch = (data) => {
    if (editingItem) updateMatch(editingItem.id, data);
    else addMatch(data);
    setIsFormOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Reviews & Matches</h2>
          <p className="text-gray-400">Manage client testimonials and successful horse matches.</p>
        </div>
        {!isFormOpen && (
          <Button onClick={handleCreateNew} className="bg-white text-black hover:bg-gray-200 rounded-xl px-6">
            <Plus className="w-4 h-4 mr-2" /> New {activeTab === 'reviews' ? 'Review' : 'Match'}
          </Button>
        )}
      </div>

      {!isFormOpen && (
        <div className="flex gap-4 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'reviews' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <MessageSquare className="w-4 h-4" /> Client Reviews
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'matches' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Heart className="w-4 h-4" /> Successful Matches
          </button>
        </div>
      )}

      {isFormOpen ? (
        activeTab === 'reviews' 
          ? <ReviewForm initialData={editingItem} onSave={handleSaveReview} onCancel={() => setIsFormOpen(false)} />
          : <MatchForm initialData={editingItem} onSave={handleSaveMatch} onCancel={() => setIsFormOpen(false)} />
      ) : (
        <div className="bg-[#222] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#111] text-gray-400">
                  <th className="p-4 font-medium">{activeTab === 'reviews' ? 'Client Name' : 'Horse & Client'}</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">{activeTab === 'reviews' ? 'Date' : 'Order'}</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(activeTab === 'reviews' ? reviews : matches).map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] text-gray-300">
                    <td className="p-4 font-medium text-white flex items-center gap-3">
                      <img src={item.image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        {activeTab === 'reviews' ? item.name : `${item.horseName} & ${item.clientName}`}
                        {activeTab === 'reviews' && <div className="text-xs text-yellow-500">{'★'.repeat(item.rating)}</div>}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${item.published ? 'bg-green-900/40 text-green-400' : 'bg-orange-900/40 text-orange-400'}`}>
                        {item.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4">
                      {activeTab === 'reviews' ? new Date(item.date).toLocaleDateString() : item.order}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <Button size="icon" variant="ghost" className="text-blue-400 hover:text-blue-300" onClick={() => handleEdit(item)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className={item.published ? "text-orange-400 hover:text-orange-300" : "text-green-400 hover:text-green-300"} 
                        onClick={() => activeTab === 'reviews' ? togglePublishReview(item.id) : togglePublishMatch(item.id)} title="Toggle Publish">
                        {item.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => activeTab === 'reviews' ? handleDeleteReview(item.id) : handleDeleteMatch(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {(activeTab === 'reviews' ? reviews : matches).length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No {activeTab} found. Create one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ReviewManagementPanel;