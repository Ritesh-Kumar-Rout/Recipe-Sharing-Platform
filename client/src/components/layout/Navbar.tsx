import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiLogOut } from 'react-icons/fi';
import { Button } from '../ui/Button';
import { BrandLogo } from '../ui/BrandLogo';
import { useAuthStore } from '../../store/useAuthStore';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const { user, isAuthenticated, logout, openAuthModal } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Feed', path: '/feed' },
    { name: 'About', path: '/about' },
  ];

  // Removed MOCK_RECIPES live search for now or keep empty array
  const searchResults: any[] = [];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-dark-background/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="outline-none">
            <BrandLogo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.path ? 'text-primary' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l border-gray-200 dark:border-gray-700 pl-8">
              
              {/* Live Search */}
              <div className="relative" ref={searchRef}>
                <div className={`flex items-center transition-all overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-surface focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary w-64`}>
                  <div className="pl-3 text-gray-400">
                    <FiSearch size={18} />
                  </div>
                  <input 
                    type="text"
                    placeholder="Search recipes..."
                    className="w-full bg-transparent border-none py-2 px-3 text-sm focus:outline-none dark:text-white"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearch(true);
                    }}
                    onFocus={() => setShowSearch(true)}
                  />
                </div>
                
                {/* Search Dropdown */}
                {showSearch && searchResults.length > 0 && (
                  <div className="absolute top-12 left-0 w-80 bg-white dark:bg-dark-surface rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-3 z-50 animate-fade-in overflow-hidden">
                    <h4 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Recipes & Categories</h4>
                    {searchResults.map(recipe => (
                      <Link 
                        key={recipe.id} 
                        to={`/recipe/${recipe.id}`}
                        onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-dark-background transition-colors"
                      >
                        <img src={recipe.image} alt={recipe.title} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                        <div className="flex-1 overflow-hidden">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{recipe.title}</p>
                          <p className="text-xs text-primary font-medium">{recipe.category}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {showSearch && searchQuery.length > 1 && searchResults.length === 0 && (
                  <div className="absolute top-12 left-0 w-80 bg-white dark:bg-dark-surface rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 z-50 text-center animate-fade-in">
                    <p className="text-gray-500 text-sm">No recipes found for "{searchQuery}"</p>
                  </div>
                )}
              </div>

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2">
                    <Link to="/profile">
                      <img src={user?.profileImage || 'https://res.cloudinary.com/demo/image/upload/v1566427384/sample.jpg'} alt="Profile" className="w-10 h-10 rounded-full border-2 border-primary object-cover shadow-sm hover:scale-105 transition-transform" />
                    </Link>
                    <button onClick={logout} title="Logout" className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <FiLogOut size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => openAuthModal()}>Log In</Button>
                  <Button variant="primary" size="sm" onClick={() => openAuthModal()}>Sign Up</Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button title="Search" className="text-gray-600 dark:text-gray-300">
              <FiSearch size={22} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-gray-600 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-background border-b border-gray-200 dark:border-gray-800 animate-fade-in shadow-xl absolute w-full left-0 top-20">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="w-full">
                    <Button variant="outline" className="w-full">Profile</Button>
                  </Link>
                  <Button variant="ghost" className="w-full text-red-500" onClick={logout}>Logout</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" onClick={() => openAuthModal()}>Log In</Button>
                  <Button variant="primary" className="w-full" onClick={() => openAuthModal()}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
