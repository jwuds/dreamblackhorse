import React, { useEffect, useState } from 'react';
import { useAffiliates } from '@/hooks/useAffiliates';
import { Plus, Edit2, Trash2, Search, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import AffiliateForm from './AffiliateForm';
import DeleteAffiliateModal from './DeleteAffiliateModal';
import { motion, AnimatePresence } from 'framer-motion';

const AffiliatesManagementPanel = () => {
  const { affiliates, loading, fetchAffiliates, addAffiliate, updateAffiliate, deleteAffiliate } = useAffiliates();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState(null);
  const [deletingAffiliate, setDeletingAffiliate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAffiliates();
  }, [fetchAffiliates]);

  const filteredAffiliates = affiliates.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingAffiliate(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (affiliate) => {
    setEditingAffiliate(affiliate);
    setIsFormOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingAffiliate) {
        await updateAffiliate(editingAffiliate.id, formData);
        toast({ title: "Success", description: "Affiliate updated successfully." });
      } else {
        await addAffiliate(formData);
        toast({ title: "Success", description: "Affiliate added successfully." });
      }
      setIsFormOpen(false);
      setEditingAffiliate(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save affiliate.", variant: "destructive" });
    }
  };

  const confirmDelete = async () => {
    if (!deletingAffiliate) return;
    setIsDeleting(true);
    try {
      await deleteAffiliate(deletingAffiliate.id);
      toast({ title: "Success", description: "Affiliate deleted." });
      setDeletingAffiliate(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white">Affiliates & Partners</h2>
          <p className="text-gray-400 text-sm mt-1">Manage partner logos displayed in the marquee</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-white text-black hover:bg-gray-200">
          <Plus size={18} className="mr-2" /> Add Affiliate
        </Button>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search affiliates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#111] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <span className="text-sm text-gray-500 font-medium px-4">
            {filteredAffiliates.length} items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111] border-b border-white/5 text-gray-400 text-sm">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Logo</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Link</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredAffiliates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No affiliates found.</td>
                </tr>
              ) : (
                filteredAffiliates.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-gray-400 text-sm">{item.order}</td>
                    <td className="p-4">
                      <div className="w-16 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center p-2">
                        {item.logo_url ? (
                          <img src={item.logo_url} alt={item.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-white">{item.name}</td>
                    <td className="p-4">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center text-sm gap-1">
                          Visit <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-gray-600 text-sm">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)} className="text-gray-400 hover:text-white h-8 w-8">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeletingAffiliate(item)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 w-8">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setIsFormOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10"
            >
              <AffiliateForm initialData={editingAffiliate} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
            </motion.div>
          </div>
        )}

        {deletingAffiliate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => !isDeleting && setDeletingAffiliate(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md z-10"
            >
              <DeleteAffiliateModal 
                affiliate={deletingAffiliate} 
                onConfirm={confirmDelete} 
                onCancel={() => setDeletingAffiliate(null)} 
                isDeleting={isDeleting} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AffiliatesManagementPanel;