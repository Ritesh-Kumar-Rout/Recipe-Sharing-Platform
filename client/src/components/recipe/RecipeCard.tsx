import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiClock, FiBookmark } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';

interface RecipeCardProps {
  recipe: any;
  index?: number;
}

export function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const { likedRecipes, toggleLikeRecipe, savedRecipes, toggleSaveRecipe, isAuthenticated, openAuthModal } = useAuthStore();
  
  const id = recipe._id || recipe.id;
  const isLiked = likedRecipes.includes(id);
  const isSaved = savedRecipes.includes(id);
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return openAuthModal();
    toggleLikeRecipe(id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return openAuthModal();
    toggleSaveRecipe(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card overflow-hidden flex flex-col h-full group"
    >
      <Link to={`/recipe/${id}`} className="relative h-56 overflow-hidden block">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-semibold bg-white/90 dark:bg-dark-surface/90 text-primary rounded-full backdrop-blur-sm shadow-sm">
            {recipe.categories?.[0] || recipe.category}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleSave}
            className={`p-2 rounded-full backdrop-blur-md shadow-lg transition-all ${isSaved ? 'bg-primary text-white' : 'bg-white/90 dark:bg-dark-surface/90 text-gray-600 hover:text-primary'}`}
          >
            <FiBookmark size={18} className={isSaved ? 'fill-current' : ''} />
          </button>
        </div>
      </Link>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/recipe/${id}`} className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
              {recipe.title}
            </h3>
          </Link>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleLike}
            className="ml-3 p-2 rounded-full bg-gray-50 dark:bg-dark-background hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
          >
            <FiHeart size={20} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
          </motion.button>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 mt-1">
          {recipe.description || 'A delicious recipe shared with our community.'}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={recipe.admin?.profileImage || "https://res.cloudinary.com/demo/image/upload/v1566427384/sample.jpg"} 
              alt={recipe.admin?.username} 
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {recipe.admin?.username || 'Admin'}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <FiClock size={16} />
              <span>{recipe.cookTime || recipe.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiMessageCircle size={16} />
              <span>{recipe.commentsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
