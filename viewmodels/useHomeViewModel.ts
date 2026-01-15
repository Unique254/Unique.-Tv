
import { useState, useEffect, useCallback } from 'react';
import { Movie, Series, NavigationTab, NewsItem, SportsEvent, UserProfile } from '../types';
import { MOCK_MOVIES, MOCK_SERIES } from '../constants';
import { di } from '../di/ServiceLocator';
import { SessionManager } from '../utils/sessionManager';

export const useHomeViewModel = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.HOME);
  const [movies, setMovies] = useState<Movie[]>(MOCK_MOVIES);
  const [series] = useState<Series[]>(MOCK_SERIES);
  const [aiMovies, setAiMovies] = useState<Movie[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sports, setSports] = useState<SportsEvent[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [trialDays, setTrialDays] = useState(SessionManager.getTrialDays());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    di.api.getFavorites().then(setFavorites);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadNews = useCallback(async () => {
    setIsAiLoading(true);
    try {
      const latestNews = await di.gemini.getLatestMovieNews();
      setNews(latestNews);
    } catch (err) { console.error(err); } finally { setIsAiLoading(false); }
  }, []);

  const loadSports = useCallback(async () => {
    setIsAiLoading(true);
    try {
      const updates = await di.gemini.getSportsUpdates();
      setSports(updates);
    } catch (err) { console.error(err); } finally { setIsAiLoading(false); }
  }, []);

  const handleAiRecommendation = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setIsAiLoading(true);
    try {
      const recommendations = await di.gemini.getAiRecommendations(query);
      setAiMovies(recommendations);
      setActiveTab(NavigationTab.AI_SUGGEST);
    } catch (err) { console.error(err); } finally { setIsAiLoading(false); }
  }, []);

  const handleGenerateTrailer = async (id: string) => {
    if (!(window as any).aistudio?.hasSelectedApiKey()) {
      await (window as any).aistudio?.openSelectKey();
    }
    const movie = [...movies, ...aiMovies].find(m => m.id === id);
    if (!movie) return;

    setMovies(prev => prev.map(m => m.id === id ? { ...m, isGeneratingTrailer: true } : m));
    setAiMovies(prev => prev.map(m => m.id === id ? { ...m, isGeneratingTrailer: true } : m));

    try {
      const trailerUrl = await di.gemini.generateTrailer(movie.title);
      const update = (m: Movie) => m.id === id ? { ...m, trailerUrl, isGeneratingTrailer: false } : m;
      setMovies(prev => prev.map(update));
      setAiMovies(prev => prev.map(update));
    } catch (err) {
      const reset = (m: Movie) => m.id === id ? { ...m, isGeneratingTrailer: false } : m;
      setMovies(prev => prev.map(reset));
      setAiMovies(prev => prev.map(reset));
    }
  };

  const handleExtendTrial = () => {
    SessionManager.extendTrial(4);
    setTrialDays(4);
  };

  const toggleFavorite = async (id: string) => {
    if (favorites.includes(id)) {
      await di.api.removeFromFavorites(id);
      setFavorites(prev => prev.filter(f => f !== id));
    } else {
      await di.api.addToFavorites(id);
      setFavorites(prev => [...prev, id]);
    }
  };

  return {
    activeTab, setActiveTab,
    movies, series, aiMovies, news, sports, favorites,
    searchQuery, setSearchQuery,
    isAiLoading, isOnline, trialDays, setTrialDays,
    loadNews, loadSports,
    handleAiRecommendation, handleGenerateTrailer, toggleFavorite, handleExtendTrial
  };
};
