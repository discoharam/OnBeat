import { Play, Square, Download, FileText, Activity, Mic2, Clock, Timer, Wand2, SlidersHorizontal, Plus, PanelTop, Sparkles } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { VocalChain } from './VocalChain';
import { LyricsPanel } from './LyricsPanel';
import { Track } from './Track';
import { VisualTuner } from './VisualTuner';
import { StructureBar } from './StructureBar';
import { StudioConsole } from './StudioConsole';
import { useAudioEngine } from '../../hooks/useAudioEngine';

export const AudioStage = () => {
  const { 
    isRecording, isPlaying, toggleRecord, togglePlay, toggleLyrics, showLyrics,
    metronome, toggleMetronome, monitoring, toggleMonitoring, countIn, toggleCountIn,
    setModals, showConsole, toggleConsole, sessionTracks, addSessionTrack, 
    showArrangement, toggleArrangement, showVocalChain, toggleVocalChain
  } = useStudioStore();
  
  useAudioEngine();

  return (
    <div className="flex-1 flex flex-col h-full relative bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      
      <header className="h-16 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-6 bg-white/80 dark:bg-zinc-950/90 backdrop-blur-md z-30 transition-colors relative">
        
        {/* Left: Tools */}
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg">
             <Activity size={14} className="text-zinc-500" />
             <span className="text-xs font-mono font-bold text-zinc-700 dark:text-white">120 BPM</span>
           </div>
           <div className="h-5 w-[1px] bg-zinc-200 dark:bg-white/10" />
           <div className="flex items-center gap-1">
             <button onClick={toggleMetronome} className={`p-2 rounded-md transition-all ${metronome ? 'bg-indigo-500 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white dark:hover:bg-zinc-900'}`}><Timer size={18} /></button>
             <button onClick={toggleMonitoring} className={`p-2 rounded-md transition-all ${monitoring ? 'bg-green-500 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white dark:hover:bg-zinc-900'}`}><Mic2 size={18} /></button>
             <button onClick={toggleCountIn} className={`p-2 rounded-md transition-all ${countIn ? 'bg-yellow-500 text-black font-bold' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white dark:hover:bg-zinc-900'}`}><Clock size={18} /></button>
           </div>
        </div>

        {/* Center: Minimal Transport Capsule */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-100/80 dark:bg-black/40 border border-zinc-200 dark:border-white/5 rounded-full p-1 backdrop-blur-md shadow-sm">
           
           <button 
             onClick={toggleRecord} 
             className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
               isRecording 
                 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                 : 'hover:bg-zinc-200 dark:hover:bg-white/10 text-red-500/80 hover:text-red-500'
             }`}
             title="Record (R)"
           >
             <div className={`bg-current transition-all duration-200 ${isRecording ? 'w-3 h-3 rounded-[2px]' : 'w-3 h-3 rounded-full'}`} />
           </button>

           <div className="w-[1px] h-4 bg-zinc-300 dark:bg-white/10" />

           <button 
             onClick={togglePlay} 
             className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-zinc-200 dark:hover:bg-white/10 ${
               isPlaying ? 'text-indigo-500' : 'text-zinc-900 dark:text-white'
             }`}
             title="Play/Stop (Space)"
           >
             {isPlaying ? <Square size={14} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
           </button>
        </div>

        {/* Right: View Toggles & Export */}
        <div className="flex gap-2 items-center">
          {/* View Toggles Group */}
          <div className="flex items-center gap-1">
             <button 
               onClick={toggleArrangement} 
               className={`p-2 rounded-lg transition-all ${showArrangement ? 'text-indigo-600 dark:text-indigo-400 bg-zinc-100 dark:bg-white/10' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5'}`} 
               title="Arrangement View"
             >
               <PanelTop size={20} strokeWidth={showArrangement ? 2.5 : 2} />
             </button>
             <button 
               onClick={toggleConsole} 
               className={`p-2 rounded-lg transition-all ${showConsole ? 'text-indigo-600 dark:text-indigo-400 bg-zinc-100 dark:bg-white/10' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5'}`} 
               title="Mixer Console"
             >
               <SlidersHorizontal size={20} strokeWidth={showConsole ? 2.5 : 2} />
             </button>
             <button 
               onClick={toggleVocalChain} 
               className={`p-2 rounded-lg transition-all ${showVocalChain ? 'text-indigo-600 dark:text-indigo-400 bg-zinc-100 dark:bg-white/10' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5'}`} 
               title="Vocal Chain"
             >
               <Sparkles size={20} strokeWidth={showVocalChain ? 2.5 : 2} />
             </button>
          </div>
          
          <div className="w-[1px] h-6 bg-zinc-200 dark:bg-white/10 mx-1" />

          {/* Lyrics Toggle */}
          <button 
            onClick={toggleLyrics} 
            className={`p-2 rounded-lg transition-all ${showLyrics ? 'text-indigo-600 dark:text-indigo-400 bg-zinc-100 dark:bg-white/10' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5'}`}
            title="Lyrics"
          >
            <FileText size={20} strokeWidth={showLyrics ? 2.5 : 2} />
          </button>

          {/* Transparent Export Button */}
          <button 
            onClick={() => setModals('mastering', true)} 
            className="ml-2 px-4 py-2 bg-transparent border border-transparent text-zinc-900 dark:text-white font-bold text-xs rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 flex items-center gap-2 transition-all active:scale-95"
          >
            <Wand2 size={14} /> Export
          </button>
        </div>
      </header>
      
      <StructureBar />
      
      <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950/30 relative">
        {sessionTracks.map(track => (
           <Track key={track.id} track={track} active={isPlaying} />
        ))}
        
        <div className="p-4 flex gap-4 border-b border-zinc-200 dark:border-white/5 opacity-50 hover:opacity-100 transition-opacity">
           <button onClick={() => addSessionTrack('beat')} className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-700">
              <Plus size={14} /> Add Audio Track
           </button>
           <button onClick={() => addSessionTrack('vocal')} className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-700">
              <Plus size={14} /> Add Vocal Track
           </button>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'linear-gradient(to right, #888888 1px, transparent 1px)', backgroundSize: '40px 100%' }} />
      </div>
      <VisualTuner active={isRecording || monitoring} />
      <VocalChain />
      <LyricsPanel />
      <StudioConsole />
    </div>
  );
};
