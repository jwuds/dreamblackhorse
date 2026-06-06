import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SEOHead from '@/components/SEOHead';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setTimeout(() => {
      setSubmitted(true);
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          inquiryType: 'general',
          message: ''
        });
      }, 3000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@dreamblackhorse.com',
      link: 'mailto:contact@dreamblackhorse.com'
    },
    {
      icon: MapPin,
      title: 'Location',
      content: '21210 Horse Ranch Rd, Mt Dora, FL 32757',
      link: 'https://maps.google.com/?q=21210+Horse+Ranch+Rd,+Mt+Dora,+FL+32757',
      target: '_blank'
    },
    {
      icon: Building2,
      title: 'Facility',
      content: 'Dream Black Horse Farm',
      link: '#'
    }
  ];

  return (
    <>
      <SEOHead 
        title="Contact Dream Black Horse - Get in Touch"
        description="Contact Dream Black Horse for inquiries about our horses, breeding services, or general questions. We're here to help!"
        canonical="/contact"
      />

      <div className="bg-[#1a1a1a] min-h-screen pb-20">
        <section className="relative py-24 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <h1 className="text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white mb-6">
                Contact Dream Black Horse - Get in Touch
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
                Have questions about our horses or services? We'd love to hear from you.
              </p>
              <a href="https://maps.google.com/?q=21210+Horse+Ranch+Rd,+Mt+Dora,+FL+32757" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-lg text-[#d4af37] hover:text-white transition-colors border-b border-[#d4af37]/30 hover:border-white pb-1 font-medium">
                <MapPin className="w-5 h-5 mr-2" />
                21210 Horse Ranch Rd, Mt Dora, FL 32757
              </a>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <motion.a key={info.title} href={info.link} target={info.target} rel={info.target === '_blank' ? "noopener noreferrer" : ""} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="bg-[#111] border border-white/10 rounded-3xl p-8 text-center hover:border-white/30 transition-all shadow-xl hover:-translate-y-2 block">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6">
                    <info.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-3">
                    {info.title}
                  </h2>
                  <p className="text-gray-400 font-medium">{info.content}</p>
                </motion.a>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-8">
                  Send Us a Message
                </h2>
                
                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">Message Sent!</h3>
                    <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-gray-300 mb-2">Full Name *</label>
                      <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-5 py-4 bg-[#222] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37]/50" placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2">Email Address *</label>
                      <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-5 py-4 bg-[#222] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37]/50" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-bold text-gray-300 mb-2">Inquiry Type *</label>
                      <select id="inquiryType" name="inquiryType" required value={formData.inquiryType} onChange={handleChange} className="w-full px-5 py-4 bg-[#222] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37]/50">
                        <option value="general" className="bg-[#222]">General Question</option>
                        <option value="horse" className="bg-[#222]">Horse Inquiry</option>
                        <option value="visit" className="bg-[#222]">Schedule a Visit</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-gray-300 mb-2">Message *</label>
                      <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} className="w-full px-5 py-4 bg-[#222] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37]/50 resize-none" placeholder="Tell us about your inquiry..." />
                    </div>
                    <Button type="submit" className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] rounded-xl py-7 text-lg font-bold shadow-lg">
                      Send Message
                      <Send className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-8">
                <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                  <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-6">Visit Our Facility</h2>
                  <p className="text-gray-400 leading-relaxed mb-6 font-medium">
                    Located in Mt Dora, Florida, Dream Black Horse operates from our private equestrian facility, serving clients across the United States. We welcome visitors to schedule an appointment to meet our horses.
                  </p>
                  <div className="space-y-4 text-gray-400 font-medium">
                    <p><strong className="text-white block mb-1">Address:</strong> 21210 Horse Ranch Rd<br />Mt Dora, FL 32757<br />United States</p>
                    <p><strong className="text-white block mb-1">Hours:</strong> Monday - Friday: 8:00 AM - 6:00 PM<br />Saturday: 9:00 AM - 4:00 PM<br />Sunday: By Appointment</p>
                  </div>
                </div>

                <div className="rounded-3xl overflow-hidden h-[350px] shadow-2xl border border-white/10 bg-[#222]">
                  <iframe title="Dream Black Horse Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3493.5857503023067!2d-81.6508931!3d28.8809071!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e7b1a03a0a3ab5%3A0xc3f15c7a524edb2b!2s21210%20Horse%20Ranch%20Rd%2C%20Mt%20Dora%2C%20FL%2032757!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;