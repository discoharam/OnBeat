import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Headphones, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { useMicrophone } from '../../hooks/useMicrophone'; // Import the new hook

export const AudioSetupModal = () => {
  const { showAudioSetup, setModals, activeInput, setInput } = useStudioStore();
  
  // CONNECT THE REAL MICROPHONE
  // Only activate the hook when the modal is actually open to save battery
  const { level, error } = useMicrophone(showAudioSetup);

  if (!showAudioSetup) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setModals('setup', false)}
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Audio Configuration</h2>
              <p className="text-sm text-zinc-400">Select your input source to begin.</p>
            </div>
            <button onClick={() => setModals('setup', false)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            
            {/* Input Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Microphone Input</label>
              <div className="grid gap-3">
                {['Default Microphone', 'Focusrite USB Audio', 'External USB Mic'].map((device) => (
                  <button
                    key={device}
                    onClick={() => setInput(device)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      activeInput === device 
                        ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-200' 
                        : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Mic size={18} />
                      <span className="font-medium">{device}</span>
                    </div>
                    {activeInput === device && <CheckCircle2 size={18} className="text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* REAL HARDWARE CHECK */}
            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 flex items-center gap-4">
              <div className={`p-3 rounded-full ${error ? 'bg-red-500/20 text-red-500' : 'bg-zinc-900 text-green-500'}`}>
                {error ? <AlertCircle size={20} /> : <Headphones size={20} />}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs text-zinc-400 uppercase font-bold">
                  <span>{error ? "No Signal" : "Input Level"}</span>
                  <span>{error ? "Check Perms" : `${Math.round(level)}%`}</span>
                </div>
                
                {/* DYNAMIC VU METER */}
                <div className="flex gap-1 h-3">
                  {[...Array(30)].map((_, i) => {
                    // Map index 0-30 to a percentage 0-100
                    const threshold = (i / 30) * 100;
                    const isActive = level > threshold;
                    
                    // Color Logic: Green -> Yellow -> Red
                    let barColor = 'bg-zinc-800'; // Inactive
                    if (isActive) {
                        if (i > 24) barColor = 'bg-red-500'; // Peak
                        else if (i > 18) barColor = 'bg-yellow-500'; // Warning
                        else barColor = 'bg-green-500'; // Good
                    }

                    return (
                      <div 
                        key={i}
                        className={`flex-1 rounded-[1px] transition-colors duration-75 ${barColor}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          <div className="p-6 pt-0">
            <button 
              onClick={() => setModals('setup', false)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/20"
            >
              Confirm Setup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
