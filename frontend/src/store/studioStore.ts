import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type VocalPreset = 'clean' | 'trap' | 'vintage' | 'stadium';
export type ViewState = 'home' | 'generate' | 'studio' | 'library' | 'discover' | 'swipe' | 'settings'; // Added 'settings'
export type Theme = 'dark' | 'light';
export type BlockType = 'Intro' | 'Verse' | 'Chorus' | 'Bridge' | 'Outro';
export type ModalType = 'setup' | 'upgrade' | 'mastering' | 'command' | 'shortcuts';

export interface TrackData { id?: string; title: string; duration: string; artist?: string; cover?: string; date?: string; bpm?: string; keySig?: string; fileUrl?: string; }
export interface SongBlock { id: string; type: BlockType; color: string; width: number; }
export interface Arrangement { id: string; name: string; blocks: SongBlock[]; }
export interface SessionTrack { id: string; title: string; type: 'beat' | 'vocal'; fileUrl: string | null; vol: number; pan: number; muted: boolean; solo: boolean; }

// Settings State Interface
interface SettingsState {
  audioBufferSize: number;
  audioInputId: string;
  aiModelVersion: string;
  autoSave: boolean;
  cloudSync: boolean;
  setSetting: (key: keyof SettingsState, value: any) => void;
}

interface StudioState extends SettingsState {
  theme: Theme; toggleTheme: () => void;
  currentView: ViewState; setView: (view: ViewState) => void;
  activeTrack: TrackData | null; setActiveTrack: (track: TrackData | null) => void;
  isPlaying: boolean; togglePlay: () => void;
  isRecording: boolean; activeInput: string | null; metronome: boolean; monitoring: boolean; countIn: boolean;
  
  userLibrary: TrackData[]; addToLibrary: (track: TrackData) => void; removeFromLibrary: (title: string) => void;
  
  songBlocks: SongBlock[]; addBlock: (type: BlockType) => void; removeBlock: (id: string) => void; resizeBlock: (id: string, newWidth: number) => void;
  savedArrangements: Arrangement[]; saveArrangement: (name: string) => void; loadArrangement: (id: string) => void; deleteArrangement: (id: string) => void;
  
  sessionTracks: SessionTrack[]; addSessionTrack: (type: 'beat' | 'vocal') => void; removeSessionTrack: (id: string) => void; updateSessionTrack: (id: string, updates: Partial<SessionTrack>) => void; importAudioToTrack: (id: string, file: File) => void;

  showAudioSetup: boolean; showUpgrade: boolean; showMastering: boolean; showCommand: boolean; showShortcuts: boolean; showConsole: boolean; 
  showArrangement: boolean; showVocalChain: boolean;
  activePreset: VocalPreset; showLyrics: boolean; lyrics: string;
  
  toggleRecord: () => void; setInput: (id: string) => void; toggleMetronome: () => void; toggleMonitoring: () => void; toggleCountIn: () => void;
  setModals: (modal: ModalType, open: boolean) => void; setPreset: (preset: VocalPreset) => void; toggleLyrics: () => void; setLyrics: (text: string) => void; 
  toggleConsole: () => void; toggleArrangement: () => void; toggleVocalChain: () => void;
  
  hasBuffer: boolean; activateBuffer: () => void; dumpBuffer: () => void;
}

const INITIAL_TRACKS: SessionTrack[] = [
  { id: 't1', title: 'Audio 1', type: 'beat', fileUrl: null, vol: 75, pan: 50, muted: false, solo: false },
  { id: 't2', title: 'Vocals 1', type: 'vocal', fileUrl: null, vol: 75, pan: 50, muted: false, solo: false },
];

export const useStudioStore = create<StudioState>()(
  persist(
    (set) => ({
      // -- Settings Defaults --
      audioBufferSize: 256,
      audioInputId: 'default',
      aiModelVersion: 'v2_stable',
      autoSave: true,
      cloudSync: false,
      setSetting: (key, value) => set({ [key]: value }),

      // -- Core State --
      theme: 'dark', toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      currentView: 'home', setView: (view) => set({ currentView: view }),
      activeTrack: null, setActiveTrack: (track) => set({ activeTrack: track, isPlaying: true }),
      isRecording: false, isPlaying: false, activeInput: 'Default Input', metronome: false, monitoring: false, countIn: true,
      
      userLibrary: [],
      addToLibrary: (track) => set((s) => ({ userLibrary: [track, ...s.userLibrary] })),
      removeFromLibrary: (title) => set((s) => ({ userLibrary: s.userLibrary.filter(t => t.title !== title) })),
      
      songBlocks: [],
      addBlock: (type) => set((s) => {
        const colors: Record<BlockType, string> = { Intro: 'bg-blue-500', Verse: 'bg-indigo-500', Chorus: 'bg-pink-500', Bridge: 'bg-orange-500', Outro: 'bg-purple-500' };
        return { songBlocks: [...s.songBlocks, { id: Math.random().toString(36), type, color: colors[type], width: 15 }] };
      }),
      removeBlock: (id) => set((s) => ({ songBlocks: s.songBlocks.filter(b => b.id !== id) })),
      resizeBlock: (id, newWidth) => set((s) => ({ songBlocks: s.songBlocks.map(b => b.id === id ? { ...b, width: Math.max(5, newWidth) } : b) })),
      
      savedArrangements: [],
      saveArrangement: (name) => set((s) => ({ savedArrangements: [...s.savedArrangements, { id: Math.random().toString(36), name, blocks: s.songBlocks }] })),
      loadArrangement: (id) => set((s) => { const arrangement = s.savedArrangements.find(a => a.id === id); return arrangement ? { songBlocks: arrangement.blocks } : {}; }),
      deleteArrangement: (id) => set((s) => ({ savedArrangements: s.savedArrangements.filter(a => a.id !== id) })),
      
      sessionTracks: INITIAL_TRACKS,
      addSessionTrack: (type) => set((s) => ({ 
        sessionTracks: [...s.sessionTracks, { 
          id: Math.random().toString(36), 
          title: type === 'beat' ? `Audio ${s.sessionTracks.length + 1}` : `Vocals ${s.sessionTracks.length + 1}`, 
          type, fileUrl: null, vol: 75, pan: 50, muted: false, solo: false 
        }] 
      })),
      removeSessionTrack: (id) => set((s) => ({ sessionTracks: s.sessionTracks.filter(t => t.id !== id) })),
      updateSessionTrack: (id, updates) => set((s) => ({ sessionTracks: s.sessionTracks.map(t => t.id === id ? { ...t, ...updates } : t) })),
      importAudioToTrack: (id, file) => set((s) => ({
        sessionTracks: s.sessionTracks.map(t => t.id === id ? { ...t, fileUrl: URL.createObjectURL(file), title: file.name.replace(/\.[^/.]+$/, "") } : t)
      })),

      showAudioSetup: false, showUpgrade: false, showMastering: false, showCommand: false, showShortcuts: false, showConsole: false, 
      showArrangement: true, showVocalChain: true,
      activePreset: 'clean', showLyrics: false, lyrics: "Yeah, uh...\n(Write your lyrics here...)",
      
      toggleRecord: () => set((state) => ({ isRecording: !state.isRecording })),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setInput: (id) => set({ activeInput: id }),
      toggleMetronome: () => set((s) => ({ metronome: !s.metronome })),
      toggleMonitoring: () => set((s) => ({ monitoring: !s.monitoring })),
      toggleCountIn: () => set((s) => ({ countIn: !s.countIn })),
      setModals: (modal, open) => set((state) => ({ 
        showAudioSetup: modal === 'setup' ? open : state.showAudioSetup, 
        showUpgrade: modal === 'upgrade' ? open : state.showUpgrade, 
        showMastering: modal === 'mastering' ? open : state.showMastering,
        showCommand: modal === 'command' ? open : state.showCommand,
        showShortcuts: modal === 'shortcuts' ? open : state.showShortcuts
      })),
      setPreset: (preset) => set({ activePreset: preset }),
      toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics })),
      setLyrics: (text) => set({ lyrics: text }),
      toggleConsole: () => set((state) => ({ showConsole: !state.showConsole })),
      toggleArrangement: () => set((state) => ({ showArrangement: !state.showArrangement })),
      toggleVocalChain: () => set((state) => ({ showVocalChain: !state.showVocalChain })),
      
      hasBuffer: true, activateBuffer: () => set({ hasBuffer: true }), dumpBuffer: () => alert("✨ Recovered last 30s of audio!"),
    }),
    { name: 'onbeat-storage', partialize: (state) => ({ 
        theme: state.theme, 
        sessionTracks: state.sessionTracks, 
        songBlocks: state.songBlocks, 
        savedArrangements: state.savedArrangements, 
        userLibrary: state.userLibrary,
        showArrangement: state.showArrangement,
        showVocalChain: state.showVocalChain,
        // Persist Settings
        audioBufferSize: state.audioBufferSize,
        aiModelVersion: state.aiModelVersion,
        autoSave: state.autoSave
    }) }
  )
);
