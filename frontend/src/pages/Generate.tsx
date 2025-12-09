import { useState } from 'react';
import { Wand2, Music, Clock, Sliders, Zap, Play, CheckCircle2 } from 'lucide-react';
import { useAudioGen } from '../hooks/useAudioGen';
import { useStudioStore } from '../store/studioStore';

const GenreChip = ({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
      selected 
        ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white' 
        : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
    }`}
  >
    {label}
  </button>
);

export default function Generate() {
  const { generate, loading, data, error } = useAudioGen();
  const { setView, setActiveTrack } = useStudioStore();
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(30);
  const [selectedGenre, setSelectedGenre] = useState('');
  const genres = ["Lofi Hip Hop", "Trap", "Cinematic", "Synthwave", "R&B", "Drill", "Ambient"];

  const handleGenerate = () => {
    const fullPrompt = selectedGenre ? `${selectedGenre}, ${prompt}` : prompt;
    generate(fullPrompt);
  };

  return (
    <div className="flex-1 h-full bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center overflow-y-auto p-8 transition-colors duration-300">
      
      <div className="max-w-3xl w-full space-y-2 mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 mb-4">
          <Wand2 size={12} /> <span className="text-[10px] font-bold uppercase tracking-wider">DiffRhythm2 Model</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Describe it. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400">Hear it.</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">Generate royalty-free samples and full tracks instantly.</p>
      </div>

      <div className="max-w-3xl w-full bg-white border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 rounded-3xl p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors">
        <div className="space-y-8 relative z-10">
          
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <Music size={14} /> Text Prompt
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g. A melancholic piano melody..."
              className="w-full h-32 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none text-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Sliders size={14} /> Style Preset
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.map(g => (
                  <GenreChip key={g} label={g} selected={selectedGenre === g} onClick={() => setSelectedGenre(selectedGenre === g ? '' : g)} />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Clock size={14} /> Duration: {duration}s
              </label>
              <input 
                type="range" min="10" max="60" step="5" value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>10s</span>
                <span>60s</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || (!prompt && !selectedGenre)}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              loading 
                ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed' 
                : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 hover:scale-[1.02] shadow-xl'
            }`}
          >
            {loading ? <>Processing Request...</> : <><Zap size={20} fill="currentColor" /> Generate Track</>}
          </button>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-100 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 text-sm text-center rounded-xl">
              {error}
            </div>
          )}
        </div>
      </div>

      {data && (
        <div className="max-w-3xl w-full mt-8 animate-fade-in">
          <div className="bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl p-6 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Music size={32} />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Generation Complete</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">ID: {data.id} • {duration}s</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-3 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-white dark:hover:text-black rounded-full transition-colors">
                <Play size={20} fill="currentColor" />
              </button>
              <button 
                onClick={() => { setActiveTrack({ title: `AI Gen #${data.id}`, duration: `${duration}s` }); setView('studio'); }}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                Open in Studio <CheckCircle2 size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
