import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/customSupabaseClient';
import BlogCard from './BlogCard';

const LatestBlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLatestPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(3);

      if (fetchError) throw fetchError;

      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts. Please try again.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-6 bg-white/10" />
            <Skeleton className="h-6 w-96 mx-auto bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-xl bg-white/10" />
                <Skeleton className="h-8 w-3/4 bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-5/6 bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-xl max-w-3xl mx-auto">
            <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Unable to Load Blog Posts</h3>
            <p className="text-gray-400 mb-8 text-center max-w-md">{error}</p>
            <Button
              onClick={fetchLatestPosts}
              variant="outline"
              className="border-white/20 text-white hover:bg-white hover:text-black rounded-full px-8"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="py-16 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
              Latest Insights
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              No blog posts available at the moment. Check back soon for expert tips and stories!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f] border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
            Latest Insights
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stay updated with our latest news, expert tips, and stories from the farm.
          </p>
        </motion.div>

        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 md:px-0 md:mx-0 gap-6 lg:gap-8 hide-scrollbar">
          {posts.map((post, index) => (
            <div key={post.id} className="min-w-[85vw] sm:min-w-[400px] md:min-w-0 snap-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="block group">
                  <article className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all shadow-xl hover:shadow-2xl h-full flex flex-col">
                    {post.featured_image && (
                      <div className="relative overflow-hidden aspect-video">
                        <img
                          src={post.featured_image}
                          alt={post.featured_image_alt || post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-4 text-sm">
                        {post.category && (
                          <span className="px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] rounded-full font-semibold uppercase tracking-wide">
                            {post.category}
                          </span>
                        )}
                        {post.published_at && (
                          <time className="text-gray-500">
                            {new Date(post.published_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                        )}
                      </div>

                      <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-3 group-hover:text-[#d4af37] transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {post.introduction && (
                        <p className="text-gray-400 line-clamp-3 mb-4 flex-1">
                          {post.introduction}
                        </p>
                      )}

                      <div className="flex items-center text-[#d4af37] font-semibold group-hover:gap-3 transition-all pt-2">
                        Read More
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link to="/blog">
            <Button className="bg-white text-black hover:bg-gray-100 rounded-full px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all">
              View All Articles
              <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
};

export default LatestBlogSection;