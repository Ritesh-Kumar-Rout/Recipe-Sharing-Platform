import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';

// Lazy loading pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Feed = lazy(() => import('./pages/Feed'));
const RecipeDetails = lazy(() => import('./pages/RecipeDetails'));
const AddRecipe = lazy(() => import('./pages/AddRecipe'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const About = lazy(() => import('./pages/About'));

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="pt-20 min-h-screen" // Add padding top to account for fixed navbar
  >
    {children}
  </motion.div>
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen pt-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-background dark:bg-dark-background text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Navbar />
          
          <main className="flex-1">
            <Suspense fallback={<LoadingFallback />}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                  <Route path="/feed" element={<PageWrapper><Feed /></PageWrapper>} />
                  <Route path="/recipe/:id" element={<PageWrapper><RecipeDetails /></PageWrapper>} />
                  <Route path="/add-recipe" element={<PageWrapper><AddRecipe /></PageWrapper>} />
                  <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
                  <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                  <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
                  <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </main>

          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
