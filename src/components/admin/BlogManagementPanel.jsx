import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, ExternalLink, Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useBlogPosts } from '@/hooks/useBlogPosts';

const BlogManagementPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchBlogPosts, deleteBlogPost, publishBlogPost } = useBlogPosts();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchBlogPosts({ limit: 100, sort: 'newest' });
      setPosts(data.posts || []);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load blog posts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to archive this post?')) {
      try {
        await deleteBlogPost(id);
        loadPosts();
      } catch (err) {
        // Handled by hook
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white">Blog Management</h2>
          <p className="text-gray-400">Create and manage your articles and news</p>
        </div>
        <Button onClick={() => navigate('/admin/blog/new')} className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold">
          <Plus className="w-5 h-5 mr-2" /> Create New Post
        </Button>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" /></div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No posts found matching your criteria.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 font-semibold text-gray-400">Title</th>
                  <th className="pb-3 font-semibold text-gray-400">Category</th>
                  <th className="pb-3 font-semibold text-gray-400">Status</th>
                  <th className="pb-3 font-semibold text-gray-400">Views</th>
                  <th className="pb-3 font-semibold text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="font-bold text-white mb-1 line-clamp-1">{post.title}</div>
                      <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{post.category}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                        post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300"><Eye className="w-4 h-4 inline mr-1 opacity-50"/> {post.view_count || 0}</td>
                    <td className="py-4 pl-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === 'published' && (
                          <Button variant="ghost" size="icon" onClick={() => window.open(`/blog/${post.slug}`, '_blank')} className="text-gray-400 hover:text-white">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/blog/edit/${post.id}`)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogManagementPanel;