import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic2, Sliders, AudioLines, Power } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import type { SessionTrack } from '../../store/studioStore';

const Knob = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="relative w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 shadow-inner flex items-center justify-center">
      <div className="w-full h-full absolute inset-0 rounded-full" style={{ transform: `rotate(${(value - 50) * 2.7}deg)`, transition: 'transform 0.1s ease-out' }}>
        <div className="w-1.5 h-3 bg-indigo-500 mx-auto mt-1 rounded-sm shadow-[0_0_5px_rgba(99,102,241,0.8)]" />
      </div>
    </div>
    <span className="text-[10px] font-bold text-zinc-500 uppercase">{label}</span>
  </div>
);

const Meter = ({ active }: { active: boolean }) => {
    const [level, setLevel] = useState(0);
    useEffect(() => {
        if(!active) { setLevel(0); return; }
        const interval = setInterval(() => setLevel(Math.random() * 100), 100);
        return () => clearInterval(interval);
    }, [active]);

    return (
        <div className="flex flex-col-reverse gap-0.5 h-48 w-4 bg-zinc-950 p-0.5 rounded-sm border border-zinc-800">
            {[...Array(20)].map((_, i) => {
                const threshold = i * 5;
                const on = level > threshold;
                let color = 'bg-green-500';
                if (i > 14) color = 'bg-yellow-500';
                if (i > 17) color = 'bg-red-500';
                return <div key={i} className={`w-full flex-1 rounded-[1px] ${on ? color : 'bg-zinc-800'} transition-colors duration-75`} />;
            })}
        </div>
    );
};

// Connected Channel Strip
const ChannelStrip = ({ track, active }: { track: SessionTrack, active: boolean }) => {
    const { updateSessionTrack } = useStudioStore();

    return (
        <div className="w-24 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-4 gap-4 relative group hover:bg-zinc-800/50 transition-colors shrink-0">
            <div className="flex flex-col items-center gap-1 mb-2">
                <span className={`p-1.5 rounded-full ${track.type === 'vocal' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-700/50 text-zinc-400'}`}>
                    {track.type === 'vocal' ? <Mic2 size={12} /> : <AudioLines size={12} />}
                </span>
                <span className="text-[10px] font-bold text-zinc-300 w-20 text-center truncate px-1" title={track.title}>{track.title}</span>
            </div>
            <Knob label="Pan" value={track.pan} onChange={(v) => updateSessionTrack(track.id, { pan: v })} />
            <div className="flex gap-3 h-48 items-center">
                 <Meter active={active && !track.muted && !!track.fileUrl} />
                 <div className="relative h-full w-8 bg-zinc-950 rounded-lg border border-zinc-800 flex justify-center shadow-inner">
                    <div className="absolute inset-y-4 w-full flex flex-col justify-between items-center pointer-events-none opacity-30">
                        <div className="w-4 h-[1px] bg-zinc-500" /><div className="w-2 h-[1px] bg-zinc-600" /><div className="w-4 h-[1px] bg-zinc-500" /><div className="w-2 h-[1px] bg-zinc-600" /><div className="w-4 h-[1px] bg-zinc-500" />
                    </div>
                    <input 
                        type="range" min="0" max="100" value={track.vol}
                        onChange={(e) => updateSessionTrack(track.id, { vol: parseInt(e.target.value) })}
                        className="absolute w-[180px] -rotate-90 top-1/2 -left-[74px] h-8 bg-transparent appearance-none cursor-pointer z-10"
                    />
                    <div 
                        className="absolute w-12 h-6 bg-gradient-to-b from-zinc-600 to-zinc-800 border-t border-zinc-500 rounded-sm shadow-xl flex items-center justify-center pointer-events-none"
                        style={{ bottom: `${track.vol}%`, transform: 'translateY(50%)' }}
                    >
                        <div className="w-full h-[1px] bg-black opacity-50" />
                    </div>
                 </div>
            </div>
            <div className="flex flex-col gap-2 w-full px-4">
                <button onClick={() => updateSessionTrack(track.id, { muted: !track.muted })} className={`w-full py-1 text-[10px] font-bold uppercase rounded border transition-colors ${track.muted ? 'bg-red-500 text-white border-red-600 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300'}`}>Mute</button>
                <button onClick={() => updateSessionTrack(track.id, { solo: !track.solo })} className={`w-full py-1 text-[10px] font-bold uppercase rounded border transition-colors ${track.solo ? 'bg-yellow-500 text-black border-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300'}`}>Solo</button>
            </div>
            <div className="mt-auto px-2 py-1 bg-black/40 rounded text-[9px] font-mono text-indigo-300 border border-zinc-800">
                {track.muted ? 'OFF' : `${(track.vol - 20) > 0 ? '+' : ''}${Math.floor((track.vol - 20) / 2)} dB`}
            </div>
        </div>
    );
}

export const StudioConsole = () => {
    const { showConsole, toggleConsole, isPlaying, sessionTracks } = useStudioStore();

    return (
        <AnimatePresence>
            {showConsole && (
                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 h-[420px] bg-zinc-950 border-t border-zinc-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-[40] flex flex-col">
                    <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6">
                        <div className="flex items-center gap-2 text-zinc-400"><Sliders size={14} /><span className="text-xs font-bold uppercase tracking-widest">Mixing Console</span></div>
                        <div className="flex items-center gap-4"><span className="text-[10px] font-mono text-zinc-500">OUTPUT: STEREO OUT (1/2)</span><button onClick={toggleConsole} className="text-zinc-500 hover:text-white transition-colors"><X size={16} /></button></div>
                    </div>
                    <div className="flex-1 overflow-x-auto flex items-stretch p-4 gap-1 bg-[#121214] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                        {sessionTracks.map(track => (
                            <ChannelStrip key={track.id} track={track} active={isPlaying} />
                        ))}
                        {sessionTracks.length === 0 && <div className="flex items-center justify-center w-full text-zinc-600 text-sm">No tracks available. Add one in the Studio.</div>}
                        
                        <div className="w-[1px] h-full bg-zinc-800 mx-4" />
                        
                        <div className="w-28 bg-zinc-900/50 border border-zinc-800 rounded-lg flex flex-col items-center py-4 relative shadow-2xl shrink-0">
                             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/10 pointer-events-none" />
                             <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Master</span>
                             <div className="flex gap-2 h-64"><Meter active={isPlaying} /><Meter active={isPlaying} /></div>
                             <div className="mt-4"><button className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition-transform active:scale-95"><Power size={20} /></button></div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
