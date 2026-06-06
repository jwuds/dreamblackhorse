import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const ReviewsContext = createContext({});

export const ReviewsProvider = ({ children }) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial load from localStorage
  useEffect(() => {
    try {
      const storedReviews = localStorage.getItem('dream_horse_reviews');
      const storedMatches = localStorage.getItem('dream_horse_matches');
      
      if (storedReviews) setReviews(JSON.parse(storedReviews));
      else {
        // Default dummy reviews
        const defaultReviews = [
          {
            id: '1', name: 'Sarah Jenkins', rating: 5, date: '2023-10-15', published: true,
            text: 'Finding my dream Friesian was an absolute joy with Dream Black Horse Farm. Their expertise and care made the process seamless.',
            image: 'https://images.unsplash.com/photo-1689784085143-3b4cccbf4f4d'
          },
          {
            id: '2', name: 'Michael Thompson', rating: 5, date: '2023-11-02', published: true,
            text: 'The veterinary checks and documentation were handled perfectly. My stallion arrived in pristine condition.',
            image: 'https://images.unsplash.com/photo-1690112329433-f1963fd0e9df'
          },
          {
            id: '3', name: 'Emma Davis', rating: 4, date: '2023-12-10', published: true,
            text: 'Exceptional service and beautiful horses. We are thrilled with our new mare!',
            image: 'https://images.unsplash.com/photo-1587997460079-d078a31109fa'
          }
        ];
        setReviews(defaultReviews);
        localStorage.setItem('dream_horse_reviews', JSON.stringify(defaultReviews));
      }

      if (storedMatches) setMatches(JSON.parse(storedMatches));
      else {
        // Default dummy matches
        const defaultMatches = [
          {
            id: '1', horseName: 'Apollo', clientName: 'The Henderson Family', published: true, order: 0,
            story: 'Apollo found his forever home with the Hendersons, excelling in dressage and becoming a beloved family member.',
            image: 'https://images.unsplash.com/photo-1700010072186-6799348b81c3'
          },
          {
            id: '2', horseName: 'Luna', clientName: 'Jessica M.', published: true, order: 1,
            story: 'A perfect match for Jessica, Luna has already started competing and turning heads at local shows.',
            image: 'https://images.unsplash.com/photo-1506809621095-d1fed6f0441d'
          }
        ];
        setMatches(defaultMatches);
        localStorage.setItem('dream_horse_matches', JSON.stringify(defaultMatches));
      }
    } catch (error) {
      console.error('Failed to load reviews from local storage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('dream_horse_reviews', JSON.stringify(reviews));
      localStorage.setItem('dream_horse_matches', JSON.stringify(matches));
    }
  }, [reviews, matches, loading]);

  // Review Actions
  const addReview = (review) => {
    const newReview = { ...review, id: Date.now().toString() };
    setReviews(prev => [newReview, ...prev]);
    toast({ title: 'Success', description: 'Review added successfully.' });
  };

  const updateReview = (id, updates) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    toast({ title: 'Success', description: 'Review updated successfully.' });
  };

  const deleteReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    toast({ title: 'Success', description: 'Review deleted successfully.' });
  };

  const togglePublishReview = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, published: !r.published } : r));
    toast({ title: 'Success', description: 'Review status updated.' });
  };

  // Match Actions
  const addMatch = (match) => {
    const newMatch = { ...match, id: Date.now().toString(), order: matches.length };
    setMatches(prev => [...prev, newMatch]);
    toast({ title: 'Success', description: 'Match added successfully.' });
  };

  const updateMatch = (id, updates) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    toast({ title: 'Success', description: 'Match updated successfully.' });
  };

  const deleteMatch = (id) => {
    setMatches(prev => prev.filter(m => m.id !== id));
    toast({ title: 'Success', description: 'Match deleted successfully.' });
  };

  const togglePublishMatch = (id) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, published: !m.published } : m));
    toast({ title: 'Success', description: 'Match status updated.' });
  };

  return (
    <ReviewsContext.Provider value={{
      reviews, matches, loading,
      addReview, updateReview, deleteReview, togglePublishReview,
      addMatch, updateMatch, deleteMatch, togglePublishMatch
    }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error('useReviews must be used within a ReviewsProvider');
  return context;
};