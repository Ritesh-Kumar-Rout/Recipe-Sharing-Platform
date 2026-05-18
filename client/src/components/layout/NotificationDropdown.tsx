import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiHeart, FiMessageCircle, FiUserPlus, FiInfo } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadNotifications, clearNotifications } = useAuthStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <FiHeart className="text-red-500 fill-current" />;
      case 'comment': return <FiMessageCircle className="text-blue-500 fill-current" />;
      case 'follow': return <FiUserPlus className="text-green-500" />;
      default: return <FiInfo className="text-gray-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
              {unreadNotifications > 0 && (
                <button 
                  onClick={clearNotifications}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n, i) => (
                  <div 
                    key={n._id || i} 
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer flex gap-3"
                  >
                    <div className="shrink-0 pt-1">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-bold">{n.sender?.username}</span> {
                          n.type === 'like' ? 'liked your post' : 
                          n.type === 'comment' ? 'commented on your post' : 
                          n.type === 'follow' ? 'started following you' : 'interacted with you'
                        }
                      </p>
                      <span className="text-[10px] text-gray-500 mt-1 block">
                        {n.createdAt ? formatDistanceToNow(new Date(n.createdAt)) : 'Just now'} ago
                      </span>
                    </div>
                    {n.post?.images?.[0] && (
                      <img src={n.post.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBell className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications yet</p>
                  <p className="text-xs text-gray-400 mt-1">Interactions with your content will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
