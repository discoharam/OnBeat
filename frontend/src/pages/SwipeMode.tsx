import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Zap, ArrowUp, Music } from 'lucide-react';
import { useStudioStore } from '../store/studioStore';

// Mock Data
const BEATS = [
  { id: 1, title: "Midnight Tokyo", artist: "Lofi Gods", color: "bg-purple-600" },
  { id: 2, title: "Drill Season", artist: "Metro 808", color: "bg-red-600" },
  { id: 3, title: "Golden Hour", artist: "Sunset Vibes", color: "bg-orange-500" },
  { id: 4, title: "Deep Ocean", artist: "Ambient Flow", color: "bg-blue-700" },
];

const Card = ({ beat, onSwipe }: { beat: any, onSwipe: (dir: 'left' | 'right' | 'up') => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  // Background Color shifts based on swipe
  const bg = useTransform(x, [-200, 0, 200], ["#ef4444", "#18181b", "#22c55e"]);

  return (
    <motion.div
      style={{ x, y, rotate, opacity }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={(e, { offset, velocity }) => {
        const swipeThreshold = 100;
        if (offset.x > swipeThreshold) onSwipe('right');
        else if (offset.x < -swipeThreshold) onSwipe('left');
        else if (offset.y < -swipeThreshold) onSwipe('up');
      }}
      className="absolute w-80 h-[450px] rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
    >
      {/* Card Content */}
      <div className={`h-full w-full ${beat.color} p-8 flex flex-col justify-between relative`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        
        {/* Top Icons (Visual Feedback) */}
        <div className="relative z-10 flex justify-between text-white font-bold text-lg opacity-80">
           <span>PASS</span>
           <span>SAVE</span>
        </div>

        {/* Beat Info */}
        <div className="relative z-10 text-center space-y-2">
           <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md mb-4 shadow-lg">
             <Music size={40} className="text-white" />
           </div>
           <h2 className="text-3xl font-extrabold text-white">{beat.title}</h2>
           <p className="text-lg text-zinc-300">{beat.artist}</p>
        </div>

        {/* Hint */}
        <div className="relative z-10 flex flex-col items-center text-zinc-400 text-xs font-bold gap-1 mt-4">
           <ArrowUp size={16} className="animate-bounce" />
           <span>SWIPE UP TO USE</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function SwipeMode() {
  const { setView, setActiveTrack } = useStudioStore();
  const [index, setIndex] = useState(0);
  const currentBeat = BEATS[index];

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (direction === 'up') {
       // Load into Studio immediately
       setActiveTrack({ title: currentBeat.title, duration: '3:00' });
       setView('studio');
    } else {
       // Next Card
       setTimeout(() => setIndex(i => i + 1), 200);
    }
  };

  if (!currentBeat) return (
    <div className="flex-1 h-full bg-zinc-950 flex flex-col items-center justify-center text-center p-8">
       <h2 className="text-2xl font-bold text-white mb-2">You've seen it all!</h2>
       <button onClick={() => setIndex(0)} className="px-6 py-3 bg-white text-black font-bold rounded-xl">Start Over</button>
    </div>
  );

  return (
    <div className="flex-1 h-full bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-zinc-950 pointer-events-none" />
      
      <div className="relative w-80 h-[450px] z-10">
        <AnimatePresence>
           <Card key={currentBeat.id} beat={currentBeat} onSwipe={handleSwipe} />
        </AnimatePresence>
      </div>

      {/* Controls Footer */}
      <div className="mt-12 flex gap-8 z-10">
        <button onClick={() => handleSwipe('left')} className="p-4 bg-zinc-900 rounded-full text-red-500 hover:bg-zinc-800 border border-zinc-800 transition-transform hover:scale-110">
          <X size={24} />
        </button>
        <button onClick={() => handleSwipe('up')} className="p-4 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition-transform hover:scale-110 shadow-lg shadow-indigo-500/30">
          <Zap size={24} fill="currentColor" />
        </button>
        <button onClick={() => handleSwipe('right')} className="p-4 bg-zinc-900 rounded-full text-green-500 hover:bg-zinc-800 border border-zinc-800 transition-transform hover:scale-110">
          <Heart size={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
