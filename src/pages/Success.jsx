import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, CheckCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const Success = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { clearCart, getCartTotal } = useCart();
  const [orderSummary, setOrderSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const totals = getCartTotal();
    setOrderSummary(totals);
    clearCart();
  }, [clearCart, getCartTotal]);

  const closeModalAndRedirect = () => {
    setIsModalOpen(false);
    navigate('/horses');
  };

  return (
    <>
      <Helmet>
        <title>Payment Successful - Dream Black Horse Farm</title>
        <meta name="description" content="Thank you for your order. Your payment was successful." />
      </Helmet>
      
      <div className="bg-[#1a1a1a] min-h-[70vh] flex items-center justify-center p-4">
        <p className="text-gray-500">Redirecting after successful payment...</p>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={closeModalAndRedirect}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-[#222] rounded-2xl shadow-2xl max-w-lg w-full text-center p-8 sm:p-12 relative border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <Button onClick={closeModalAndRedirect} variant="ghost" size="icon" className="absolute top-4 right-4 text-gray-400 hover:bg-white/10 hover:text-white rounded-full">
                <X size={24} />
              </Button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="mb-6 flex justify-center"
              >
                <div className="bg-green-500/20 p-4 rounded-full border-2 border-green-500">
                  <CheckCircle size={48} className="text-green-500" />
                </div>
              </motion.div>

              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-white mb-4"
              >
                Payment Successful!
              </motion.h1>
    
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-gray-300 mb-8"
              >
                Thank you for your order. You will receive a confirmation email shortly.
              </motion.p>

              {orderSummary && orderSummary.totalInCents > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 mb-8"
                >
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-white">
                      <span className="text-base">Subtotal</span>
                      <span className="text-lg font-medium">{orderSummary.subtotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-400 bg-green-400/10 px-3 py-2 rounded-lg border border-green-400/20">
                      <span className="text-sm font-semibold flex items-center gap-2">
                        <Tag size={16} />
                        Discount (15%)
                      </span>
                      <span className="text-base font-bold">-{orderSummary.discountAmount}</span>
                    </div>
                    <div className="flex justify-between items-center text-white pt-3 border-t border-white/10">
                      <span className="text-lg font-bold">Amount Paid</span>
                      <span className="text-2xl font-bold text-[#d4af37]">{orderSummary.total}</span>
                    </div>
                  </div>
                </motion.div>
              )}
    
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Button onClick={closeModalAndRedirect} className="bg-white text-black hover:bg-gray-200 rounded-full px-8 py-6 text-base font-bold w-full sm:w-auto transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  Continue Browsing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Success;