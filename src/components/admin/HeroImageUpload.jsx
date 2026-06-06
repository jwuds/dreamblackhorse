import React, { useState, useRef } from 'react';
import { Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const HeroImageUpload = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    let successCount = 0;

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `hero-images/${fileName}`;

        // Upload to storage bucket
        const { error: uploadError } = await supabase.storage
          .from('site-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('site-images')
          .getPublicUrl(filePath);

        // Get max order
        const { data: orderData } = await supabase
          .from('hero_images')
          .select('order')
          .order('order', { ascending: false })
          .limit(1);
        
        const nextOrder = (orderData && orderData[0]?.order) !== undefined ? orderData[0].order + 1 : 0;

        // Save reference to database
        const { error: dbError } = await supabase
          .from('hero_images')
          .insert([{
            image_url: publicUrlData.publicUrl,
            alt_text: file.name,
            order: nextOrder,
            status: 'active'
          }]);

        if (dbError) throw dbError;
        successCount++;
      }

      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${successCount} image(s).`,
      });
      setFiles([]);
      if (onUploadSuccess) onUploadSuccess();
      
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Upload Hero Images</h3>
      
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-white/20 hover:border-white/40'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300 font-medium">Drag & drop images here, or click to select</p>
        <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, WEBP (Max 5MB)</p>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">Selected Files:</h4>
          <div className="space-y-2 mb-4">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[#111] p-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-300 truncate max-w-[200px] sm:max-w-md">{file.name}</span>
                </div>
                <button 
                  onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                  className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold"
          >
            {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : 'Upload All Images'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeroImageUpload;