import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

const BlogPostCard = ({ post }) => {
  return (
    <div className="group flex flex-col bg-[#222] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={post.featured_image || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <Calendar className="w-4 h-4" />
          <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
        </div>
        <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-3 group-hover:text-gray-200 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-3">
          {post.excerpt || post.content?.substring(0, 150) + '...'}
        </p>
        <Link 
          to={`/blog/${post.slug}`}
          className="inline-flex items-center text-sm font-medium text-white hover:text-gray-300 transition-colors"
        >
          Read Full Article
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default BlogPostCard;