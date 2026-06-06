import { supabase } from '@/lib/customSupabaseClient';
import { logError, logInfo, logSupabaseError, logQuery, logAuthError } from '@/utils/errorLogger';
import { validateBlogPost, validateJsonbField } from '@/utils/supabaseValidation';
import { refreshAccessToken } from '@/utils/tokenRefresh';

const sanitizePost = (post) => {
  if (!post) return null;
  return {
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : [],
    keywords: Array.isArray(post.keywords) ? post.keywords : [],
    faq_items: validateJsonbField(post.faq_items, 'faq_items') || [],
    internal_links: validateJsonbField(post.internal_links, 'internal_links') || [],
    live_links: validateJsonbField(post.live_links, 'live_links') || [],
    featured_on_home: Boolean(post.featured_on_home),
    view_count: post.view_count || 0,
    status: post.status || 'draft',
    title: post.title || 'Untitled',
    content: post.content || '',
    author: post.author || 'Anonymous',
    category: post.category || 'General'
  };
};

const handleQueryError = async (error, operation, table, context) => {
  if (error?.message?.includes('Auth session missing') || error?.code === 'PGRST301') {
    logAuthError('Auth session missing during query, attempting recovery', error, { operation, table });
    try {
      await refreshAccessToken();
      return true;
    } catch (refreshErr) {
      logAuthError('Recovery failed during query', refreshErr, { operation, table });
      return false;
    }
  }
  logSupabaseError(`${operation} failed on ${table}`, error, context);
  return false;
};

export const getBlogPosts = async (filters = {}, isRetry = false) => {
  const startTime = Date.now();
  try {
    logInfo('Fetching blog posts', { filters });
    
    let query = supabase.from('blog_posts').select('*', { count: 'exact' });
    
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category);
    if (filters.search) query = query.ilike('title', `%${filters.search}%`);
    
    query = query.order('published_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });

    if (filters.page && filters.limit) {
      const from = (filters.page - 1) * filters.limit;
      query = query.range(from, from + filters.limit - 1);
    }

    const { data, count, error } = await query;
    
    if (error) {
      const shouldRetry = !isRetry && await handleQueryError(error, 'SELECT', 'blog_posts', { filters });
      if (shouldRetry) return getBlogPosts(filters, true);
      return { data: [], count: 0 };
    }
    
    const posts = (data || []).map(sanitizePost).filter(p => p.title && p.slug);
    logQuery('SELECT', 'blog_posts', filters, posts, Date.now() - startTime);

    return { data: posts, count: count || 0 };
  } catch (error) {
    logError('Exception in getBlogPosts', { filters }, error);
    return { data: [], count: 0 };
  }
};

export const getBlogPostBySlug = async (slug, isRetry = false) => {
  const startTime = Date.now();
  
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    logError('getBlogPostBySlug called with invalid slug', { slug });
    return null;
  }
  
  const cleanSlug = slug.trim().toLowerCase();

  try {
    logInfo('Fetching blog post by slug', { slug: cleanSlug });

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', cleanSlug)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      const shouldRetry = !isRetry && await handleQueryError(error, 'SELECT', 'blog_posts', { slug: cleanSlug });
      if (shouldRetry) return getBlogPostBySlug(slug, true);
      logError('Query failed for getBlogPostBySlug', { slug: cleanSlug }, error);
      return null;
    }

    if (!data) {
      logInfo('Blog post not found by slug', { slug: cleanSlug });
      return null;
    }

    const post = sanitizePost(data);
    
    if (!post.title || !post.content || !post.author) {
      logError('Blog post missing required fields', { slug: cleanSlug, post });
    }

    logQuery('SELECT', 'blog_posts', { slug: cleanSlug, status: 'published' }, post, Date.now() - startTime);
    return post;
  } catch (error) {
    logError('Exception in getBlogPostBySlug', { slug: cleanSlug }, error);
    return null;
  }
};

export const getBlogPost = async (identifier, isSlug = true, isRetry = false) => {
  if (isSlug) {
    return getBlogPostBySlug(identifier, isRetry);
  }
  
  const startTime = Date.now();
  if (!identifier) {
    logError('getBlogPost called with empty id');
    return null;
  }
  
  const cleanIdentifier = typeof identifier === 'string' ? identifier.trim() : identifier;

  try {
    logInfo('Fetching blog post by id', { id: cleanIdentifier });

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', cleanIdentifier)
      .maybeSingle();

    if (error) {
      const shouldRetry = !isRetry && await handleQueryError(error, 'SELECT', 'blog_posts', { id: cleanIdentifier });
      if (shouldRetry) return getBlogPost(identifier, false, true);
      return null;
    }

    if (!data) return null;

    const post = sanitizePost(data);
    logQuery('SELECT', 'blog_posts', { id: cleanIdentifier }, post, Date.now() - startTime);
    return post;
  } catch (error) {
    logError('Exception in getBlogPost by id', { id: cleanIdentifier }, error);
    return null;
  }
};

export const createBlogPost = async (postData, isRetry = false) => {
  try {
    const { isValid, errors, sanitizedData } = validateBlogPost(postData);
    if (!isValid) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      const shouldRetry = !isRetry && await handleQueryError(userError, 'GET_USER', 'auth', {});
      if (shouldRetry) return createBlogPost(postData, true);
      throw userError;
    }

    const payload = {
      ...sanitizedData,
      user_id: userData?.user?.id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('blog_posts').insert([payload]).select().maybeSingle();

    if (error) {
      const shouldRetry = !isRetry && await handleQueryError(error, 'INSERT', 'blog_posts', { title: payload.title });
      if (shouldRetry) return createBlogPost(postData, true);
      throw new Error(error.message || 'Failed to create blog post');
    }

    return sanitizePost(data);
  } catch (error) {
    logError('Failed to create blog post', { title: postData?.title }, error);
    throw error;
  }
};

export const updateBlogPost = async (id, postData, isRetry = false) => {
  try {
    const payload = {
      ...postData,
      tags: validateJsonbField(postData.tags, 'tags'),
      keywords: validateJsonbField(postData.keywords, 'keywords'),
      faq_items: validateJsonbField(postData.faq_items, 'faq_items'),
      internal_links: validateJsonbField(postData.internal_links, 'internal_links'),
      live_links: validateJsonbField(postData.live_links, 'live_links'),
      featured_on_home: Boolean(postData.featured_on_home),
      updated_at: new Date().toISOString()
    };
    
    if (postData.status === 'published' && !postData.published_at) {
      payload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase.from('blog_posts').update(payload).eq('id', id).select().maybeSingle();

    if (error) {
      const shouldRetry = !isRetry && await handleQueryError(error, 'UPDATE', 'blog_posts', { postId: id });
      if (shouldRetry) return updateBlogPost(id, postData, true);
      throw new Error(error.message || 'Failed to update blog post');
    }

    return sanitizePost(data);
  } catch (error) {
    logError('Failed to update blog post', { postId: id }, error);
    throw error;
  }
};

export const deleteBlogPost = async (id, isRetry = false) => {
  try {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
      const shouldRetry = !isRetry && await handleQueryError(error, 'DELETE', 'blog_posts', { postId: id });
      if (shouldRetry) return deleteBlogPost(id, true);
      throw new Error(error.message || 'Failed to delete blog post');
    }

    return true;
  } catch (error) {
    logError('Failed to delete blog post', { postId: id }, error);
    throw error;
  }
};

export const getFeaturedBlogPosts = async (limit = 3, isRetry = false) => {
  const startTime = Date.now();
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('featured_on_home', true)
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      const shouldRetry = !isRetry && await handleQueryError(error, 'SELECT', 'blog_posts', { limit });
      if (shouldRetry) return getFeaturedBlogPosts(limit, true);
      return [];
    }

    const posts = (data || []).map(sanitizePost).filter(p => p.title && p.slug);
    logQuery('SELECT', 'blog_posts', { featured: true, status: 'published' }, posts, Date.now() - startTime);

    return posts;
  } catch (error) {
    logError('Failed to fetch featured blog posts', { limit }, error);
    return [];
  }
};

// YouTube Video Queries
export const getYouTubeVideos = async (isRetry = false) => {
  const startTime = Date.now();
  try {
    logInfo('Fetching YouTube videos');

    const { data, error } = await supabase
      .from('home_page_videos')
      .select('*')
      .eq('video_type', 'youtube')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      const shouldRetry = !isRetry && await handleQueryError(error, 'SELECT', 'home_page_videos', { video_type: 'youtube' });
      if (shouldRetry) return getYouTubeVideos(true);
      return [];
    }

    logQuery('SELECT', 'home_page_videos', { video_type: 'youtube' }, data, Date.now() - startTime);
    return data || [];
  } catch (error) {
    logError('Exception in getYouTubeVideos', {}, error);
    return [];
  }
};

export const addYouTubeVideo = async (url, title, description, isRetry = false) => {
  try {
    if (!url || !title) {
      throw new Error('URL and title are required');
    }

    const payload = {
      section_name: 'experience_arrivals',
      video_url: url.trim(),
      video_title: title.trim(),
      video_description: description?.trim() || '',
      video_type: 'youtube',
      is_active: true,
      display_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('home_page_videos')
      .insert([payload])
      .select()
      .maybeSingle();

    if (error) {
      const shouldRetry = !isRetry && await handleQueryError(error, 'INSERT', 'home_page_videos', { title });
      if (shouldRetry) return addYouTubeVideo(url, title, description, true);
      throw new Error(error.message || 'Failed to add YouTube video');
    }

    logInfo('YouTube video added successfully', { id: data.id, title });
    return data;
  } catch (error) {
    logError('Failed to add YouTube video', { title }, error);
    throw error;
  }
};

export const updateYouTubeVideo = async (id, title, description, isRetry = false) => {
  try {
    if (!id) {
      throw new Error('Video ID is required');
    }

    const payload = {
      video_title: title?.trim() || '',
      video_description: description?.trim() || '',
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('home_page_videos')
      .update(payload)
      .eq('id', id)
      .eq('video_type', 'youtube')
      .select()
      .maybeSingle();

    if (error) {
      const shouldRetry = !isRetry && await handleQueryError(error, 'UPDATE', 'home_page_videos', { videoId: id });
      if (shouldRetry) return updateYouTubeVideo(id, title, description, true);
      throw new Error(error.message || 'Failed to update YouTube video');
    }

    logInfo('YouTube video updated successfully', { id, title });
    return data;
  } catch (error) {
    logError('Failed to update YouTube video', { videoId: id }, error);
    throw error;
  }
};

export const deleteYouTubeVideo = async (id, isRetry = false) => {
  try {
    if (!id) {
      throw new Error('Video ID is required');
    }

    const { error } = await supabase
      .from('home_page_videos')
      .delete()
      .eq('id', id)
      .eq('video_type', 'youtube');

    if (error) {
      const shouldRetry = !isRetry && await handleQueryError(error, 'DELETE', 'home_page_videos', { videoId: id });
      if (shouldRetry) return deleteYouTubeVideo(id, true);
      throw new Error(error.message || 'Failed to delete YouTube video');
    }

    logInfo('YouTube video deleted successfully', { id });
    return true;
  } catch (error) {
    logError('Failed to delete YouTube video', { videoId: id }, error);
    throw error;
  }
};