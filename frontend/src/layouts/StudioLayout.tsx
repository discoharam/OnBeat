import { ReactNode } from 'react';
import { 
  LayoutGrid, Sparkles, Compass, Disc3, FolderOpen, 
  Settings, Zap, HelpCircle 
} from 'lucide-react';
import { useStudioStore } from '../store/studioStore';
import type { ViewState } from '../store/studioStore';
import { clsx } from 'clsx';
import { PlaybackBar } from '../components/ui/PlaybackBar';

const NavItem = ({ icon: Icon, label, view, active }: { icon: any, label: string, view?: ViewState, active: boolean }) => {
  const { setView } = useStudioStore();
  
  return (
    <button 
      onClick={() => view && setView(view)}
      className="group relative w-full flex items-center justify-center py-2"
    >
      <div className={clsx(
        "absolute w-10 h-10 rounded-xl transition-all duration-200 ease-out",
        active 
          ? "bg-zinc-100 dark:bg-white/10" 
          : "bg-transparent group-hover:bg-zinc-50 dark:group-hover:bg-white/5"
      )} />
      <div className={clsx(
        "relative z-10 transition-colors duration-200",
        active 
          ? "text-indigo-600 dark:text-white" 
          : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
      )}>
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      </div>
      <div className="absolute left-14 px-3 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-md opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-white/10">
        {label}
      </div>
    </button>
  );
};

export const StudioLayout = ({ children }: { children: ReactNode }) => {
  const { setModals, currentView, setView } = useStudioStore();
  
  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden font-sans selection:bg-indigo-500/30 transition-colors duration-300">
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR */}
        <nav className="w-[80px] border-r border-transparent bg-white dark:bg-[#09090b] flex flex-col items-center py-6 z-20 transition-colors duration-300 shrink-0">
          <div className="mb-8 cursor-pointer hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="OnBeat" className="w-16 h-16 object-contain drop-shadow-md" />
          </div>
          
          <div className="flex-1 w-full space-y-3 flex flex-col items-center justify-center">
            <NavItem icon={LayoutGrid} label="Dashboard" view="home" active={currentView === 'home'} />
            <NavItem icon={Sparkles} label="AI Generator" view="generate" active={currentView === 'generate'} />
            <NavItem icon={Compass} label="Discover" view="discover" active={currentView === 'discover'} />
            <div className="w-8 h-[1px] bg-zinc-100 dark:bg-white/5 rounded-full my-1" />
            <NavItem icon={Disc3} label="Studio" view="studio" active={currentView === 'studio'} />
            <NavItem icon={FolderOpen} label="Library" view="library" active={currentView === 'library'} />
          </div>

          <div className="w-full space-y-3 flex flex-col items-center mb-2">
            <button onClick={() => setModals('shortcuts', true)} className="p-2.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl" title="Shortcuts">
               <HelpCircle size={20} />
            </button>
            
            <button onClick={() => setModals('upgrade', true)} className="p-2.5 rounded-xl bg-gradient-to-tr from-yellow-400/10 to-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300" title="Upgrade">
              <Zap size={20} fill="currentColor" />
            </button>
            
            <button 
              onClick={() => setView('settings')}
              className={`p-2.5 transition-colors hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl ${currentView === 'settings' ? 'text-indigo-600 dark:text-white bg-zinc-100 dark:bg-white/10' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </nav>

        <main className="flex-1 flex flex-col relative overflow-hidden bg-zinc-50 dark:bg-black transition-colors duration-300">
          {children}
          {currentView !== 'studio' && currentView !== 'settings' && <PlaybackBar />}
        </main>
      </div>
    </div>
  );
};
