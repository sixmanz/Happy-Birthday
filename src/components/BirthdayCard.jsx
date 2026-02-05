import { motion } from 'framer-motion';
import { Heart, Star, Sparkles, Wand2 } from 'lucide-react';

const BirthdayCard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
            className="max-w-[90%] md:max-w-lg w-full mx-auto bg-white/80 backdrop-blur-xl border-4 border-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_20px_60px_rgba(255,182,193,0.5)] p-6 md:p-8 text-center relative overflow-visible"
        >
            {/* Floating Cute Icons */}
            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -top-6 -left-4 md:-top-10 md:-left-6 text-pink-300">
                <Heart size={48} className="md:w-16 md:h-16" fill="#FFB6C1" stroke="none" />
            </motion.div>
            <motion.div animate={{ y: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -top-4 -right-4 md:-top-8 md:-right-6 text-yellow-300">
                <Star size={56} className="md:w-[72px] md:h-[72px]" fill="#FFE4B5" stroke="none" />
            </motion.div>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute bottom-5 -left-4 md:bottom-10 md:-left-12 text-purple-300">
                <Sparkles size={40} className="md:w-14 md:h-14" />
            </motion.div>

            {/* Content Container */}
            <div className="relative z-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="inline-block bg-pink-100 text-pink-500 px-4 py-1 rounded-full text-xs md:text-sm font-bold mb-4"
                >
                    ✨ Special Day ✨
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl md:text-4xl font-black text-gray-800 mb-6 tracking-wide drop-shadow-sm"
                    style={{ textShadow: "2px 2px 0px #FFF0F5" }}
                >
                    <span className="text-pink-500">Happy</span> <span className="text-purple-400">Birthday</span>
                    <br />
                    <span className="text-2xl md:text-3xl text-gray-700 mt-2 block">สุขสันต์วันเกิดนะอีฟ! 🎉</span>
                </motion.h1>

                {/* Photo Area */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-6 md:mb-8 cursor-pointer group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 to-purple-300 rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity"></div>
                    <div className="w-full h-full bg-white rounded-full border-8 border-pink-100 flex items-center justify-center overflow-hidden relative shadow-inner">
                        <span className="text-7xl md:text-8xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">🧸</span>
                    </div>

                    {/* Tiny badge */}
                    <div className="absolute bottom-2 right-4 bg-white p-2 rounded-full shadow-md">
                        <Heart size={16} className="text-red-400 md:w-5 md:h-5" fill="currentColor" />
                    </div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white/60 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 text-gray-600 space-y-2 md:space-y-3 shadow-sm border border-pink-50 text-sm md:text-lg font-medium leading-relaxed"
                >
                    <p>ปีนี้เป็นปีสุดท้ายแล้ว ขอให้การฝึกงานผ่านไปด้วยดี ✌️</p>
                    <p>เรียนจบแบบสวย ๆ งานเข้ามารัว ๆ 💼</p>
                    <p>เหนื่อยแค่ไหนก็ขอให้รู้ว่าเธอเก่งมากจริง ๆ 💖</p>
                    <p className="text-pink-500 font-bold pt-2">ขอให้ปีนี้เป็นปีที่โตขึ้น แข็งแรงขึ้น และมีความสุขกับทุกก้าวที่เดินนะ 💙</p>
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-800 text-white font-bold py-3 px-8 md:py-4 md:px-10 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(255,105,180,0.3)] transition-all flex items-center gap-2 mx-auto text-sm md:text-base"
                    onClick={() => window.location.reload()}
                >
                    <Wand2 size={18} className="md:w-5 md:h-5" />
                    Again!
                </motion.button>
            </div>
        </motion.div>
    );
};

export default BirthdayCard;
