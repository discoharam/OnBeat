import { useRef, useState } from 'react';
import { Search, Filter, MoreHorizontal, Play, Pause, Upload, Trash2, Disc3, Mic2, FileAudio, LayoutList, Grid } from 'lucide-react';
import { useStudioStore } from '../store/studioStore';

const LibraryRow = ({ track, index }: { track: any, index: number }) => {
  const { setActiveTrack, activeTrack, isPlaying, togglePlay, removeFromLibrary } = useStudioStore();
  const isCurrent = activeTrack?.title === track.title;
  const isCurrentlyPlaying = isCurrent && isPlaying;
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) togglePlay();
    else setActiveTrack(track);
  };

  return (
    <div className={`group relative grid grid-cols-12 gap-4 p-3 mx-2 rounded-xl items-center transition-all duration-200 border border-transparent 
      ${isCurrent 
        ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20' 
        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-800'}`}
    >
      
      {/* 1. Index & Play Trigger & Title */}
      <div className="col-span-5 flex items-center gap-4">
        
        {/* Play/Index Swapper */}
        <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            {/* Index Number */}
            <span className={`text-xs font-mono font-medium text-zinc-400 transition-opacity duration-200 ${isCurrentlyPlaying ? 'opacity-0' : 'group-hover:opacity-0'}`}>
                {index + 1}
            </span>

            {/* Play Button */}
            <button 
                onClick={handlePlay}
                className={`absolute inset-0 flex items-center justify-center rounded-full transition-all duration-200 ${
                    isCurrentlyPlaying 
                    ? 'opacity-100 text-indigo-600 dark:text-indigo-400 scale-100' 
                    : 'opacity-0 group-hover:opacity-100 text-zinc-600 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-700 hover:scale-110'
                }`}
            >
                {isCurrentlyPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
            </button>
        </div>

        <div className="flex flex-col min-w-0">
          <span className={`font-bold text-sm truncate ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-900 dark:text-white'}`}>
            {track.title}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-medium ${track.artist === 'OnBeat AI' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                {track.artist === 'OnBeat AI' ? <Disc3 size={10} /> : <Mic2 size={10} />}
                {track.artist || 'User'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Metadata Pills */}
      <div className="col-span-3 flex items-center gap-2">
         {track.bpm && track.bpm !== '???' && (
            <div className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-white dark:bg-black/50">
                {track.bpm} BPM
            </div>
         )}
         {track.keySig && track.keySig !== '-' && (
            <div className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-white dark:bg-black/50">
                {track.keySig}
            </div>
         )}
      </div>

      {/* 3. Date */}
      <div className="col-span-2 text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
        {track.date}
      </div>

      {/* 4. Duration & Actions */}
      <div className="col-span-2 flex items-center justify-end gap-3">
        <span className="text-xs font-mono text-zinc-500">{track.duration}</span>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-200">
            <button 
                onClick={(e) => { e.stopPropagation(); removeFromLibrary(track.title); }}
                className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                title="Delete"
            >
                <Trash2 size={14} />
            </button>
            <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                <MoreHorizontal size={14} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default function Library() {
  const { userLibrary, addToLibrary } = useStudioStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<'all' | 'beats' | 'vocals'>('all');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newTrack = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        date: "Just now",
        bpm: "120",
        keySig: "Cm",
        duration: "2:30",
        artist: "User Upload",
        fileUrl: URL.createObjectURL(file)
      };
      addToLibrary(newTrack);
    }
  };

  const filteredLibrary = userLibrary.filter(track => {
     if (filter === 'all') return true;
     if (filter === 'beats') return track.artist === 'OnBeat AI';
     if (filter === 'vocals') return track.artist !== 'OnBeat AI';
     return true;
  });

  return (
    <div className="flex-1 h-full bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      
      {/* Header */}
      <div className="h-24 px-8 flex items-end pb-6 justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-20 border-b border-zinc-200 dark:border-white/5">
        <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Library
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Manage your stems, beats, and recordings.</p>
        </div>
        
        <div className="flex items-center gap-3">
            {/* Transparent Filter Container */}
            <div className="flex bg-transparent p-1 rounded-lg mr-4">
                {['all', 'beats', 'vocals'].map((f) => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${filter === f ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleFileUpload} />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-sm rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
            >
                <Upload size={16} /> Import
            </button>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="px-8 py-4 flex items-center justify-between">
         <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, key, or bpm..." 
              className="w-full bg-white dark:bg-zinc-900/50 border border-transparent rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
         </div>
         <div className="flex items-center gap-2">
            <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><LayoutList size={20} /></button>
            <button className="p-2 text-zinc-300 dark:text-zinc-700 cursor-not-allowed"><Grid size={20} /></button>
         </div>
      </div>

      {/* List Header */}
      <div className="grid grid-cols-12 gap-4 px-12 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider select-none">
        <div className="col-span-5 pl-4">Track Name</div>
        <div className="col-span-3">Attributes</div>
        <div className="col-span-2">Date Added</div>
        <div className="col-span-2 text-right">Duration</div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-32">
        {filteredLibrary.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl m-2">
              <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-full mb-4">
                <FileAudio size={48} className="text-zinc-300 dark:text-zinc-700" />
              </div>
              <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300">No tracks found</h3>
              <p className="text-sm text-zinc-500">Import audio or generate a beat to get started.</p>
            </div>
        ) : (
            <div className="space-y-1">
                {filteredLibrary.map((track, i) => (
                    <LibraryRow key={i} index={i} track={track} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
