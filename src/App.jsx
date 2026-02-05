import { useState } from 'react';
import GiftBox from './components/GiftBox';
import BirthdayCard from './components/BirthdayCard';
import BackgroundMusic from './components/BackgroundMusic';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-50">
      {/* Background Music - Plays immediately (with click handler fallback) */}
      <BackgroundMusic isPlaying={true} />

      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="gift-box"
            exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="z-10"
          >
            <GiftBox onOpen={() => setIsOpened(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="birthday-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full z-10"
          >
            <BirthdayCard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
