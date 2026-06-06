import React, { useEffect } from 'react';
import { useAffiliates } from '@/hooks/useAffiliates';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNetworkStatus } from '@/utils/networkCheck';

const AffiliatesMarquee = () => {
  const { affiliates, fetchAffiliates, loading, error } = useAffiliates();

  // Retry fetch automatically if network is restored
  useNetworkStatus(fetchAffiliates);

  useEffect(() => {
    fetchAffiliates();
  }, [fetchAffiliates]);

  const activeAffiliates = affiliates.filter(a => a.status === 'active');

  // Fallback to placeholder if no active affiliates yet and no error
  const displayItems = activeAffiliates.length > 0 ? activeAffiliates : [
    { id: 1, name: 'Equestrian Federation', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80', link: '#' },
    { id: 2, name: 'Royal Friesian Registry', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80', link: '#' },
    { id: 3, name: 'Global Equine Transport', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80', link: '#' },
    { id: 4, name: 'Premium Horse Care', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80', link: '#' },
    { id: 5, name: 'Elite Breeders Assoc', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80', link: '#' },
  ];

  const LogoItems = () => (
    <>
      {displayItems.map((item) => (
        <a 
          key={item.id} 
          href={item.link || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-40 md:w-48 group shrink-0 mx-4"
        >
          <div className="relative h-20 w-full flex items-center justify-center">
            {item.logo_url && (
              <img 
                src={item.logo_url} 
                alt={`${item.name} Logo`} 
                className="max-h-full max-w-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
            )}
            {!item.logo_url && (
              <div className="absolute inset-0 flex items-center justify-center grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-sm font-semibold text-center uppercase tracking-wider text-white">
                  {item.name}
                </span>
              </div>
            )}
          </div>
        </a>
      ))}
    </>
  );

  if (loading && affiliates.length === 0) {
    return <div className="py-4 text-center text-gray-500">Loading affiliations...</div>;
  }

  if (error) {
    return (
      <div className="py-10 flex flex-col items-center justify-center text-center px-4 bg-[#111] border-y border-white/5">
        <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
        <p className="text-gray-400 mb-4 text-sm max-w-md">No affiliates available. {error}</p>
        <Button onClick={fetchAffiliates} variant="outline" className="border-white/20 text-white hover:bg-white/10">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: scroll-marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
      <div className="overflow-hidden py-6 relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#111111] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#111111] to-transparent z-10 pointer-events-none" />
        
        <div className="animate-marquee">
          <LogoItems />
          <LogoItems />
        </div>
      </div>
    </>
  );
};

export default AffiliatesMarquee;