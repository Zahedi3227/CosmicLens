import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen px-3 py-4 md:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <main>
          {children}
        </main>
      </motion.div>
    </div>
  );
};

export default Layout; 