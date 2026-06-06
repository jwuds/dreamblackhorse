import React from 'react';
import BlogPost from '@/pages/BlogPost';

// We route /blog/:slug to BlogPost.jsx in App.jsx. 
// If BlogPostDetail is directly used anywhere, we mirror the same component to keep functionality consistent
// and prevent duplicated logic errors or infinite loops.
const BlogPostDetail = () => {
  return <BlogPost />;
};

export default BlogPostDetail;