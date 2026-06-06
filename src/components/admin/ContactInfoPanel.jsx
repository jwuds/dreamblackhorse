import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, GripVertical, Trash2, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useContactInfo } from '@/hooks/useContactInfo';

const ContactInfoPanel = () => {
  const { toast } = useToast();
  const { contacts, addContact, editContact, deleteContact } = useContactInfo();
  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleSave = (id) => {
    editContact(id, editForm);
    setIsEditing(null);
    toast({ title: "Contact Updated", description: "Your contact information has been saved." });
  };

  const handleAddNew = () => {
    toast({ title: "Add Contact", description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Contact Information</h2>
          <p className="text-gray-400">Manage farm location, phone numbers, and operating hours.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-white text-black hover:bg-gray-200 rounded-xl font-semibold px-6">
          <Plus className="w-4 h-4 mr-2" /> Add New Detail
        </Button>
      </div>

      <div className="bg-[#222] rounded-2xl border border-white/5 shadow-xl p-6">
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <div key={contact.id} className="flex items-center gap-4 p-4 bg-[#111] rounded-xl border border-white/5 group">
              <GripVertical className="w-5 h-5 text-gray-500 cursor-grab" />
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                {isEditing === contact.id ? (
                  <>
                    <input 
                      value={editForm.label} 
                      onChange={e => setEditForm({...editForm, label: e.target.value})} 
                      className="bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white" 
                    />
                    <input 
                      value={editForm.value} 
                      onChange={e => setEditForm({...editForm, value: e.target.value})} 
                      className="bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white md:col-span-2" 
                    />
                  </>
                ) : (
                  <>
                    <div className="text-sm font-medium text-gray-400">{contact.label} <span className="text-xs ml-2 px-2 py-0.5 bg-white/10 rounded text-gray-300">{contact.type}</span></div>
                    <div className="text-white md:col-span-2">{contact.value}</div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                {isEditing === contact.id ? (
                  <Button onClick={() => handleSave(contact.id)} size="sm" variant="ghost" className="text-green-400 hover:bg-green-400/10"><Save className="w-4 h-4" /></Button>
                ) : (
                  <Button onClick={() => { setIsEditing(contact.id); setEditForm(contact); }} size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-400/10"><Edit2 className="w-4 h-4" /></Button>
                )}
                <Button onClick={() => deleteContact(contact.id)} size="sm" variant="ghost" className="text-red-400 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfoPanel;