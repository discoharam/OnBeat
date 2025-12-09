import { useState, useEffect, useRef } from 'react';
import { StudioLayout } from '../layouts/StudioLayout';
import { useAudioGen } from '../hooks/useAudioGen';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getHistory } from '../services/api';

export default function Studio() {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const { generate, loading, data, error } = useAudioGen();
  
  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Poll history every 5 seconds to check for completed jobs
  useEffect(() => {
    const fetchHistory = () => getHistory().then(setHistory);
    fetchHistory(); // Initial load
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, [data]);

  // Handle Play Logic
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack;
      audioRef.current.play();
    }
  }, [currentTrack]);

  return (
    <StudioLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Create AI Music
          </h1>
          <p className="text-gray-400">Describe your sound. DiffRhythm2 will generate it.</p>
        </div>

        {/* GENERATION FORM */}
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <Input 
            placeholder="E.g. Lo-fi hip hop beat with rainy ambiance..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generate(prompt)}
          />
          <Button onClick={() => generate(prompt)} loading={loading} className="w-full">
            {loading ? "Sending to AI..." : "Generate Track"}
          </Button>
          
          {error && <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}
        </div>

        {/* SUCCESS MESSAGE */}
        {data && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between animate-fade-in">
            <div>
              <h3 className="text-green-400 font-bold text-sm">✅ Request Sent</h3>
              <p className="text-xs text-gray-400">ID: {data.id} • Status: {data.status}</p>
            </div>
            <div className="text-xs bg-green-500/20 px-2 py-1 rounded text-green-300 animate-pulse">
              Processing...
            </div>
          </div>
        )}

        {/* AUDIO PLAYER (Hidden unless playing) */}
        <audio ref={audioRef} controls className="fixed bottom-0 left-0 w-full bg-[#1a1d2d] border-t border-white/10 p-4" style={{ display: currentTrack ? 'block' : 'none' }} />

        {/* HISTORY LIST */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-300">Recent Projects</h2>
          
          {history.length === 0 && <p className="text-gray-500 text-center text-sm">No tracks yet.</p>}

          {history.map((song) => (
            <div key={song.id} className="group flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-white/5 hover:border-indigo-500/50 transition-all">
              <div className="flex-1">
                <div className="font-medium text-white flex items-center gap-2">
                  {song.prompt}
                  {song.status === 'completed' && <span className="w-2 h-2 rounded-full bg-green-400"></span>}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(song.created_at).toLocaleString()} • {song.duration}s
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded capitalize font-mono ${
                  song.status === 'completed' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'
                }`}>
                  {song.status}
                </span>

                {song.status === 'completed' && song.file_url && (
                  <button 
                    onClick={() => setCurrentTrack(song.file_url)}
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-all transform hover:scale-105"
                  >
                    ▶
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </StudioLayout>
  );
}
