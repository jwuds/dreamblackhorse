import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/hooks/useImageUpload';

const ImageEditModal = ({ isOpen, onClose, onSave, currentImage }) => {
  const fileInputRef = useRef(null);
  const {
    selectedFile,
    preview,
    error,
    isLoading,
    setIsLoading,
    isDragging,
    setIsDragging,
    handleDrop,
    handleFileSelect,
    clearFile,
    setError
  } = useImageUpload();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      clearFile();
      onClose();
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      setError('Please select an image to upload.');
      return;
    }
    setIsLoading(true);
    try {
      await onSave(selectedFile);
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to upload image.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const displayImage = preview || currentImage;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h3 className="text-xl font-['Playfair_Display'] font-bold text-white">Update Image</h3>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {displayImage && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-[#111] border border-white/5">
                <img
                  src={displayImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/20 bg-[#111] hover:bg-white/5 hover:border-white/40'
              } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={isLoading}
              />
              <UploadCloud className={`w-8 h-8 mb-2 ${isDragging ? 'text-blue-400' : 'text-gray-400'}`} />
              <p className="text-sm font-medium text-white text-center px-4">
                {selectedFile ? selectedFile.name : 'Click or drag and drop to upload'}
              </p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP, GIF up to 5MB</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5 bg-[#111]">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedFile || isLoading}
              className="bg-white text-black hover:bg-gray-200 min-w-[100px]"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Image'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ImageEditModal;