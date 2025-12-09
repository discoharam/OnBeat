import { useState, useEffect, useRef } from 'react';
import { Search, Play, Pause, Download, Zap, Heart, Flame, ArrowRight, Star, Hash, Loader2 } from 'lucide-react';
import { useStudioStore } from '../store/studioStore';

const categories = ["Trending", "Hip Hop", "R&B", "Cinematic", "Lo-Fi", "Pop", "Afrobeats", "Trap", "Soul", "Drill", "House", "Techno", "Reggaeton", "Phonk"];

const FEATURED_DATA = [
  { id: 101, title: "Neon Horizon", artist: "Future Bass", bpm: "128", keySig: "Am", color: "bg-gradient-to-r from-indigo-900 via-purple-900 to-black" },
  { id: 102, title: "Sunset Boulevard", artist: "Retro Wave", bpm: "110", keySig: "F", color: "bg-gradient-to-r from-orange-900 via-red-900 to-black" }
];

const BEATS_DATA = [
  { id: 1, title: "Midnight Tokyo", artist: "Lofi Gods", bpm: "85", keySig: "Cm", tags: ["Chill", "Night"], color: "bg-gradient-to-br from-indigo-900 to-purple-800" },
  { id: 2, title: "Drill Season", artist: "Metro 808", bpm: "140", keySig: "Fm", tags: ["Dark", "Hard"], color: "bg-gradient-to-br from-red-900 to-orange-800" },
  { id: 3, title: "Golden Hour", artist: "Sunset Vibes", bpm: "110", keySig: "E", tags: ["Summer", "Happy"], color: "bg-gradient-to-br from-amber-700 to-orange-600" },
  { id: 4, title: "Cyberpunk City", artist: "Synthwave X", bpm: "128", keySig: "Am", tags: ["Retro", "Synth"], color: "bg-gradient-to-br from-cyan-900 to-blue-800" },
  { id: 5, title: "Deep Ocean", artist: "Ambient Flow", bpm: "60", keySig: "G#m", tags: ["Atmospheric"], color: "bg-gradient-to-br from-emerald-900 to-teal-800" },
  { id: 6, title: "Club Banger", artist: "Pop Charts", bpm: "124", keySig: "Bm", tags: ["Party", "Dance"], color: "bg-gradient-to-br from-pink-900 to-rose-800" },
  { id: 7, title: "Soulful Keys", artist: "Jazz Cats", bpm: "90", keySig: "C#m", tags: ["Smooth", "Piano"], color: "bg-gradient-to-br from-yellow-800 to-amber-900" },
  { id: 8, title: "Dark Knight", artist: "Orchestra", bpm: "70", keySig: "Dm", tags: ["Epic", "Orchestral"], color: "bg-gradient-to-br from-zinc-800 to-black" },
];

const FeaturedSection = () => {
    const { setActiveTrack, setView } = useStudioStore();
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {FEATURED_DATA.map((beat) => (
                <div key={beat.id} className="relative h-64 rounded-3xl overflow-hidden group">
                    <div className={`absolute inset-0 ${beat.color}`} />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                    
                    <div className="absolute inset-0 p-8 flex flex-col justify-center items-start z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-yellow-500 text-black text-[10px] font-bold uppercase tracking-wider rounded shadow-lg shadow-yellow-500/20">Featured</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-white/80"><Star size={12} fill="currentColor"/> Staff Picks</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight">{beat.title}</h2>
                        <p className="text-white/60 font-medium mb-6">By {beat.artist} • {beat.bpm} BPM • {beat.keySig}</p>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => { setActiveTrack({ ...beat, duration: "3:45" }); setView('studio'); }}
                                className="px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                <Play size={16} fill="currentColor" /> Listen
                            </button>
                            <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-md transition-colors">
                                + Library
                            </button>
                        </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
                </div>
            ))}
        </div>
    );
};

const BeatCard = ({ data }: { data: any }) => {
  const { setActiveTrack, activeTrack, isPlaying, togglePlay, setView } = useStudioStore();
  const isCurrent = activeTrack?.title === data.title;
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) togglePlay();
    else setActiveTrack({ ...data, artist: data.artist });
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
      <div className={`h-48 ${data.color} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
        
        <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">{data.bpm} BPM</span>
            <span className="px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-md text-[10px] font-bold text-zinc-300 font-mono">{data.keySig}</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-4">
             <button onClick={handlePlay} className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110 shadow-xl">
                {isCurrent && isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
             </button>
        </div>

        <div className="absolute bottom-4 left-4 flex gap-1.5 opacity-100 transition-opacity">
            {data.tags.map((tag: string) => (
                <span key={tag} className="flex items-center gap-0.5 px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded-full text-[9px] font-bold text-white/90 border border-white/10">
                    <Hash size={8} /> {tag}
                </span>
            ))}
        </div>

        <button className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/50 text-white/70 hover:text-pink-500 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"><Heart size={18} /></button>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white leading-tight mb-0.5 group-hover:text-indigo-500 transition-colors">{data.title}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{data.artist}</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
             <button className="p-2 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <Download size={16} />
             </button>
             <button onClick={() => { setActiveTrack(data); setView('studio'); }} className="px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity">
                <Zap size={12} fill="currentColor" /> Use Beat
             </button>
        </div>
      </div>
    </div>
  );
};

export default function Discover() {
  const { setView } = useStudioStore();
  const [activeCat, setActiveCat] = useState('Trending');
  const [beats, setBeats] = useState(BEATS_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = () => {
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
        const newBeats = BEATS_DATA.map(b => ({ ...b, id: Math.random() })); // Duplicate for demo
        setBeats(prev => [...prev, ...newBeats]);
        setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [isLoading]);

  return (
    <div className="flex-1 h-full bg-zinc-50 dark:bg-zinc-950 flex flex-col overflow-y-auto transition-colors duration-300">
      
      <div className="p-8 pb-0 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Discover</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-md">Curated, royalty-free stems and beats for your next hit.</p>
          </div>

          <button 
            onClick={() => setView('swipe')}
            className="group relative px-6 py-3 rounded-2xl bg-transparent border border-transparent hover:bg-zinc-100 dark:hover:bg-white/5 transition-all hover:scale-105"
          >
            <div className="relative flex items-center gap-3">
                <div className="p-1.5 bg-zinc-100 dark:bg-white/10 rounded-lg text-zinc-900 dark:text-white group-hover:text-pink-500 transition-colors">
                    <Flame size={18} fill="currentColor" />
                </div>
                <div className="text-left">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none mb-0.5">Try Mode</div>
                    <div className="text-sm font-bold text-zinc-900 dark:text-white">Vibe Swipe</div>
                </div>
                <ArrowRight size={16} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors ml-2" />
            </div>
          </button>
        </div>

        <FeaturedSection />

        <div className="flex flex-col gap-6 mb-8">
            <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search genres, moods, or keys..." 
                  className="w-full bg-white dark:bg-zinc-900/50 border border-transparent rounded-2xl pl-12 pr-4 py-3.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    activeCat === cat
                      ? 'text-zinc-900 dark:text-white bg-zinc-200/50 dark:bg-white/10' 
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 bg-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {beats.map((beat) => (
                <BeatCard key={beat.id} data={beat} />
            ))}
        </div>

        {/* Infinite Scroll Sentinel */}
        <div ref={observerRef} className="flex justify-center items-center h-32 w-full">
            {isLoading && (
                <div className="flex flex-col items-center gap-2 text-zinc-400 animate-pulse">
                    <Loader2 size={24} className="animate-spin text-indigo-500" />
                    <span className="text-xs font-bold">Digging for more beats...</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
