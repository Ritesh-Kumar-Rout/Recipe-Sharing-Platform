import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiEdit2, FiGrid, FiBookmark, FiX, FiCheck, FiHeart, FiMessageCircle } from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RecipeCard } from '../components/recipe/RecipeCard';
import { MOCK_RECIPES } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

export default function Profile() {
  const { userProfile, savedRecipes: savedIds, updateProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState<'posts' | 'my-recipes' | 'saved'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [editForm, setEditForm] = useState({ name: userProfile?.name || '', bio: userProfile?.bio || '' });

  const myRecipes = MOCK_RECIPES.slice(0, 2);
  const savedRecipesList = MOCK_RECIPES.filter(r => savedIds.includes(r.id));

  const handleSaveProfile = () => {
    if (userProfile) {
      updateProfile({ ...userProfile, name: editForm.name, bio: editForm.bio });
    }
    setIsEditing(false);
  };


  return (
    <div className="pb-20">
      {/* Profile Header */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group shrink-0">
              <img 
                src={userProfile?.avatar || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400"} 
                alt="Profile" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white dark:border-dark-background shadow-lg"
              />
              <button className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <FiEdit2 size={16} />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left w-full">
              {isEditing ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mb-6 relative">
                  <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="max-w-md font-bold text-lg" placeholder="Name" />
                  <textarea 
                    value={editForm.bio} 
                    onChange={e => setEditForm({...editForm, bio: e.target.value})} 
                    className="w-full max-w-2xl bg-gray-50 dark:bg-dark-background border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all resize-none h-24"
                    placeholder="Bio"
                  />
                  <div className="flex justify-center md:justify-start gap-3 mt-4">
                    <Button variant="primary" size="sm" onClick={handleSaveProfile} leftIcon={<FiCheck />}>Save</Button>
                    <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setEditForm({ name: userProfile?.name || '', bio: userProfile?.bio || '' }); }}>Cancel</Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">{userProfile?.name || 'Guest User'}</h1>
                      <p className="text-gray-500 dark:text-gray-400">@{userProfile?.name?.toLowerCase().replace(' ', '') || 'guest'} • Joined March 2026</p>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Button variant="outline" leftIcon={<FiEdit2 />} onClick={() => setIsEditing(true)}>Edit Profile</Button>
                      <Button variant="secondary" className="px-3" onClick={() => setShowSettings(true)}><FiSettings size={20} /></Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 max-w-2xl mb-6 leading-relaxed">
                    {userProfile?.bio || 'Add a bio to tell people about yourself.'}
                  </p>
                  
                  <div className="flex items-center justify-center md:justify-start gap-8">
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-gray-900 dark:text-white">{myRecipes.length}</span>
                      <span className="text-sm text-gray-500">Recipes</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-gray-900 dark:text-white">{savedRecipesList.length}</span>
                      <span className="text-sm text-gray-500">Saved</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-gray-900 dark:text-white">156</span>
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
            onClick={() => setActiveTab('posts' as any)}
          >
            <FiGrid size={18} /> Posts
          </button>
          <button
            className={`flex items-center gap-2 pb-4 text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'my-recipes' 
                ? 'border-primary text-gray-900 dark:text-white' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('my-recipes')}
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg> Recipes
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
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="aspect-square relative group cursor-pointer bg-gray-100 dark:bg-gray-800">
                  <img src={`https://images.unsplash.com/photo-${1500000000000 + idx * 1000}?auto=format&fit=crop&q=80&w=400`} alt="Post" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                    <span className="text-white font-bold flex items-center gap-2"><FiHeart size={20} className="fill-current" /> {100 + idx * 24}</span>
                    <span className="text-white font-bold flex items-center gap-2"><FiMessageCircle size={20} className="fill-current" /> {10 + idx}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeTab === 'my-recipes' 
                ? myRecipes.map((recipe, idx) => (
                    <RecipeCard key={recipe.id} recipe={recipe} index={idx} />
                  ))
                : savedRecipesList.map((recipe, idx) => (
                    <RecipeCard key={recipe.id} recipe={recipe} index={idx} />
                  ))
              }
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
