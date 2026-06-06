import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Send, Trash2, Plus, ArrowUp, ArrowDown, X, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const AdminBlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchPostById, createPost, updatePost, deletePost } = useBlogPosts();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showInternalLinkModal, setShowInternalLinkModal] = useState(false);
  const [showLiveLinkModal, setShowLiveLinkModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '', slug: '', seo_title: '', meta_description: '', h1_headline: '',
    introduction: '', content: '', conclusion: '', featured_image: '', featured_image_alt: '',
    author: 'Dream Black Horse Team', category: 'KFPS Friesian', tags: '', canonical_url: '',
    keywords: '', status: 'draft', faq_items: [], internal_links: [], live_links: [],
    featured_on_home: false
  });

  const [newInternalLink, setNewInternalLink] = useState({ link_text: '', link_url: '', link_type: 'page' });
  const [newLiveLink, setNewLiveLink] = useState({ link_text: '', link_url: '', link_title: '' });

  useEffect(() => {
    if (id) loadPost();
    // eslint-disable-next-line
  }, [id]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const data = await fetchPostById(id);
      if (data) {
        setFormData({
          ...data,
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
          keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : (data.keywords || ''),
          faq_items: data.faq_items || [],
          internal_links: data.internal_links || [],
          live_links: data.live_links || [],
          featured_on_home: data.featured_on_home || false
        });
      }
    } catch (err) {
      toast({ title: 'Error loading post', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, title, slug: prev.slug || slug }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // FAQ Management
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faq_items: [...(prev.faq_items || []), { question: '', answer: '', order: (prev.faq_items?.length || 0) + 1 }]
    }));
  };

  const updateFaq = (index, field, value) => {
    const updated = [...formData.faq_items];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, faq_items: updated }));
  };

  const removeFaq = (index) => {
    const updated = formData.faq_items.filter((_, i) => i !== index);
    updated.forEach((item, i) => item.order = i + 1);
    setFormData(prev => ({ ...prev, faq_items: updated }));
  };

  const moveFaq = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === formData.faq_items.length - 1)) return;
    const updated = [...formData.faq_items];
    const temp = updated[index];
    updated[index] = updated[index + direction];
    updated[index + direction] = temp;
    updated.forEach((item, i) => item.order = i + 1);
    setFormData(prev => ({ ...prev, faq_items: updated }));
  };

  // Internal Links Management
  const addInternalLink = () => {
    if (!newInternalLink.link_text || !newInternalLink.link_url) {
      toast({ title: 'Validation Error', description: 'Link text and URL are required', variant: 'destructive' });
      return;
    }
    setFormData(prev => ({
      ...prev,
      internal_links: [...(prev.internal_links || []), newInternalLink]
    }));
    setNewInternalLink({ link_text: '', link_url: '', link_type: 'page' });
    setShowInternalLinkModal(false);
    toast({ title: 'Internal link added' });
  };

  const removeInternalLink = (index) => {
    setFormData(prev => ({
      ...prev,
      internal_links: prev.internal_links.filter((_, i) => i !== index)
    }));
  };

  // Live Links Management
  const addLiveLink = () => {
    if (!newLiveLink.link_text || !newLiveLink.link_url) {
      toast({ title: 'Validation Error', description: 'Link text and URL are required', variant: 'destructive' });
      return;
    }
    if (!newLiveLink.link_url.startsWith('https://') && !newLiveLink.link_url.startsWith('http://')) {
      toast({ title: 'Validation Error', description: 'URL must start with https:// or http://', variant: 'destructive' });
      return;
    }
    setFormData(prev => ({
      ...prev,
      live_links: [...(prev.live_links || []), newLiveLink]
    }));
    setNewLiveLink({ link_text: '', link_url: '', link_title: '' });
    setShowLiveLinkModal(false);
    toast({ title: 'Live link added' });
  };

  const removeLiveLink = (index) => {
    setFormData(prev => ({
      ...prev,
      live_links: prev.live_links.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    if (!formData.title) return "Title is required";
    if (!formData.slug) return "Slug is required";
    if (!formData.content) return "Content is required";
    if (formData.faq_items?.some(f => !f.question || !f.answer)) return "All FAQ items must have a question and answer";
    return null;
  };

  const handleSave = async (forceStatus = null) => {
    const error = validate();
    if (error) {
      toast({ title: 'Validation Error', description: error, variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        status: forceStatus || formData.status,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(Boolean) : [],
        faq_items: formData.faq_items,
        internal_links: formData.internal_links,
        live_links: formData.live_links,
        featured_on_home: formData.featured_on_home
      };

      if (id) {
        await updatePost(id, payload);
      } else {
        await createPost(payload);
        navigate('/admin/blog');
      }
    } catch (err) {
      // Handled in hook
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post forever?')) {
      await deletePost(id);
      navigate('/admin/blog');
    }
  };

  if (loading) return <div className="text-center py-20 text-white">Loading...</div>;

  return (
    <div className="bg-[#1a1a1a] min-h-screen pb-20">
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/blog')} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">{id ? 'Edit Blog Post' : 'New Blog Post'}</h1>
          </div>
          <div className="flex gap-3">
            {id && (
              <Button onClick={handleDelete} variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            )}
            <Button onClick={() => handleSave('draft')} disabled={saving} variant="outline" className="border-white/20 text-white hover:bg-white/5">
              <Save className="w-4 h-4 mr-2" /> Save Draft
            </Button>
            <Button onClick={() => handleSave('published')} disabled={saving} className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold">
              <Send className="w-4 h-4 mr-2" /> Publish Now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-6">
              <h2 className="text-lg font-bold text-white mb-4">Core Content</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleTitleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-[#d4af37]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">H1 Headline</label>
                <input type="text" name="h1_headline" value={formData.h1_headline || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-[#d4af37]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Introduction</label>
                <textarea name="introduction" value={formData.introduction || ''} onChange={handleChange} rows="3" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-[#d4af37]"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Main Content (Markdown Supported) *</label>
                <textarea name="content" value={formData.content} onChange={handleChange} rows="15" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:ring-[#d4af37]"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Conclusion</label>
                <textarea name="conclusion" value={formData.conclusion || ''} onChange={handleChange} rows="3" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-[#d4af37]"></textarea>
              </div>
            </div>

            {/* Internal Links Section */}
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-[#d4af37]" /> Internal Links
                </h2>
                <Dialog open={showInternalLinkModal} onOpenChange={setShowInternalLinkModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 text-sm">
                      <Plus className="w-4 h-4 mr-2" /> Add Internal Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1a1a1a] border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-white">Add Internal Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label className="text-gray-300 mb-2">Link Text *</Label>
                        <input 
                          type="text" 
                          value={newInternalLink.link_text} 
                          onChange={e => setNewInternalLink(p => ({ ...p, link_text: e.target.value }))}
                          className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white"
                          placeholder="e.g., featured horses page"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2">Link Type *</Label>
                        <select 
                          value={newInternalLink.link_type} 
                          onChange={e => setNewInternalLink(p => ({ ...p, link_type: e.target.value }))}
                          className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white"
                        >
                          <option value="page">Page</option>
                          <option value="product">Product</option>
                          <option value="blog">Blog Post</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2">Link URL *</Label>
                        <input 
                          type="text" 
                          value={newInternalLink.link_url} 
                          onChange={e => setNewInternalLink(p => ({ ...p, link_url: e.target.value }))}
                          className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white"
                          placeholder="/horses or /about or /product/123"
                        />
                      </div>
                      <Button onClick={addInternalLink} className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f]">
                        Add Link
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {formData.internal_links?.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No internal links added yet.</p>
              ) : (
                <div className="space-y-2">
                  {formData.internal_links.map((link, index) => (
                    <div key={index} className="bg-[#1a1a1a] p-4 rounded-lg border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{link.link_text}</p>
                        <p className="text-gray-400 text-sm">→ {link.link_url} <span className="text-[#d4af37]">({link.link_type})</span></p>
                      </div>
                      <button onClick={() => removeInternalLink(index)} className="p-2 text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Links Section */}
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-[#d4af37]" /> Live Links
                </h2>
                <Dialog open={showLiveLinkModal} onOpenChange={setShowLiveLinkModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 text-sm">
                      <Plus className="w-4 h-4 mr-2" /> Add Live Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1a1a1a] border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-white">Add Live Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label className="text-gray-300 mb-2">Link Text *</Label>
                        <input 
                          type="text" 
                          value={newLiveLink.link_text} 
                          onChange={e => setNewLiveLink(p => ({ ...p, link_text: e.target.value }))}
                          className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white"
                          placeholder="e.g., KFPS"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2">Link URL *</Label>
                        <input 
                          type="url" 
                          value={newLiveLink.link_url} 
                          onChange={e => setNewLiveLink(p => ({ ...p, link_url: e.target.value }))}
                          className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2">Link Title (Optional)</Label>
                        <input 
                          type="text" 
                          value={newLiveLink.link_title} 
                          onChange={e => setNewLiveLink(p => ({ ...p, link_title: e.target.value }))}
                          className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white"
                          placeholder="External website description"
                        />
                      </div>
                      <Button onClick={addLiveLink} className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f]">
                        Add Link
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {formData.live_links?.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No live links added yet.</p>
              ) : (
                <div className="space-y-2">
                  {formData.live_links.map((link, index) => (
                    <div key={index} className="bg-[#1a1a1a] p-4 rounded-lg border border-white/5 flex items-center justify-between">
                      <div className="flex-1 overflow-hidden">
                        <p className="text-white font-medium">{link.link_text}</p>
                        <p className="text-gray-400 text-sm truncate">→ {link.link_url}</p>
                        {link.link_title && <p className="text-gray-500 text-xs italic">{link.link_title}</p>}
                      </div>
                      <button onClick={() => removeLiveLink(index)} className="p-2 text-red-400 hover:text-red-300 shrink-0 ml-4">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FAQ Section */}
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">FAQ Items</h2>
                <Button onClick={addFaq} type="button" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-sm">
                  <Plus className="w-4 h-4 mr-2" /> Add FAQ
                </Button>
              </div>

              {formData.faq_items?.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No FAQ items added yet.</p>
              ) : (
                <div className="space-y-4">
                  {formData.faq_items.map((faq, index) => (
                    <div key={index} className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 space-y-4 relative">
                      <div className="absolute top-4 right-4 flex items-center gap-1">
                        <button onClick={() => moveFaq(index, -1)} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                        <button onClick={() => moveFaq(index, 1)} disabled={index === formData.faq_items.length - 1} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                        <button onClick={() => removeFaq(index)} className="p-1.5 text-red-400 hover:text-red-300 ml-2"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Question</label>
                        <input 
                          type="text" 
                          value={faq.question} 
                          onChange={(e) => updateFaq(index, 'question', e.target.value)} 
                          className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" 
                          placeholder="e.g., What is a Friesian?" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Answer (Markdown)</label>
                        <textarea 
                          value={faq.answer} 
                          onChange={(e) => updateFaq(index, 'answer', e.target.value)} 
                          rows="3" 
                          className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" 
                        ></textarea>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-6">
              <h2 className="text-lg font-bold text-white mb-4">Publishing & Meta</h2>
              
              <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-[#d4af37]/20">
                <div>
                  <Label htmlFor="featured-toggle" className="text-white font-semibold">Featured on Home</Label>
                  <p className="text-xs text-gray-400 mt-1">Display in Latest Insights section</p>
                </div>
                <Switch 
                  id="featured-toggle"
                  checked={formData.featured_on_home} 
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, featured_on_home: checked }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL Slug *</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input type="text" name="category" value={formData.category || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags (Comma separated)</label>
                <input type="text" name="tags" value={formData.tags || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-sm text-white" />
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-6">
              <h2 className="text-lg font-bold text-white mb-4">Media</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Featured Image URL</label>
                <input type="text" name="featured_image" value={formData.featured_image || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-sm text-white" />
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-6">
              <h2 className="text-lg font-bold text-white mb-4">SEO Optimization</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SEO Title</label>
                <input type="text" name="seo_title" value={formData.seo_title || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
                <textarea name="meta_description" value={formData.meta_description || ''} onChange={handleChange} rows="3" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-sm text-white"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditor;