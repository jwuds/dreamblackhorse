import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Loader2, Calendar } from 'lucide-react';
import YouTubeVideoEmbed from '@/components/YouTubeVideoEmbed';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
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

const YouTubeVideoCard = ({ 
  videoId, 
  title, 
  description, 
  createdAt,
  onDelete,
  showAdminControls = false 
}) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error('Error deleting video:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all shadow-xl hover:shadow-2xl"
    >
      <div className="relative">
        <YouTubeVideoEmbed videoId={videoId} title={title} />
        
        {showAdminControls && user && onDelete && (
          <div className="absolute top-4 right-4 z-20">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-red-500/90 hover:bg-red-600 backdrop-blur-sm"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
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
                    Are you sure you want to delete "{title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-[#111] border-white/20 text-white hover:bg-white/10">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <div className="p-6 space-y-3">
        <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white group-hover:text-[#d4af37] transition-colors line-clamp-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-400 leading-relaxed line-clamp-3">
            {description}
          </p>
        )}

        {formattedDate && (
          <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default YouTubeVideoCard;