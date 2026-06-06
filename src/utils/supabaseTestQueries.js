import { supabase } from '@/lib/customSupabaseClient';
import { logInfo, logError } from '@/utils/errorLogger';

export const testBlogPostQuery = async (slug) => {
  console.log(`[TEST] Testing getBlogPostBySlug for slug: ${slug}`);
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
      
    if (error) {
      console.error('[TEST] Error fetching blog post:', error);
      return { success: false, error };
    }
    
    console.log(`[TEST] Success. Found post: ${data ? 'YES' : 'NO'}`);
    return { success: true, data };
  } catch (err) {
    console.error('[TEST] Exception in testBlogPostQuery:', err);
    return { success: false, error: err };
  }
};

export const testAllBlogPostsQuery = async () => {
  console.log(`[TEST] Testing getBlogPosts`);
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, status')
      .eq('status', 'published')
      .limit(10);
      
    if (error) {
      console.error('[TEST] Error fetching all blog posts:', error);
      return { success: false, error };
    }
    
    console.log(`[TEST] Success. Found ${data?.length || 0} published posts.`);
    return { success: true, data };
  } catch (err) {
    console.error('[TEST] Exception in testAllBlogPostsQuery:', err);
    return { success: false, error: err };
  }
};

export const testDataIntegrity = async () => {
  console.log(`[TEST] Testing Data Integrity`);
  try {
    // Check duplicates
    const { data: duplicates, error: dupError } = await supabase
      .rpc('get_duplicate_slugs'); // Assumes RPC exists or we just fetch all and check locally
      
    const { data: allPosts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('slug');
      
    if (fetchError) throw fetchError;
    
    const slugCounts = {};
    const dupSlugs = [];
    allPosts?.forEach(p => {
      slugCounts[p.slug] = (slugCounts[p.slug] || 0) + 1;
      if (slugCounts[p.slug] > 1 && !dupSlugs.includes(p.slug)) dupSlugs.push(p.slug);
    });
    
    console.log(`[TEST] Data Integrity Check. Duplicate Slugs found: ${dupSlugs.length}`, dupSlugs);
    return { success: true, duplicates: dupSlugs };
  } catch (err) {
    console.error('[TEST] Exception in testDataIntegrity:', err);
    return { success: false, error: err };
  }
};

export const runAllTests = async () => {
  logInfo('Starting Supabase Test Suite');
  await testAllBlogPostsQuery();
  await testDataIntegrity();
  logInfo('Finished Supabase Test Suite');
};