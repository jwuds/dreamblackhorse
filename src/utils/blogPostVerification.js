import { supabase } from '@/lib/customSupabaseClient';
import { logInfo, logError } from '@/utils/errorLogger';

export const verifyBlogPosts = async () => {
  const slugsToVerify = [
    'from-roblox-to-reality',
    'why-choose-dream-black-horse-farm-to-buy-your-friesian-horse'
  ];

  const results = [];

  for (const slug of slugsToVerify) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        logError(`Verification Failed: Post not found or not published`, { slug });
        results.push({ slug, status: 'Not Found / Not Published', valid: false });
        continue;
      }

      const isValidJSON = (val) => Array.isArray(val) || (typeof val === 'string' && val.startsWith('['));
      
      const validation = {
        hasTitle: !!data.title,
        hasContent: !!data.content,
        hasAuthor: !!data.author,
        hasCategory: !!data.category,
        isPublished: data.status === 'published',
        hasPublishedAt: !!data.published_at,
        validTags: Array.isArray(data.tags),
        validFaq: isValidJSON(data.faq_items),
        validInternalLinks: isValidJSON(data.internal_links),
        validLiveLinks: isValidJSON(data.live_links)
      };

      const allValid = Object.values(validation).every(v => v === true);

      if (allValid) {
        logInfo(`Verification Passed: Post configured correctly`, { slug });
      } else {
        logError(`Verification Failed: Missing or invalid fields`, { slug, validation });
      }

      results.push({ slug, ...validation, valid: allValid, data });
    } catch (err) {
      logError(`Exception during verification for ${slug}`, null, err);
      results.push({ slug, status: 'Error', error: err.message, valid: false });
    }
  }

  console.table(results);
  return results;
};