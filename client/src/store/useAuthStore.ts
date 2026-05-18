import { create } from 'zustand';

interface User {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  savedRecipes: string[];
  likedRecipes: string[];
  notifications: any[];
  unreadNotifications: number;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setSavedRecipes: (ids: string[]) => void;
  toggleSaveRecipe: (id: string) => void;
  toggleLikeRecipe: (id: string) => void;
  addNotification: (notification: any) => void;
  clearNotifications: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isAuthModalOpen: false, 
  savedRecipes: JSON.parse(localStorage.getItem('savedRecipes') || '[]'),
  likedRecipes: JSON.parse(localStorage.getItem('likedRecipes') || '[]'),
  notifications: [],
  unreadNotifications: 0,

  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isAuthModalOpen: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    set({ user: null, token: null, isAuthenticated: false, isAuthModalOpen: true });
  },

  updateUser: (updatedData) => {
    set((state) => {
      const newUser = state.user ? { ...state.user, ...updatedData } : null;
      if (newUser) localStorage.setItem('user', JSON.stringify(newUser));
      return { user: newUser };
    });
  },

  setSavedRecipes: (ids) => {
    localStorage.setItem('savedRecipes', JSON.stringify(ids));
    set({ savedRecipes: ids });
  },

  toggleSaveRecipe: (id) => {
    set((state) => {
      const isSaved = state.savedRecipes.includes(id);
      const next = isSaved ? state.savedRecipes.filter(r => r !== id) : [...state.savedRecipes, id];
      localStorage.setItem('savedRecipes', JSON.stringify(next));
      return { savedRecipes: next };
    });
  },

  toggleLikeRecipe: (id) => {
    set((state) => {
      const isLiked = state.likedRecipes.includes(id);
      const next = isLiked ? state.likedRecipes.filter(r => r !== id) : [...state.likedRecipes, id];
      localStorage.setItem('likedRecipes', JSON.stringify(next));
      return { likedRecipes: next };
    });
  },

  addNotification: (notification) => {
    set((state) => ({ 
      notifications: [notification, ...state.notifications],
      unreadNotifications: state.unreadNotifications + 1
    }));
  },

  clearNotifications: () => set({ unreadNotifications: 0 }),

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
