import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link to={`/feed?category=${category.name}`} className={`relative h-full overflow-hidden rounded-3xl p-6 cursor-pointer group flex flex-col items-center justify-center min-h-[160px] ${category.color} bg-opacity-20 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-all block`}>
        <div className="absolute inset-0 bg-white/40 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">{category.icon}</span>
        <h3 className="font-bold text-lg relative z-10">{category.name}</h3>
      </Link>
    </motion.div>
  );
}
