import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiSend, FiBookmark, FiMoreHorizontal } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import api from '../../api/axios';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';

interface SocialPostCardProps {
  post: any;
}

export function SocialPostCard({ post }: SocialPostCardProps) {
  const { user } = useAuthStore();
  const likesArray = post.likes || [];
  const [isLiked, setIsLiked] = useState(likesArray.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likesCount || likesArray.length);
  const [showHeart, setShowHeart] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const lastTapTime = useRef<number>(0);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    try {
      await api.put(`/posts/${post._id}/like`);
    } catch (error) {
      // Revert if error
      setIsLiked(isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime.current;
    
    if (timeSinceLastTap < 300) {
      // It's a double tap
      if (!isLiked) {
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        api.put(`/posts/${post._id}/like`).catch(() => {
          setIsLiked(false);
          setLikeCount(prev => prev - 1);
        });
      }
      
      // Trigger heart animation
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    
    lastTapTime.current = now;
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-8 break-inside-avoid">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={post.user?.profileImage || 'https://res.cloudinary.com/demo/image/upload/v1566427384/sample.jpg'} 
              alt={post.user?.username} 
              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />
            {post.user?.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[10px] p-0.5 rounded-full border-2 border-white dark:border-dark-surface">
                ✓
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-1">
              {post.user?.username}
            </h3>
            <p className="text-xs text-gray-500">{post.user?.name || ''}</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <FiMoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Image with Double Tap */}
      <div 
        className="relative w-full aspect-square md:aspect-auto md:min-h-[400px] bg-gray-100 dark:bg-gray-900 overflow-hidden cursor-pointer group"
        onClick={handleDoubleTap}
      >
        <img 
          src={post.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba959aab5db4?auto=format&fit=crop&q=80&w=2000'} 
          alt={post.caption} 
          className="w-full h-full object-cover"
        />
        
        {/* Giant Animated Heart on Double Tap */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: '-50%', x: '-50%' }}
              animate={{ opacity: 1, scale: 1.2, y: '-50%', x: '-50%' }}
              exit={{ opacity: 0, scale: 0.8, y: '-50%', x: '-50%' }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="absolute top-1/2 left-1/2 text-white/90 drop-shadow-2xl z-20 pointer-events-none"
            >
              <FaHeart size={100} className="text-red-500 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={handleLike}
              className={`transition-colors ${isLiked ? 'text-red-500' : 'text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              {isLiked ? <FaHeart size={24} /> : <FiHeart size={24} />}
            </motion.button>
            <button className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <FiMessageCircle size={24} />
            </button>
            <button className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <FiSend size={24} />
            </button>
          </div>
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={() => setIsSaved(!isSaved)}
            className={`transition-colors ${isSaved ? 'text-primary' : 'text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            {isSaved ? <FiBookmark size={24} className="fill-current" /> : <FiBookmark size={24} />}
          </motion.button>
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
          {likeCount.toLocaleString()} likes
        </p>

        {/* Caption */}
        <div className="text-sm text-gray-900 dark:text-white mb-2">
          <span className="font-semibold mr-2">{post.user?.username}</span>
          <span className="text-gray-800 dark:text-gray-200">
            {post.caption?.split(' ').map((word: string, i: number) => {
              if (word.startsWith('#')) {
                return <span key={i} className="text-orange-500 hover:underline cursor-pointer"> {word} </span>;
              }
              return word + ' ';
            })}
          </span>
        </div>

        {/* Comments Count */}
        {post.comments?.length > 0 && (
          <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 mb-2">
            View all {post.comments.length} comments
          </button>
        )}

        {/* Time */}
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">
          {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Just now'}
        </p>
      </div>
      
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <img 
          src={user?.profileImage || 'https://res.cloudinary.com/demo/image/upload/v1566427384/sample.jpg'} 
          alt="My Profile" 
          className="w-8 h-8 rounded-full object-cover"
        />
        <input 
          type="text" 
          placeholder="Add a comment..." 
          className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500"
        />
        <button className="text-orange-500 font-semibold text-sm disabled:opacity-50">
          Post
        </button>
      </div>
    </div>
  );
}
