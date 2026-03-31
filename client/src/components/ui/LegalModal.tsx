import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function LegalModal({ isOpen, onClose, title }: LegalModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white dark:bg-dark-surface w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto grow custom-scrollbar space-y-4 text-gray-600 dark:text-gray-300">
              <p>Welcome to YumCircle's {title}. This is a simulated legal document for demonstration purposes.</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">1. Your Agreement</h3>
              <p>By using our Platform, you agree to comply with and be bound by these dummy terms. If you do not agree, please do not use the Platform.</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">2. User Content</h3>
              <p>When you upload recipes, images, or comments, you grant us a non-exclusive license to use, display, and distribute your content across our services.</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">3. Privacy & Data</h3>
              <p>We respect your privacy. Any mock data entered here remains local to your browser session and is not transmitted to external servers.</p>
              <p className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm pb-8">Last updated: March 2026</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
