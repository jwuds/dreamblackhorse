
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Search, MessageSquare, Stethoscope, FileText, Truck, Home, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LatestBlogSection from '@/components/LatestBlogSection';
import DeliveryReach from '@/components/DeliveryReach';
import AffiliationsSection from '@/components/AffiliationsSection';
import EditableImage from '@/components/EditableImage';
import ImageCarousel from '@/components/ImageCarousel';
import { getProducts } from '@/api/EcommerceApi';
import { useBeginJourneyImage } from '@/hooks/useBeginJourneyImage';
import { retryFetch } from '@/utils/retryFetch';
import { useNetworkStatus } from '@/utils/networkCheck';

const HomePage = () => {
  const [featuredHorses, setFeaturedHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    journeyImage,
    fetchImage: fetchJourneyImage
  } = useBeginJourneyImage();

  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await retryFetch(() => getProducts({
        limit: 4
      }), 3, 1000, 30000);
      const available = (data?.products || []).filter(h => h.purchasable).slice(0, 3);
      setFeaturedHorses(available);
    } catch (err) {
      console.error('[HomePage] Error loading featured horses:', err);
      setError('Failed to load our featured collection. Please check your connection.');
      setFeaturedHorses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useNetworkStatus(fetchFeatured);

  useEffect(() => {
    fetchFeatured();
    fetchJourneyImage();
  }, [fetchFeatured, fetchJourneyImage]);

  const [pageImages, setPageImages] = useState({
    heroImage: "https://images.unsplash.com/photo-1613437190836-d59585104264"
  });

  const welcomeImages = ["https://images.unsplash.com/photo-1613437190836-d59585104264", "https://images.unsplash.com/photo-1598026619363-a024cadfcff1", "https://images.unsplash.com/photo-1551191916-07a589e85954"];

  const handleImageUpdate = (key, newUrl) => {
    setPageImages(prev => ({
      ...prev,
      [key]: newUrl
    }));
  };

  const journeySteps = [{
    icon: Search,
    title: 'Browse & Select',
    description: 'Explore our curated collection of premium Friesians online.'
  }, {
    icon: MessageSquare,
    title: 'Consultation',
    description: 'Discuss your goals with our experts to find your perfect match.'
  }, {
    icon: Stethoscope,
    title: 'Vet Review',
    description: 'Complete veterinary examination and review of health records.'
  }, {
    icon: FileText,
    title: 'Documentation',
    description: 'Secure purchase agreement and export paperwork processing.'
  }, {
    icon: Truck,
    title: 'Transport',
    description: 'Professional door-to-door delivery coordination worldwide.'
  }, {
    icon: Home,
    title: 'Welcome Home',
    description: 'Arrival of your new partner and start of your journey together.'
  }];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AnimalShelter"],
    "name": "Dream Black Horse",
    "description": "Premium KFPS-registered Friesian horse sales in Mt Dora, Florida. Expert guidance, vet-checked horses, and worldwide transport.",
    "url": "https://dreamblackhorse.com",
    "email": "contact@dreamblackhorse.com",
    "priceRange": "$$$",
    "image": "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "21210 Horse Ranch Rd",
      "addressLocality": "Mt Dora",
      "addressRegion": "FL",
      "postalCode": "32757",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.8029",
      "longitude": "-81.6437"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    }
  };

  return (
    <>
      <SEOHead
        title="Dream Black Horse — Premium Friesian Horses for Sale in Florida"
        description="KFPS-registered Friesian horses for sale in Mt Dora, FL. Vet-checked, fully documented, worldwide delivery. Browse our current availability."
        canonical="/"
        keywords="friesian horses for sale, KFPS friesian horse, buy friesian horse USA, black horses for sale Florida, Mt Dora horse farm, dream black horse"
        schema={localBusinessSchema}
      />

      <div className="bg-[#1a1a1a] min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-black">
          <div className="absolute inset-0">
            <EditableImage src={pageImages.heroImage} alt="Majestic black horse in motion" className="w-full h-full absolute inset-0 object-cover opacity-80" storageKey="heroImage" onUpdate={handleImageUpdate} loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#1a1a1a] z-10 pointer-events-none" />
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 pointer-events-none w-full">
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 1
          }} className="pointer-events-auto w-full">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-['Playfair_Display'] font-bold text-white mb-6 md:mb-8 leading-tight drop-shadow-2xl">
                Dream Horse Classifieds
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 font-light drop-shadow-lg whitespace-pre-line">
                "We make your Friesian horse dream a reality!."{"\n"}We specialize in pure bred horses.{"\n"}Discover our premium curated catalog of horses from champion bloodlines, bred for performance and beauty.
              </p>
              <Link to="/horses" className="inline-block touch-manipulation">
                <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-10 sm:px-14 py-7 sm:py-8 text-lg sm:text-xl font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-1 w-full sm:w-auto min-h-[48px]">
                  Explore Our Horses
                  <ArrowRight className="ml-3 w-6 h-6 sm:w-7 sm:h-7" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none hidden sm:block">
            <motion.div animate={{
            y: [0, 10, 0]
          }} transition={{
            duration: 2,
            repeat: Infinity
          }} className="text-white/50">
              <div className="w-px h-16 md:h-24 bg-white/40 mx-auto" />
            </motion.div>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#1a1a1a] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <motion.div initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true,
              margin: "-100px"
            }} transition={{
              duration: 0.8
            }} className="space-y-8">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-['Playfair_Display'] font-bold text-white leading-tight">
                  Welcome to Dream Black Horse Farm
                </h2>
                <div className="w-24 h-1 bg-white/20" />
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                  Dream black horse farm is the best place to create that genuine <strong>Friesian connection</strong>. We are experienced <strong>Friesian horse breeders</strong> and specialized in <strong>pure bred Friesians</strong>. If you're looking to <strong>buy a friesian</strong> we can aid in your unique <strong>equestrian journey.</strong>
                </p>
                <Link to="/about" className="inline-block touch-manipulation pt-4">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black rounded-full px-10 py-7 text-lg font-bold transition-all duration-300">
                    Learn Our Story
                  </Button>
                </Link>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              x: 20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true,
              margin: "-100px"
            }} transition={{
              duration: 0.8
            }} className="relative mt-8 lg:mt-0 h-[400px] lg:h-[600px] w-full">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-[#111]">
                  <ImageCarousel images={welcomeImages} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Affiliations Section */}
        <AffiliationsSection />

        {/* Featured Horses Section */}
        <section className="py-24 sm:py-32 bg-[#111]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: "-100px"
          }} transition={{
            duration: 0.8
          }} className="text-center mb-16 sm:mb-24">
              <h2 className="text-5xl sm:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">
                Featured Collection
              </h2>
              <div className="w-24 h-1 bg-white/20 mx-auto mb-8" />
              <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto px-4 font-light">
                Exceptional horses currently available for discerning buyers
              </p>
            </motion.div>

            {loading && !error && <div className="flex justify-center items-center h-64">
                <Loader2 className="h-16 w-16 text-white animate-spin" />
              </div>}

            {error && !loading && <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#1a1a1a] rounded-3xl border border-white/5 shadow-xl max-w-3xl mx-auto mb-16">
                <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Connection Error</h3>
                <p className="text-gray-400 mb-8 text-center max-w-md">{error}</p>
                <Button onClick={fetchFeatured} variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black rounded-full px-8">
                  <RefreshCw className="w-4 h-4 mr-2" /> Retry Connection
                </Button>
              </div>}

            {!loading && !error && featuredHorses.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 mb-16 sm:mb-20">
                {featuredHorses.map((horse, index) => {
              const displayVariant = horse.variants?.[0];
              const displayPrice = displayVariant?.sale_price_in_cents !== null ? displayVariant?.sale_price_formatted : displayVariant?.price_formatted;
              return <motion.div key={horse.id} initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true,
                margin: "-50px"
              }} transition={{
                duration: 0.6,
                delay: index * 0.1
              }} className="group touch-manipulation bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-white/5 hover:border-white/20 hover:-translate-y-2">
                      <Link to={`/product/${horse.id}`} className="block h-full flex flex-col">
                        <div className="relative overflow-hidden w-full">
                          <img src={horse.image} alt={`Portrait of ${horse.title} - Featured Horse`} className="horse-image-container-md w-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-80" />
                        </div>
                        <div className="space-y-3 text-center px-6 pb-8 pt-4 relative z-10 -mt-12">
                          <h3 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-white truncate drop-shadow-md">
                            {horse.title}
                          </h3>
                          <p className="text-white text-xl sm:text-2xl font-semibold bg-white/10 py-2 rounded-lg backdrop-blur-sm border border-white/5 w-fit mx-auto px-6">{displayPrice}</p>
                        </div>
                      </Link>
                    </motion.div>;
            })}
              </div>}

            {!loading && !error && featuredHorses.length === 0 && <div className="text-center py-16 bg-[#1a1a1a] rounded-3xl border border-white/5 shadow-xl max-w-3xl mx-auto mb-16">
                 <p className="text-gray-400 text-lg">No featured horses available at the moment. Please check back later.</p>
               </div>}

            <div className="text-center px-4">
              <Link to="/horses" className="inline-block touch-manipulation w-full sm:w-auto">
                <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-12 sm:px-16 py-7 sm:py-8 text-lg sm:text-xl font-bold shadow-2xl w-full sm:w-auto transition-all hover:scale-105">
                  View All Horses
                  <ArrowRight className="ml-3 w-6 h-6 sm:w-7 sm:h-7" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Journey to Ownership Section */}
        <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#1a1a1a] border-t border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: "-100px"
          }} transition={{
            duration: 0.8
          }} className="text-center mb-16 sm:mb-24">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">
                Journey to Ownership
              </h2>
              <div className="w-24 h-1 bg-white/20 mx-auto mb-8" />
              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto px-4 font-light">
                A seamless, transparent process designed to unite you with your perfect equine partner.
              </p>
            </motion.div>

            <div className="relative">
              <div className="hidden lg:block absolute top-[4rem] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-white/0 via-white/20 to-white/0 z-0" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 relative z-10">
                {journeySteps.map((step, index) => <motion.div key={step.title} initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true,
                margin: "-50px"
              }} transition={{
                duration: 0.6,
                delay: index * 0.1
              }} className="group flex flex-col items-center text-center p-6 sm:p-4 rounded-2xl sm:rounded-xl bg-white/5 sm:bg-transparent hover:bg-white/10 sm:hover:bg-white/5 transition-all duration-300 luxury-border sm:border-transparent sm:hover:border-white/10">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center justify-center mb-6 sm:mb-8 sm:group-hover:border-white sm:group-hover:scale-110 sm:group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-500 z-10 relative shadow-xl">
                      <step.icon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 sm:group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-widest bg-black/50 py-1 px-3 rounded-full w-fit mx-auto border border-white/5">Step {index + 1}</div>
                      <h3 className="text-xl sm:text-2xl font-['Playfair_Display'] font-bold text-white sm:group-hover:text-gray-200 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-base text-gray-400 leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>)}
              </div>
            </div>
          </div>
        </section>

        <DeliveryReach />
        
        {/* Latest Blog Section */}
        <LatestBlogSection />

        {/* CTA Section */}
        <section className="py-20 sm:py-32 bg-[#111] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: "-100px"
          }} transition={{
            duration: 0.8
          }} className="bg-gradient-to-br from-[#222] to-[#111] rounded-3xl p-12 sm:p-20 text-center luxury-border shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1613437190836-d59585104264')] opacity-5 mix-blend-overlay object-cover" />
              <div className="relative z-10">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-['Playfair_Display'] font-bold text-white mb-6 sm:mb-8 drop-shadow-lg">
                  Begin Your Journey With Us
                </h2>
                <p className="text-xl md:text-2xl text-gray-300 mb-10 sm:mb-12 max-w-3xl mx-auto px-4 font-light">
                  Connect with us to find your perfect equine partner. Our team is ready to guide you through every step of this exciting process.
                </p>

                {journeyImage?.image_url && <div className="mb-10 max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
                    <img src={journeyImage.image_url} alt={journeyImage.alt_text || 'Begin Your Journey'} className="w-full max-h-[500px] object-cover" />
                  </div>}

                <Link to="/contact" className="inline-block touch-manipulation w-full sm:w-auto">
                  <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-12 sm:px-14 py-7 sm:py-8 text-lg sm:text-xl font-bold shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:-translate-y-1 w-full sm:w-auto transition-all">
                    Contact Us Today
                    <ArrowRight className="ml-3 w-6 h-6 sm:w-7 sm:h-7" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
