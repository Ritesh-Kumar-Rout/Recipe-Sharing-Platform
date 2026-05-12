import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { IoClose } from 'react-icons/io5';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../api/axios';
import toast from 'react-hot-toast';

type ViewMode = 'login' | 'signup' | 'forgot-password' | 'verify-otp' | 'reset-password';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, isAuthenticated } = useAuthStore();
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [formData, setFormData] = useState({ username: '', email: '', password: '', otp: '', newPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      // Reset view when opening
      setViewMode('login');
      setFormData({ username: '', email: '', password: '', otp: '', newPassword: '' });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isAuthModalOpen]);

  if (isAuthenticated && !isAuthModalOpen) return null;

  const handleClose = () => closeAuthModal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = viewMode === 'login' ? '/auth/login' : '/auth/signup';
      const payload = viewMode === 'login' 
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };
        
      const response = await api.post(endpoint, payload);
      
      if (response.data.success) {
        if (viewMode === 'login') {
          toast.success('Logged in successfully!');
          login(response.data.user, response.data.token);
        } else {
          toast.success('Account created successfully! Please log in.');
          setViewMode('login');
          setFormData({ username: '', email: '', password: '', otp: '', newPassword: '' });
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: formData.email });
      if (res.data.success) {
        toast.success('OTP sent to your email!');
        setViewMode('verify-otp');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email: formData.email, otp: formData.otp });
      if (res.data.success) {
        toast.success('OTP verified!');
        setViewMode('reset-password');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { email: formData.email, otp: formData.otp, newPassword: formData.newPassword });
      if (res.data.success) {
        toast.success('Password reset successfully! Please log in.');
        setViewMode('login');
        setFormData({ username: '', email: '', password: '', otp: '', newPassword: '' });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const response = await api.post('/auth/google', {
        email: user.email,
        username: user.displayName?.replace(/\s+/g, '').toLowerCase() || `user${user.uid.slice(0, 5)}`,
        profileImage: user.photoURL,
        uid: user.uid
      });
      if (response.data.success) {
        toast.success('Logged in with Google!');
        login(response.data.user, response.data.token);
      }
    } catch (error: any) {
      toast.error('Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    if (viewMode === 'login' || viewMode === 'signup') {
      return (
        <form onSubmit={handleAuth} className="space-y-4">
          {viewMode === 'signup' && (
            <input 
              type="text" name="username" placeholder="Username" 
              value={formData.username} onChange={handleInputChange} required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          )}
          <input 
            type="email" name="email" placeholder="Email address" 
            value={formData.email} onChange={handleInputChange} required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input 
            type="password" name="password" placeholder="Password" 
            value={formData.password} onChange={handleInputChange} required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          
          {viewMode === 'login' && (
            <div className="flex justify-end">
              <button type="button" onClick={() => setViewMode('forgot-password')} className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                Forgot Password?
              </button>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-70">
            {isLoading ? 'Processing...' : (viewMode === 'login' ? 'Log In' : 'Sign Up')}
          </button>
        </form>
      );
    }

    if (viewMode === 'forgot-password') {
      return (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-white/60 text-sm mb-4 text-center">Enter your email address to receive a 6-digit OTP.</p>
          <input 
            type="email" name="email" placeholder="Email address" 
            value={formData.email} onChange={handleInputChange} required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl disabled:opacity-70">
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
          <button type="button" onClick={() => setViewMode('login')} className="w-full text-sm text-gray-400 hover:text-white mt-2">Back to Login</button>
        </form>
      );
    }

    if (viewMode === 'verify-otp') {
      return (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <p className="text-white/60 text-sm mb-4 text-center">Enter the 6-digit OTP sent to {formData.email}</p>
          <input 
            type="text" name="otp" placeholder="6-digit OTP" 
            value={formData.otp} onChange={handleInputChange} required maxLength={6}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 tracking-widest text-center text-xl font-bold"
          />
          <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl disabled:opacity-70">
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button type="button" onClick={() => setViewMode('login')} className="w-full text-sm text-gray-400 hover:text-white mt-2">Cancel</button>
        </form>
      );
    }

    if (viewMode === 'reset-password') {
      return (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-white/60 text-sm mb-4 text-center">Enter your new secure password.</p>
          <input 
            type="password" name="newPassword" placeholder="New Password" 
            value={formData.newPassword} onChange={handleInputChange} required minLength={6}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl disabled:opacity-70">
            {isLoading ? 'Resetting...' : 'Update Password'}
          </button>
        </form>
      );
    }
  };

  const getTitle = () => {
    switch(viewMode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Join YumCircle';
      case 'forgot-password': return 'Reset Password';
      case 'verify-otp': return 'Verify Email';
      case 'reset-password': return 'New Password';
      default: return 'Authenticate';
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="relative w-full max-w-md p-8 overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
              <IoClose size={24} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">{getTitle()}</h2>
            </div>

            {renderForm()}

            {(viewMode === 'login' || viewMode === 'signup') && (
              <>
                <div className="mt-6 flex items-center justify-center space-x-4">
                  <div className="h-px bg-white/20 flex-1"></div>
                  <span className="text-white/50 text-sm">OR</span>
                  <div className="h-px bg-white/20 flex-1"></div>
                </div>
                <button 
                  onClick={handleGoogleAuth} disabled={isLoading}
                  className="mt-6 w-full flex items-center justify-center gap-3 py-3.5 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-md disabled:opacity-70"
                >
                  <FcGoogle size={24} /> Continue with Google
                </button>
                <div className="mt-8 text-center text-white/60">
                  {viewMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    onClick={() => setViewMode(viewMode === 'login' ? 'signup' : 'login')}
                    className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                  >
                    {viewMode === 'login' ? 'Sign up' : 'Log in'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
