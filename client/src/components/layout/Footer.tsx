import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiHeart } from 'react-icons/fi';
import { LegalModal } from '../ui/LegalModal';

export function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const openModal = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    setModalTitle(title);
    setModalOpen(true);
  };

  return (
    <footer className="bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                YumCircle
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
              Discover, organize, and share your favorite recipes within our community of food lovers. Your next great meal starts here.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-background flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-background flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-background flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-background flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Explore</h3>
            <ul className="space-y-3">
              <li><Link to="/feed" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">All Recipes</Link></li>
              <li><Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Categories</Link></li>
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Submit Recipe</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" onClick={(e) => openModal(e, 'Terms of Service')} className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer">Terms of Service</a></li>
              <li><a href="#" onClick={(e) => openModal(e, 'Privacy Policy')} className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer">Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => openModal(e, 'Cookie Policy')} className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer">Cookie Policy</a></li>
              <li><a href="#" onClick={(e) => openModal(e, 'Contact Us')} className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            © {new Date().getFullYear()} YumCircle. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500">
            Made with <FiHeart className="text-red-500" /> by Antigravity
          </p>
        </div>
      </div>
      <LegalModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} />
    </footer>
  );
}
