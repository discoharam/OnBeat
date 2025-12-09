import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wand2, Download, Play, Pause, Check, Activity, ToggleLeft, ToggleRight } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

export const MasteringModal = () => {
  const { showMastering, setModals } = useStudioStore();
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [masteredMode, setMasteredMode] = useState(false); // A/B Toggle

  // Reset state when opening
  useEffect(() => {
    if (showMastering) {
      setProcessing(false);
      setCompleted(false);
      setMasteredMode(false);
      setIsPlaying(false);
    }
  }, [showMastering]);

  const runMastering = () => {
    setProcessing(true);
    // Simulate AI Processing
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      setMasteredMode(true); // Auto-switch to mastered view
    }, 3000);
  };

  if (!showMastering) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setModals('mastering', false)}
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Wand2 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Magic Master</h2>
                <p className="text-xs text-zinc-400">AI-Powered Mixing & Limiting</p>
              </div>
            </div>
            <button onClick={() => setModals('mastering', false)} className="text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Visualization Stage */}
          <div className="relative h-64 bg-black flex items-center justify-center p-8 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />

            {/* Waveform Visualizer */}
            <div className="flex items-center gap-1 h-32 w-full max-w-md z-10">
              {[...Array(40)].map((_, i) => {
                // Simulate "Before" vs "After" amplitude
                // Before: Dynamic, quieter. After: Compressed, louder "sausage"
                const baseHeight = Math.sin(i * 0.5) * 40 + 50;
                const masteredHeight = Math.min(100, baseHeight * 1.5 + 20);
                
                return (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: completed && masteredMode ? `${masteredHeight}%` : `${baseHeight}%`,
                      opacity: isPlaying ? [0.5, 1, 0.5] : 1
                    }}
                    transition={{ 
                      height: { duration: 0.5 },
                      opacity: { duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }
                    }}
                    className={`flex-1 rounded-full transition-colors duration-500 ${
                      completed && masteredMode ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-zinc-600'
                    }`}
                  />
                );
              })}
            </div>

            {/* Processing Overlay */}
            {processing && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20"
              >
                <Activity size={48} className="text-indigo-500 animate-bounce" />
                <p className="mt-4 text-indigo-300 font-mono text-sm">Analyzing Dynamics...</p>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 bg-zinc-900 border-t border-zinc-800 flex flex-col gap-6">
            
            {/* A/B Toggle (Only if completed) */}
            {completed && (
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className={`text-xs font-bold uppercase ${!masteredMode ? 'text-white' : 'text-zinc-500'}`}>Original</span>
                <button onClick={() => setMasteredMode(!masteredMode)} className="text-indigo-500 transition-transform hover:scale-110">
                  {masteredMode ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                </button>
                <span className={`text-xs font-bold uppercase ${masteredMode ? 'text-indigo-400' : 'text-zinc-500'}`}>Mastered</span>
              </div>
            )}

            <div className="flex gap-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                Preview
              </button>

              {completed ? (
                <button className="flex-[2] py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/20">
                  <Download size={18} /> Export Mastered WAV
                </button>
              ) : (
                <button 
                  onClick={runMastering}
                  disabled={processing}
                  className="flex-[2] py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
                >
                  {processing ? 'Processing...' : <><Wand2 size={18} /> Apply Magic Master</>}
                </button>
              )}
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
