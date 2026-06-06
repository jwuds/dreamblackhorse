import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { motion, AnimatePresence } from 'framer-motion';

const TeamManagementPanel = () => {
  const { teamMembers, loading, fetchTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useTeamMembers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '', role: '', bio: '', image_url: '', order: 0
  });

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const handleOpenForm = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        role: member.role || '',
        bio: member.bio || '',
        image_url: member.image_url || '',
        order: member.order || 0
      });
    } else {
      setEditingMember(null);
      setFormData({ name: '', role: '', bio: '', image_url: '', order: 0 });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, formData);
        toast({ title: "Success", description: "Team member updated." });
      } else {
        await addTeamMember(formData);
        toast({ title: "Success", description: "Team member added." });
      }
      setIsFormOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save team member.", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    setIsDeleting(id);
    try {
      await deleteTeamMember(id);
      toast({ title: "Success", description: "Team member deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete team member.", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-gray-400" /> Team Members
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage team members displayed on the About Us page</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="bg-white text-black hover:bg-gray-200">
          <Plus size={18} className="mr-2" /> Add Member
        </Button>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111] border-b border-white/5 text-gray-400 text-sm">
                <th className="p-4 font-medium w-16">Photo</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium hidden md:table-cell">Bio Summary</th>
                <th className="p-4 font-medium w-24">Order</th>
                <th className="p-4 font-medium text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && teamMembers.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
              ) : teamMembers.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No team members found.</td></tr>
              ) : (
                teamMembers.map((member) => (
                  <tr key={member.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/20">
                        {member.image_url ? (
                          <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-5 h-5 m-2.5 text-gray-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-white">{member.name}</td>
                    <td className="p-4 text-gray-300">{member.role}</td>
                    <td className="p-4 text-gray-500 text-sm hidden md:table-cell max-w-xs truncate">{member.bio}</td>
                    <td className="p-4 text-gray-400 text-sm font-mono">{member.order}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenForm(member)} className="text-gray-400 hover:text-white h-8 w-8">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} disabled={isDeleting === member.id} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 w-8">
                          {isDeleting === member.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">{editingMember ? 'Edit Team Member' : 'Add Team Member'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Name <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Role <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Bio</label>
                  <textarea rows="3" value={formData.bio} onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Image URL</label>
                  <input type="url" value={formData.image_url} onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Display Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="border-white/20 text-gray-300">Cancel</Button>
                  <Button type="submit" className="bg-white text-black hover:bg-gray-200">Save Member</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamManagementPanel;