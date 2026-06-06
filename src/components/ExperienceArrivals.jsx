import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw, Plus, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import YouTubeVideoCard from '@/components/YouTubeVideoCard';
import YouTubeVideoForm from '@/components/YouTubeVideoForm';
import { getYouTubeVideos, deleteYouTubeVideo } from '@/utils/supabaseQueries';
import { extractYouTubeVideoId } from '@/utils/youtubeUtils';

const ExperienceArrivals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getYouTubeVideos();
      setVideos(data);
    } catch (err) {
      console.error('Error fetching YouTube videos:', err);
      setError('Failed to load videos. Please try again.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (videoId) => {
    try {
      await deleteYouTubeVideo(videoId);
      toast({
        title: "Video Deleted",
        description: "The video has been removed successfully.",
        className: "bg-green-500/10 border-green-500/20"
      });
      await fetchVideos();
    } catch (err) {
      console.error('Error deleting video:', err);
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: err.message || "Failed to delete video. Please try again."
      });
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    await fetchVideos();
  };

  if (loading && videos.length === 0) {
    return (
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 w-64 bg-white/10 rounded mx-auto mb-6 animate-pulse" />
            <div className="h-6 w-96 bg-white/10 rounded mx-auto animate-pulse" />
          </div>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#111]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
            Witness the Magic
          </h2>
          <div className="w-24 h-1 bg-white/20 mx-auto mb-8" />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience Arrivals at Dream Black Horse Farm
          </p>
        </motion.div>

        {/* Admin Controls */}
        {user && (
          <div className="mb-12 flex justify-center">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#d4af37] hover:bg-[#b8941f] text-black font-bold rounded-full px-8 py-6"
            >
              {showForm ? (
                <>
                  <Youtube className="w-5 h-5 mr-2" />
                  Hide Form
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add YouTube Video
                </>
              )}
            </Button>
          </div>
        )}

        {/* Add Video Form */}
        {showForm && user && (
          <div className="mb-16">
            <YouTubeVideoForm
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-xl max-w-3xl mx-auto mb-16">
            <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Unable to Load Videos</h3>
            <p className="text-gray-400 mb-8 text-center max-w-md">{error}</p>
            <Button
              onClick={fetchVideos}
              variant="outline"
              className="border-white/20 text-white hover:bg-white hover:text-black rounded-full px-8"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {/* Videos Grid */}
        {!error && videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => {
              const videoId = extractYouTubeVideoId(video.video_url);
              return (
                <YouTubeVideoCard
                  key={video.id}
                  videoId={videoId}
                  title={video.video_title}
                  description={video.video_description}
                  createdAt={video.created_at}
                  onDelete={user ? () => handleDelete(video.id) : null}
                  showAdminControls={!!user}
                />
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!error && !loading && videos.length === 0 && (
          <div className="text-center py-16 bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-xl max-w-3xl mx-auto">
            <Youtube className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No Videos Yet</h3>
            <p className="text-gray-400 mb-8">
              {user 
                ? 'Start by adding your first YouTube video using the button above.'
                : 'Check back soon for exciting new video content!'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceArrivals;