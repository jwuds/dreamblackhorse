import React, { useState, useEffect } from 'react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateBlogPost } from '@/utils/validateBlogPost';

const BlogEditor = ({ post, onSave, onCancel }) => {
  const { savePost } = useBlogPosts();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    content: '',
    author: 'Admin',
    status: 'draft',
    featured_image_url: '',
    category: 'news',
    excerpt: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (post) {
      setFormData({ ...post });
    } else {
      setFormData(prev => ({ ...prev, id: crypto.randomUUID() }));
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors([]);
    
    const postToValidate = {
      ...formData,
      id: formData.id || crypto.randomUUID(),
    };

    const validation = validateBlogPost(postToValidate);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await savePost(postToValidate);
      if (onSave) onSave();
    } catch (error) {
      toast({
        title: "Error Saving Post",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 shadow-xl w-full">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-bold text-white font-['Playfair_Display']">
          {post ? 'Edit Post' : 'Create New Post'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-center gap-2 text-red-400 mb-2 font-semibold">
            <AlertCircle className="w-5 h-5" /> Validation Errors
          </div>
          <ul className="list-disc list-inside text-sm text-red-300 ml-5">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
              placeholder="Post Title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Author <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
            >
              <option value="news">News</option>
              <option value="care">Care Tips</option>
              <option value="training">Training</option>
              <option value="breeding">Breeding</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Featured Image URL</label>
          <input
            type="url"
            value={formData.featured_image_url}
            onChange={(e) => setFormData({...formData, featured_image_url: e.target.value})}
            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            rows={2}
            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 resize-none"
            placeholder="Short summary of the post..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Content <span className="text-red-500">*</span></label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            rows={10}
            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
            placeholder="Write your post content here..."
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-gray-400 hover:text-white">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-white text-black hover:bg-gray-200 px-8">
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;