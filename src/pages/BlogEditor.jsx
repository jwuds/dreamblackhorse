import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Image as ImageIcon, Loader2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const BlogEditor = ({ post, onSave, onCancel }) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    id: post?.id || null,
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author: post?.author || 'Admin',
    category: post?.category || 'news',
    tags: post?.tags || '',
    featured_image_url: post?.featured_image_url || '',
    status: post?.status || 'draft',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    if (!file.type.match(/image\/(png|jpeg|jpg|webp)/)) {
      toast({ title: 'Error', description: 'Invalid file type. Please use PNG, JPG, or WEBP.', variant: 'destructive' });
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `blog_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('horse-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('horse-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, featured_image_url: publicUrl }));
      toast({ title: 'Success', description: 'Image uploaded successfully.' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Upload Failed', description: error.message || 'Could not upload image.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({ title: 'Validation Error', description: 'Title is required.', variant: 'destructive' });
      return;
    }
    
    setIsSaving(true);
    try {
      if(onSave) await onSave(formData);
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">
            {post ? 'Edit Post' : 'New Blog Post'}
          </h2>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={onCancel} className="text-gray-400 hover:text-white" disabled={isSaving}>
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving} className="bg-white text-black hover:bg-gray-200">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#222] p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Post Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                required
                placeholder="Enter an engaging title..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Short Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows="3"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-white/30"
                placeholder="Brief summary for preview cards..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Content (HTML supported)</label>
              <p className="text-xs text-gray-500 mb-2">Use tags like &lt;strong&gt;, &lt;em&gt;, &lt;h2&gt;, &lt;ul&gt; to format text.</p>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="20"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white resize-y font-mono text-sm focus:outline-none focus:border-white/30"
                placeholder="<p>Start writing your content here...</p>"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#222] p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 className="font-semibold text-white border-b border-white/10 pb-2">Featured Image</h3>
            
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-white/30 transition-colors bg-[#111] cursor-pointer"
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/webp"
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center h-32">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                    <p className="text-sm text-gray-400">Uploading...</p>
                  </div>
                ) : formData.featured_image_url ? (
                  <div className="relative group rounded-lg overflow-hidden h-32">
                    <img src={formData.featured_image_url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-sm">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32">
                    <UploadCloud className="w-10 h-10 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-300">Click to upload image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Or enter image URL manually:</label>
                <input
                  type="url"
                  name="featured_image_url"
                  value={formData.featured_image_url}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="bg-[#222] p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 className="font-semibold text-white border-b border-white/10 pb-2">Publishing</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white appearance-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white appearance-none"
              >
                <option value="news">News</option>
                <option value="care">Care Tips</option>
                <option value="training">Training</option>
                <option value="breeding">Breeding</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogEditor;