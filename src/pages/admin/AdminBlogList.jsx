import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Eye, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminBlogList = () => {
  const { posts, loading, fetchAllPosts, deletePost } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
      fetchAllPosts();
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#1a1a1a] rounded-2xl border border-white/10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog Posts</h1>
          <p className="text-gray-400">Manage your articles, news, and insights.</p>
        </div>
        <Link to="/admin/blog/new">
          <Button className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold">
            <Plus className="w-5 h-5 mr-2" />
            Create New Post
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
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
        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white appearance-none focus:ring-2 focus:ring-[#d4af37] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading posts...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-[#111] rounded-xl border border-white/10">
          No posts found. Create your first blog post!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="pb-4 font-medium pl-4">Title</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">Author</th>
                <th className="pb-4 font-medium">Views</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 pl-4 max-w-xs truncate text-white font-medium">
                    {post.title}
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                      post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                      post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-300">{post.author || '-'}</td>
                  <td className="py-4 text-gray-300">{post.view_count || 0}</td>
                  <td className="py-4 text-gray-300">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/blog/${post.slug}`} target="_blank">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/blog/${post.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBlogList;