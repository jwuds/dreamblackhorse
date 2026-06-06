import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useContactInfo } from '@/hooks/useContactInfo';

const ContactInfoDisplay = () => {
  const { getContactInfo, loading } = useContactInfo();
  const contacts = getContactInfo();

  if (loading) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'phone': return <Phone className="w-5 h-5 text-gray-400" />;
      case 'email': return <Mail className="w-5 h-5 text-gray-400" />;
      case 'address': return <MapPin className="w-5 h-5 text-gray-400" />;
      case 'hours': return <Clock className="w-5 h-5 text-gray-400" />;
      default: return null;
    }
  };

  const getLink = (type, value) => {
    switch (type) {
      case 'phone': return `tel:${value.replace(/[^0-9+]/g, '')}`;
      case 'email': return `mailto:${value}`;
      case 'address': return `https://maps.google.com/?q=${encodeURIComponent(value)}`;
      default: return null;
    }
  };

  const addressContact = contacts.find(c => c.type === 'address');

  return (
    <div className="bg-[#111] p-8 rounded-2xl border border-white/10 shadow-2xl max-w-4xl mx-auto w-full">
      <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-8 text-center">Get in Touch</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-start gap-4">
              <div className="p-3 bg-white/5 rounded-xl shrink-0">
                {getIcon(contact.type)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">{contact.label}</p>
                {['phone', 'email', 'address'].includes(contact.type) ? (
                  <a href={getLink(contact.type, contact.value)} target="_blank" rel="noopener noreferrer" className="text-lg text-white hover:text-gray-300 transition-colors">
                    {contact.value}
                  </a>
                ) : (
                  <p className="text-lg text-white">{contact.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="rounded-xl overflow-hidden h-[300px] border border-white/10 relative bg-[#222]">
          {addressContact ? (
            <iframe
              title="Farm Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.openstreetmap.org/export/embed.html?bbox=-84.52%2C38.02%2C-84.48%2C38.06&layer=mapnik&marker=38.04%2C-84.50`}
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">Map unavailable</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoDisplay;