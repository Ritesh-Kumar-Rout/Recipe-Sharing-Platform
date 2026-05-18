import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiEdit2, FiGrid, FiBookmark, FiX, FiCheck, FiHeart, FiMessageCircle, FiCamera } from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RecipeCard } from '../components/recipe/RecipeCard';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { SEO } from '../components/seo/SEO';
import { Avatar } from '../components/ui/Avatar';

export default function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'posts' | 'my-recipes' | 'saved'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [posts, setPosts] = useState<any[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({ 
    username: user?.username || '', 
    bio: user?.bio || '' 
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserContent();
    }
  }, [user?.username, activeTab]);

  const fetchUserContent = async () => {
    try {
      if (activeTab === 'posts') {
        const res = await api.get(`/users/${user?.username}`);
        if (res.data.success) {
          setPosts(res.data.data.posts);
        }
      }
      // Note: Backend for saved items needs to be connected if available
    } catch (error) {
      console.error("Failed to fetch profile content");
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', editForm.username);
      formData.append('bio', editForm.bio);
      if (avatarFile) {
        formData.append('profileImage', avatarFile);
      }

      const res = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        updateUser(res.data.data);
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white dark:bg-dark-background">
      <SEO 
        title={`${user?.username || 'Profile'}`} 
        description={`View ${user?.username}'s profile on YumCircle. Explore their shared recipes and culinary journey.`}
      />
      <div className="pt-24 pb-12 bg-gray-50 dark:bg-dark-surface/50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-dark-background shadow-lg overflow-hidden relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Avatar src={user?.profileImage} name={user?.username} size="xl" className="w-full h-full rounded-none" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform">
                  <FiCamera size={16} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left w-full">
              {isEditing ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mb-6 relative">
                  <Input value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})} className="max-w-md font-bold text-lg" placeholder="Username" />
                  <textarea 
                    value={editForm.bio} 
                    onChange={e => setEditForm({...editForm, bio: e.target.value})} 
                    className="w-full max-w-2xl bg-gray-50 dark:bg-dark-background border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all resize-none h-24"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex justify-center md:justify-start gap-3 mt-4">
                    <Button variant="primary" size="sm" onClick={handleSaveProfile} isLoading={isLoading} leftIcon={<FiCheck />}>Save Changes</Button>
                    <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setEditForm({ username: user?.username || '', bio: user?.bio || '' }); setAvatarPreview(null); }}>Cancel</Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">{user?.username || 'Guest User'}</h1>
                      <p className="text-gray-500 dark:text-gray-400">@{user?.username?.toLowerCase() || 'guest'} • Member since 2026</p>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Button variant="outline" leftIcon={<FiEdit2 />} onClick={() => setIsEditing(true)}>Edit Profile</Button>
                      <Button variant="secondary" className="px-3" onClick={() => setShowSettings(true)}><FiSettings size={20} /></Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 max-w-2xl mb-6 leading-relaxed">
                    {user?.bio || 'No bio yet. Click edit to add one!'}
                  </p>
                  
                  <div className="flex items-center justify-center md:justify-start gap-8">
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</span>
                      <span className="text-sm text-gray-500">Posts</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-gray-900 dark:text-white">{user?.followersCount || 0}</span>
                      <span className="text-sm text-gray-500">Followers</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-gray-900 dark:text-white">{user?.followingCount || 0}</span>
                      <span className="text-sm text-gray-500">Following</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 justify-center gap-8 md:gap-16">
          <button
            className={`flex items-center gap-2 pb-4 text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'posts' 
                ? 'border-primary text-gray-900 dark:text-white' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            <FiGrid size={18} /> Posts
          </button>
          <button
            className={`flex items-center gap-2 pb-4 text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'saved' 
                ? 'border-primary text-gray-900 dark:text-white' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('saved')}
          >
            <FiBookmark size={18} /> Saved
          </button>
        </div>

        {/* Grid */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'posts' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
              {posts.map((post) => (
                <div key={post._id} className="aspect-square relative group cursor-pointer bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-lg">
                  <img src={post.images?.[0] || post.image} alt="Post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                    <span className="text-white font-bold flex items-center gap-2"><FiHeart size={20} className="fill-current" /> {post.likesCount || post.likes || 0}</span>
                    <span className="text-white font-bold flex items-center gap-2"><FiMessageCircle size={20} className="fill-current" /> {post.commentsCount || post.comments || 0}</span>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500">No posts yet.</div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedItems.map((item, idx) => (
                <RecipeCard key={item._id || item.id} recipe={item} index={idx} />
              ))}
              {savedItems.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500">No saved items found.</div>
              )}
            </div>
          )}
        </motion.div>
        
        {((activeTab === 'my-recipes' && myRecipes.length === 0) || 
           (activeTab === 'saved' && savedRecipesList.length === 0)) && (
          <div className="py-20 text-center text-gray-500 dark:text-gray-400">
            <h3 className="text-xl font-medium mb-2">Nothing here yet</h3>
            <p>Start exploring or adding new recipes to fill this space.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl shadow-xl w-full max-w-md relative"
            >
              <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                <FiX size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h4>
                    <p className="text-sm text-gray-500">Toggle dark theme appearance</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Push Notifications</h4>
                    <p className="text-sm text-gray-500">Get notified about likes & comments</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white dark:bg-gray-400 rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Weekly Newsletter</h4>
                    <p className="text-sm text-gray-500">Top recipes of the week</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Delete Account</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
