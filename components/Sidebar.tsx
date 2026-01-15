
import React from 'react';
import { NavigationTab } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isOnline: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOnline }) => {
  const mainNavItems = [
    { id: NavigationTab.HOME, icon: Icons.Home, label: 'Home' },
    { id: NavigationTab.LIVE_TV, icon: Icons.Tv, label: 'Live TV' },
    { id: NavigationTab.VOD, icon: Icons.Film, label: 'Movies' },
    { id: NavigationTab.SERIES, icon: Icons.Film, label: 'Series' },
    { id: NavigationTab.KIDS, icon: Icons.Face, label: 'Kids' },
    { id: NavigationTab.VIDEO_LAB, icon: Icons.Camera, label: 'AI Lab' },
    { id: NavigationTab.SPORTS, icon: Icons.Sports, label: 'Sports' },
    { id: NavigationTab.FAVORITES, icon: Icons.Heart, label: 'Favorites' },
    { id: NavigationTab.NEWS, icon: Icons.Trending, label: 'Industry' },
    { id: NavigationTab.AI_SUGGEST, icon: Icons.Sparkles, label: 'AI Curated' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-black/90 backdrop-blur-2xl border-r border-white/5 flex flex-col z-50">
      <div className="p-8 flex items-center gap-4">
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl shadow-2xl shadow-red-900/40 transform hover:rotate-6 transition-transform">U</div>
        <span className="hidden md:block font-black text-xl tracking-tighter uppercase italic">Unique<span className="text-red-600">TV</span></span>
      </div>

      <nav className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
        <p className="hidden md:block px-4 py-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Navigation</p>
        {mainNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative ${
              activeTab === item.id 
                ? 'bg-red-600 text-white shadow-2xl shadow-red-900/40 scale-[1.02]' 
                : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200'
            }`}
          >
            <item.icon />
            <span className="hidden md:block font-bold text-sm tracking-tight">{item.label}</span>
            {activeTab === item.id && (
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto flex flex-col gap-2">
        <button
          onClick={() => setActiveTab(NavigationTab.SETTINGS)}
          className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative ${
            activeTab === NavigationTab.SETTINGS 
              ? 'bg-zinc-800 text-white shadow-xl scale-[1.02]' 
              : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200'
          }`}
        >
          <Icons.Settings />
          <span className="hidden md:block font-bold text-sm tracking-tight">Settings</span>
        </button>

        <div className="hidden md:flex flex-col gap-4 p-5 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md mt-2">
          <div className="flex items-center justify-between">
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">Status</p>
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse' : 'bg-red-600'}`}></div>
          </div>
          <p className="text-[11px] font-bold text-zinc-400">{isOnline ? 'High Speed Core' : 'Offline Mode'}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
