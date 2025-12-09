import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, Command, Search, Play, Mic, Timer } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

const ShortcutRow = ({ icon: Icon, label, keys }: { icon: any, label: string, keys: string[] }) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
      <Icon size={18} />
      <span className="font-medium text-sm">{label}</span>
    </div>
    <div className="flex gap-1">
      {keys.map((k) => (
        <kbd key={k} className="px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded text-xs font-mono font-bold text-zinc-600 dark:text-zinc-200 min-w-[24px] text-center">
          {k}
        </kbd>
      ))}
    </div>
  </div>
);

export const ShortcutsModal = () => {
  const { showShortcuts, setModals } = useStudioStore();

  if (!showShortcuts) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModals('shortcuts', false)} />
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg"><Keyboard size={20} /></div>
              <div><h2 className="text-lg font-bold text-zinc-900 dark:text-white">Keyboard Shortcuts</h2><p className="text-xs text-zinc-500">Speed up your workflow</p></div>
            </div>
            <button onClick={() => setModals('shortcuts', false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><X size={20} /></button>
          </div>
          <div className="p-4 space-y-1">
            <ShortcutRow icon={Search} label="Command Center" keys={['Ctrl', 'K']} />
            <ShortcutRow icon={Play} label="Play / Pause" keys={['Space']} />
            <ShortcutRow icon={Mic} label="Toggle Record" keys={['R']} />
            <ShortcutRow icon={Timer} label="Metronome" keys={['M']} />
            <ShortcutRow icon={Command} label="Save Project" keys={['Ctrl', 'S']} />
          </div>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 text-center text-[10px] text-zinc-400 font-mono border-t border-zinc-200 dark:border-zinc-800">
            Pro Tip: Use Command Center to navigate anywhere instantly.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
