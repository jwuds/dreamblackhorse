import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Heart, Users, Shield, Loader2, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useDeliveryMapImage } from '@/hooks/useDeliveryMapImage';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import DeliveryReach from '@/components/DeliveryReach';
import MissionVisionSlider from '@/components/about/MissionVisionSlider';

const AboutUs = () => {
  const { teamMembers, loading: teamLoading, fetchTeamMembers } = useTeamMembers();
  const { image: deliveryMapImage, loading: deliveryMapLoading } = useDeliveryMapImage();
  
  const [missionStatement, setMissionStatement] = useState("");
  const [visionStatement, setVisionStatement] = useState("");

  useEffect(() => {
    fetchTeamMembers();
    const fetchStatements = async () => {
      try {
        const { data, error } = await supabase
          .from('homepage_content')
          .select('field_name, content')
          .eq('section_name', 'about');
          
        if (!error && data) {
          const mStatement = data.find(d => d.field_name === 'mission_statement')?.content;
          const vStatement = data.find(d => d.field_name === 'vision_statement')?.content;
          if (mStatement) setMissionStatement(mStatement);
          if (vStatement) setVisionStatement(vStatement);
        }
      } catch (err) {
        console.error("Error fetching statements", err);
      }
    };
    fetchStatements();
  }, [fetchTeamMembers]);

  const values = [
    { icon: Award, title: 'Excellence', description: 'We maintain the highest standards in breeding, training, and care' },
    { icon: Heart, title: 'Passion', description: 'Our love for horses drives everything we do' },
    { icon: Users, title: 'Partnership', description: 'Building lasting relationships with our clients and their horses' },
    { icon: Shield, title: 'Integrity', description: 'Honest, transparent, and ethical in all our practices' }
  ];

  return (
    <>
      <SEOHead 
        title="About Dream Black Horse - Our Story & Mission"
        description="Learn about Dream Black Horse's history, mission, and commitment to quality horse breeding and sales. Meet our team and discover our values."
        canonical="/about"
      />

      <div className="bg-[#1a1a1a] min-h-screen">
        <section className="relative py-32 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <h1 className="text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white mb-8 leading-tight">
                About Dream Black Horse - Our Story & Mission
              </h1>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                A legacy of excellence in equestrian breeding, training, and care spanning over three decades
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:col-span-6 space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-4">Our Story</h2>
                  <h3 className="text-2xl font-['Playfair_Display'] text-[#d4af37] italic">Bridging the Gap in the Friesian Horse Market</h3>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  DreamBlackHorse originated as a humble family farm fueled by a profound admiration for the majestic Friesian breed. Over the years, our passion evolved into a lifelong journey of connecting exceptional horses with loving owners across the globe.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Recognizing the challenges many faced in finding authentic, high-caliber Friesians, we dedicated ourselves to directly importing the finest bloodlines from the Netherlands. We carefully select each horse based on uncompromising standards of quality, elite pedigree, and outstanding performance potential.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:col-span-6 lg:mt-32 w-full flex justify-end">
                <MissionVisionSlider missionStatement={missionStatement} visionStatement={visionStatement} />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#0f0f0f] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">Our Values</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">The principles that guide every decision we make</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 text-center hover:bg-[#222] transition-colors">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#d4af37]/10 mb-6 border border-[#d4af37]/20">
                    <value.icon className="w-8 h-8 text-[#d4af37]" />
                  </div>
                  <h3 className="text-xl font-['Playfair_Display'] font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {deliveryMapLoading ? (
          <div className="py-24 flex justify-center bg-[#0f0f0f]">
            <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
          </div>
        ) : deliveryMapImage ? (
          <DeliveryReach image={deliveryMapImage} loading={false} error={null} />
        ) : (
          <section className="py-24 bg-[#0f0f0f] border-b border-white/5 text-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                className="bg-[#1a1a1a] rounded-3xl p-12 border border-white/10 max-w-3xl mx-auto shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578783931049-165bde93e43f')] opacity-5 mix-blend-overlay object-cover" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <Map className="w-10 h-10 text-gray-500" />
                  </div>
                  <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-4">Delivery Map Coming Soon</h2>
                  <p className="text-gray-400 mb-8 text-lg font-light leading-relaxed">
                    We are currently preparing an updated visual for our global delivery reach and logistics coordination. Please check back shortly!
                  </p>
                  <Link to="/admin/dashboard">
                    <Button className="bg-[#d4af37] text-black hover:bg-[#b5952f] rounded-full px-8 py-6 text-lg font-bold transition-all shadow-xl hover:-translate-y-1">
                      Upload Map Image (Admin)
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        <section className="py-24 bg-[#1a1a1a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">Meet Our Team</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">Expert professionals dedicated to excellence</p>
            </motion.div>

            {teamLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
              </div>
            ) : teamMembers.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Our team is growing. Check back soon for updates.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {teamMembers.map((member, index) => (
                  <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="bg-[#111] rounded-2xl p-8 text-center border border-white/5 shadow-xl">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#d4af37]/30 mx-auto mb-6 bg-[#222]">
                      {member.image_url ? (
                        <img src={member.image_url} alt={`${member.name}, ${member.role}`} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <Users className="w-12 h-12 text-gray-500 mx-auto mt-9" />
                      )}
                    </div>
                    <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-[#d4af37] font-semibold mb-4">{member.role}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{member.bio}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;