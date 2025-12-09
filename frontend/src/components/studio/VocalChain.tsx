import { Sparkles, Mic2, CloudFog, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore } from '../../store/studioStore';
import type { VocalPreset } from '../../store/studioStore';

const PresetCard = ({ id, label, icon: Icon, color }: { id: VocalPreset, label: string, icon: any, color: string }) => {
  const { activePreset, setPreset } = useStudioStore();
  const isActive = activePreset === id;
  const colorClasses: Record<string, string> = {
    indigo: 'border-indigo-500 bg-indigo-500/10 text-indigo-400',
    pink: 'border-pink-500 bg-pink-500/10 text-pink-400',
    yellow: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
    emerald: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
  };

  return (
    <button
      onClick={() => setPreset(id)}
      className={`relative group flex flex-col items-center justify-center h-24 w-24 rounded-2xl border transition-all duration-200 ease-out ${
        isActive 
          ? `${colorClasses[color]} shadow-lg` 
          : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-500'
      }`}
    >
      <Icon size={24} className={`mb-2 transition-transform duration-200 ${isActive ? 'text-white scale-110' : 'group-hover:text-zinc-300'}`} />
      <span className={`text-xs font-bold tracking-wide ${isActive ? 'text-white' : ''}`}>
        {label}
      </span>
    </button>
  );
};

export const VocalChain = () => {
  const { showVocalChain } = useStudioStore();

  return (
    <AnimatePresence>
      {showVocalChain && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: '10rem', opacity: 1 }} // 10rem = h-40
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          className="border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-xl flex items-center px-8 gap-8 z-30 overflow-hidden"
        >
          <div className="flex flex-col gap-1 mr-4 shrink-0">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Vocal Chain</h3>
            <p className="text-xs text-zinc-500">Instant Pro Mixing</p>
          </div>
          <div className="flex gap-4">
            <PresetCard id="clean" label="Studio Dry" icon={Mic2} color="indigo" />
            <PresetCard id="trap" label="Auto-Tune" icon={Sparkles} color="pink" />
            <PresetCard id="vintage" label="Vintage" icon={Radio} color="yellow" />
            <PresetCard id="stadium" label="Stadium" icon={CloudFog} color="emerald" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
