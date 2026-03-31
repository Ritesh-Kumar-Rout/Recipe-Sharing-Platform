import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { RecipeCard } from '../components/recipe/RecipeCard';
import { CategoryCard } from '../components/recipe/CategoryCard';
import { MOCK_RECIPES, CATEGORIES } from '../data/mockData';

export default function Home() {
  const featuredRecipes = MOCK_RECIPES.slice(0, 3);
  const heroImages = [
    "https://images.unsplash.com/photo-1495195134817-a1a18cd2aead?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1546069901-ba959aab5db4?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=2000"
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={currentSlide}
              src={heroImages[currentSlide]} 
              alt="Hero background with diverse food" 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-[2px] pointer-events-none" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white backdrop-blur-md mb-6 text-sm font-semibold tracking-wider font-mono uppercase border border-white/30">
              Join the Culinary Community
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Discover & Share <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-orange-400 to-primary bg-clip-text text-transparent">Amazing Recipes</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
              Explore thousands of curated recipes, share your own culinary creations, and connect with food lovers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/feed">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                  Explore Recipes
                </Button>
              </Link>
              <Link to="/add-recipe">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-white/10 hover:bg-white/20 border-white/30 text-white dark:bg-white/10 dark:text-white dark:border-white/30">
                  Add Recipe
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom fade for smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background dark:from-dark-background to-transparent z-10" />
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background dark:bg-dark-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Browse Categories
            </motion.h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find exactly what you're craving with our organized collections of delicious meals.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((category, idx) => (
              <CategoryCard key={category.id} category={category} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Featured Recipes
              </motion.h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                Hand-picked community favorites that you'll definitely want to try.
              </p>
            </div>
            <Link to="/feed" className="text-primary font-semibold hover:underline mt-4 md:mt-0 flex items-center gap-1 group">
              View all
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe, idx) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={idx} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Stay Updated</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Delicious recipes, delivered to your inbox
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
            Join 50,000+ subscribers and get a fresh new recipe every Friday morning.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={e => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-6 py-4 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface focus:ring-2 focus:ring-primary/50 outline-none shadow-sm"
            />
            <Button size="lg" className="h-14 px-8 rounded-xl shadow-lg">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
