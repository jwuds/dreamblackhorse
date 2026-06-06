import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Info, Activity, Ruler, Calendar, Heart, Medal, Tag } from 'lucide-react';
import { parseHorseFields, formatHorseAge, formatHorseHeight, getAvailabilityColor } from '@/utils/horseUtils';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import SpecBadge from '@/components/SpecBadge';
import HealthStatusBadge from '@/components/HealthStatusBadge';
import TrainingLevelBadge from '@/components/TrainingLevelBadge';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmEyYTJhIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=";

const HorseCard = memo(({ product, index = 0 }) => {
  const fields = useMemo(() => parseHorseFields(product), [product]);
  const availabilityColor = getAvailabilityColor(fields.availability);
  
  const displayVariant = useMemo(() => product.variants?.[0], [product]);
  const hasSale = useMemo(() => displayVariant && displayVariant.sale_price_in_cents !== null, [displayVariant]);
  const displayPrice = useMemo(() => hasSale ? displayVariant?.sale_price_formatted : displayVariant?.price_formatted, [displayVariant, hasSale]);
  const originalPrice = useMemo(() => hasSale ? displayVariant?.price_formatted : null, [displayVariant, hasSale]);

  const { addToCart } = useCart();
  const { toast } = useToast();

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

  // Strip HTML for a clean description excerpt
  const rawDescription = product.description ? product.description.replace(/<[^>]*>?/gm, '') : 'A magnificent horse with exceptional qualities, ready to join your stable.';
  const excerpt = rawDescription.length > 100 ? `${rawDescription.substring(0, 100)}...` : rawDescription;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 transition-all duration-300 shadow-md hover:shadow-2xl"
    >
      <Link to={`/product/${product.id}`} className="block flex-1 flex flex-col">
        {/* Image Section */}
        <div className="relative overflow-hidden w-full bg-muted aspect-[16/9]">
          <img
            src={product.image || placeholderImage}
            alt={`Portrait of ${product.title}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-90 pointer-events-none" />
          
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${availabilityColor}`}>
              {isSoldOut ? 'Sold' : fields.availability || 'Available'}
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <HealthStatusBadge status={fields.health_status || 'Vet Checked'} />
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col z-10 -mt-12 relative">
          {/* Header */}
          <div className="bg-card/95 backdrop-blur-xl p-5 rounded-xl border border-border mb-5 shadow-xl group-hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start gap-4 mb-2">
              <h3 className="text-2xl sm:text-[28px] font-bold text-card-foreground font-['Playfair_Display'] leading-tight line-clamp-2">
                {product.title}
              </h3>
              <div className="text-right shrink-0">
                <span className="text-2xl sm:text-[28px] font-bold text-primary block leading-none">
                  {displayPrice || 'Contact'}
                </span>
                {hasSale && <span className="text-sm text-muted-foreground line-through block mt-1">{originalPrice}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium uppercase tracking-wider">
              <Tag size={14} className="text-primary/70" />
              {fields.breed || fields.category || 'Premium Horse'}
            </div>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <SpecBadge icon={Calendar} label="Age" value={formatHorseAge(fields.age)} />
            <SpecBadge icon={Activity} label="Gender" value={fields.gender || 'Not specified'} />
            <SpecBadge icon={Ruler} label="Height" value={formatHorseHeight(fields.height)} />
            <SpecBadge icon={Heart} label="Color" value={fields.color || 'Not specified'} />
          </div>

          {/* Description Excerpt */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3">
            {excerpt}
          </p>

          <div className="mb-6 flex flex-wrap gap-2">
            <TrainingLevelBadge level={fields.training_level || fields.temperament || 'Foundation Trained'} />
          </div>
          
          {/* CTA Section */}
          <div className="flex items-center gap-3 mt-auto pt-5 border-t border-border">
            <Button 
              className="flex-1 font-bold text-sm tracking-wide h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={handleAddToCart}
              disabled={isSoldOut}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isSoldOut ? 'Sold Out' : 'Add to Cart'}
            </Button>
            <Button 
              variant="outline" 
              className="px-4 h-12 border-border text-foreground hover:bg-muted transition-colors font-bold"
            >
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

HorseCard.displayName = 'HorseCard';

export default HorseCard;