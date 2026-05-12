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
      {/* Premium Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col lg:flex-row items-center justify-center overflow-hidden bg-black pt-20 lg:pt-0">
        {/* Background Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={currentSlide}
              src={heroImages[currentSlide]} 
              alt="Hero background" 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />
        </div>
        
        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-12 mt-10 lg:mt-0">
          
          {/* Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-orange-400 mb-8 text-sm font-semibold uppercase tracking-wider shadow-xl">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Premium Food Community
              </span>
            </motion.div>
            
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-6 leading-[1.1] tracking-tight"
            >
              Taste The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                Masterpiece.
              </span>
            </motion.h1>
            
            <motion.p 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0 font-light"
            >
              Connect with elite chefs, explore visually stunning recipes, and share your culinary journey with a community that appreciates taste.
            </motion.p>
            
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link to="/feed">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-xl hover:shadow-orange-500/50 hover:-translate-y-1 transition-all">
                  Explore Feed
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all">
                  Discover Recipes
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stable Floating Featured Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5, type: "spring" }}
            className="flex-1 hidden md:flex justify-center lg:justify-end relative"
          >
            {/* Glowing backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-pink-500/30 blur-3xl rounded-full transform scale-75" />
            
            <motion.img 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              src="https://png.pngtree.com/png-clipart/20231019/original/pngtree-delicious-burger-on-transparent-background-png-image_13374945.png"
              alt="Featured Premium Food"
              className="relative z-10 w-full max-w-md xl:max-w-lg drop-shadow-2xl"
            />

            {/* Glassmorphism Floating Stats Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-10 -left-10 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-2xl z-20 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl">
                🔥
              </div>
              <div>
                <p className="text-white font-bold">Trending Now</p>
                <p className="text-gray-300 text-sm">Spicy Double Burger</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent z-10" />
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
