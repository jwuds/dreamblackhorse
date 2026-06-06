import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Video as VideoIcon, X, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const SECTIONS = ['hero', 'featured_horses', 'latest_insights', 'about_preview', 'credibility', 'testimonials', 'footer', 'other'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

export default function VideoUploadComponent({ onUploadSuccess, onCancel }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadType, setUploadType] = useState('url'); // 'url' or 'file'
  const [file, setFile] = useState(null);
  
  const [formData, setFormData] = useState({
    section_name: 'hero',
    video_url: '',
    video_title: '',
    video_description: '',
    thumbnail_url: '',
    display_order: 0,
    is_active: true
  });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      toast({ 
        title: 'Invalid File Type', 
        description: 'Please select a valid video file (MP4, WebM, MOV, AVI).', 
        variant: 'destructive' 
      });
      return;
    }
    
    if (selected.size > MAX_FILE_SIZE) {
      toast({ 
        title: 'File Too Large', 
        description: 'Maximum file size is 100MB.', 
        variant: 'destructive' 
      });
      return;
    }

    setFile(selected);
    if (!formData.video_title) {
      setFormData(p => ({ ...p, video_title: selected.name.split('.')[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (uploadType === 'url' && !formData.video_url) {
      toast({ title: 'Missing URL', description: 'Please enter a video URL.', variant: 'destructive' });
      return;
    }
    if (uploadType === 'file' && !file) {
      toast({ title: 'Missing File', description: 'Please select a video file to upload.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      let finalVideoUrl = formData.video_url;

      if (uploadType === 'file' && file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `vid_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `home-videos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('site-images')
          .upload(filePath, file, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('site-images')
          .getPublicUrl(filePath);
          
        finalVideoUrl = publicUrl;
      }

      const newRecord = {
        section_name: formData.section_name,
        video_url: finalVideoUrl,
        video_title: formData.video_title,
        video_description: formData.video_description,
        thumbnail_url: formData.thumbnail_url,
        display_order: parseInt(formData.display_order, 10),
        is_active: formData.is_active
      };

      const { data: insertedData, error: dbError } = await supabase
        .from('home_page_videos')
        .insert([newRecord])
        .select();

      if (dbError) throw dbError;

      if (onUploadSuccess) {
        await onUploadSuccess(insertedData[0]);
      }
      
      toast({ title: 'Success', description: 'Video saved successfully.' });
      
      // Reset form
      setFile(null);
      setFormData({
        section_name: 'hero', video_url: '', video_title: '', video_description: '', thumbnail_url: '', display_order: 0, is_active: true
      });

    } catch (err) {
      console.error('Upload Error:', err);
      toast({ title: 'Upload Failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Add New Video</h3>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setUploadType('url')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${uploadType === 'url' ? 'bg-[#d4af37] text-black' : 'bg-[#111] text-gray-400 border border-white/10 hover:text-white'}`}
        >
          <LinkIcon className="w-4 h-4" /> Embed URL
        </button>
        <button
          type="button"
          onClick={() => setUploadType('file')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${uploadType === 'file' ? 'bg-[#d4af37] text-black' : 'bg-[#111] text-gray-400 border border-white/10 hover:text-white'}`}
        >
          <Upload className="w-4 h-4" /> Upload File
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {uploadType === 'url' ? (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Video URL (YouTube, Vimeo, etc.)</label>
            <input 
              type="url" 
              value={formData.video_url} 
              onChange={e => setFormData(p => ({ ...p, video_url: e.target.value }))}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-[#d4af37]"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Video File</label>
            {file ? (
              <div className="flex items-center justify-between bg-[#111] border border-white/20 p-4 rounded-xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <VideoIcon className="w-6 h-6 text-[#d4af37] shrink-0" />
                  <span className="text-white truncate">{file.name}</span>
                </div>
                <button type="button" onClick={() => setFile(null)} className="text-red-400 hover:text-red-300 p-2"><X className="w-5 h-5"/></button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-[#d4af37]/50 transition-colors">
                <Upload className="mx-auto h-10 w-10 text-gray-500 mb-4" />
                <label className="cursor-pointer block">
                  <span className="bg-[#d4af37] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#b5952f] transition-colors inline-block">Select Video</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="video/mp4,video/webm,video/quicktime,video/x-msvideo" 
                    onChange={handleFileChange} 
                  />
                </label>
                <p className="text-xs text-gray-500 mt-4">MP4, WebM, MOV, AVI up to 100MB</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input 
              type="text" 
              required
              value={formData.video_title} 
              onChange={e => setFormData(p => ({ ...p, video_title: e.target.value }))}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail URL (optional)</label>
            <input 
              type="url" 
              value={formData.thumbnail_url} 
              onChange={e => setFormData(p => ({ ...p, thumbnail_url: e.target.value }))}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-[#d4af37]"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea 
            value={formData.video_description} 
            onChange={e => setFormData(p => ({ ...p, video_description: e.target.value }))}
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-[#d4af37]"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Section</label>
            <select 
              value={formData.section_name} 
              onChange={e => setFormData(p => ({ ...p, section_name: e.target.value }))}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-[#d4af37]"
            >
              {SECTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
            <input 
              type="number" 
              value={formData.display_order} 
              onChange={e => setFormData(p => ({ ...p, display_order: e.target.value }))}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-[#d4af37]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="is_active_vid"
            checked={formData.is_active}
            onChange={e => setFormData(p => ({ ...p, is_active: e.target.checked }))}
            className="w-5 h-5 bg-[#111] border-white/10 rounded text-[#d4af37] focus:ring-[#d4af37]"
          />
          <label htmlFor="is_active_vid" className="text-sm font-medium text-gray-300 cursor-pointer">Active (Visible on site)</label>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg transition-colors">
          {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Upload className="w-6 h-6 mr-2" />}
          {loading ? 'Saving Video...' : 'Save Video'}
        </Button>
      </form>
    </div>
  );
}