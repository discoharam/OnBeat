import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Layers, Save, Download, Trash2 } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import type { BlockType } from '../../store/studioStore';

const BLOCK_TYPES: BlockType[] = ['Intro', 'Verse', 'Chorus', 'Bridge', 'Outro'];

export const StructureBar = () => {
  const { songBlocks, addBlock, removeBlock, resizeBlock, saveArrangement, loadArrangement, savedArrangements, deleteArrangement, showArrangement } = useStudioStore();
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  
  // Resizing Logic
  const containerRef = useRef<HTMLDivElement>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);

  const handleResizeStart = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setResizingId(id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!resizingId || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const deltaPercent = (e.movementX / containerRect.width) * 100;
        const currentBlock = songBlocks.find(b => b.id === resizingId);
        if(currentBlock) resizeBlock(resizingId, currentBlock.width + deltaPercent);
    };
    const handleMouseUp = () => setResizingId(null);
    if (resizingId) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingId, songBlocks, resizeBlock]);

  const handleSave = () => {
    const name = prompt("Name this arrangement:");
    if (name) saveArrangement(name);
  };

  return (
    <AnimatePresence>
      {showArrangement && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }} 
          animate={{ height: 'auto', opacity: 1 }} 
          exit={{ height: 0, opacity: 0 }} 
          className="flex flex-col border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/20 overflow-hidden relative z-20"
        >
          
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-2 border-b border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-950/50">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    <Layers size={12} /> Arrangement
                </div>
                <div className="flex items-center gap-1 bg-zinc-200 dark:bg-zinc-800 rounded-md p-0.5">
                    <button onClick={handleSave} disabled={songBlocks.length === 0} className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 transition-colors disabled:opacity-50"><Save size={14} /></button>
                    <div className="w-[1px] h-3 bg-zinc-300 dark:bg-zinc-700" />
                    <button onClick={() => setShowLoadMenu(!showLoadMenu)} className={`p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 transition-colors ${showLoadMenu ? 'bg-white dark:bg-zinc-700 text-indigo-500' : ''}`}><Download size={14} /></button>
                </div>
            </div>
            
            <div className="flex gap-2">
                {BLOCK_TYPES.map((type) => (
                    <button key={type} onClick={() => addBlock(type)} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 hover:border-indigo-200 dark:hover:border-zinc-500 transition-all flex items-center gap-1 shadow-sm"><Plus size={10} /> {type}</button>
                ))}
            </div>
          </div>

          {/* Load Menu */}
          <AnimatePresence>
            {showLoadMenu && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-12 left-24 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 text-xs font-bold text-zinc-500 uppercase">Saved Templates</div>
                    <div className="max-h-48 overflow-y-auto p-1">
                        {savedArrangements.length === 0 && <div className="px-4 py-3 text-xs text-zinc-400 text-center">No saved templates</div>}
                        {savedArrangements.map(arr => (
                            <div key={arr.id} className="flex items-center justify-between p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg group cursor-pointer" onClick={() => { loadArrangement(arr.id); setShowLoadMenu(false); }}>
                                <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{arr.name}</span>
                                <button onClick={(e) => { e.stopPropagation(); deleteArrangement(arr.id); }} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"><Trash2 size={12} /></button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          {/* Timeline Strip */}
          <div className="flex w-full h-12 relative select-none">
            <div className="w-48 shrink-0 bg-zinc-50 dark:bg-zinc-950/30 border-r border-zinc-200 dark:border-white/5 flex items-end justify-end px-2 pb-1">
                <span className="text-[10px] font-mono text-zinc-400">00:00</span>
            </div>
            <div ref={containerRef} className="flex-1 relative bg-zinc-100 dark:bg-zinc-900/50 flex items-center overflow-hidden">
                 <div className="absolute inset-0 pointer-events-none flex justify-between px-4 opacity-30">
                    {[...Array(10)].map((_, i) => <div key={i} className="h-2 w-[1px] bg-zinc-400 mt-0" />)}
                 </div>
                 <AnimatePresence mode='popLayout'>
                    {songBlocks.map((block) => (
                        <motion.div
                            key={block.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, width: `${block.width}%` }} exit={{ opacity: 0, scale: 0.5, width: 0 }}
                            className={`h-full ${block.color} relative group border-r border-black/20 overflow-hidden min-w-[50px]`}
                            style={{ width: `${block.width}%` }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center"><span className="text-[10px] font-extrabold text-white uppercase tracking-wide drop-shadow-sm truncate px-2">{block.type}</span></div>
                            <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="absolute top-1 left-1 text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-black/20 rounded-full z-10"><X size={10} /></button>
                            <div onMouseDown={(e) => handleResizeStart(e, block.id)} className="absolute top-0 bottom-0 right-0 w-3 cursor-col-resize hover:bg-white/20 flex items-center justify-center z-20 group/handle transition-colors">
                                <div className="w-[1px] h-4 bg-white/50 group-hover/handle:bg-white" /><div className="w-[1px] h-4 bg-white/50 group-hover/handle:bg-white ml-[2px]" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {songBlocks.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-600 uppercase tracking-widest pointer-events-none font-bold">Start adding blocks to arrange</div>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
