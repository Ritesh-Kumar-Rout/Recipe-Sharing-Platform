import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import AuthModal from './components/auth/AuthModal';
import { Toaster } from 'react-hot-toast';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const Feed = lazy(() => import('./pages/Feed'));
const Explore = lazy(() => import('./pages/Explore'));
const RecipeDetails = lazy(() => import('./pages/RecipeDetails'));
const AddRecipe = lazy(() => import('./pages/AddRecipe'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';
import { FloatingPostButton } from './components/ui/FloatingPostButton';
import { useAuthStore } from './store/useAuthStore';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="pt-20 min-h-screen" 
  >
    {children}
  </motion.div>
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen pt-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

const MainApp = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Toaster position="top-center" />
      
      {!isAdminRoute && <AuthModal />}
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && isAuthenticated && <FloatingPostButton />}
      
      <main className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/recipe/:id" element={<PageWrapper><RecipeDetails /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              
              {/* Protected User Routes */}
              <Route path="/feed" element={<ProtectedRoute><PageWrapper><Feed /></PageWrapper></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><PageWrapper><Explore /></PageWrapper></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/add-recipe" element={<AdminProtectedRoute><PageWrapper><AddRecipe /></PageWrapper></AdminProtectedRoute>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <MainApp />
      </Router>
    </AppProvider>
  );
}

export default App;
