import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, X, Ghost, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

const Suggestion = ({ text, onClick }: { text: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full text-left p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-zinc-700 hover:text-indigo-600 dark:hover:text-white transition-colors text-sm border border-zinc-200 dark:border-zinc-700 group flex justify-between items-center"
  >
    "{text}"
    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
  </button>
);

export const LyricsPanel = () => {
  const { showLyrics, toggleLyrics, lyrics, setLyrics } = useStudioStore();
  const [mode, setMode] = useState<'write' | 'assist'>('write');

  // Mock AI Suggestions
  const suggestions = [
    "Shadows dancing on the ceiling",
    "Whispers lost in the wind",
    "Heartbeat syncing with the rain",
    "Neon lights fading away"
  ];

  const rhymes = ["Ceiling", "Feeling", "Healing", "Reeling", "Kneeling"];

  const addLine = (line: string) => {
    setLyrics(`${lyrics}\n${line}`);
  };

  return (
    <AnimatePresence>
      {showLyrics && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 right-0 bottom-0 w-96 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-40 flex flex-col"
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <PenLine size={18} />
              <span className="font-bold text-sm uppercase tracking-widest">Songwriting</span>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setMode(mode === 'write' ? 'assist' : 'write')}
                    className={`p-2 rounded-lg transition-colors ${mode === 'assist' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
                    title="AI Ghostwriter"
                >
                    <Ghost size={18} />
                </button>
                <button onClick={toggleLyrics} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><X size={20} /></button>
            </div>
          </div>

          {/* Mode Switcher */}
          {mode === 'write' ? (
            <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="flex-1 bg-transparent p-8 text-lg font-medium text-zinc-800 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-700 resize-none focus:outline-none leading-relaxed"
                placeholder="Write your masterpiece..."
                spellCheck={false}
            />
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-zinc-50 dark:bg-black/20">
                
                {/* Rhyme Finder */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
                        <BookOpen size={12} /> Rhymes with "Ceiling"
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {rhymes.map(r => (
                            <span key={r} onClick={() => addLine(r)} className="cursor-pointer px-3 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-xs text-zinc-600 dark:text-zinc-300 hover:border-indigo-500 hover:text-indigo-500 transition-colors">
                                {r}
                            </span>
                        ))}
                    </div>
                </div>

                {/* AI Line Suggestions */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={12} /> Ghostwriter Suggestions
                    </div>
                    <div className="space-y-2">
                        {suggestions.map((s, i) => (
                            <Suggestion key={i} text={s} onClick={() => addLine(s)} />
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300">
                    💡 Tip: Highlight a word in your lyrics to find rhymes instantly.
                </div>
            </div>
          )}
          
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 text-center">
            {mode === 'write' ? 'Auto-saved to cloud' : 'Powered by OnBeat AI'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
