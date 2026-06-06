import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const About = () => {
  const teamMembers = [{
    name: 'Klaus',
    role: 'Founder & Curator',
    bio: 'With a lifelong passion for design and history, Klaus founded Midcentury Decor to share his love for timeless furniture. He meticulously sources each piece, ensuring it meets his high standards of quality and authenticity.',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36'
  }, {
    name: 'Greta',
    role: 'Restoration Specialist',
    bio: 'Greta breathes new life into every vintage find. Her expertise in restoration techniques and her delicate touch ensure that each piece notophen looks beautiful but is also ready for a new generation of use.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
  }, {
    name: 'Lars',
    role: 'Logistics & Customer Care',
    bio: 'Lars makes sure your new treasure arrives safely. He manages all logistics, from packing to shipping, and is always ready to assist with any questions, ensuring a smooth and happy experience for our customers.',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5'
  }];
  return <>
          <Helmet>
            <title>About Us - Midcentury Decor</title>
            <meta name="description" content="Learn about the passion and people behind Midcentury Decor. Discover our story and our commitment to curating authentic vintage pieces from Berlin." />
          </Helmet>
    
          <div className="bg-white">
            <header className="bg-white py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="text-5xl font-light tracking-tight text-gray-900 mb-4">Our story</motion.h1>
                <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }} className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                  Founded in the heart of Berlin, Midcentury Decor was born from a passion for timeless design and the stories behind each piece. We believe that furniture should be more than just functional; it should be a source of joy and a reflection of personal style.
                </motion.p>
              </div>
            </header>
    
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <motion.div initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.8
            }}>
                    <img className="rounded-2xl w-full h-full object-cover aspect-[4/3]" alt="Brightly lit modern interior with vintage wooden furniture" src="https://horizons-cdn.hostinger.com/1ee4ac76-1453-4dcc-a280-1aeb1d67f81b/mesut-cicen-tsu1bkzhu98-unsplash-iqZ6i.jpg" />
                  </motion.div>
                  <motion.div initial={{
              opacity: 0,
              x: 20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }}>
                    <h2 className="text-4xl font-light text-gray-900">Our philosophy</h2>
                    <p className="mt-4 text-lg text-gray-600">
                      We are dedicated to sourcing and restoring authentic midcentury, vintage, and retro furniture. Each item in our collection is handpicked for its unique character, quality craftsmanship, and enduring appeal.
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                      Our mission is to help you create a space that is not only beautiful but also tells a story. We value sustainability, choosing to give well-made pieces a second life, reducing waste, and celebrating the art of design.
                    </p>
                  </motion.div>
                </div>
              </div>
            </section>
    
            <section className="bg-gray-50 py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-4xl font-light text-gray-900">Meet the team</h2>
                  <p className="mt-4 text-lg text-gray-600">The passionate individuals behind our collection.</p>
                </div>
                <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                  {teamMembers.map((member, index) => <motion.div key={member.name} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6,
              delay: index * 0.1
            }} className="text-center">
                      <img className="mx-auto h-40 w-40 rounded-full object-cover" src={member.image} alt={`Portrait of ${member.name}`} />
                      <h3 className="mt-6 text-xl font-medium text-gray-900">{member.name}</h3>
                      <p className="text-gray-600">{member.role}</p>
                      <p className="mt-2 text-gray-500 max-w-xs mx-auto">{member.bio}</p>
                    </motion.div>)}
                </div>
              </div>
            </section>
    
            <section className="py-20">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-light text-gray-900">Join our community</h2>
                <p className="mt-4 text-lg text-gray-600">
                  Ready to find your next treasure? Browse our collection or get in touch if you're looking for something specific. We're here to help you create the home of your dreams.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <Link to="/shop">
                    <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-3">
                      Shop Now
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" className="rounded-full px-8 py-3">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </>;
};
export default About;