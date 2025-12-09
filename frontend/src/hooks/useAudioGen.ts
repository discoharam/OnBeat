import { useState } from 'react';
import { generateTrack } from '../services/api';

export const useAudioGen = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async (prompt: string) => {
    if(!prompt) return;
    setLoading(true); setError(null); setData(null);
    try {
      const res = await generateTrack(prompt);
      setData(res);
    } catch (err) {
      setError("Failed to generate track. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, data, error };
};
