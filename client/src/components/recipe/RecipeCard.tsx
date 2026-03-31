import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiClock } from 'react-icons/fi';
import type { Recipe } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

export function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const { likedRecipes, toggleLikeRecipe, isLoggedIn } = useAppContext();
  const isLiked = likedRecipes.includes(recipe.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card overflow-hidden flex flex-col h-full group"
    >
      <Link to={`/recipe/${recipe.id}`} className="relative h-56 overflow-hidden block">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-semibold bg-white/90 dark:bg-dark-surface/90 text-primary rounded-full backdrop-blur-sm shadow-sm">
            {recipe.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Link>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/recipe/${recipe.id}`} className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
              {recipe.title}
            </h3>
          </Link>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.preventDefault();
              if (!isLoggedIn) {
                alert("Please log in to like a recipe!");
                return;
              }
              toggleLikeRecipe(recipe.id);
            }}
            className="ml-3 p-2 rounded-full bg-gray-50 dark:bg-dark-background hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
          >
            <FiHeart size={20} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
          </motion.button>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 mt-1">
          {recipe.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={recipe.author.avatar} 
              alt={recipe.author.name} 
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {recipe.author.name}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <FiClock size={16} />
              <span>{recipe.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiMessageCircle size={16} />
              <span>{recipe.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
