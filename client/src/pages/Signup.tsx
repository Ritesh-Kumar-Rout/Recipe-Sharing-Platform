import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { Button } from '../components/ui/Button';

import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Signup() {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=2000" 
          alt="Delicious food background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10 px-4"
      >
        <div className="glass-card p-8 sm:p-10 border border-white/20 bg-white/10 dark:bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-300 text-sm">
              Join the ultimate community of food lovers.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/70">
                  <FiUser />
                </div>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required 
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-white/50 transition-all"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/70">
                  <FiMail />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required 
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-white/50 transition-all"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/70">
                  <FiLock />
                </div>
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-white/50 transition-all"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-lg mt-6 shadow-[0_0_20px_rgba(255,69,0,0.4)] hover:shadow-[0_0_30px_rgba(255,69,0,0.6)]" rightIcon={<FiArrowRight />}>
              Sign Up
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-300">
              Already have an account?
              <Link to="/login" className="ml-2 font-semibold text-primary hover:text-white transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
