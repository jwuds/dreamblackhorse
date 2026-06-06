import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HorseCategoryCard from '@/components/HorseCategoryCard';

const HorsesPage = () => {
  const categories = [
    {
      title: 'Stallions',
      description: "Discover our magnificent approved Friesian stallions, representing the pinnacle of the breed's standard with exceptional power and grace.",
      image: 'https://images.unsplash.com/photo-1613437190836-d59585104264',
      link: '/horses/stallions'
    },
    {
      title: 'Mares',
      description: "Explore our exceptional Friesian mares, featuring top bloodlines and outstanding conformation perfectly suited for premium breeding or sport.",
      image: 'https://images.unsplash.com/photo-1696771666744-4f9794bfc1f2',
      link: '/horses/mares'
    },
    {
      title: 'Geldings',
      description: "Find your perfect riding or driving partner among our selection of well-trained, reliable Friesian geldings with wonderful temperaments.",
      image: 'https://images.unsplash.com/photo-1578915018613-53972a979bb3',
      link: '/horses/geldings'
    },
    {
      title: 'Foals',
      description: "Invest in the future with our promising Friesian foals, bred from champion bloodlines and nurtured for ultimate equestrian success.",
      image: 'https://images.unsplash.com/photo-1689890629682-473d88f7918b',
      link: '/horses/foals'
    }
  ];

  const values = [
    {
      icon: Star,
      title: 'Champion Bloodlines',
      description: 'Our horses originate from the finest, most rigorously tested bloodlines ensuring premium quality and performance.'
    },
    {
      icon: Shield,
      title: 'Health Guarantee',
      description: 'Every horse undergoes comprehensive veterinary examinations and comes with complete health records and transparency.'
    },
    {
      icon: Heart,
      title: 'Exceptional Care',
      description: 'Raised with love and professional expertise, our horses develop wonderful temperaments and willingness to work.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Horses for Sale - Dream Black Horse Farm</title>
        <meta name="description" content="Discover your perfect Friesian horse. Browse our premium selection of Stallions, Mares, Geldings, and Foals bred for elegance, performance, and temperament." />
      </Helmet>

      <div className="bg-[#1a1a1a] min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1686858503532-bb58bb0ae680"
              alt="Beautiful Friesian horse running in a field"
              className="horse-image-container-lg w-full h-full opacity-80"
              style={{ borderRadius: 0 }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#1a1a1a] pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32 mt-16 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="pointer-events-auto"
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-['Playfair_Display'] font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                Horses for Sale
              </h1>
              <h2 className="text-2xl md:text-3xl text-gray-200 mb-8 font-['Playfair_Display'] italic font-light drop-shadow-lg">
                Discover Your Perfect Friesian Horse
              </h2>
              <div className="w-24 h-1 bg-white/30 mx-auto mb-10" />
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                Step into a world of elegance. Explore our carefully curated selection of premium Friesians, bred for outstanding performance, breathtaking beauty, and devoted companionship.
              </p>
            </motion.div>
          </div>
          
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/50"
            >
              <div className="w-px h-20 bg-white/40 mx-auto" />
            </motion.div>
          </div>
        </section>

        {/* Categories Grid Section */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#1a1a1a] relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
              {categories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <HorseCategoryCard {...category} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-[#111111] border-y border-white/5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20 sm:mb-24"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">
                Why Choose Dream Black Horse Farm
              </h2>
              <div className="w-24 h-1 bg-white/20 mx-auto mb-8" />
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                We are dedicated to preserving the majestic Friesian breed, providing our clients with not just a horse, but a lifetime partner of unparalleled quality.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center bg-[#1a1a1a] p-10 lg:p-12 rounded-3xl hover:bg-[#222] transition-all duration-300 border border-white/5 shadow-xl hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-[#111] border border-white/10 flex items-center justify-center mb-8 shadow-inner">
                    <value.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-['Playfair_Display'] font-bold text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg font-light">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-[#1a1a1a]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#111]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#111111] opacity-80" />
              <div className="absolute inset-0">
                 <img src="https://images.unsplash.com/photo-1613437190836-d59585104264" alt="Background" className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
              </div>
              
              <div className="relative z-10 px-8 py-20 md:p-24 text-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-bold text-white mb-6 drop-shadow-md">
                  Ready to Meet Your Match?
                </h2>
                <div className="w-20 h-1 bg-white/20 mx-auto mb-8" />
                <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                  Our experts are ready to guide you through our collection and help you find the perfect Friesian companion for your equestrian journey.
                </p>
                <Link to="/contact">
                  <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-12 py-8 text-xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all duration-300 hover:-translate-y-1">
                    Contact Us Today
                    <ArrowRight className="ml-3 w-6 h-6" />
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

export default HorsesPage;