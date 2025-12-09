import { Plus, Clock, Mic2, ArrowRight, Disc, Keyboard } from 'lucide-react';
import { useStudioStore } from '../store/studioStore';

const RecentCard = ({ title, date, genre }: { title: string, date: string, genre: string }) => (
  <div className="group p-4 rounded-xl bg-white border border-zinc-200 hover:border-indigo-300 hover:shadow-md dark:bg-zinc-900/50 dark:border-zinc-800/50 dark:hover:bg-zinc-900 dark:hover:border-zinc-700 transition-all cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
        <Disc size={20} />
      </div>
      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">{genre}</span>
    </div>
    <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors">{title}</h3>
    <p className="text-xs text-zinc-500 flex items-center gap-1"><Clock size={10} /> {date}</p>
  </div>
);

export default function Home() {
  const { setView, setModals } = useStudioStore();
  return (
    <div className="flex-1 h-full bg-zinc-50 dark:bg-zinc-950 p-8 overflow-y-auto transition-colors duration-300 relative">
      
      {/* Tiny Shortcut Toggle (Top Right) */}
      <div className="absolute top-8 right-8 z-10">
        <button 
          onClick={() => setModals('shortcuts', true)}
          className="p-2.5 bg-white dark:bg-zinc-900 text-zinc-400 hover:text-indigo-500 rounded-full shadow-sm hover:shadow-md border border-zinc-200 dark:border-zinc-800 transition-all hover:scale-110"
          title="Keyboard Shortcuts & Tips"
        >
          <Keyboard size={16} />
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">Artist.</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl text-lg">Ready to create your next hit? Start a new session or continue where you left off.</p>
          
          <div className="flex gap-4">
            <button onClick={() => setView('studio')} className="px-8 py-4 bg-zinc-900 text-white dark:bg-white dark:text-black font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-transform hover:scale-105 flex items-center gap-2 shadow-xl shadow-black/5 dark:shadow-white/5"><Plus size={20} /> New Project</button>
            <button onClick={() => setView('library')} className="px-8 py-4 bg-white text-zinc-900 border border-zinc-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 hover:bg-zinc-50 dark:hover:border-zinc-700 transition-colors font-bold rounded-xl">Open Library</button>
          </div>
        </div>
        
        {/* Banner Removed - Clean UI */}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2"><Clock size={20} className="text-zinc-400 dark:text-zinc-500" /> Jump Back In</h2>
            <button onClick={() => setView('library')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">View All <ArrowRight size={14} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RecentCard title="Neon Nights (Demo)" date="2 hours ago" genre="Synthwave" />
            <RecentCard title="Acoustic Session" date="Yesterday" genre="Pop" />
            <RecentCard title="Trap Beat V3" date="3 days ago" genre="Hip Hop" />
          </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 dark:from-indigo-900/20 dark:to-purple-900/20 dark:border-indigo-500/20 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-indigo-600 border border-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-transparent text-xs font-bold uppercase tracking-wider shadow-sm dark:shadow-none">New Feature</div>
            <h3 className="text-xl font-bold text-indigo-900 dark:text-white">DiffRhythm2 AI Model is live.</h3>
            <p className="text-indigo-700/70 dark:text-indigo-200/70 text-sm max-w-md">Generate full tracks with higher fidelity and improved structure control.</p>
          </div>
          <button className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30"><Mic2 size={24} /></button>
        </div>
      </div>
    </div>
  );
}
