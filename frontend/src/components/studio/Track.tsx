import React, { memo, useRef } from 'react';
import { Mic, Volume2, Sliders, Upload, Trash2, Music } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import type { SessionTrack } from '../../store/studioStore';
import { WaveformCanvas } from './WaveformCanvas';

interface TrackProps {
  track: SessionTrack;
  active: boolean;
}

const TrackComponent = ({ track, active }: TrackProps) => {
  const { updateSessionTrack, removeSessionTrack, importAudioToTrack, activePreset } = useStudioStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetColors: Record<string, string> = { clean: 'indigo', trap: 'pink', vintage: 'yellow', stadium: 'emerald' };
  const safePreset = activePreset || 'clean';
  const colorKey = track.type === 'vocal' ? (presetColors[safePreset] || 'indigo') : 'zinc';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) importAudioToTrack(track.id, e.target.files[0]);
  };

  return (
    <div className={`relative h-32 border-b border-zinc-200 dark:border-white/5 flex group transition-colors will-change-transform ${track.muted ? 'bg-zinc-100 dark:bg-zinc-950 opacity-60' : 'bg-white/50 dark:bg-zinc-900/30 hover:bg-white dark:hover:bg-zinc-900/50'}`}>
      
      {/* Mixer Sidebar */}
      <div className="w-48 border-r border-zinc-200 dark:border-white/5 p-3 flex flex-col justify-between z-10 bg-zinc-50/80 dark:bg-zinc-950/50 backdrop-blur-sm">
        
        {/* Header */}
        <div className="group/header relative">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-white font-bold tracking-tight mb-0.5 truncate text-sm">
            {track.type === 'beat' ? <Sliders size={12} className="text-zinc-400" /> : <Mic size={12} className="text-indigo-500" />}
            <span className="truncate">{track.title}</span>
          </div>
          {/* Delete Button (Hidden by default) */}
          <button 
             onClick={() => removeSessionTrack(track.id)}
             className="absolute top-0 right-0 p-1 text-zinc-500 hover:text-red-500 opacity-0 group-hover/header:opacity-100 transition-opacity bg-zinc-100 dark:bg-zinc-900 rounded"
             title="Delete Track"
          >
             <Trash2 size={10} />
          </button>
          
          {track.type === 'vocal' && (
            <div className="text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
              {safePreset} Chain
            </div>
          )}
        </div>

        {/* Mixer Controls */}
        <div className="space-y-2">
          {/* Vol Fader */}
          <div className="flex items-center gap-2 group/vol">
            <Volume2 size={12} className="text-zinc-400 group-hover/vol:text-zinc-600 dark:group-hover/vol:text-white transition-colors" />
            <input 
              type="range" min="0" max="100" value={track.vol} 
              onChange={(e) => updateSessionTrack(track.id, { vol: parseInt(e.target.value) })}
              className="w-full h-1 bg-zinc-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-1">
            <button 
              onClick={() => updateSessionTrack(track.id, { muted: !track.muted })}
              className={`flex-1 py-0.5 rounded text-[9px] font-bold border transition-all ${track.muted ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
            >
              M
            </button>
            <button 
              onClick={() => updateSessionTrack(track.id, { solo: !track.solo })}
              className={`flex-1 py-0.5 rounded text-[9px] font-bold border transition-all ${track.solo ? 'bg-yellow-500/10 border-yellow-500 text-yellow-600 dark:text-yellow-500' : 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
            >
              S
            </button>
          </div>
        </div>
      </div>

      {/* Visualizer Area */}
      <div className="flex-1 relative p-1 overflow-hidden opacity-90">
        {track.fileUrl ? (
          <>
            <WaveformCanvas active={active && !track.muted} color={track.muted ? 'gray' : colorKey} />
            <div className={`absolute top-0 bottom-0 w-[1px] bg-indigo-500 dark:bg-white z-20 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-[30s] ease-linear ${active ? 'left-full' : 'left-0'}`} />
          </>
        ) : (
          /* Empty State / Import Button */
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/50">
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="audio/*" />
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-white transition-all shadow-sm hover:scale-105"
             >
                <Upload size={14} />
                <span className="text-xs font-bold uppercase">Import Audio</span>
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const Track = memo(TrackComponent);
