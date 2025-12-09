import { useStudioStore } from '../../store/studioStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, Infinity, Wand2 } from 'lucide-react';

export const UpgradeModal = () => {
  const { showUpgrade, setModals } = useStudioStore();
  if (!showUpgrade) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
           className="absolute inset-0 bg-black/80 backdrop-blur-md"
           onClick={() => setModals('upgrade', false)}
        />
        
        <motion.div 
           initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
           className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="absolute top-4 right-4 z-10">
            <button onClick={() => setModals('upgrade', false)} className="p-2 bg-black/20 hover:bg-white/10 rounded-full text-white">
              <X size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 h-full min-h-[500px]">
            <div className="p-10 flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 w-fit">
                <Sparkles size={14} /> <span className="text-xs font-bold uppercase tracking-wider">OnBeat Pro</span>
              </div>
              
              <h2 className="text-5xl font-extrabold text-white leading-tight">
                Unleash your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">full potential.</span>
              </h2>
              
              <p className="text-zinc-400 text-lg leading-relaxed">
                Get access to studio-grade auto-tune, unlimited AI generations, and stem separation.
              </p>

              <button className="py-4 px-8 bg-white text-black text-lg font-bold rounded-xl hover:bg-zinc-200 transition-transform hover:scale-105 shadow-xl shadow-white/10">
                Upgrade for $9.99/mo
              </button>
            </div>

            <div className="bg-zinc-900/50 p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-indigo-600 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-100 group-hover:scale-105 transition-transform duration-700" />
                 <Wand2 className="relative z-10 text-white" size={32} />
                 <div className="relative z-10">
                   <h3 className="text-xl font-bold text-white">DiffRhythm2 Engine</h3>
                   <p className="text-indigo-200 text-sm">Unlimited Gen-AI tracks</p>
                 </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-center items-center text-center space-y-3 hover:border-zinc-700 transition-colors">
                <Zap className="text-yellow-400" size={32} />
                <h3 className="font-bold text-zinc-300">0ms Latency</h3>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-center items-center text-center space-y-3 hover:border-zinc-700 transition-colors">
                <Infinity className="text-emerald-400" size={32} />
                <h3 className="font-bold text-zinc-300">Cloud Storage</h3>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
