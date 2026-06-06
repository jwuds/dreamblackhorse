import React, { useState } from 'react';
import { useHomePageImages } from '@/hooks/useHomePageImages';
import ImageUploadComponent from '@/components/ImageUploadComponent';
import { Loader2, Plus, Edit, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PREDEFINED_SECTIONS = [
  'delivery_map',
  'hero',
  'explore_farm',
  'featured',
  'about'
];

export default function AdminHomeImages() {
  const { images, loading, addImage, updateImage, deleteImage } = useHomePageImages();
  const [showUpload, setShowUpload] = useState(false);
  const [uploadSection, setUploadSection] = useState('delivery_map');
  const { toast } = useToast();

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await updateImage(id, { is_active: !currentStatus });
      toast({ title: 'Status updated' });
    } catch (e) {
      toast({ title: 'Error updating status', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await deleteImage(id);
      toast({ title: 'Image deleted' });
    } catch (e) {
      toast({ title: 'Error deleting image', variant: 'destructive' });
    }
  };

  const groupedImages = images.reduce((acc, img) => {
    acc[img.section_name] = acc[img.section_name] || [];
    acc[img.section_name].push(img);
    return acc;
  }, {});

  if (loading && images.length === 0) {
    return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]"/></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Home Page Images</h1>
          <p className="text-gray-400">Manage images displayed across the front page sections, including the Delivery Map.</p>
        </div>
        {!showUpload && (
          <Button onClick={() => setShowUpload(true)} className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold">
            <Plus className="w-5 h-5 mr-2" /> Add New Image
          </Button>
        )}
      </div>

      {showUpload && (
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white">Upload New Image</h2>
            <Button variant="ghost" onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-white">
              Cancel
            </Button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Section</label>
            <select 
              value={uploadSection} 
              onChange={(e) => setUploadSection(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white focus:ring-[#d4af37]"
            >
              {PREDEFINED_SECTIONS.map(section => (
                <option key={section} value={section}>
                  {section.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">Select "DELIVERY MAP" to update the logistics map on the home page.</p>
          </div>

          <ImageUploadComponent 
            onCancel={() => setShowUpload(false)} 
            onUploadSuccess={async (data) => {
              try {
                await addImage({ ...data, section_name: uploadSection });
                toast({ title: 'Image uploaded successfully' });
                setShowUpload(false);
              } catch (err) {
                toast({ title: 'Failed to upload', variant: 'destructive' });
              }
            }} 
          />
        </div>
      )}

      <div className="space-y-12">
        {Object.entries(groupedImages).map(([section, imgs]) => (
          <div key={section} className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden shadow-xl">
            <div className="bg-[#111] px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#d4af37] uppercase tracking-wider">{section.replace('_', ' ')}</h2>
              <span className="text-xs bg-white/5 text-gray-400 px-3 py-1 rounded-full">{imgs.length} Images</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400 text-sm">
                    <th className="p-4 font-medium w-32">Preview</th>
                    <th className="p-4 font-medium">Alt Text</th>
                    <th className="p-4 font-medium">Order</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {imgs.map(img => (
                    <tr key={img.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="w-24 h-16 rounded-lg overflow-hidden bg-[#0a0a0a] flex items-center justify-center border border-white/10">
                          {img.image_url ? (
                            <img src={img.image_url} alt={img.image_alt || ''} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-gray-600" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-white text-sm">
                        <span className="line-clamp-2">{img.image_alt || <span className="text-gray-600 italic">No alt text</span>}</span>
                      </td>
                      <td className="p-4 text-white font-mono">{img.display_order}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${img.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                          {img.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleToggleActive(img.id, img.is_active)} className="border-white/20 text-white hover:bg-white/10">
                            {img.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(img.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        
        {images.length === 0 && !showUpload && (
          <div className="text-center py-20 text-gray-500 border border-dashed border-white/20 rounded-2xl bg-[#1a1a1a]">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <p className="text-lg">No home page images uploaded yet.</p>
            <p className="text-sm mt-2">Click "Add New Image" to populate your home page sections.</p>
          </div>
        )}
      </div>
    </div>
  );
}