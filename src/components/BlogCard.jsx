import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogCard = memo(({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link to={`/blog/${post.id}`} className="block h-full">
        <div className="glass-effect rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col hover:-translate-y-2">
          <div className="relative overflow-hidden aspect-[16/9]">
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-6 flex flex-col flex-grow bg-[#2a2a2a]">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <h3 className="text-xl font-['Playfair_Display'] font-semibold text-white leading-tight mb-3 line-clamp-2 group-hover:text-gray-200 transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
              {post.excerpt}
            </p>
            <div className="mt-auto pt-4 border-t border-white/10">
              <Button variant="ghost" className="p-0 text-white hover:text-gray-300 hover:bg-transparent flex items-center group-hover:translate-x-2 transition-transform">
                Read More
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;