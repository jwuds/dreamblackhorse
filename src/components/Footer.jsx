import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Building2 } from 'lucide-react';

const LOGO_URL = "https://horizons-cdn.hostinger.com/1ee4ac76-1453-4dcc-a280-1aeb1d67f81b/9a6ccfbea5cec07ff7085d5e702c493d.jpg";

const Footer = () => {
  const location = useLocation();

  const handleHorsesLinkClick = (e) => {
    if (location.pathname === '/horses') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-[#0f0f0f] border-t border-white/10 mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={LOGO_URL} 
                alt="DreamBlackHorse Logo" 
                className="h-[30px] md:h-[40px] w-auto object-contain rounded-full"
              />
              <span className="text-2xl font-['Playfair_Display'] font-semibold tracking-tight text-white">
                DreamBlackHorse
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Premium horse breeding and sales. Excellence in equestrian tradition.
            </p>
          </div>

          <div>
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              Navigation
            </span>
            <ul className="mt-6 space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link to="/horses" onClick={handleHorsesLinkClick} className="text-sm text-gray-400 hover:text-white transition-colors duration-300">Horses for Sale</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">About Us</Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">Contact</Link>
              </li>
              <li>
                <Link to="/terms-policies" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">Terms & Policies</Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact Info
            </span>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start text-sm text-gray-400">
                <Building2 className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                <span>Dream Black Horse</span>
              </li>
              <li className="flex items-start text-sm text-gray-400 group">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0 group-hover:text-white transition-colors" />
                <a 
                  href="https://maps.google.com/?q=21210+Horse+Ranch+Rd,+Mt+Dora,+FL+32757" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-300 leading-relaxed"
                >
                  21210 Horse Ranch Rd<br />
                  Mt Dora, FL 32757
                </a>
              </li>
              <li className="flex items-center text-sm text-gray-400 group">
                <Mail className="w-4 h-4 mr-2 shrink-0 group-hover:text-white transition-colors" />
                <a href="mailto:contact@dreamblackhorse.com" className="hover:text-white transition-colors duration-300">
                  contact@dreamblackhorse.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              Connect
            </span>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="mailto:contact@dreamblackhorse.com" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-white/10 flex flex-col items-center justify-center space-y-8">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} DreamBlackHorse. All rights reserved.
          </p>
          <div className="bg-black p-6 rounded-3xl flex flex-col items-center justify-center border border-white/10 shadow-2xl w-full max-w-sm transform hover:scale-[1.02] transition-transform duration-300">
            <div className="relative mb-6">
              <div className="absolute -inset-1 bg-white/5 rounded-xl blur-sm"></div>
              <img 
                src="https://images.unsplash.com/photo-1468532144896-09bb235c657f?q=80&w=400" 
                alt="United States Flag" 
                className="relative w-48 sm:w-56 h-auto rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)] opacity-95 hover:opacity-100 transition-all duration-300 object-cover object-center aspect-[16/9] border border-white/10"
                loading="lazy"
              />
            </div>
            <p className="text-base md:text-lg text-white font-['Playfair_Display'] italic text-center leading-relaxed tracking-wide">
              Established in Florida — Committed to Excellence in Equine Care.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;