import { motion } from 'framer-motion';

export function BrandLogo() {
  return (
    <motion.div 
      className="flex items-center gap-2.5 group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Abstract Circular Food Icon */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Animated Glow behind the logo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
        
        {/* Main Logo Container */}
        <div className="relative z-10 w-full h-full bg-white dark:bg-dark-surface rounded-full shadow-md border-2 border-transparent bg-clip-padding flex items-center justify-center overflow-hidden">
          {/* Gradient Border Trick */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-br from-primary via-secondary to-accent" style={{ padding: '2px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}></div>
          
          {/* Inner SVG Icon (Spark / Plate / Utensils abstract) */}
          <svg className="w-5 h-5 text-primary transform group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Abstract Plate/Bowl curve */}
            <path d="M4 12c0 4.418 3.582 8 8 8s8-3.582 8-8" stroke="url(#logo-gradient)" />
            {/* Abstract Food Spark / Steam */}
            <path d="M12 4c-1.5 2-1.5 4 0 6" stroke="url(#logo-gradient)" />
            <path d="M8 6c-1 1.5-1 3 0 4.5" stroke="url(#logo-gradient)" opacity="0.6" />
            <path d="M16 6c1 1.5 1 3 0 4.5" stroke="url(#logo-gradient)" opacity="0.6" />
            
            <defs>
              <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4500" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <span className="text-2xl tracking-tight leading-none flex items-center">
          <span className="font-extrabold text-gray-900 dark:text-white drop-shadow-sm">Yum</span>
          <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent drop-shadow-sm">
            Circle
          </span>
        </span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-semibold -mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Food Community
        </span>
      </div>
    </motion.div>
  );
}
