import React from 'react';

const AffiliationsMarquee = () => {
  // Placeholder structure for admin-editable logo uploads
  const logos = [
    { id: 1, name: 'Equestrian Federation', src: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80', alt: 'Equestrian Federation Logo' },
    { id: 2, name: 'Royal Friesian Registry', src: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80', alt: 'Royal Friesian Registry Logo' },
    { id: 3, name: 'Global Equine Transport', src: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80', alt: 'Global Equine Transport Logo' },
    { id: 4, name: 'Premium Horse Care', src: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80', alt: 'Premium Horse Care Logo' },
    { id: 5, name: 'Elite Breeders Assoc', src: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80', alt: 'Elite Breeders Association Logo' },
    { id: 6, name: 'Equine Health Partners', src: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80', alt: 'Equine Health Partners Logo' },
  ];

  // Render the logo items list
  const LogoItems = () => (
    <>
      {logos.map((logo) => (
        <div key={logo.id} className="flex items-center justify-center w-40 md:w-48 group">
          <div className="relative h-16 w-full flex items-center justify-center">
            {/* Displaying placeholder text or the image itself */}
            <div className="absolute inset-0 flex items-center justify-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer">
              <span className="text-sm font-semibold text-center uppercase tracking-wider text-white">
                {logo.name}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="marquee-container py-4">
      <div className="marquee-content">
        <LogoItems />
      </div>
      {/* Duplicate for infinite scroll seamless effect */}
      <div className="marquee-content" aria-hidden="true">
        <LogoItems />
      </div>
    </div>
  );
};

export default AffiliationsMarquee;