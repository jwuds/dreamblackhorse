import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Eye, ArrowLeft, Tag, ExternalLink as ExternalLinkIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import SEOHead from '@/components/SEOHead';
import { marked } from 'marked';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import ErrorBoundary from '@/components/ErrorBoundary';

const BlogPostContent = () => {
  const { slug } = useParams();
  const { fetchPostBySlug, incrementViewCount, loading: fetchLoading } = useBlogPosts();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      setNotFound(false);
      
      try {
        const data = await fetchPostBySlug(slug);
        
        if (data && data.title && data.content) {
          setPost(data);
          incrementViewCount(data.id);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error loading blog post:", err);
        setError("An error occurred while loading the article. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [slug, fetchPostBySlug, incrementViewCount]);

  if (loading || fetchLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium">Loading article...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-[#111] p-10 rounded-3xl border border-white/10 max-w-lg w-full shadow-2xl">
          <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog">
            <Button className="bg-[#d4af37] text-black font-bold hover:bg-[#b5952f] w-full">
              Browse All Articles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-[#111] p-10 rounded-3xl border border-red-500/20 max-w-lg w-full shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Failed to Load</h1>
          <p className="text-gray-400 mb-8">{error || "An unexpected error occurred while processing the post."}</p>
          <div className="flex gap-4">
             <Button onClick={() => window.location.reload()} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
               Retry
             </Button>
             <Link to="/blog" className="flex-1">
               <Button className="w-full bg-[#d4af37] text-black font-bold hover:bg-[#b5952f]">
                 Back to Blog
               </Button>
             </Link>
          </div>
        </div>
      </div>
    );
  }

  let htmlContent = '';
  try {
    htmlContent = marked.parse(post.content || '');
  } catch (e) {
    console.error("Markdown parsing failed:", e);
    htmlContent = `<p>${post.content}</p>`;
  }

  const faqItems = Array.isArray(post.faq_items) ? post.faq_items : [];
  const internalLinks = Array.isArray(post.internal_links) ? post.internal_links : [];
  const liveLinks = Array.isArray(post.live_links) ? post.live_links : [];
  const tagsList = Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? post.tags.split(',') : []);

  const faqSchema = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(faq => ({
      "@type": "Question",
      "name": faq.question || '',
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer ? marked.parse(faq.answer).replace(/<[^>]*>?/gm, '') : ''
      }
    }))
  } : null;

  return (
    <>
      <SEOHead 
        title={post.seo_title || `${post.title} - Dream Black Horse Blog`}
        description={post.meta_description || post.introduction || post.title}
        canonical={`/blog/${post.slug}`}
      />
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}

      <div className="bg-[#1a1a1a] min-h-screen pb-20">
        <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#1a1a1a] z-10 opacity-95" />
             {post.featured_image && (
               <img 
                 src={post.featured_image} 
                 alt={post.featured_image_alt || post.title} 
                 className="w-full h-full object-cover blur-md opacity-20"
               />
             )}
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link to="/blog" className="inline-flex items-center text-gray-400 hover:text-[#d4af37] mb-8 transition-colors text-sm font-bold uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
            </Link>
            
            <div className="mb-6 flex justify-center">
              <span className="px-4 py-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest rounded-full">
                {post.category || 'News'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-bold text-white mb-8 leading-tight">
              {post.h1_headline || post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#d4af37]" /> {post.author || 'Dream Black Horse Team'}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d4af37]" /> {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#d4af37]" /> {post.view_count || 0} Views
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="bg-[#111] rounded-[2rem] p-6 md:p-12 lg:p-16 shadow-2xl border border-white/5">
            
            {post.featured_image && (
              <div className="mb-12 rounded-2xl overflow-hidden aspect-[16/9] shadow-lg border border-white/10 bg-[#0a0a0a]">
                <img 
                  src={post.featured_image} 
                  alt={post.featured_image_alt || post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {post.introduction && (
              <div className="mb-12 text-xl md:text-2xl text-gray-300 font-['Playfair_Display'] italic leading-relaxed border-l-4 border-[#d4af37] pl-6 py-2">
                {post.introduction}
              </div>
            )}

            <div 
              className="blog-prose mb-12 text-gray-300"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Internal Links Section */}
            {internalLinks.length > 0 && (
              <div className="mb-12 p-6 bg-[#1a1a1a] rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Related Pages</h3>
                <div className="grid gap-3">
                  {internalLinks.map((link, index) => (
                    <Link 
                      key={index} 
                      to={link.link_url || '#'}
                      className="flex items-center gap-3 p-3 bg-[#111] rounded-lg border border-white/5 hover:border-[#d4af37]/30 transition-all group"
                    >
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full group-hover:scale-125 transition-transform"></div>
                      <span className="text-white group-hover:text-[#d4af37] transition-colors font-medium">
                        {link.link_text || 'Related Link'}
                      </span>
                      {link.link_type && (
                        <span className="ml-auto text-xs text-gray-500 uppercase">{link.link_type}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Live Links Section */}
            {liveLinks.length > 0 && (
              <div className="mb-12 p-6 bg-[#1a1a1a] rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">External Resources</h3>
                <div className="grid gap-3">
                  {liveLinks.map((link, index) => (
                    <a 
                      key={index} 
                      href={link.link_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[#111] rounded-lg border border-white/5 hover:border-[#d4af37]/30 transition-all group"
                      title={link.link_title || link.link_url}
                    >
                      <ExternalLinkIcon className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <span className="text-white group-hover:text-[#d4af37] transition-colors font-medium block">
                          {link.link_text || link.link_url || 'External Link'}
                        </span>
                        {link.link_title && (
                          <span className="text-xs text-gray-500 block truncate">{link.link_title}</span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {faqItems.length > 0 && (
              <div className="mt-16 pt-12 border-t border-white/10">
                <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {faqItems.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 bg-[#1a1a1a] rounded-xl px-6 data-[state=open]:border-[#d4af37]/30 transition-all">
                      <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-[#d4af37] py-6">
                        {faq.question || 'Question?'}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400 pb-6 leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: marked.parse(faq.answer || '') }} className="prose prose-invert prose-p:mb-2 max-w-none" />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {post.conclusion && (
              <div className="mt-12 pt-8 border-t border-white/10 bg-[#1a1a1a] p-8 rounded-2xl">
                <h3 className="text-2xl font-['Playfair_Display'] text-white font-bold mb-4">In Conclusion</h3>
                <p className="text-gray-300 leading-relaxed mb-6">{post.conclusion}</p>
                <Link to="/contact">
                  <Button className="bg-[#d4af37] text-black font-bold hover:bg-[#b5952f]">
                    Contact Us Today
                  </Button>
                </Link>
              </div>
            )}

            {tagsList.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-3">
                <Tag className="w-5 h-5 text-gray-500 mt-0.5" />
                {tagsList.map(tag => (
                  tag ? (
                    <span key={tag} className="px-3 py-1 bg-white/5 text-gray-300 text-xs font-semibold rounded-full border border-white/10">
                      {typeof tag === 'string' ? tag.trim() : JSON.stringify(tag)}
                    </span>
                  ) : null
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

const BlogPost = () => {
  return (
    <ErrorBoundary>
      <BlogPostContent />
    </ErrorBoundary>
  );
};

export default BlogPost;