import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, XCircle, ChevronLeft, ChevronRight, MapPin, Mail, Calendar, Ruler, Activity, Heart, Award, ShieldCheck, Tag } from 'lucide-react';
import SimilarHorsesSection from '@/components/SimilarHorsesSection';
import SpecBadge from '@/components/SpecBadge';
import HealthStatusBadge from '@/components/HealthStatusBadge';
import TrainingLevelBadge from '@/components/TrainingLevelBadge';
import { getProduct } from '@/api/EcommerceApi';
import SEOHead from '@/components/SEOHead';
import { parseHorseFields, formatHorseAge, formatHorseHeight } from '@/utils/horseUtils';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmEyYTJhIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=";

function ProductDetailPage({ setIsCartOpen }) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getProduct(id);
        
        if (data) {
          const images = data.images || [];
          if (images.length === 0 && data.image) {
            images.push({ url: data.image, type: 'featured' });
          }

          const processedProduct = {
            ...data,
            images
          };

          setProduct(processedProduct);
          if (processedProduct.variants?.length > 0) {
            setSelectedVariant(processedProduct.variants[0]);
          }
          setCurrentImageIndex(0);
        } else {
          setError('Horse not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleAddToCart = useCallback(async () => {
    if (product && selectedVariant) {
      const availableQuantity = selectedVariant.inventory_quantity;
      try {
        await addToCart(product, selectedVariant, quantity, availableQuantity);
        setIsCartOpen(true);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      }
    }
  }, [product, selectedVariant, quantity, addToCart, toast, setIsCartOpen]);

  const handlePrevImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    }
  }, [product?.images?.length]);

  const handleNextImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
    }
  }, [product?.images?.length]);

  const handleScheduleViewing = () => {
    toast({
      title: "Viewing Request Initiated",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-[#0f0f0f]">
        <Loader2 className="h-16 w-16 text-[#d4af37] animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 bg-[#0f0f0f] min-h-[60vh]">
        <Link to="/horses" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 font-bold">
          <ArrowLeft size={16} />
          Back to Collection
        </Link>
        <div className="text-center text-red-500 p-12 bg-red-500/10 border border-red-500/20 rounded-3xl shadow-2xl">
          <XCircle className="mx-auto h-20 w-20 mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-3 font-['Playfair_Display'] text-white">Record Unavailable</h2>
          <p className="text-red-300 text-lg">{error || "The horse you're looking for could not be found."}</p>
        </div>
      </div>
    );
  }

  const fields = parseHorseFields(product);
  const price = selectedVariant?.sale_price_formatted || selectedVariant?.price_formatted;
  const availableStock = selectedVariant ? selectedVariant.inventory_quantity : 0;
  const isStockManaged = selectedVariant?.manage_inventory ?? false;
  const isInStock = !isStockManaged || availableStock > 0;
  const canAddToCart = isInStock && product.purchasable;

  const currentImage = product.images[currentImageIndex]?.url || product.image || placeholderImage;
  const hasMultipleImages = product.images.length > 1;

  // SEO Dynamic Data
  const horseName = product.title || "Premium Horse";
  const horseBreed = fields.breed || "Premium";
  const seoTitle = `${horseName} - ${horseBreed} Horse for Sale | Dream Black Horse`;
  const seoH1 = `${horseName} - ${horseBreed} Horse for Sale`;
  const ageDisplay = formatHorseAge(fields.age);
  const seoDescription = `${horseName} - ${ageDisplay} old ${horseBreed} horse for sale in Mt Dora, Florida. ${fields.temperament ? `${fields.temperament} temperament.` : ''} ${fields.training_level ? `${fields.training_level} training.` : ''} KFPS-registered, vet-checked, worldwide delivery available.`.trim();

  // Product JSON-LD schema
  const priceRaw = selectedVariant?.sale_price_in_cents || selectedVariant?.price_in_cents;
  const priceValue = priceRaw ? (priceRaw / 100).toFixed(2) : undefined;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description?.replace(/<[^>]*>?/gm, '').trim() || seoDescription,
    "image": (product.images?.map(img => img.url).filter(Boolean).length
      ? product.images.map(img => img.url).filter(Boolean)
      : product.image ? [product.image] : []),
    "brand": { "@type": "Brand", "name": "Dream Black Horse" },
    "category": fields.breed ? `${fields.breed} Horse` : "Horse",
    ...(fields.color && { "color": fields.color }),
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      ...(priceValue && { "price": priceValue }),
      "availability": isInStock
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      "url": `https://dreamblackhorse.com/product/${id}`,
      "seller": {
        "@type": "Organization",
        "name": "Dream Black Horse",
        "url": "https://dreamblackhorse.com"
      }
    }
  };

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonical={`/product/${id}`}
        ogData={{
          title: seoTitle,
          description: seoDescription,
          image: product.image,
          url: `https://dreamblackhorse.com/product/${id}`,
          type: 'product',
        }}
        keywords={`${horseName}, ${horseBreed} horse for sale, KFPS friesian, buy friesian horse, horse for sale Florida, Dream Black Horse`}
        schema={productSchema}
      />
      <div className="bg-[#0f0f0f] min-h-screen pb-24">
        {/* Navigation Bar */}
        <div className="border-b border-white/10 bg-[#1a1a1a]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link to="/horses" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#d4af37] transition-colors font-bold text-sm uppercase tracking-wider">
              <ArrowLeft size={16} />
              Collection
            </Link>
            <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
              <span className="text-gray-400">Share:</span>
              <a href={`mailto:?subject=Look at this beautiful horse: ${product.title}&body=Check out ${product.title} at ${window.location.href}`} className="text-white hover:text-[#d4af37] transition-colors"><Mail size={18} /></a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column - Images */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-7 flex flex-col gap-4">
              <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-[#111] border border-white/10 aspect-[4/3] group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={currentImage} 
                    alt={`View ${currentImageIndex + 1} of ${product.title}`} 
                    className="w-full h-full object-cover" 
                    loading="lazy" 
                  />
                </AnimatePresence>
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
                  <HealthStatusBadge status={fields.health_status || 'Vet Checked & Sound'} />
                </div>

                {!isInStock && (
                  <div className="absolute top-6 right-6 bg-red-600 text-white text-lg font-bold px-6 py-2 rounded-full uppercase tracking-widest shadow-2xl z-10">
                    Sold
                  </div>
                )}

                {hasMultipleImages && (
                  <>
                    <Button onClick={handlePrevImage} variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md hover:bg-black/80 text-white rounded-full h-14 w-14 shadow-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300"><ChevronLeft size={32} /></Button>
                    <Button onClick={handleNextImage} variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md hover:bg-black/80 text-white rounded-full h-14 w-14 shadow-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300"><ChevronRight size={32} /></Button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {hasMultipleImages && (
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-[#d4af37] shadow-lg scale-105 z-10' : 'border-transparent hover:border-[#d4af37]/50 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right Column - Details */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-5 flex flex-col">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-[#d4af37] font-bold tracking-widest uppercase text-sm flex items-center gap-1.5"><Tag size={16}/> {fields.category || 'Premium Collection'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500/50"></span>
                <span className="text-gray-400 font-medium">{fields.breed || 'Warmblood'}</span>
              </div>
              
              <h1 className="text-4xl lg:text-[56px] font-['Playfair_Display'] font-bold text-white mb-4 tracking-tight leading-[1.1]">{seoH1}</h1>
              
              {product.subtitle && <p className="text-xl lg:text-2xl text-gray-400 mb-8 font-light italic font-['Playfair_Display']">{product.subtitle}</p>}
              
              <div className="bg-[#111] border border-white/10 p-6 rounded-2xl mb-8 shadow-sm">
                <div className="flex items-end gap-4 mb-2">
                  <span className="text-[40px] font-bold text-[#d4af37] leading-none">{price || 'Contact for price'}</span>
                </div>
                <p className="text-sm text-gray-400">Prices include standard health documentation and ownership transfer.</p>
              </div>

              {/* Advanced Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                <SpecBadge icon={Calendar} label="Age" value={formatHorseAge(fields.age)} />
                <SpecBadge icon={Activity} label="Gender" value={fields.gender || 'Not specified'} />
                <SpecBadge icon={Ruler} label="Height" value={formatHorseHeight(fields.height)} />
                <SpecBadge icon={Heart} label="Color" value={fields.color || 'Not specified'} />
                <SpecBadge icon={Award} label="Temperament" value={fields.temperament || 'Contact for details'} />
                <SpecBadge icon={ShieldCheck} label="Registry" value={fields.registry || 'Eligible'} />
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Training Status</h3>
                <TrainingLevelBadge level={fields.training_level || fields.temperament || 'Foundation Trained'} />
              </div>

              {/* Discount Badge */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                <Tag size={20} className="text-green-400 shrink-0" />
                <div>
                  <p className="text-green-400 font-bold text-sm">15% Discount Applied at Checkout</p>
                  <p className="text-green-300/70 text-xs mt-0.5">Automatic savings on your purchase</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-4 mb-12">
                <Button 
                  onClick={handleAddToCart} 
                  size="lg" 
                  className={`w-full rounded-2xl h-16 text-lg font-bold transition-all shadow-xl ${canAddToCart ? 'bg-[#d4af37] text-black hover:bg-[#b5952f] hover:-translate-y-1' : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-70'}`} 
                  disabled={!canAddToCart}
                >
                  <ShoppingCart className="mr-3 h-6 w-6" /> 
                  {!isInStock ? 'Sold Out' : 'Secure with Deposit'}
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline"
                    className="w-full rounded-xl h-14 border-white/20 hover:bg-white/10 text-white font-bold shadow-sm"
                    onClick={() => window.location.href = `mailto:contact@dreamblackhorse.com?subject=Inquiry: ${product.title}`}
                  >
                    <Mail className="mr-2 h-5 w-5" /> Contact Seller
                  </Button>
                  <Button 
                    variant="secondary"
                    className="w-full rounded-xl h-14 bg-[#222] text-white hover:bg-[#333] font-bold shadow-sm border border-white/5"
                    onClick={handleScheduleViewing}
                  >
                    <Calendar className="mr-2 h-5 w-5" /> Schedule Viewing
                  </Button>
                </div>
                
                {isStockManaged && isInStock && (
                  <p className="text-sm text-green-400 mt-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
                    <CheckCircle size={16} /> Available for Immediate Acquisition
                  </p>
                )}
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-white/10">
                <div className="text-center">
                  <ShieldCheck className="w-8 h-8 text-[#d4af37] mx-auto mb-2 opacity-80" />
                  <p className="text-xs text-gray-400 font-semibold uppercase">Verified Health</p>
                </div>
                <div className="text-center">
                  <Award className="w-8 h-8 text-[#d4af37] mx-auto mb-2 opacity-80" />
                  <p className="text-xs text-gray-400 font-semibold uppercase">Premium Lineage</p>
                </div>
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-[#d4af37] mx-auto mb-2 opacity-80" />
                  <p className="text-xs text-gray-400 font-semibold uppercase">Global Delivery</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Full Description Section */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mt-24 pt-16 border-t border-white/10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold font-['Playfair_Display'] text-white mb-8 text-center">About {product.title}</h2>
              <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed bg-[#111] p-8 md:p-12 rounded-3xl border border-white/10 shadow-xl" dangerouslySetInnerHTML={{ __html: product.description || 'No description provided.' }} />
            </div>
          </motion.div>

          {/* Crawler-readable spec block — sr-only, not visible to visitors */}
          <dl className="sr-only">
            <dt>Horse name</dt><dd>{product.title}</dd>
            {fields.breed && <><dt>Breed</dt><dd>{fields.breed}</dd></>}
            {fields.gender && <><dt>Gender</dt><dd>{fields.gender}</dd></>}
            {fields.age && <><dt>Age</dt><dd>{formatHorseAge(fields.age)}</dd></>}
            {fields.height && <><dt>Height</dt><dd>{formatHorseHeight(fields.height)}</dd></>}
            {fields.color && <><dt>Color</dt><dd>{fields.color}</dd></>}
            {fields.temperament && <><dt>Temperament</dt><dd>{fields.temperament}</dd></>}
            {fields.training_level && <><dt>Training level</dt><dd>{fields.training_level}</dd></>}
            {fields.registry && <><dt>Registry</dt><dd>{fields.registry}</dd></>}
            {fields.sire && <><dt>Sire</dt><dd>{fields.sire}</dd></>}
            {fields.dam && <><dt>Dam</dt><dd>{fields.dam}</dd></>}
            <dt>Availability</dt><dd>{fields.availability}</dd>
            <dt>Price</dt><dd>{price || 'Contact for price'}</dd>
            <dt>Location</dt><dd>Mt Dora, Florida, United States</dd>
            <dt>Seller</dt><dd>Dream Black Horse</dd>
          </dl>

          {/* Similar Horses */}
          <div className="mt-24 pt-16 border-t border-white/10">
            <SimilarHorsesSection currentHorse={product} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;