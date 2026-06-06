import React, { useMemo, memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { parseHorseFields, formatHorseAge, formatHorseHeight } from '@/utils/horseUtils';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmEyYTJhIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=";

const HorseCardLarge = memo(({ product, index = 0 }) => {
  const fields = useMemo(() => parseHorseFields(product), [product]);
  const displayVariant = useMemo(() => product.variants?.[0], [product]);
  const hasSale = useMemo(() => displayVariant && displayVariant.sale_price_in_cents !== null, [displayVariant]);
  const displayPrice = useMemo(() => hasSale ? displayVariant?.sale_price_formatted : displayVariant?.price_formatted, [displayVariant, hasSale]);
  const originalPrice = useMemo(() => hasSale ? displayVariant?.price_formatted : null, [displayVariant, hasSale]);

  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isSoldOut = !product.purchasable || (displayVariant && displayVariant.inventory_quantity <= 0 && displayVariant.manage_inventory);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSoldOut && displayVariant) {
      try {
        await addToCart(product, displayVariant, 1, displayVariant.inventory_quantity);
        toast({
          title: "Added to Cart",
          description: `${product.title} has been added to your inquiries.`,
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      }
    }
  };

  const handleNavigate = () => {
    navigate(`/product/${product.id}`);
  };

  const DetailRow = ({ label, value }) => (
    <div className="flex flex-col border-b border-border/50 pb-2">
      <span className="text-[12px] sm:text-[14px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">{label}</span>
      <span className="text-[14px] sm:text-[16px] text-card-foreground font-medium truncate">{value || 'N/A'}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden large-card cursor-pointer"
      onClick={handleNavigate}
    >
      {/* 4:3 Image Section */}
      <div className="relative w-full aspect-[4/3] bg-muted/30 rounded-xl overflow-hidden mb-6">
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-medium">Image unavailable</span>
          </div>
        ) : (
          <img
            src={product.image || placeholderImage}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            loading="lazy"
          />
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md border ${
            isSoldOut ? 'bg-destructive/90 text-destructive-foreground border-destructive' : 'bg-primary/90 text-primary-foreground border-primary/50'
          }`}>
            {isSoldOut ? 'Sold' : fields.availability || 'Available'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col">
        {/* Header & Price */}
        <div className="flex justify-between items-start gap-4 mb-8">
          <h3 className="text-[28px] sm:text-[36px] font-bold text-foreground font-['Playfair_Display'] leading-tight line-clamp-2">
            {product.title}
          </h3>
          <div className="text-right shrink-0 pt-1">
            <span className="text-2xl sm:text-[28px] font-bold text-primary block leading-none">
              {displayPrice || 'Contact'}
            </span>
            {hasSale && <span className="text-sm text-muted-foreground line-through block mt-1">{originalPrice}</span>}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
          <DetailRow label="Breed" value={fields.breed || fields.category || 'Warmblood'} />
          <DetailRow label="Age" value={formatHorseAge(fields.age)} />
          <DetailRow label="Height" value={formatHorseHeight(fields.height)} />
          <DetailRow label="Gender" value={fields.gender || 'Not specified'} />
          <DetailRow label="Color" value={fields.color || 'Not specified'} />
          <DetailRow label="Training Level" value={fields.training_level || fields.temperament || 'Started'} />
          <DetailRow label="Sire" value={fields.sire || 'Unknown'} />
          <DetailRow label="Dam" value={fields.dam || 'Unknown'} />
        </div>

        {/* Description Section */}
        {product.description && (
          <div className="mb-8 pb-8 border-b border-border/50">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Description</h4>
            <div 
              className="text-[15px] leading-relaxed text-card-foreground/90 line-clamp-4"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center gap-4">
          <Button 
            className="w-full sm:w-auto flex-1 font-bold text-[14px] sm:text-[16px] tracking-wide h-14 bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-xl"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
          >
            View Details
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline"
            className={`w-full sm:w-auto px-6 font-bold text-[14px] sm:text-[16px] tracking-wide h-14 border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors rounded-xl ${isSoldOut ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-foreground hover:border-border' : ''}`}
            onClick={handleAddToCart}
            disabled={isSoldOut}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {isSoldOut ? 'Sold Out' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

HorseCardLarge.displayName = 'HorseCardLarge';

export default HorseCardLarge;