import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

const GiftBox = ({ onOpen }) => {
    const handleClick = () => {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#FFC0CB', '#FFB6C1', '#FF69B4', '#FFFACD'] // Pink and pastel colors
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#FFC0CB', '#FFB6C1', '#FF69B4', '#FFFACD']
            });
        }, 250);

        onOpen();
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen cursor-pointer" onClick={handleClick}>
            <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 5, 0] }}
                whileTap={{ scale: 0.9 }}
                animate={{ y: [0, -15, 0] }}
                transition={{
                    y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative"
            >
                <div className="w-52 h-52 md:w-64 md:h-64 bg-pink-400 rounded-3xl shadow-[0_20px_50px_rgba(255,105,180,0.3)] flex items-center justify-center relative z-10 border-4 border-white/50">
                    {/* Ribbon - Vertical */}
                    <div className="absolute w-12 md:w-16 h-full bg-white/30 backdrop-blur-sm border-x border-white/50"></div>
                    {/* Ribbon - Horizontal */}
                    <div className="absolute w-full h-12 md:h-16 bg-white/30 backdrop-blur-sm border-y border-white/50"></div>

                    <Gift size={90} className="text-white z-20 drop-shadow-lg md:w-28 md:h-28" />
                </div>

                <motion.div
                    className="absolute -top-16 left-1/2 -translate-x-1/2 text-center w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                >
                    <div className="bg-white/90 px-6 py-3 rounded-full shadow-lg border-2 border-pink-200">
                        <p className="text-lg md:text-xl font-bold text-pink-500 whitespace-nowrap">Open Me! 🎁</p>
                    </div>
                    {/* Triangle for speech bubble */}
                    <div className="w-4 h-4 bg-white absolute left-1/2 -bottom-2 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-pink-200"></div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default GiftBox;
