import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Check, X, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { validateYouTubeUrl, extractYouTubeVideoId } from '@/utils/youtubeUtils';
import { supabase } from '@/lib/customSupabaseClient';

const YouTubeVideoForm = ({ onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: ''
  });
  const [urlError, setUrlError] = useState('');

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, url }));
    
    if (url.trim()) {
      const validation = validateYouTubeUrl(url);
      if (!validation.valid) {
        setUrlError(validation.error);
      } else {
        setUrlError('');
      }
    } else {
      setUrlError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.url.trim()) {
      toast({
        variant: "destructive",
        title: "Missing URL",
        description: "Please enter a YouTube video URL"
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Title",
        description: "Please enter a video title"
      });
      return;
    }

    // Validate YouTube URL
    const validation = validateYouTubeUrl(formData.url);
    if (!validation.valid) {
      setUrlError(validation.error);
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: validation.error
      });
      return;
    }

    setIsLoading(true);

    try {
      const videoId = extractYouTubeVideoId(formData.url);
      
      const { data, error } = await supabase
        .from('home_page_videos')
        .insert([{
          section_name: 'experience_arrivals',
          video_url: formData.url,
          video_title: formData.title.trim(),
          video_description: formData.description.trim(),
          video_type: 'youtube',
          is_active: true,
          display_order: 0
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Video Added Successfully",
        description: `"${formData.title}" has been added to your collection.`,
        className: "bg-green-500/10 border-green-500/20"
      });

      // Reset form
      setFormData({ url: '', title: '', description: '' });
      setUrlError('');

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      console.error('Error adding YouTube video:', error);
      toast({
        variant: "destructive",
        title: "Failed to Add Video",
        description: error.message || "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <Youtube className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white">
          Add YouTube Video
        </h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtube-url" className="text-white font-semibold">
          YouTube URL *
        </Label>
        <Input
          id="youtube-url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={formData.url}
          onChange={handleUrlChange}
          className={`bg-[#111] border-white/20 text-white placeholder:text-gray-500 focus:border-[#d4af37] ${
            urlError ? 'border-red-500' : ''
          }`}
          required
        />
        {urlError && (
          <p className="text-red-400 text-sm flex items-center gap-2">
            <X className="w-4 h-4" />
            {urlError}
          </p>
        )}
        {!urlError && formData.url && (
          <p className="text-green-400 text-sm flex items-center gap-2">
            <Check className="w-4 h-4" />
            Valid YouTube URL
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-title" className="text-white font-semibold">
          Video Title *
        </Label>
        <Input
          id="video-title"
          type="text"
          placeholder="Enter video title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="bg-[#111] border-white/20 text-white placeholder:text-gray-500 focus:border-[#d4af37]"
          required
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-description" className="text-white font-semibold">
          Description (Optional)
        </Label>
        <Textarea
          id="video-description"
          placeholder="Enter video description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="bg-[#111] border-white/20 text-white placeholder:text-gray-500 focus:border-[#d4af37] min-h-[100px] resize-none"
          maxLength={500}
        />
        <p className="text-gray-500 text-sm">
          {formData.description.length}/500 characters
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading || !!urlError || !formData.url.trim() || !formData.title.trim()}
          className="flex-1 bg-[#d4af37] hover:bg-[#b8941f] text-black font-bold rounded-lg py-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Adding Video...
            </>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Add Video
            </>
          )}
        </Button>

        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </motion.form>
  );
};

export default YouTubeVideoForm;