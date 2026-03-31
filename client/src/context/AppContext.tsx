import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_RECIPES } from '../data/mockData';

interface AppContextType {
  isLoggedIn: boolean;
  userProfile: { name: string; avatar: string; bio: string } | null;
  savedRecipes: string[]; 
  likedRecipes: string[];
  login: () => void;
  logout: () => void;
  updateProfile: (profile: any) => void;
  toggleSaveRecipe: (id: string) => void;
  toggleLikeRecipe: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; avatar: string; bio: string } | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([MOCK_RECIPES[0].id, MOCK_RECIPES[1].id]);
  const [likedRecipes, setLikedRecipes] = useState<string[]>([MOCK_RECIPES[2].id]);

  useEffect(() => {
    const saved = localStorage.getItem('yumcore_saved');
    if (saved) setSavedRecipes(JSON.parse(saved));
    const liked = localStorage.getItem('yumcore_liked');
    if (liked) setLikedRecipes(JSON.parse(liked));
    const auth = localStorage.getItem('yumcore_auth');
    if (auth === 'true') {
      setIsLoggedIn(true);
      setUserProfile({
        name: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
        bio: 'Culinary enthusiast and amateur food photographer. I love experimenting with plant-based recipes and discovering new fusion cuisines. Always looking for the perfect sourdough crust! 🍞✨'
      });
    }
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    setUserProfile({
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
      bio: 'Culinary enthusiast and amateur food photographer. I love experimenting with plant-based recipes!'
    });
    localStorage.setItem('yumcore_auth', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    localStorage.removeItem('yumcore_auth');
  };

  const updateProfile = (profile: any) => {
    setUserProfile(profile);
  };

  const toggleSaveRecipe = (id: string) => {
    setSavedRecipes(prev => {
      const next = prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id];
      localStorage.setItem('yumcore_saved', JSON.stringify(next));
      return next;
    });
  };

  const toggleLikeRecipe = (id: string) => {
    setLikedRecipes(prev => {
      const next = prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id];
      localStorage.setItem('yumcore_liked', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppContext.Provider value={{ isLoggedIn, userProfile, savedRecipes, likedRecipes, login, logout, updateProfile, toggleSaveRecipe, toggleLikeRecipe }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
