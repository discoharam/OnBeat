import { useState } from 'react';
import { Settings as SettingsIcon, Mic, Speaker, Cpu, Cloud, Shield, CreditCard, ChevronRight, Check } from 'lucide-react';
import { useStudioStore } from '../store/studioStore';

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-10 animate-fade-in">
    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
      {title}
    </h2>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const SettingRow = ({ label, desc, children }: { label: string, desc?: string, children: React.ReactNode }) => (
  <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
    <div className="max-w-md">
      <h3 className="font-bold text-zinc-900 dark:text-zinc-200">{label}</h3>
      {desc && <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{desc}</p>}
    </div>
    <div>{children}</div>
  </div>
);

export default function Settings() {
  const store = useStudioStore();
  const [activeTab, setActiveTab] = useState<'general' | 'audio' | 'ai' | 'account'>('general');

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'audio', label: 'Audio & Devices', icon: Speaker },
    { id: 'ai', label: 'AI & Models', icon: Cpu },
    { id: 'account', label: 'Account & Plan', icon: Shield },
  ];

  return (
    <div className="flex-1 h-full bg-zinc-50 dark:bg-zinc-950 flex flex-col overflow-hidden">
      <div className="flex h-full max-w-7xl mx-auto w-full">
        
        {/* Sidebar */}
        <div className="w-64 p-8 border-r border-zinc-200 dark:border-white/5 hidden md:block">
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-8">Settings</h1>
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg' 
                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          
          {activeTab === 'general' && (
            <Section title="General Preferences">
              <SettingRow label="Appearance" desc="Toggle between dark and light themes.">
                <button 
                  onClick={store.toggleTheme}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-bold flex items-center gap-2"
                >
                  {store.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </button>
              </SettingRow>
              <SettingRow label="Auto-Save Projects" desc="Automatically save your arrangement every 5 minutes.">
                <button 
                  onClick={() => store.setSetting('autoSave', !store.autoSave)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${store.autoSave ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${store.autoSave ? 'left-7' : 'left-1'}`} />
                </button>
              </SettingRow>
              <SettingRow label="Cloud Sync (Coming Soon)" desc="Sync your projects across devices automatically.">
                 <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                    <Cloud size={14} /> Disabled
                 </div>
              </SettingRow>
            </Section>
          )}

          {activeTab === 'audio' && (
            <Section title="Audio Configuration">
              <SettingRow label="Input Device" desc="Select your primary microphone source.">
                <select 
                  value={store.audioInputId}
                  onChange={(e) => store.setSetting('audioInputId', e.target.value)}
                  className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="default">Default System Input</option>
                  <option value="usb-mic">USB Microphone (Generic)</option>
                  <option value="focusrite">Focusrite Scarlett 2i2</option>
                </select>
              </SettingRow>
              <SettingRow label="Buffer Size" desc="Lower values reduce latency but increase CPU load.">
                 <div className="flex gap-2">
                    {[128, 256, 512].map(size => (
                        <button 
                           key={size}
                           onClick={() => store.setSetting('audioBufferSize', size)}
                           className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                               store.audioBufferSize === size 
                               ? 'bg-indigo-600 text-white border-indigo-600' 
                               : 'bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-700'
                           }`}
                        >
                           {size} spls
                        </button>
                    ))}
                 </div>
              </SettingRow>
              <SettingRow label="Input Monitoring" desc="Listen to your input in real-time while recording.">
                <button 
                    onClick={store.toggleMonitoring}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border ${store.monitoring ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-zinc-100 text-zinc-500 border-transparent dark:bg-zinc-800'}`}
                >
                    {store.monitoring ? 'On' : 'Off'}
                </button>
              </SettingRow>
            </Section>
          )}

          {activeTab === 'ai' && (
            <Section title="AI Engine Settings">
               <SettingRow label="Generation Model" desc="Select the model used for generating beats and stems.">
                  <div className="grid gap-2">
                     <button 
                        onClick={() => store.setSetting('aiModelVersion', 'v2_stable')}
                        className={`text-left p-3 rounded-lg border flex items-center justify-between transition-all ${store.aiModelVersion === 'v2_stable' ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30' : 'border-zinc-200 dark:border-zinc-800'}`}
                     >
                        <div>
                            <div className="font-bold text-sm">DiffRhythm 2.0 (Stable)</div>
                            <div className="text-xs text-zinc-500">Best for Lofi, Hip Hop, and Pop.</div>
                        </div>
                        {store.aiModelVersion === 'v2_stable' && <Check size={16} className="text-indigo-500" />}
                     </button>
                     <button 
                        onClick={() => store.setSetting('aiModelVersion', 'v3_beta')}
                        className={`text-left p-3 rounded-lg border flex items-center justify-between transition-all ${store.aiModelVersion === 'v3_beta' ? 'bg-purple-50 border-purple-200 dark:bg-purple-500/10 dark:border-purple-500/30' : 'border-zinc-200 dark:border-zinc-800'}`}
                     >
                        <div>
                            <div className="font-bold text-sm flex items-center gap-2">DiffRhythm 3.0 <span className="text-[10px] bg-purple-500 text-white px-1.5 rounded">BETA</span></div>
                            <div className="text-xs text-zinc-500">Experimental. Higher fidelity, longer gen times.</div>
                        </div>
                        {store.aiModelVersion === 'v3_beta' && <Check size={16} className="text-purple-500" />}
                     </button>
                  </div>
               </SettingRow>
               <SettingRow label="Local Inference" desc="Use your own GPU instead of cloud credits (Requires NVIDIA 3060+).">
                    <button className="text-zinc-400 text-sm font-bold flex items-center gap-1 cursor-not-allowed opacity-50">
                        Unavailable
                    </button>
               </SettingRow>
            </Section>
          )}

          {activeTab === 'account' && (
             <Section title="Account & Plan">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white mb-8 shadow-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-2">Current Plan</div>
                            <h3 className="text-3xl font-extrabold">OnBeat Free</h3>
                            <p className="mt-2 text-indigo-100 max-w-sm text-sm">You are on the free tier. Upgrade to unlock unlimited generations and stem separation.</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                            <Shield size={32} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                        <button onClick={() => store.setModals('upgrade', true)} className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-zinc-100 transition-colors">
                            Upgrade to Pro
                        </button>
                        <button className="px-6 py-3 bg-indigo-800/50 hover:bg-indigo-800 text-white font-bold rounded-xl transition-colors">
                            Manage Billing
                        </button>
                    </div>
                </div>

                <SettingRow label="Email Address">
                    <span className="text-zinc-500 text-sm">user@example.com</span>
                </SettingRow>
                <SettingRow label="Payment Method">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <CreditCard size={16} /> •••• 4242
                    </div>
                </SettingRow>
             </Section>
          )}

        </div>
      </div>
    </div>
  );
}
