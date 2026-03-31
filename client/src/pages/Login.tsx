import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function Login() {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/profile');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-background dark:bg-dark-background">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to access your saved recipes and profile.
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            <Input 
              type="email" 
              label="Email Address" 
              placeholder="you@example.com" 
              leftIcon={<FiMail />} 
              required 
            />
            
            <div className="space-y-1">
              <Input 
                type="password" 
                label="Password" 
                placeholder="••••••••" 
                leftIcon={<FiLock />} 
                required 
              />
              <div className="flex justify-end">
                <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot password?</a>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg mt-4" rightIcon={<FiArrowRight />}>
              Sign In
            </Button>
          </motion.form>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?
              <Link to="/signup" className="ml-2 font-semibold text-primary hover:underline transition-colors focus:outline-none">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image Cover (Hidden on mobile) */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
        <img 
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200" 
          alt="Delicious food" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        
        <div className="absolute bottom-0 left-0 right-0 p-16 z-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              "Good food is very often, even most often, simple food."
            </h2>
            <p className="text-lg text-white/80 font-medium">— Anthony Bourdain</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
