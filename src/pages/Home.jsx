import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Image as ImageIcon, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi';
import DeliveryReach from '@/components/DeliveryReach';
import { useExploreFarmImage } from '@/hooks/useExploreFarmImage';
import { getFeaturedBlogPosts } from '@/utils/supabaseQueries';
import { getDeliveryMapImage } from '@/hooks/useHomePageImages';
import { logInfo, logError } from '@/utils/errorLogger';
import SEOHead from '@/components/SEOHead';
import HeroCarousel from '@/components/HeroCarousel';

const ExploreFarmSection = () => {
  const { image, loading } = useExploreFarmImage();

  return (
    <section className="py-20 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h2 className="text-5xl font-['Playfair_Display'] font-bold text-white mb-6">Explore Our Farm</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the environment where our Friesian horses are raised, trained, and cared for with excellence.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl luxury-border">
          {loading ? (
            <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          ) : (
            <img 
              src={image?.file_path || "https://images.unsplash.com/photo-1677612128153-d251048b7a1f"} 
              alt={image?.alt_text || "Premium equestrian farm facility and pastures"} 
              className="w-full h-full object-cover" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
            <div className="p-8 md:p-12 w-full">
              <h3 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-white mb-4">A Legacy of Excellence</h3>
              <p className="text-lg text-gray-300 max-w-2xl mb-8">
                Our state-of-the-art facilities ensure every horse receives the pinnacle of care, training, and attention they deserve.
              </p>
              <Link to="/about">
                <Button className="bg-[#d4af37] text-black hover:bg-[#b5952f] rounded-lg px-8 py-6 text-base font-semibold">
                  Discover Our Story
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-[#222] text-gray-500 ${className}`}>
        <ImageIcon size={32} className="mb-2 opacity-50" />
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

const LatestInsightsSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedPosts = async () => {
      try {
        logInfo('Loading featured blog posts for home page');
        setLoading(true);
        const data = await getFeaturedBlogPosts(3);
        setPosts(data || []);
        logInfo('Featured posts loaded successfully', { count: data?.length || 0 });
      } catch (err) {
        logError('Failed to load featured posts for home page', {}, err);
        setError('Unable to load articles');
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedPosts();
  }, []);

  return (
    <section className="py-24 bg-[#111] border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-4">Latest Insights</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Expert knowledge, breeding insights, and equestrian care tips.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-10 w-10 text-[#d4af37] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 bg-red-900/10 p-8 rounded-2xl border border-red-500/20">
            <p>{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-[#1a1a1a] rounded-2xl border border-white/10">
            More insights coming soon. Stay tuned!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="group h-full">
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden hover:border-[#d4af37]/30 transition-all duration-300 h-full flex flex-col shadow-xl">
                    <div className="relative overflow-hidden aspect-[16/10] bg-[#0a0a0a]">
                      {post.featured_image ? (
                        <img src={post.featured_image} alt={post.featured_image_alt || post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-xs text-[#d4af37] font-medium mb-3">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.published_at || post.created_at).toLocaleDateString()}
                      </div>
                      <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white leading-tight mb-3 group-hover:text-[#d4af37] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                        {post.introduction || post.meta_description || (post.content && post.content.substring(0, 150) + '...')}
                      </p>
                      <span className="text-white text-sm font-bold flex items-center gap-2 group-hover:text-[#d4af37] transition-colors mt-auto">
                        Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/blog">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-5">
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const DeliveryMapSection = () => {
  const [mapImage, setMapImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMap = async () => {
      setLoading(true);
      const img = await getDeliveryMapImage();
      setMapImage(img);
      setLoading(false);
    };
    fetchMap();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[#1a1a1a] flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#d4af37]" />
      </section>
    );
  }

  if (!mapImage) return null;

  return (
    <section className="py-24 bg-[#1a1a1a] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-4">Map Delivery Reach — Successful Logistics</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            We ensure safe, reliable, and comfortable transportation for your premium Friesian horse across the United States. Our logistics partners are experienced professionals deeply dedicated to equine care.
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-[#111] p-2 md:p-6 mx-auto max-w-5xl">
          <img 
            src={mapImage.image_url} 
            alt={mapImage.image_alt || "Map showing nationwide horse delivery reach"} 
            className="w-full h-auto object-contain rounded-2xl bg-[#0a0a0a]" 
          />
        </motion.div>
      </div>
    </section>
  );
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const response = await getProducts({ limit: 4 });
        if (response.products.length > 0) {
          const productIds = response.products.map(p => p.id);
          const quantitiesResponse = await getProductQuantities({
            fields: 'inventory_quantity',
            product_ids: productIds
          });
          const variantQuantityMap = new Map();
          quantitiesResponse.variants.forEach(v => variantQuantityMap.set(v.id, v.inventory_quantity));
          const productsWithQuantities = response.products.map((product) => ({
            ...product,
            variants: product.variants.map(variant => ({
              ...variant,
              inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
            }))
          }));
          setFeaturedProducts(productsWithQuantities);
        }
      } catch (err) {
        setProductsError("Failed to load featured horses. Please try refreshing.");
      } finally {
        setProductsLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const handleSeeDetails = useCallback((e, product) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`, {
      state: { featuredImage: product.image }
    });
  }, [navigate]);

  return (
    <>
      <SEOHead 
        title="Dream Black Horse - Premium Horse Sales & Breeding"
        description="Discover premium horses for sale at Dream Black Horse. Browse our collection of Arabian, Thoroughbred, and other quality horses. Expert breeding and sales."
        canonical="/"
      />

      <div className="bg-[#111]">
        
        <section className="pt-16 lg:pt-0 border-b border-white/10">
          <HeroCarousel />
        </section>

        <h1 className="sr-only">Dream Black Horse - Premium Horse Sales & Breeding</h1>

        <section className="py-20 bg-[#1a1a1a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-4">Featured Collection</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Handpicked premium horses ready for a new partnership
              </p>
            </motion.div>

            {productsLoading && <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 text-gray-500 animate-spin" /></div>}
            {productsError && (
              <div className="text-center text-red-400 bg-red-900/10 p-8 rounded-2xl border border-red-500/20">
                <p>{productsError}</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 border-red-500/50 text-white hover:bg-red-500/20">Retry</Button>
              </div>
            )}
            
            {!productsLoading && !productsError && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product, index) => {
                  const displayVariant = product.variants[0];
                  const hasSale = displayVariant && displayVariant.sale_price_in_cents !== null;
                  const displayPrice = hasSale ? displayVariant.sale_price_formatted : displayVariant.price_formatted;
                  return (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="group">
                      <Link to={`/product/${product.id}`} state={{ featuredImage: product.image }} className="block">
                        <div className="relative overflow-hidden rounded-2xl mb-4 bg-[#222] aspect-square border border-white/5">
                          <ImageWithFallback className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={`Premium horse: ${product.title}`} src={product.image} />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button onClick={e => handleSeeDetails(e, product)} className="bg-white text-black hover:bg-gray-200 rounded-full px-6 py-3 shadow-2xl transform group-hover:scale-100 scale-90 transition-transform font-bold" aria-label={`See details for ${product.title}`}>
                              View Details
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1 text-center">
                          <h3 className="text-xl font-['Playfair_Display'] font-bold text-white truncate">{product.title}</h3>
                          <p className="text-[#d4af37] font-semibold">{displayPrice}</p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="text-center mt-16">
              <Link to="/horses">
                <Button className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 rounded-full px-10 py-6 font-bold text-lg">
                  View Full Collection
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#0f0f0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 p-2 bg-[#1a1a1a]">
                   <ImageWithFallback className="w-full h-[500px] object-cover rounded-2xl" alt="Expert horse trainer with majestic Friesian horse" src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a" />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">Curated With Care</h2>
                <div className="w-20 h-1 bg-[#d4af37] mb-8" />
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Every horse in our collection is carefully selected for its unique character, impeccable conformation, and exceptional bloodlines. We believe in nurturing the profound connection between horse and rider.
                </p>
                <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                  Operating with decades of expertise, we directly import authentic Friesians from the Netherlands, ensuring transparency, health, and unmatched quality in every match we make.
                </p>
                <Link to="/about">
                  <Button className="bg-white text-black hover:bg-gray-200 transition-colors duration-300 rounded-full px-8 py-6 font-bold">
                    Discover Our Story
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <LatestInsightsSection />
        
        <DeliveryMapSection />
        
        <DeliveryReach />
        <ExploreFarmSection />

      </div>
    </>
  );
};

export default Home;