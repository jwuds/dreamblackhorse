export const blogPosts = [
  {
    id: 'nutrition-guide-2026',
    title: 'Complete Nutrition Guide for Performance Horses',
    excerpt: 'Learn about optimal feeding strategies to maintain peak performance and health in your competition horses.',
    category: 'care',
    date: '2026-02-15',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a',
    featured: true,
    author: 'Dr. James Richardson'
  },
  {
    id: 'young-horse-training',
    title: 'Starting Young Horses: A Foundation for Success',
    excerpt: 'Expert guidance on introducing training to young horses while building trust and confidence.',
    category: 'training',
    date: '2026-02-10',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1598026619363-a024cadfcff1',
    author: 'Emily Torres'
  },
  {
    id: 'breeding-program-update',
    title: '2026 Breeding Program Announcements',
    excerpt: 'Exciting new additions to our breeding program including champion stallions and proven mares.',
    category: 'breeding',
    date: '2026-02-05',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1693500897543-e8427a6b96c7',
    author: 'Sarah Jenkins'
  },
  {
    id: 'winter-care-essentials',
    title: 'Winter Care Essentials for Your Horse',
    excerpt: 'Comprehensive guide to keeping your horse healthy and comfortable during cold weather months.',
    category: 'care',
    date: '2026-01-28',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1551191916-07a589e85954',
    author: 'Dr. James Richardson'
  },
  {
    id: 'dressage-fundamentals',
    title: 'Dressage Fundamentals: Building Block by Block',
    excerpt: 'Master the basics of dressage training with our systematic approach to developing collection and balance.',
    category: 'training',
    date: '2026-01-20',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1534582927965-c3fb32f191fc',
    author: 'Marcus Weber'
  },
  {
    id: 'foal-season-preparations',
    title: 'Preparing for Foal Season: Checklist and Tips',
    excerpt: 'Everything you need to know to prepare for a successful foaling season at your facility.',
    category: 'breeding',
    date: '2026-01-15',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1544686833-1f79cc2b8f11',
    author: 'Sarah Jenkins'
  }
];

export const getLatestBlogPosts = (limit = 3) => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};