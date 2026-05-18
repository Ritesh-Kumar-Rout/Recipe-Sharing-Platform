import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiHeart, FiShare2, FiMessageCircle, FiBookmark, FiChevronLeft } from 'react-icons/fi';
import { LuChefHat } from 'react-icons/lu';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/useAuthStore';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { SEO } from '../components/seo/SEO';

export default function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { isAuthenticated, likedRecipes, savedRecipes, toggleLikeRecipe, toggleSaveRecipe, openAuthModal } = useAuthStore();
  
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/recipes/${id}`);
        if (res.data.success) {
          setRecipe(res.data.data);
        }
      } catch (error) {
        toast.error("Recipe not found");
        navigate('/explore');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-2xl animate-pulse">Loading Recipe...</div>;
  if (!recipe) return null;

  const isLiked = likedRecipes.includes(recipe._id);
  const isSaved = savedRecipes.includes(recipe._id);

  const handleLike = () => {
    if (!isAuthenticated) return openAuthModal();
    toggleLikeRecipe(recipe._id);
  };

  const handleSave = () => {
    if (!isAuthenticated) return openAuthModal();
    toggleSaveRecipe(recipe._id);
  };

  return (
    <div className="pb-20">
      <SEO 
        title={recipe.title} 
        description={recipe.description || `Learn how to make ${recipe.title} on YumCircle.`}
        image={recipe.image}
      />
      {/* Recipe Banner */}
      <div className="relative h-[60vh] w-full bg-gray-200 dark:bg-gray-800">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-dark-background via-black/30 to-black/10" />
        
        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-black/40"
            leftIcon={<FiChevronLeft />}
          >
            Back
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-white backdrop-blur-md mb-4 text-sm font-semibold uppercase tracking-wider border border-white/20">
              {recipe.categories?.[0] || recipe.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {recipe.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-3">
                <img src={recipe.admin?.profileImage || "https://res.cloudinary.com/demo/image/upload/v1566427384/sample.jpg"} alt={recipe.admin?.username} className="w-10 h-10 rounded-full border-2 border-white/50 object-cover" />
                <span className="font-medium text-lg">{recipe.admin?.username || 'Admin'}</span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-white/30" />
              <div className="flex items-center gap-2 text-lg">
                <FiClock /> <span>{recipe.cookTime || recipe.time}</span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-white/30" />
              <div className="flex items-center gap-2 text-lg">
                <LuChefHat /> <span>{recipe.difficulty || 'Medium'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-gray-200 dark:border-gray-800 mb-12">
          <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2"><FiHeart className={isLiked ? "fill-red-500 text-red-500" : ""} size={20} /> {(recipe.likesCount || 0) + (isLiked ? 1 : 0)} Likes</span>
            <span className="flex items-center gap-2"><FiMessageCircle size={20} /> {recipe.commentsCount || 0} Comments</span>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={handleLike} 
              leftIcon={<FiHeart className={isLiked ? "fill-red-500 text-red-500" : ""} />}
            >
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleSave} 
              leftIcon={<FiBookmark className={isSaved ? "fill-primary text-primary" : ""} />}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="secondary" leftIcon={<FiShare2 />}>
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ingredients</h2>
              <ul className="space-y-4">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Instructions</h2>
            <div className="space-y-10">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                      {idx + 1}
                    </div>
                    {idx !== recipe.steps.length - 1 && (
                      <div className="w-px h-full bg-gray-200 dark:bg-gray-800 mt-4 mb-2"></div>
                    )}
                  </div>
                  <div className="pt-2 pb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Step {idx + 1}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comments Section */}
            <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Comments ({recipe.comments})</h2>
              
              <div className="flex gap-4 mb-10">
                <img src="https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff" alt="You" className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <Input placeholder="Add a comment..." className="mb-3" />
                  <div className="flex justify-end">
                    <Button>Post Comment</Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                {/* Mock Comment */}
                <div className="flex gap-4">
                  <img src="https://ui-avatars.com/api/?name=Alex+P&background=random" alt="Alex" className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">Alex P.</h4>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">Made this last night and it was absolutely delicious! I added a bit more garlic than suggested and it turned out great. Highly recommend.</p>
                    <button className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
