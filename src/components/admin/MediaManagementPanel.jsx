import React, { useState, useEffect, useRef } from 'react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useMediaManagement } from '@/hooks/useMediaManagement';
import { Upload, Image as ImageIcon, Trash2, Edit2, CheckCircle, XCircle, Search, Filter, Loader2, PlaySquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SECTIONS = ['all', 'hero', 'carousel', 'products', 'team', 'affiliates', 'journey', 'blog', 'gallery', 'backgrounds', 'other'];

const MediaManagementPanel = () => {
  const { uploadMedia, isUploading, progress } = useMediaUpload();
  const { images, loading, fetchImages, updateImageMetadata, publishImage, unpublishImage, deleteImage } = useMediaManagement();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchImages({ 
      section: activeTab === 'all' ? null : activeTab,
      search: searchTerm 
    });
  }, [activeTab, searchTerm, fetchImages]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (const file of files) {
      try {
        await uploadMedia(file, { 
          section: activeTab === 'all' ? 'other' : activeTab,
          status: 'draft'
        });
        toast({ title: 'Upload successful', description: `${file.name} uploaded.` });
      } catch (err) {
        toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
      }
    }
    fetchImages({ section: activeTab === 'all' ? null : activeTab });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;

    for (const file of files) {
      try {
        await uploadMedia(file, { section: activeTab === 'all' ? 'other' : activeTab });
      } catch (err) {
        toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
      }
    }
    fetchImages({ section: activeTab === 'all' ? null : activeTab });
  };

  const openEditModal = (img) => {
    setSelectedImage(img);
    setEditForm({
      alt_text: img.alt_text || '',
      description: img.description || '',
      section: img.section || 'other',
      image_type: img.image_type || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveMetadata = async () => {
    try {
      await updateImageMetadata(selectedImage.id, editForm);
      toast({ title: 'Success', description: 'Metadata updated successfully.' });
      setIsEditModalOpen(false);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update metadata.', variant: 'destructive' });
    }
  };

  const handleTogglePublish = async (img) => {
    try {
      if (img.status === 'published') {
        await unpublishImage(img.id);
        toast({ title: 'Unpublished', description: 'Image is now a draft.' });
      } else {
        await publishImage(img.id, img.section);
        toast({ title: 'Published', description: 'Image is now live.' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to change status.', variant: 'destructive' });
    }
  };

  const handleDelete = async (img) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await deleteImage(img.id, img.file_path);
      toast({ title: 'Deleted', description: 'Image removed successfully.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete image.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-white">Media Management</h2>
          <p className="text-gray-400 text-sm mt-1">Centralized library for all website imagery.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search images..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="bg-white text-black hover:bg-gray-200 shrink-0">
            {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Upload
          </Button>
          <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleFileSelect} />
        </div>
      </div>

      {isUploading && (
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {/* Upload Drop Zone */}
      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-white/20 hover:border-white/40 rounded-2xl p-8 text-center bg-[#1a1a1a]/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-300 font-medium">Drag & drop images here or click to browse</p>
        <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WEBP up to 10MB</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {SECTIONS.map(section => (
          <button
            key={section}
            onClick={() => setActiveTab(section)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              activeTab === section ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gray-500 animate-spin" /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No images found in this section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map(img => (
            <div key={img.id} className="group bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-colors flex flex-col">
              <div className="aspect-square relative bg-[#111] overflow-hidden">
                <img src={img.file_path} alt={img.alt_text || 'img'} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${img.status === 'published' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                    {img.status}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => handleTogglePublish(img)} title={img.status === 'published' ? 'Unpublish' : 'Publish'}>
                    {img.status === 'published' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => openEditModal(img)} title="Edit">
                    <Edit2 size={16} />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:bg-red-500/20 hover:text-red-300" onClick={() => handleDelete(img)} title="Delete">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-white truncate" title={img.file_name}>{img.file_name}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] text-gray-500 capitalize">{img.section}</p>
                  <p className="text-[10px] text-gray-500">{(img.file_size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Edit Image Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Alt Text</label>
                <input type="text" value={editForm.alt_text} onChange={(e) => setEditForm({...editForm, alt_text: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white resize-none" rows={3}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Section</label>
                  <select value={editForm.section} onChange={(e) => setEditForm({...editForm, section: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white capitalize">
                    {SECTIONS.filter(s => s !== 'all').map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Image Type</label>
                  <input type="text" value={editForm.image_type} onChange={(e) => setEditForm({...editForm, image_type: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white" placeholder="e.g. background" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveMetadata} className="bg-white text-black hover:bg-gray-200">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManagementPanel;