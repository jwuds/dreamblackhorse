import React, { useState } from 'react';
import { useHomePageVideos } from '@/hooks/useHomePageVideos';
import VideoUploadComponent from '@/components/VideoUploadComponent';
import { Loader2, Plus, Edit, Trash2, Video as VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function AdminHomeVideos() {
  const { videos, loading, addVideo, updateVideo, deleteVideo } = useHomePageVideos();
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await updateVideo(id, { is_active: !currentStatus });
      toast({ title: 'Status updated' });
    } catch (e) {
      toast({ title: 'Error updating status', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await deleteVideo(id);
      toast({ title: 'Video deleted' });
    } catch (e) {
      toast({ title: 'Error deleting video', variant: 'destructive' });
    }
  };

  const groupedVideos = videos.reduce((acc, vid) => {
    acc[vid.section_name] = acc[vid.section_name] || [];
    acc[vid.section_name].push(vid);
    return acc;
  }, {});

  if (loading && videos.length === 0) {
    return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]"/></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Home Page Videos</h1>
          <p className="text-gray-400">Manage videos displayed across the front page sections.</p>
        </div>
        {!showUpload && (
          <Button onClick={() => setShowUpload(true)} className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold">
            <Plus className="w-5 h-5 mr-2" /> Add New Video
          </Button>
        )}
      </div>

      {showUpload && (
        <VideoUploadComponent 
          onCancel={() => setShowUpload(false)} 
          onUploadSuccess={async (data) => {
            await addVideo(data);
            setShowUpload(false);
          }} 
        />
      )}

      <div className="space-y-12">
        {Object.entries(groupedVideos).map(([section, vids]) => (
          <div key={section} className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
            <div className="bg-[#111] px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white capitalize">{section.replace('_', ' ')}</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400 text-sm">
                    <th className="p-4 font-medium">Video/Thumbnail</th>
                    <th className="p-4 font-medium">Title</th>
                    <th className="p-4 font-medium">Order</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {vids.map(vid => (
                    <tr key={vid.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="w-24 h-16 rounded-lg overflow-hidden bg-[#222] flex items-center justify-center border border-white/10">
                          {vid.thumbnail_url ? (
                            <img src={vid.thumbnail_url} alt={vid.video_title || 'Thumbnail'} className="w-full h-full object-cover" />
                          ) : (
                            <VideoIcon className="text-gray-600" />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-white font-medium">{vid.video_title || 'Untitled'}</p>
                        <a href={vid.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#d4af37] hover:underline truncate max-w-[200px] inline-block">
                          {vid.video_url}
                        </a>
                      </td>
                      <td className="p-4 text-white font-mono">{vid.display_order}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${vid.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {vid.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleToggleActive(vid.id, vid.is_active)} className="border-white/20 text-white hover:bg-white/10">
                            {vid.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(vid.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {videos.length === 0 && !showUpload && (
          <div className="text-center py-20 text-gray-500 border border-dashed border-white/20 rounded-2xl">
            No videos uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}