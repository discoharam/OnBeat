import { useEffect } from 'react';
import { useStudioStore } from '../store/studioStore';

export const useTheme = () => {
  const theme = useStudioStore((s) => s.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old class
    root.classList.remove('light', 'dark');
    
    // Add new class
    root.classList.add(theme);
    
    // Update color scheme for browser UI (scrollbars, etc)
    root.style.colorScheme = theme;
  }, [theme]);
};
