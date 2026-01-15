import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import VideoCard from './components/VideoCard';
import Player from './components/Player';
import LiveSession from './components/LiveSession';
import ProfileSelector from './components/ProfileSelector';
import LoginView from './components/LoginView';
import EPGView from './components/EPGView';
import SubscriptionView from './components/SubscriptionView';
import SettingsView from './components/SettingsView';
import VideoLabView from './components/VideoLabView';
import { Movie, NavigationTab, UserProfile, EPGProgram } from './types';
import { Icons, LIVE_CHANNELS, MOCK_MOVIES, MOCK_SERIES } from './constants';
import { SessionManager } from './utils/sessionManager';
import { useHomeViewModel } from './viewmodels/useHomeViewModel';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(SessionManager.getProfile());
  const [selectedContent, setSelectedContent] = useState<Movie | EPGProgram | null>(null);
  const [showLiveSearch, setShowLiveSearch] = useState(false);

  const vm = useHomeViewModel();

  const handleProfileSelect = (profile: UserProfile) => {
    SessionManager.setProfile(profile);
    setSelectedProfile(profile);
    vm.setTrialDays(SessionManager.getTrialDays());
  };

  const handlePlayAll = () => {
    const allContent = [...LIVE_CHANNELS, ...vm.movies] as any[];
    if (allContent.length > 0) {
      const firstItem = allContent[0];
      setSelectedContent({
        ...firstItem,
        id: firstItem.id,
        title: firstItem.title,
        description: firstItem.description,
        streamUrl: firstItem.streamUrl,
        category: firstItem.category || 'Featured'
      } as any);
    }
  };

  const getCategorizedContent = () => {
    const featured = [...vm.movies.slice(0, 3), ...vm.series.slice(0, 2)] as unknown as Movie[];
    const live = LIVE_CHANNELS.map(ch => ({
      id: ch.id,
      title: ch.title,
      description: ch.description,
      thumbnail: ch.thumbnail,
      category: ch.category,
      rating: 5.0,
      duration: 'LIVE',
      year: 2024,
      streamUrl: ch.streamUrl,
      isLive: true
    })) as Movie[];
    
    const free = [...vm.movies, ...vm.series].filter(m => (m as any).isFree !== false) as unknown as Movie[];
    const moviesList = vm.movies;
    const seriesList = vm.series as unknown as Movie[];
    const kids = vm.movies.filter(m => m.category === 'Animation' || m.category === 'Kids') as Movie[];

    return { featured, live, free, moviesList, seriesList, kids };
  };

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  if (!selectedProfile) {
    return <ProfileSelector onSelect={handleProfileSelect} />;
  }

  const { featured, live, free, moviesList, seriesList, kids } = getCategorizedContent();

  const renderContentRow = (title: string, subtitle: string, items: Movie[], tab?: NavigationTab) => (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest italic">{title} <span className="text-red-600">{subtitle}</span></h2>
        </div>
        {tab && (
          <button onClick={() => vm.setActiveTab(tab)} className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">See All</button>
        )}
      </div>
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2 snap-x">
        {items.map(movie => (
          <div key={movie.id} className="min-w-[280px] md:min-w-[320px] snap-start">
            <VideoCard 
              movie={movie} 
              onClick={setSelectedContent} 
              onToggleFavorite={vm.toggleFavorite} 
              isFavorite={vm.favorites.includes(movie.id)} 
            />
          </div>
        ))}
      </div>
    </section>
  );

  const renderHome = () => {
    const heroContent = featured[0];
    return (
      <div className="space-y-16 animate-in fade-in duration-1000">
        {heroContent && (
          <div className="relative h-[65vh] rounded-[48px] overflow-hidden border border-white/5 shadow-2xl group">
            <img src={heroContent.thumbnail} alt={heroContent.title} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-10000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-12 flex flex-col justify-end">
              <div className="max-w-2xl space-y-6">
                <div className="flex items-center gap-3">
                   <span className="px-3 py-1 bg-red-600 rounded text-[10px] font-black uppercase tracking-widest">Featured Picks</span>
                   <span className="text-zinc-400 text-xs font-bold">{heroContent.year} • {heroContent.category}</span>
                </div>
                <h1 className="text-6xl font-black tracking-tighter leading-tight uppercase italic">{heroContent.title}</h1>
                <p className="text-zinc-300 text-lg font-medium leading-relaxed line-clamp-2">{heroContent.description}</p>
                <div className="flex items-center gap-4 pt-4">
                  <button 
                    onClick={() => setSelectedContent(heroContent)}
                    className="px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl"
                  >
                    <Icons.Play />
                    Play Now
                  </button>
                  <button 
                    onClick={() => vm.toggleFavorite(heroContent.id)}
                    className="px-6 py-5 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
                  >
                    {vm.favorites.includes(heroContent.id) ? 'Saved to List' : '+ My List'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-16">
          {renderContentRow("Featured", "Picks", featured, NavigationTab.VOD)}
          {renderContentRow("Live", "Broadcasts", live, NavigationTab.LIVE_TV)}
          {renderContentRow("Free", "Collection", free)}
          {renderContentRow("Trending", "Movies", moviesList, NavigationTab.VOD)}
          {renderContentRow("Popular", "Series", seriesList, NavigationTab.SERIES)}
          {renderContentRow("Kids", "Animation", kids, NavigationTab.KIDS)}
        </div>
      </div>
    );
  };

  const renderContentGrid = () => {
    let content: Movie[] = [];
    
    switch(vm.activeTab) {
      case NavigationTab.FAVORITES:
        content = [...vm.movies, ...vm.series].filter(m => vm.favorites.includes(m.id)) as unknown as Movie[];
        break;
      case NavigationTab.VOD:
        content = vm.movies;
        break;
      case NavigationTab.SERIES:
        content = vm.series as unknown as Movie[];
        break;
      case NavigationTab.KIDS:
        content = vm.movies.filter(m => m.category === 'Animation' || m.category === 'Kids');
        break;
      case NavigationTab.AI_SUGGEST:
        content = vm.aiMovies;
        break;
      default:
        content = vm.movies;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
        {content.map(movie => (
          <VideoCard 
            key={movie.id} 
            movie={movie} 
            onClick={setSelectedContent} 
            onGenerateTrailer={vm.handleGenerateTrailer}
            onToggleFavorite={vm.toggleFavorite}
            isFavorite={vm.favorites.includes(movie.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`flex min-h-screen bg-black text-white selection:bg-red-500/30 ${!vm.isOnline ? 'offline' : ''}`}>
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,255,0,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      <Sidebar activeTab={vm.activeTab} setActiveTab={vm.setActiveTab} isOnline={vm.isOnline} />

      <main className="flex-1 ml-20 md:ml-64 p-6 md:p-12 pb-24 max-w-7xl mx-auto overflow-x-hidden">
        {vm.trialDays > 0 && vm.activeTab !== NavigationTab.SETTINGS && (
          <div className="mb-10 p-8 bg-gradient-to-r from-red-600/20 via-zinc-900/40 to-zinc-900/40 border-l-4 border-red-600 rounded-r-[32px] flex flex-col md:flex-row items-center justify-between gap-8 group animate-in slide-in-from-top duration-1000 shadow-2xl backdrop-blur-md border border-white/5">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-red-900/40 text-2xl">{vm.trialDays}</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 mb-1 italic">Premium Trial: Active</p>
                <p className="text-xl font-black text-white tracking-tight uppercase">Unlock Your Cinema Potential</p>
                <p className="text-zinc-400 text-sm font-medium">Enjoy unlimited global channels and 4K VOD assets today.</p>
                
                <button 
                  id="btnPlayAll"
                  onClick={handlePlayAll}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 active:scale-95 shadow-lg"
                >
                  <Icons.Play />
                  Play All Content
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button 
                onClick={vm.handleExtendTrial}
                className="px-10 py-4 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 border border-white/10"
              >
                Claim 4 Days Free
              </button>
              <button 
                onClick={() => vm.setActiveTab(NavigationTab.SPORTS)}
                className="px-10 py-4 bg-zinc-800 text-white hover:bg-zinc-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 border border-white/5"
              >
                Check VIP Plans
              </button>
            </div>
          </div>
        )}

        {vm.activeTab === NavigationTab.HOME && renderHome()}
        {vm.activeTab === NavigationTab.LIVE_TV && <EPGView onSelectProgram={(prog) => setSelectedContent(prog)} />}
        {vm.activeTab === NavigationTab.SETTINGS && <SettingsView profile={selectedProfile} />}
        {vm.activeTab === NavigationTab.VIDEO_LAB && <VideoLabView />}
        {vm.activeTab === NavigationTab.SPORTS && <SubscriptionView />}
        
        {[NavigationTab.VOD, NavigationTab.SERIES, NavigationTab.KIDS, NavigationTab.FAVORITES, NavigationTab.AI_SUGGEST].includes(vm.activeTab) && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">
              {vm.activeTab === NavigationTab.FAVORITES && "Your Saved List"}
              {vm.activeTab === NavigationTab.VOD && "Cinema Catalog"}
              {vm.activeTab === NavigationTab.SERIES && "Popular TV Shows"}
              {vm.activeTab === NavigationTab.KIDS && "Animation Station"}
              {vm.activeTab === NavigationTab.AI_SUGGEST && "Neural Recommendations"}
            </h2>
            {renderContentGrid()}
          </div>
        )}
      </main>

      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-[100]">
        <button 
          onClick={() => setShowLiveSearch(true)}
          className="w-16 h-16 bg-red-600 text-white rounded-2xl shadow-2xl shadow-red-900/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all border border-red-500"
        >
          <Icons.Mic />
        </button>
      </div>

      {showLiveSearch && (
        <LiveSession 
          onClose={() => setShowLiveSearch(false)} 
          onSearchRequest={(q) => {
            vm.handleAiRecommendation(q);
            setShowLiveSearch(false);
          }}
        />
      )}

      {selectedContent && (
        <Player content={selectedContent} onClose={() => setSelectedContent(null)} />
      )}
    </div>
  );
};

export default App;