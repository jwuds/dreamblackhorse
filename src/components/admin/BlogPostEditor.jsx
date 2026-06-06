import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BlogPostEditor = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    category: '',
    tags: '',
    author: '',
    status: 'draft'
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        featured_image_url: post.featured_image_url || '',
        category: post.category || '',
        tags: post.tags || '',
        author: post.author || '',
        status: post.status || 'draft'
      });
    }
  }, [post]);

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: !post ? generateSlug(newTitle) : prev.slug
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      toast({
        title: 'Success',
        description: 'Blog post saved successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to save post',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white">{post ? 'Edit Post' : 'Create New Post'}</h2>
        </div>
        <div className="flex items-center gap-3">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="bg-[#222] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#b5952f] transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Post
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
              className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
              placeholder="Post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="15"
              className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none font-mono text-sm"
              placeholder="Write your post content here (supports markdown/HTML)..."
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
              placeholder="Brief summary of the post..."
            ></textarea>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#222] p-5 rounded-xl border border-white/5">
            <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none text-sm"
            />
          </div>

          <div className="bg-[#222] p-5 rounded-xl border border-white/5">
            <label className="block text-sm font-medium text-gray-400 mb-2">Featured Image URL</label>
            <input
              type="text"
              name="featured_image_url"
              value={formData.featured_image_url}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none text-sm mb-3"
              placeholder="https://..."
            />
            {formData.featured_image_url ? (
              <img src={formData.featured_image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
            ) : (
              <div className="w-full h-32 bg-[#111] rounded-lg border border-white/5 flex items-center justify-center text-gray-500">
                <ImageIcon size={24} />
              </div>
            )}
          </div>

          <div className="bg-[#222] p-5 rounded-xl border border-white/5">
            <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none text-sm mb-4"
              placeholder="e.g. Training, Health"
            />

            <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none text-sm mb-4"
              placeholder="friesian, dressage, care"
            />

            <label className="block text-sm font-medium text-gray-400 mb-2">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none text-sm"
              placeholder="Author name"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostEditor;