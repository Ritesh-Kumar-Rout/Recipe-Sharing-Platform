import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RecipeCard } from '../components/recipe/RecipeCard';
import { CATEGORIES } from '../data/mockData';
import { RecipeCardSkeleton } from '../components/ui/Skeleton';
import api from '../api/axios';
import { SEO } from '../components/seo/SEO';

export default function Explore() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlCategory = searchParams.get('category');

  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>(urlCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const endpoint = sortBy === 'popular' ? '/recipes/popular' : '/recipes/latest';
        const res = await api.get(endpoint);
        if (res.data.success) {
          setRecipes(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch recipes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, [sortBy]);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (recipe.ingredients && recipe.ingredients.some((i: string) => i.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = activeCategory === 'All' ? true : (recipe.categories && recipe.categories.includes(activeCategory));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
      <SEO 
        title="Explore Recipes" 
        description="Discover thousands of trending and latest recipes from the YumCircle community. Filter by category, ingredients, and more."
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Explore <span className="text-primary">Recipes</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Find the perfect recipe for your next meal.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Input 
            placeholder="Search recipes..." 
            leftIcon={<FiSearch />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 shadow-md border-transparent"
          />
          <div className="flex bg-gray-100 dark:bg-dark-surface p-1 rounded-xl shadow-inner whitespace-nowrap hidden sm:flex">
            <button 
              onClick={() => setSortBy('latest')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'latest' ? 'bg-white dark:bg-dark-background shadow-md text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Latest
            </button>
            <button 
              onClick={() => setSortBy('popular')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'popular' ? 'bg-white dark:bg-dark-background shadow-md text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Popular
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <Button 
          variant={activeCategory === 'All' ? 'primary' : 'secondary'} 
          size="sm" 
          onClick={() => setActiveCategory('All')}
          className="rounded-full shadow-sm whitespace-nowrap"
        >
          All Recipes
        </Button>
        {CATEGORIES.map(cat => (
          <Button 
            key={cat.id}
            variant={activeCategory === cat.name ? 'primary' : 'secondary'} 
            size="sm" 
            onClick={() => setActiveCategory(cat.name)}
            className="rounded-full shadow-sm whitespace-nowrap"
          >
            <span className="mr-2">{cat.icon}</span> {cat.name}
          </Button>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((i) => <RecipeCardSkeleton key={i} />)
          ) : filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe, idx) => (
              <RecipeCard key={recipe._id || recipe.id} recipe={recipe} index={idx} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400"
            >
              <h3 className="text-2xl font-bold mb-2">No recipes found</h3>
              <p>Try adjusting your search or category filter.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
