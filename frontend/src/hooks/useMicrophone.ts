import { useState, useEffect, useRef } from 'react';

export const useMicrophone = (isActive: boolean) => {
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isActive) {
      cleanup();
      return;
    }

    const initMic = async () => {
      try {
        // 1. Request Microphone Access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        // 2. Setup Audio Context
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        // 3. Create Analyzer
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256; // Smaller size = faster performance
        analyserRef.current = analyser;

        // 4. Connect Source -> Analyzer
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceRef.current = source;

        // 5. Animation Loop
        const updateLevel = () => {
          if (!analyser) return;
          
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(dataArray);

          // Calculate average volume
          const sum = dataArray.reduce((a, b) => a + b, 0);
          const avg = sum / dataArray.length;
          
          // Normalize to 0-100 range (multiplying by 1.5 to make it more sensitive)
          setLevel(Math.min(100, avg * 1.5));
          
          rafRef.current = requestAnimationFrame(updateLevel);
        };

        updateLevel();

      } catch (err) {
        console.error("Microphone Access Denied:", err);
        setError("Permission Denied");
      }
    };

    initMic();

    return () => cleanup();
  }, [isActive]);

  const cleanup = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (sourceRef.current) sourceRef.current.disconnect();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    
    setLevel(0);
  };

  return { level, error };
};
