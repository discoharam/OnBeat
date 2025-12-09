import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Home, Music, Layers, Wand2, Play, Mic, Moon, Sun, Monitor, Timer, X, CornerDownLeft } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

export const CommandCenter = () => {
  const store = useStudioStore();
  const [query, setQuery] = useState('');
  const [idx, setIdx] = useState(0);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); store.setModals('command', !store.showCommand); }
      if (!store.showCommand) return;
      if (e.key === 'Escape') store.setModals('command', false);
      if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => (i + 1) % filtered.length); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => (i - 1 + filtered.length) % filtered.length); }
      if (e.key === 'Enter') { e.preventDefault(); runAction(filtered[idx]); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [store.showCommand, idx, query]);

  // Reset on open
  useEffect(() => { if (store.showCommand) { setQuery(''); setIdx(0); } }, [store.showCommand]);

  const commands = useMemo(() => [
    { id: 'nav-home', label: 'Go to Home', group: 'Navigation', icon: Home, action: () => store.setView('home') },
    { id: 'nav-studio', label: 'Go to Studio', group: 'Navigation', icon: Music, action: () => store.setView('studio') },
    { id: 'nav-lib', label: 'Go to Library', group: 'Navigation', icon: Layers, action: () => store.setView('library') },
    { id: 'nav-gen', label: 'Go to Generator', group: 'Navigation', icon: Wand2, action: () => store.setView('generate') },
    { id: 'nav-dis', label: 'Go to Discover', group: 'Navigation', icon: Command, action: () => store.setView('discover') },
    { id: 'act-play', label: store.isPlaying ? 'Pause Playback' : 'Start Playback', group: 'Studio', icon: Play, action: () => store.togglePlay() },
    { id: 'act-rec', label: store.isRecording ? 'Stop Recording' : 'Start Recording', group: 'Studio', icon: Mic, action: () => store.toggleRecord() },
    { id: 'act-metro', label: 'Toggle Metronome', group: 'Studio', icon: Timer, action: () => store.toggleMetronome() },
    { id: 'act-mon', label: 'Toggle Monitoring', group: 'Studio', icon: Monitor, action: () => store.toggleMonitoring() },
    { id: 'sys-theme', label: `Switch to ${store.theme === 'dark' ? 'Light' : 'Dark'} Mode`, group: 'System', icon: store.theme === 'dark' ? Sun : Moon, action: () => store.toggleTheme() },
  ], [store.theme, store.isPlaying, store.isRecording]);

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()) || c.group.toLowerCase().includes(query.toLowerCase()));
  const runAction = (cmd: any) => { if(!cmd) return; cmd.action(); store.setModals('command', false); };

  if (!store.showCommand) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => store.setModals('command', false)} />
        <motion.div initial={{ scale: 0.95, opacity: 0, y: -20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/50 rounded-xl shadow-2xl overflow-hidden flex flex-col">
          
          <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-800">
            <Search className="text-zinc-500" size={20} />
            <input autoFocus value={query} onChange={(e) => { setQuery(e.target.value); setIdx(0); }} placeholder="Type a command or search..." className="flex-1 bg-transparent text-white text-lg placeholder-zinc-500 focus:outline-none" />
            <button onClick={() => store.setModals('command', false)} className="px-2 py-1 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700">ESC</button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto py-2">
            {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-zinc-500 text-sm">No commands found.</div>
            ) : (
                filtered.map((cmd, i) => (
                    <button key={cmd.id} onClick={() => runAction(cmd)} onMouseEnter={() => setIdx(i)} className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${i === idx ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                        <div className="flex items-center gap-3">
                            <cmd.icon size={18} className={i === idx ? 'text-white' : 'text-zinc-500'} />
                            <div>
                                <div className={`text-sm font-medium ${i === idx ? 'text-white' : 'text-zinc-200'}`}>{cmd.label}</div>
                                {query && <div className="text-[10px] opacity-70">{cmd.group}</div>}
                            </div>
                        </div>
                        {i === idx && <CornerDownLeft size={14} className="opacity-50" />}
                    </button>
                ))
            )}
          </div>
          <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-600 font-mono">
             <div className="flex gap-2"><span>↑↓ Navigate</span><span>↵ Select</span></div>
             <div className="flex items-center gap-1"><Command size={10} /><span>K</span></div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
