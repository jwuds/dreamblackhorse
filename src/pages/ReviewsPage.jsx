import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useReviews } from '@/contexts/ReviewsContext';
import { Button } from '@/components/ui/button';

const ReviewsPage = () => {
  const { reviews, matches, loading } = useReviews();
  const [matchIndex, setMatchIndex] = useState(0);

  const publishedReviews = reviews.filter(r => r.published);
  const publishedMatches = matches.filter(m => m.published).sort((a, b) => a.order - b.order);

  const nextMatch = () => {
    if (publishedMatches.length > 0) {
      setMatchIndex((prev) => (prev + 1) % publishedMatches.length);
    }
  };

  const prevMatch = () => {
    if (publishedMatches.length > 0) {
      setMatchIndex((prev) => (prev - 1 + publishedMatches.length) % publishedMatches.length);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Client Reviews & Matches - Dream Black Horse Farm</title>
        <meta name="description" content="Read testimonials from our satisfied clients and view successful horse-rider matches from Dream Black Horse Farm." />
      </Helmet>

      <div className="bg-[#1a1a1a] min-h-screen pt-24 pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-['Playfair_Display'] font-bold text-white mb-6 leading-tight">
              Words From Our Clients
            </h1>
            <div className="w-24 h-1 bg-white/20 mx-auto mb-8" />
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Our greatest pride is the joy and success of our clients. Read about their experiences and see the beautiful partnerships formed at Dream Black Horse Farm.
            </p>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedReviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-[#222] p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors flex flex-col h-full relative group"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 group-hover:text-white/10 transition-colors" />
                <div className="flex gap-1 mb-6 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-600 fill-transparent'}`} />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-8 flex-grow text-lg italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20">
                    <img src={review.image || 'https://via.placeholder.com/150'} alt={review.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold font-['Playfair_Display'] text-lg">{review.name}</h4>
                    <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {publishedReviews.length === 0 && (
            <p className="text-center text-gray-500 py-12">No reviews available yet.</p>
          )}
          
          {/* Pagination Placeholder */}
          {publishedReviews.length > 0 && (
            <div className="flex justify-center mt-12 gap-2">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white hover:text-black">1</Button>
              <Button variant="ghost" className="text-gray-400">Next</Button>
            </div>
          )}
        </section>

        <section className="bg-[#111] py-24 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
                Successful Matches
              </h2>
              <p className="text-gray-400 text-lg">Celebrating the perfect harmony between horse and rider.</p>
            </div>

            {publishedMatches.length > 0 ? (
              <div className="relative">
                <div className="overflow-hidden rounded-3xl bg-[#1a1a1a] border border-white/10 luxury-shadow">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-[500px]">
                      <img 
                        src={publishedMatches[matchIndex].image} 
                        alt={publishedMatches[matchIndex].horseName} 
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#1a1a1a]" />
                    </div>
                    <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
                      <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-6 w-max border border-white/20">
                        Featured Match
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-['Playfair_Display'] font-bold text-white mb-2">
                        {publishedMatches[matchIndex].horseName}
                      </h3>
                      <p className="text-xl text-gray-400 mb-8">
                        Ridden by {publishedMatches[matchIndex].clientName}
                      </p>
                      <p className="text-gray-300 leading-relaxed text-lg mb-8">
                        {publishedMatches[matchIndex].story}
                      </p>
                      
                      <div className="flex gap-4 mt-auto">
                        <Button variant="outline" size="icon" onClick={prevMatch} className="rounded-full w-12 h-12 border-white/20 text-white hover:bg-white hover:text-black">
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={nextMatch} className="rounded-full w-12 h-12 border-white/20 text-white hover:bg-white hover:text-black">
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2 mt-8">
                  {publishedMatches.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMatchIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${idx === matchIndex ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">No matches available yet.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default ReviewsPage;