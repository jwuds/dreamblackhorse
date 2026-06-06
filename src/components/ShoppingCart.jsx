import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Plus, Minus, Tag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useToast } from '@/components/ui/use-toast';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const cartTotals = getCartTotal();

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add some products to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const items = cartItems.map(item => ({
        variant_id: item.variant.id,
        quantity: item.quantity,
      }));

      const successUrl = `${window.location.origin}/success`;
      const cancelUrl = window.location.href;

      const { url } = await initializeCheckout({ items, successUrl, cancelUrl });
      
      window.location.href = url;
    } catch (error) {
      toast({
        title: 'Checkout error',
        description: error.message || 'There was a problem initializing checkout. Please try again.',
        variant: 'destructive',
      });
    }
  }, [cartItems, toast]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-[#1a1a1a] shadow-2xl flex flex-col border-l border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-light text-white">Shopping cart</h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-gray-400 hover:bg-white/10 hover:text-white rounded-full">
                <X />
              </Button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 h-full flex flex-col items-center justify-center">
                  <ShoppingCartIcon size={48} className="mb-4 text-gray-600" />
                  <p>Your cart is empty.</p>
                  <Button asChild variant="link" className="mt-4 text-white hover:text-gray-300" onClick={() => setIsCartOpen(false)}>
                    <Link to="/horses">Continue shopping</Link>
                  </Button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex items-start gap-4 p-3 rounded-xl border border-white/10 bg-[#222]">
                    <img src={item.product.image} alt={item.product.title} className="w-20 h-20 object-cover rounded-lg border border-white/5" />
                    <div className="flex-grow">
                      <h3 className="font-medium text-white">{item.product.title}</h3>
                      {item.variant.title && <p className="text-sm text-gray-400">{item.variant.title}</p>}
                      <p className="text-sm text-white font-medium mt-1">
                        {item.variant.sale_price_formatted || item.variant.price_formatted}
                      </p>
                       <div className="flex items-center border border-white/10 rounded-full mt-3 w-fit bg-[#111]">
                        <Button onClick={() => updateQuantity(item.variant.id, item.quantity - 1)} size="icon" variant="ghost" className="h-8 w-8 rounded-full text-gray-400 hover:bg-white/10 hover:text-white"><Minus size={14} /></Button>
                        <span className="px-2 text-white text-sm font-medium">{item.quantity}</span>
                        <Button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} size="icon" variant="ghost" className="h-8 w-8 rounded-full text-gray-400 hover:bg-white/10 hover:text-white"><Plus size={14} /></Button>
                      </div>
                    </div>
                     <Button onClick={() => removeFromCart(item.variant.id)} size="icon" variant="ghost" className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 rounded-full">
                       <X size={16} />
                     </Button>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 pb-[80px]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-white">
                    <span className="text-base">Subtotal</span>
                    <span className="text-lg font-medium">{cartTotals.subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-400 bg-green-400/10 px-3 py-2 rounded-lg border border-green-400/20">
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <Tag size={16} />
                      Discount (15%)
                    </span>
                    <span className="text-base font-bold">-{cartTotals.discountAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-white pt-3 border-t border-white/10">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-[#d4af37]">{cartTotals.total}</span>
                  </div>
                </div>
                <Button onClick={handleCheckout} className="w-full bg-white text-black hover:bg-gray-200 rounded-full py-6 text-base font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:-translate-y-1">
                  Proceed to checkout
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;