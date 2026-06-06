import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Loader2, AlertCircle, RefreshCw, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import YouTubeVideoForm from '@/components/YouTubeVideoForm';
import YouTubeVideoEmbed from '@/components/YouTubeVideoEmbed';
import { getYouTubeVideos, deleteYouTubeVideo } from '@/utils/supabaseQueries';
import { extractYouTubeVideoId } from '@/utils/youtubeUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const YouTubeManagementPanel = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleDelete = async (videoId, videoTitle) => {
    setDeletingId(videoId);
    try {
      await deleteYouTubeVideo(videoId);
      toast({
        title: "Video Deleted",
        description: `"${videoTitle}" has been removed successfully.`,
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
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    await fetchVideos();
  };

  const lastUpdated = videos.length > 0 
    ? new Date(Math.max(...videos.map(v => new Date(v.updated_at)))).toLocaleString()
    : 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white flex items-center gap-3">
            <Youtube className="w-8 h-8 text-red-500" />
            YouTube Video Management
          </h2>
          <p className="text-gray-400 mt-2">
            Manage YouTube videos displayed in the Experience Arrivals section
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          {showForm ? 'Hide Form' : 'Add YouTube Video'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Total Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-[#d4af37]">{videos.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Active Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-500">
              {videos.filter(v => v.is_active).length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {lastUpdated}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Video Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <YouTubeVideoForm
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </motion.div>
      )}

      {/* Loading State */}
      {loading && videos.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-[#1a1a1a] border-red-500/20">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Unable to Load Videos</h3>
            <p className="text-gray-400 mb-8 text-center max-w-md">{error}</p>
            <Button
              onClick={fetchVideos}
              variant="outline"
              className="border-white/20 text-white hover:bg-white hover:text-black"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Videos List */}
      {!error && !loading && videos.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Manage Videos ({videos.length})</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {videos.map((video) => {
              const videoId = extractYouTubeVideoId(video.video_url);
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-[#1a1a1a] border-white/10 hover:border-white/20 transition-all overflow-hidden">
                    <div className="relative">
                      <YouTubeVideoEmbed videoId={videoId} title={video.video_title} />
                      
                      <div className="absolute top-4 right-4 z-20">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="bg-red-500/90 hover:bg-red-600 backdrop-blur-sm"
                              disabled={deletingId === video.id}
                            >
                              {deletingId === video.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#1a1a1a] border-white/20">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Delete Video</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                Are you sure you want to delete "{video.video_title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-[#111] border-white/20 text-white hover:bg-white/10">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(video.id, video.video_title)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {video.video_title}
                      </h4>
                      
                      {video.video_description && (
                        <p className="text-gray-400 mb-4 line-clamp-3">
                          {video.video_description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(video.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          video.is_active 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-gray-500/10 text-gray-500'
                        }`}>
                          {video.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-[#111] rounded-lg border border-white/5">
                        <p className="text-xs text-gray-500 mb-1">YouTube URL</p>
                        <p className="text-sm text-gray-400 truncate">{video.video_url}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!error && !loading && videos.length === 0 && (
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Youtube className="w-20 h-20 text-gray-600 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No YouTube Videos</h3>
            <p className="text-gray-400 mb-8 text-center max-w-md">
              Get started by adding your first YouTube video using the button above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default YouTubeManagementPanel;