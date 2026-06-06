import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as queries from '@/utils/supabaseQueries';
import { supabase } from '@/lib/customSupabaseClient';
import { logError } from '@/utils/errorLogger';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchBlogPosts = useCallback(async ({ page = 1, limit = 12, status, category, search, tags, sort = 'newest' } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const filters = { page, limit, status, category, search, tags, sort };
      const { data, count } = await queries.getBlogPosts(filters);
      setPosts(data || []);
      return { posts: data || [], count: count || 0, totalPages: Math.ceil((count || 0) / limit) };
    } catch (err) {
      logError('Error in fetchBlogPosts hook', err);
      setError(err.message || 'Failed to fetch posts');
      return { posts: [], count: 0, totalPages: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPublishedPosts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await queries.getBlogPosts({ ...filters, status: 'published' });
      setPosts(data || []);
      return data || [];
    } catch (err) {
      logError('Error in fetchPublishedPosts hook', err);
      setError(err.message || 'Failed to fetch published posts');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostBySlug = useCallback(async (slug) => {
    if (!slug) return null;
    setLoading(true);
    setError(null);
    try {
      const data = await queries.getBlogPostBySlug(slug);
      return data || null;
    } catch (err) {
      logError('Error in fetchPostBySlug hook', err, { slug });
      setError(err.message || 'Failed to fetch post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostById = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      return await queries.getBlogPost(id, false);
    } catch (err) {
      logError('Error in fetchPostById hook', err, { id });
      setError(err.message || 'Failed to fetch post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = async (postData) => {
    try {
      const data = await queries.createBlogPost(postData);
      toast({ title: 'Success', description: 'Post created successfully' });
      return data;
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Failed to create post', variant: 'destructive' });
      throw err;
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const data = await queries.updateBlogPost(id, postData);
      toast({ title: 'Success', description: 'Post updated successfully' });
      return data;
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Failed to update post', variant: 'destructive' });
      throw err;
    }
  };

  const deletePost = async (id) => {
    try {
      await queries.deleteBlogPost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Success', description: 'Post deleted' });
      return true;
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Failed to delete post', variant: 'destructive' });
      throw err;
    }
  };

  const incrementViewCount = useCallback(async (id) => {
    if (!id) return;
    try {
      const { data: current } = await supabase.from('blog_posts').select('view_count').eq('id', id).maybeSingle();
      if (current) {
        await supabase.from('blog_posts').update({ view_count: (current.view_count || 0) + 1 }).eq('id', id);
      }
    } catch (e) {
      // Silently ignore background tracking errors
    }
  }, []);

  return {
    posts,
    loading,
    error,
    fetchBlogPosts,
    fetchPublishedPosts,
    fetchBlogPostBySlug: fetchPostBySlug,
    fetchPostBySlug,
    fetchBlogPostById: fetchPostById,
    fetchPostById,
    createBlogPost: createPost,
    createPost,
    updateBlogPost: updatePost,
    updatePost,
    deleteBlogPost: deletePost,
    deletePost,
    incrementViewCount
  };
};