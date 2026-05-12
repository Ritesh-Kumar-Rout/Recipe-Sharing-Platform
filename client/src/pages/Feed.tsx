import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SocialPostCard } from '../components/feed/SocialPostCard';
import { Button } from '../components/ui/Button';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum: number) => {
    try {
      const res = await api.get(`/posts/feed?page=${pageNum}&limit=10`);
      if (res.data.success) {
        if (pageNum === 1) {
          setPosts(res.data.data);
        } else {
          setPosts(prev => [...prev, ...res.data.data]);
        }
        setHasMore(res.data.data.length === 10);
      }
    } catch (error: any) {
      toast.error('Failed to load feed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        if (!isLoading && hasMore) {
          setIsLoading(true);
          setPage(p => p + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Feed Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your <span className="text-orange-500">Feed</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">See what your favorite chefs are cooking.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="secondary" className="rounded-full shadow-sm">
            Trending
          </Button>
          <Button variant="primary" className="rounded-full shadow-md">
            Following
          </Button>
        </div>
      </div>

      {/* Masonry Feed Layout */}
      <div className="columns-1 md:columns-2 gap-8 space-y-8">
        {posts.map((post, idx) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (idx % 10) * 0.1 }}
            className="break-inside-avoid"
          >
            <SocialPostCard post={post} />
          </motion.div>
        ))}
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}
      
      {!isLoading && posts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No posts found. Try following some creators!
        </div>
      )}
    </div>
  );
}

