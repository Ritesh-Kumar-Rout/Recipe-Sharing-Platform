import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoAdd } from 'react-icons/io5';
import { UploadPostModal } from '../feed/UploadPostModal';

export const FloatingPostButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-gradient-to-tr from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] cursor-pointer group"
      >
        <IoAdd size={32} className="group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>

      <UploadPostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          // If we are on the feed page, we might want to refresh the feed
          // But a simple reload or state trigger is fine for now
          window.location.reload(); // Simple refresh for now to see new post
        }} 
      />
    </>
  );
};
