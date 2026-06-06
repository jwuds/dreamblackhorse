import React, { useEffect, useState } from 'react';
import { Save, Loader2, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useBeginJourneyImage } from '@/hooks/useBeginJourneyImage';

const BeginJourneyImageManagement = () => {
  const { journeyImage, loading, error, fetchImage, saveImage, deleteImage } = useBeginJourneyImage();
  const [formData, setFormData] = useState({ image_url: '', alt_text: '' });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  useEffect(() => {
    if (journeyImage) {
      setFormData({
        image_url: journeyImage.image_url || '',
        alt_text: journeyImage.alt_text || ''
      });
    } else {
      setFormData({ image_url: '', alt_text: '' });
    }
  }, [journeyImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_url.trim()) {
      toast({ title: "Error", description: "Image URL is required", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      await saveImage(formData);
      toast({ title: "Success", description: "Begin Journey image updated successfully." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update image.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove this image from the homepage?")) return;
    try {
      await deleteImage();
      toast({ title: "Success", description: "Image removed." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove image.", variant: "destructive" });
    }
  };

  if (loading && !journeyImage && !error) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-white animate-spin" /></div>;
  }

  if (error && !journeyImage) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#1a1a1a] rounded-2xl border border-white/5">
        <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
        <p className="text-gray-300 mb-6 text-center max-w-md">Failed to load journey image settings. Please check your connection and try again.</p>
        <Button onClick={fetchImage} variant="outline" className="border-white/20 text-white hover:bg-white/10">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-1">Begin Journey Image</h2>
        <p className="text-gray-400 text-sm mb-6">Manage the image displayed above the "Contact Us Today" button on the homepage.</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
            <Button size="sm" variant="ghost" onClick={fetchImage} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
              Retry
            </Button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Image URL <span className="text-red-500">*</span></label>
              <input
                type="url"
                required
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Alt Text</label>
              <input
                type="text"
                value={formData.alt_text}
                onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white"
                placeholder="Description of the image for accessibility"
              />
            </div>
          </div>

          <div className="border border-white/10 rounded-xl p-4 bg-[#111] min-h-[200px] flex items-center justify-center relative overflow-hidden">
            {formData.image_url ? (
              <img src={formData.image_url} alt="Preview" className="max-w-full max-h-[400px] object-contain rounded-lg" onError={(e) => e.target.style.display = 'none'} />
            ) : (
              <p className="text-gray-500 text-sm">Image preview will appear here</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSaving} className="bg-white text-black hover:bg-gray-200 px-8">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Image
            </Button>
            {journeyImage && (
              <Button type="button" variant="destructive" onClick={handleDelete} className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
                <Trash2 className="w-4 h-4 mr-2" /> Remove Image
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeginJourneyImageManagement;