import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Search, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import SEOHead from '@/components/SEOHead';
import ErrorBoundary from '@/components/ErrorBoundary';

const BlogContent = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { fetchPublishedPosts, loading, error } = useBlogPosts();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  const loadData = async () => {
    const data = await fetchPublishedPosts({ 
      category: selectedCategory === 'all' ? null : selectedCategory,
      search: searchTerm || null
    });
    setPosts(data || []);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [selectedCategory, searchTerm]);

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'KFPS Friesian', label: 'KFPS Friesian' },
    { id: 'Dressage', label: 'Dressage' },
    { id: 'Breeding', label: 'Breeding' },
    { id: 'Care Tips', label: 'Care Tips' },
    { id: 'Training', label: 'Training' },
  ];

  const paginatedPosts = posts.slice((page - 1) * postsPerPage, page * postsPerPage);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const featuredPost = page === 1 && posts.length > 0 && selectedCategory === 'all' && !searchTerm ? posts[0] : null;
  const regularPosts = featuredPost ? paginatedPosts.slice(1) : paginatedPosts;

  return (
    <div className="bg-[#1a1a1a] min-h-screen pb-20">
      <section className="relative py-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <h1 className="text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white mb-6">
              Equestrian Excellence Blog
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Expert knowledge and insights on KFPS Friesians, premium breeding, dressage, and the equestrian lifestyle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Toolbar: Categories & Search */}
      <section className="py-8 bg-[#0f0f0f] border-b border-white/5 sticky top-16 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 w-full lg:w-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => { setSelectedCategory(category.id); setPage(1); }}
                  className={`rounded-full px-6 py-2 text-sm font-bold transition-all border ${
                    selectedCategory === category.id
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50 hover:text-white'
                  }`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full bg-[#111] border border-white/20 rounded-full pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-[#d4af37] outline-none text-sm transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="bg-[#111] border border-red-500/30 rounded-2xl p-8 text-center shadow-xl">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Error Loading Articles</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button onClick={loadData} className="bg-white text-black font-bold">Try Again</Button>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h3 className="text-2xl font-['Playfair_Display'] text-gray-400">No articles found matching your criteria.</h3>
          <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="mt-6 bg-[#d4af37] text-black">Clear Filters</Button>
        </div>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <Link to={`/blog/${featuredPost.slug}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-gradient-to-br from-[#111] to-[#1a1a1a] rounded-[2rem] p-6 lg:p-10 hover:border-[#d4af37]/30 transition-all duration-500 border border-white/10 shadow-2xl group">
                      <div className="relative overflow-hidden rounded-[1.5rem] aspect-[4/3] bg-[#0a0a0a]">
                        {featuredPost.featured_image ? (
                          <img src={featuredPost.featured_image} alt={featuredPost.featured_image_alt || featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                        )}
                      </div>
                      <div className="space-y-6 pr-4">
                        <div className="flex items-center gap-4">
                          <span className="inline-block px-4 py-1.5 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                            Featured
                          </span>
                          <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{featuredPost.category}</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-['Playfair_Display'] font-bold text-white leading-tight group-hover:text-[#d4af37] transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-lg text-gray-400 leading-relaxed line-clamp-3">
                          {featuredPost.introduction || featuredPost.meta_description}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {featuredPost.view_count || 0} Views
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </section>
          )}

          {/* Grid Posts */}
          {regularPosts.length > 0 && (
            <section className="py-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post, index) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="group">
                      <Link to={`/blog/${post.slug}`}>
                        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#d4af37]/30 transition-all duration-300 h-full flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1">
                          <div className="relative overflow-hidden aspect-[16/10] shrink-0 bg-[#0a0a0a]">
                            {post.featured_image ? (
                              <img src={post.featured_image} alt={post.featured_image_alt || post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                            )}
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/10">
                                {post.category || 'News'}
                              </span>
                            </div>
                          </div>
                          <div className="p-8 space-y-4 flex-1 flex flex-col">
                            <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white leading-tight line-clamp-2 group-hover:text-[#d4af37] transition-colors">
                              {post.title}
                            </h2>
                            <p className="text-gray-400 text-sm line-clamp-3 flex-1 leading-relaxed">
                              {post.introduction || post.meta_description}
                            </p>
                            <div className="flex items-center justify-between pt-6 border-t border-white/5 shrink-0 mt-4">
                              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.published_at || post.created_at).toLocaleDateString()}
                              </div>
                              <span className="text-[#d4af37] text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                Read <ArrowRight size={16}/>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-white/10">
                    <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="outline" className="border-white/20 text-white hover:bg-white/10">Previous</Button>
                    <span className="text-gray-400 text-sm font-medium px-4">Page {page} of {totalPages}</span>
                    <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} variant="outline" className="border-white/20 text-white hover:bg-white/10">Next</Button>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

const Blog = () => {
  return (
    <>
      <SEOHead 
        title="Dream Black Horse Blog - Horse Care & Insights"
        description="Read expert articles about horse care, training, breeding, and more at Dream Black Horse Blog."
        canonical="/blog"
      />
      <ErrorBoundary>
        <BlogContent />
      </ErrorBoundary>
    </>
  );
};

export default Blog;