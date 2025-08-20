import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useFileUpload = (initialPreview = '') => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialPreview);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.match('image.*')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (max 2MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error('File size should be less than 2MB');
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  const removeFile = useCallback(() => {
    setFile(null);
    setPreviewUrl('');
  }, []);

  const resetUpload = useCallback(() => {
    setFile(null);
    setPreviewUrl(initialPreview);
  }, [initialPreview]);

  return {
    file,
    previewUrl,
    isUploading,
    handleFileChange,
    removeFile,
    resetUpload,
    setIsUploading
  };
};