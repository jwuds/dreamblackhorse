import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const EditableImage = ({ src, alt, className, storageKey, onUpdate, ...props }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const isAdmin = !!user;

  const handleSave = () => {
    if (!newUrl) return;
    if (onUpdate) {
      onUpdate(storageKey, newUrl);
    }
    toast({
      title: "Image Updated",
      description: "The image URL has been successfully updated.",
    });
    setIsEditing(false);
    setNewUrl('');
  };

  if (!isAdmin) {
    return <img src={src} alt={alt} className={className} {...props} />;
  }

  return (
    <>
      <div className={`relative group w-full h-full overflow-hidden ${className}`}>
        <img src={src} alt={alt} className="w-full h-full object-cover" {...props} />
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full font-medium transition-all transform scale-95 group-hover:scale-100"
          >
            <Edit2 className="w-4 h-4" />
            Edit Image
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Edit Image URL</h3>
            <input
              type="text"
              placeholder="Paste new image URL here..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white mb-4"
            />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-gray-400">Cancel</Button>
              <Button onClick={handleSave} className="bg-white text-black">Save Image</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditableImage;