import { useEffect, useRef } from 'react';
import { useStudioStore } from '../store/studioStore';

export const useAudioEngine = () => {
  const isPlaying = useStudioStore((s) => s.isPlaying);
  const isRecording = useStudioStore((s) => s.isRecording);
  
  // Audio Context Reference
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on first interaction
    if ((isPlaying || isRecording) && !audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;

    if (ctx) {
      if (isPlaying || isRecording) {
        if (ctx.state === 'suspended') ctx.resume();
        console.log("🔊 Audio Engine: Started");
      } else {
        if (ctx.state === 'running') ctx.suspend();
        console.log("🔇 Audio Engine: Paused");
      }
    }

    return () => {
      // Cleanup logic if needed
    };
  }, [isPlaying, isRecording]);

  return { audioContext: audioContextRef.current };
};
