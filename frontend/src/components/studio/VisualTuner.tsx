import { useEffect, useState } from 'react';
import { Mic } from 'lucide-react';

export const VisualTuner = ({ active }: { active: boolean }) => {
  const [pitch, setPitch] = useState(0); // -50 to 50 cents
  const [note, setNote] = useState('-');

  useEffect(() => {
    if (!active) {
      setPitch(0);
      setNote('-');
      return;
    }

    // Simulate Tuner Movement
    const interval = setInterval(() => {
      setPitch(Math.random() * 60 - 30);
      const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
      setNote(notes[Math.floor(Math.random() * notes.length)]);
    }, 300);

    return () => clearInterval(interval);
  }, [active]);

  return (
    // Positioned at bottom-44 to sit nicely above the Vocal Chain (which is h-40)
    <div className="absolute bottom-44 right-8 z-20 flex flex-col items-center transition-all duration-500">
      
      {/* Gauge Body */}
      <div className="w-32 h-16 bg-zinc-50/90 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-t-full relative overflow-hidden shadow-2xl">
        {/* Tick Marks */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-between px-4 pb-1">
          <div className="w-[1px] h-2 bg-red-500/50" />
          <div className="w-[1px] h-3 bg-zinc-400/50" />
          <div className="w-[2px] h-4 bg-green-500" /> {/* Center */}
          <div className="w-[1px] h-3 bg-zinc-400/50" />
          <div className="w-[1px] h-2 bg-red-500/50" />
        </div>

        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-12 bg-zinc-800 dark:bg-white origin-bottom rounded-full transition-transform duration-300 ease-out shadow-sm"
          style={{ transform: `translateX(-50%) rotate(${pitch}deg)` }}
        />
      </div>
      
      {/* Note Display Box */}
      <div className="bg-white dark:bg-black/90 border border-zinc-200 dark:border-zinc-800 px-4 py-1 rounded-b-xl flex items-center gap-2 mt-[-1px] shadow-lg">
        <Mic size={12} className={active ? "text-green-500" : "text-zinc-400"} />
        <span className="font-mono font-bold text-lg text-zinc-900 dark:text-white w-6 text-center">{active ? note : '--'}</span>
        <span className="text-[10px] text-zinc-500 font-bold uppercase">Tuner</span>
      </div>
    </div>
  );
};
