import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoCloudUploadOutline } from 'react-icons/io5';
import api from '../../api/axios';
import toast from 'react-hot-toast';

interface UploadPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadPostModal: React.FC<UploadPostModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5); // Limit to 5 images
      setImages(filesArray);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('caption', caption);
    
    // Process hashtags
    const parsedTags = hashtags.split(' ').map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(',');
    formData.append('hashtags', parsedTags);
    
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const res = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Post uploaded successfully!');
        setImages([]);
        setPreviews([]);
        setCaption('');
        setHashtags('');
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to upload post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Post</h2>
              <button 
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              <form id="upload-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Photos (Max 5)
                  </label>
                  {previews.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>
                      <IoCloudUploadOutline size={48} className="text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-300 font-medium">Click to upload images</p>
                      <p className="text-xs text-gray-400 mt-2">JPEG, PNG, JPG up to 5MB each</p>
                      <input 
                        id="image-upload" 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {previews.map((preview, idx) => (
                          <div key={idx} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                            <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <IoClose size={14} />
                            </button>
                          </div>
                        ))}
                        {previews.length < 5 && (
                          <div 
                            onClick={() => document.getElementById('image-upload-more')?.click()}
                            className="w-24 h-24 flex-shrink-0 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-colors cursor-pointer"
                          >
                            +
                            <input 
                              id="image-upload-more" 
                              type="file" 
                              multiple 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                if (e.target.files) {
                                  const newFiles = Array.from(e.target.files).slice(0, 5 - images.length);
                                  setImages([...images, ...newFiles]);
                                  setPreviews([...previews, ...newFiles.map(f => URL.createObjectURL(f))]);
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => { setImages([]); setPreviews([]); }}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Caption
                  </label>
                  <textarea 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a catchy caption..."
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none h-28 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hashtags
                  </label>
                  <input 
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="e.g. #foodie #burger #delicious"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                  />
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="upload-form"
                disabled={isLoading || images.length === 0}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-lg shadow-orange-500/30 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Uploading...' : 'Share Post'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
