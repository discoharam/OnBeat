import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Repeat, Shuffle, Volume2, Maximize2, Mic2, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore } from '../../store/studioStore';

export const PlaybackBar = () => {
  const { activeTrack, isPlaying, togglePlay, setActiveTrack, setView } = useStudioStore();
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.2));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!activeTrack) return null;

  const colors = ['from-pink-500 to-rose-500', 'from-indigo-500 to-blue-500', 'from-emerald-500 to-teal-500'];
  const colorClass = colors[activeTrack.title.length % colors.length];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none flex justify-center"
      >
        {/* Updated Class: border-transparent */}
        <div className="w-full max-w-5xl bg-white dark:bg-[#121214] border border-transparent rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-3 pointer-events-auto flex items-center justify-between gap-6 group">
          
          {/* 1. Track Info (Left) */}
          <div className="flex items-center gap-4 w-1/4 min-w-fit">
             <div className={`relative w-14 h-14 rounded-lg bg-gradient-to-br ${colorClass} shadow-md overflow-hidden shrink-0 group/art`}>
                <div className="absolute inset-0 bg-black/10" />
                <button 
                    onClick={() => setView('studio')}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/art:opacity-100 transition-opacity"
                >
                    <Maximize2 size={16} className="text-white" />
                </button>
             </div>
             <div className="min-w-0">
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm truncate">{activeTrack.title}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{activeTrack.artist || "OnBeat AI"}</p>
             </div>
          </div>

          {/* 2. Center Controls & Progress */}
          <div className="flex flex-col items-center flex-1 max-w-lg gap-1">
             <div className="flex items-center gap-6">
                <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Shuffle size={16} /></button>
                <button className="text-zinc-800 dark:text-white hover:text-indigo-500 transition-colors"><SkipBack size={20} fill="currentColor" /></button>
                
                <button 
                    onClick={togglePlay}
                    className="w-10 h-10 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>
                
                <button className="text-zinc-800 dark:text-white hover:text-indigo-500 transition-colors"><SkipForward size={20} fill="currentColor" /></button>
                <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"><Repeat size={16} /></button>
             </div>

             <div className="w-full flex items-center gap-3 text-[10px] font-mono font-medium text-zinc-400">
                <span>0:{(progress * 0.3).toFixed(0).padStart(2, '0')}</span>
                <div className="relative flex-1 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden group/bar cursor-pointer">
                    <div className="absolute inset-0 bg-zinc-300 dark:bg-zinc-700 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                    <motion.div 
                        className="h-full bg-indigo-500 rounded-full relative" 
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow opacity-0 group-hover/bar:opacity-100" />
                    </motion.div>
                </div>
                <span>{activeTrack.duration}</span>
             </div>
          </div>

          {/* 3. Volume & Tools (Right) */}
          <div className="flex items-center justify-end gap-3 w-1/4 min-w-fit">
             <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" title="Lyrics"><Mic2 size={18} /></button>
             <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" title="Queue"><ListMusic size={18} /></button>
             
             <div className="flex items-center gap-2 pl-2 group/vol">
                <Volume2 size={18} className="text-zinc-500 dark:text-zinc-400" />
                <div className="w-20 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-zinc-500 dark:bg-zinc-400 rounded-full" style={{ width: `${volume}%` }} />
                </div>
             </div>

             <button 
                onClick={() => setActiveTrack(null)} 
                className="ml-2 p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-500 hover:text-white rounded-md text-zinc-500 transition-colors"
             >
                <X size={14} />
             </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
