import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiHeart } from 'react-icons/fi';

export default function About() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="bg-primary/5 dark:bg-primary/10 py-20 text-center px-4 sm:px-6 lg:px-8 border-b border-primary/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Our Story</span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Bringing the world together, one recipe at a time.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            YumCircle was born from a simple idea: that everyone has a recipe worth sharing. We're building the most vibrant community of home cooks and food lovers on the internet.
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <FiUsers size={32} />,
              title: "Community First",
              desc: "We believe food is best enjoyed together. Our platform connects people across cultures through the universal language of delicious meals."
            },
            {
              icon: <FiAward size={32} />,
              title: "Quality Content",
              desc: "Every recipe is a crafted piece of art. We provide the tools to showcase your culinary creations with the premium design they deserve."
            },
            {
              icon: <FiHeart size={32} />,
              title: "Inspire Creativity",
              desc: "Whether you're a beginner or a seasoned chef, find endless inspiration to try new ingredients, techniques, and flavors in your own kitchen."
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="glass p-8 rounded-3xl text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Story Timeline */}
      <section className="py-20 bg-gray-50 dark:bg-dark-surface/50 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Journey</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              How YumCircle grew from a kitchen experiment to a global food community.
            </p>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 dark:before:via-gray-700 before:to-transparent">
            {[
              { year: '2023', title: 'The Idea Incubates', desc: 'Started as a tiny blog sharing family recipes.' },
              { year: '2024', title: 'Community Launches', desc: 'Opened the platform to the public. Reached 10,000 cooks in 3 months.' },
              { year: '2025', title: 'Mobile App Debut', desc: 'Brought YumCircle to iOS and Android, revolutionizing kitchen cooking.' },
              { year: '2026', title: 'Global Expansion', desc: 'Supporting 15 languages and connecting millions of foodies worldwide.' },
            ].map((milestone, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-dark-background bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] glass p-6 rounded-3xl group-hover:-translate-y-1 transition-transform border border-transparent hover:border-primary/20">
                  <span className="text-primary font-bold text-lg mb-1 block">{milestone.year}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
