import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getProducts } from '@/api/EcommerceApi';
import HorseCardLarge from '@/components/HorseCardLarge';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-8 overflow-hidden shadow-md animate-pulse h-[800px] flex flex-col">
            <div className="w-full aspect-[4/3] bg-muted/50 rounded-xl mb-6" />
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between mb-8">
                <div className="h-10 bg-muted/50 rounded-md w-1/2" />
                <div className="h-10 bg-muted/50 rounded-md w-1/4" />
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(j => (
                  <div key={j} className="flex flex-col border-b border-border/50 pb-2">
                    <div className="h-3 bg-muted/30 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-muted/50 rounded w-3/4" />
                  </div>
                ))}
              </div>
              <div className="mt-auto flex gap-4">
                <div className="h-14 bg-muted/50 rounded-xl flex-1" />
                <div className="h-14 w-32 bg-muted/30 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12 bg-destructive/10 border border-destructive/20 rounded-2xl max-w-2xl mx-auto shadow-lg">
        <h3 className="text-2xl font-bold text-destructive mb-3 font-['Playfair_Display']">Unable to Load Collection</h3>
        <p className="text-destructive-foreground/80 leading-relaxed mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-destructive text-destructive-foreground px-6 py-3 rounded-full font-bold shadow-md hover:bg-destructive/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center p-16 bg-card border border-border rounded-2xl max-w-3xl mx-auto shadow-lg">
        <h3 className="text-3xl font-bold text-card-foreground mb-4 font-['Playfair_Display']">No Horses Available</h3>
        <p className="text-muted-foreground text-lg">We are currently updating our inventory. Please check back soon for our latest premium selections.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
      {products.map((product, index) => (
        <HorseCardLarge key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductsList;