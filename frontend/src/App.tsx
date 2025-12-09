import { Suspense, lazy } from 'react';
import { useStudioStore } from './store/studioStore';
import { StudioLayout } from './layouts/StudioLayout';
import { useTheme } from './hooks/useTheme';

const AudioStage = lazy(() => import('./components/studio/AudioStage').then(m => ({ default: m.AudioStage })));
const Home = lazy(() => import('./pages/Home'));
const Library = lazy(() => import('./pages/Library'));
const Discover = lazy(() => import('./pages/Discover'));
const Generate = lazy(() => import('./pages/Generate'));
const SwipeMode = lazy(() => import('./pages/SwipeMode'));
const Settings = lazy(() => import('./pages/Settings')); // New
const AudioSetupModal = lazy(() => import('./components/modals/AudioSetupModal').then(m => ({ default: m.AudioSetupModal })));
const UpgradeModal = lazy(() => import('./components/modals/UpgradeModal').then(m => ({ default: m.UpgradeModal })));
const MasteringModal = lazy(() => import('./components/modals/MasteringModal').then(m => ({ default: m.MasteringModal })));
const CommandCenter = lazy(() => import('./components/modals/CommandCenter').then(m => ({ default: m.CommandCenter })));
const ShortcutsModal = lazy(() => import('./components/modals/ShortcutsModal').then(m => ({ default: m.ShortcutsModal })));

export default function App() {
  const currentView = useStudioStore((s) => s.currentView);
  useTheme();
  return (
    <>
      <StudioLayout>
        <Suspense fallback={<div className="flex-1 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-500">Loading...</div>}>
          {currentView === 'home' && <Home />}
          {currentView === 'generate' && <Generate />}
          {currentView === 'studio' && <AudioStage />}
          {currentView === 'library' && <Library />}
          {currentView === 'discover' && <Discover />}
          {currentView === 'swipe' && <SwipeMode />}
          {currentView === 'settings' && <Settings />} {/* New Route */}
        </Suspense>
      </StudioLayout>
      <Suspense fallback={null}>
        <AudioSetupModal />
        <UpgradeModal />
        <MasteringModal />
        <CommandCenter />
        <ShortcutsModal />
      </Suspense>
    </>
  );
}
