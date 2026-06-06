import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { AnimatePresence, motion } from 'framer-motion';

const LOGO_URL = "https://horizons-cdn.hostinger.com/1ee4ac76-1453-4dcc-a280-1aeb1d67f81b/9a6ccfbea5cec07ff7085d5e702c493d.jpg";

const Header = ({ setIsCartOpen }) => {
  const location = useLocation();
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/horses', label: 'Horses for Sale' },
    { path: '/about', label: 'About Us' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="bg-[#1a1a1a] border-b border-white/10 sticky top-0 z-40 glass-effect-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            <Link to="/" className="flex items-center gap-3 z-50">
              <img 
                src={LOGO_URL} 
                alt="Chess Knight Logo" 
                className="h-[40px] md:h-[50px] w-auto object-contain rounded-full border border-white/10"
              />
              <span className="text-xl md:text-3xl font-['Playfair_Display'] font-semibold tracking-tight text-white truncate hidden sm:block">
                DreamBlackHorse
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative ${
                    location.pathname === link.path || (link.path === '/horses' && location.pathname.startsWith('/horses'))
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {(location.pathname === link.path || (link.path === '/horses' && location.pathname.startsWith('/horses'))) && (
                    <motion.div
                      layoutId="headerUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                    />
                  )}
                </Link>
              ))}
              
              {user && (
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition-colors relative ${
                    location.pathname === '/admin' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Dashboard
                  {location.pathname === '/admin' && (
                    <motion.div
                      layoutId="headerUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                    />
                  )}
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4 sm:space-x-6 z-50">
              <div className="hidden sm:flex items-center space-x-4">
                {user ? (
                  <button onClick={logout} className="text-xs font-semibold text-gray-400 hover:text-white uppercase tracking-wider transition-colors p-2 touch-manipulation">
                    Logout
                  </button>
                ) : (
                  <Link to="/login" className="text-xs font-semibold text-gray-400 hover:text-white uppercase tracking-wider transition-colors flex items-center gap-1 p-2 touch-manipulation">
                    <User className="w-4 h-4" /> Login
                  </Link>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:text-gray-400 transition-colors p-2 touch-manipulation"
                aria-label={`Open cart with ${totalItems} items`}
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] rounded-full w-4 h-4 md:w-5 md:h-5 md:-top-2 md:-right-2 flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-white hover:text-gray-400 transition-colors p-2 touch-manipulation"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-40 lg:hidden backdrop-blur-md pt-20 md:pt-24"
          >
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex flex-col h-full px-6 pb-6 overflow-y-auto"
            >
              <div className="flex items-center justify-center py-6 border-b border-white/10">
                <img 
                  src={LOGO_URL} 
                  alt="Chess Knight Logo" 
                  className="h-[45px] w-auto object-contain rounded-full"
                />
              </div>

              <ul className="space-y-4 mt-8 mb-auto">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`block w-full text-left px-4 py-4 text-xl md:text-2xl font-['Playfair_Display'] rounded-xl transition-colors ${
                        location.pathname === link.path || (link.path === '/horses' && location.pathname.startsWith('/horses'))
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {user && (
                  <li>
                    <Link
                      to="/admin"
                      className={`block w-full text-left px-4 py-4 text-xl md:text-2xl font-['Playfair_Display'] rounded-xl transition-colors ${
                        location.pathname === '/admin' ? 'bg-white/10 text-white font-semibold' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
              
              <div className="pt-6 mt-6 border-t border-white/10 pb-10">
                {user ? (
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-center px-4 py-4 text-lg font-medium rounded-xl text-red-400 bg-red-400/10 hover:bg-red-400/20"
                  >
                    Logout
                  </button>
                ) : (
                  <Link 
                    to="/login"
                    className="block w-full text-center px-4 py-4 text-lg font-medium rounded-xl text-black bg-white hover:bg-gray-200"
                  >
                    Login to Account
                  </Link>
                )}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;