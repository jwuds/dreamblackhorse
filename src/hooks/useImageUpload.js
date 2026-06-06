import { useState, useCallback } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const useImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file) => {
    setError(null);
    if (!file) {
      setError('No file selected.');
      return false;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, WebP, or GIF.');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 5MB.');
      return false;
    }
    return true;
  };

  const processFile = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  return {
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
    validateFile,
    setError
  };
};