import React from 'react';
import { UserProfile, UserRole, EPGProgram, Series, SubscriptionPlan, Movie, StreamItem, SubscriptionDuration } from './types';

export const COLORS = {
  primary: '#E50914',
  background: '#0a0a0a',
  surface: '#141414',
  text: '#ffffff',
  textMuted: '#b3b3b3'
};

export const API_CONFIG = {
  BASE_URL: "https://api.unique.tv/v1/",
  TIMEOUT: 30000, 
  CACHE_SIZE: 100 * 1024 * 1024 
};

export const TRIAL_CONFIG = {
  TOTAL_DAYS: 7,
  STORAGE_KEY: "trial_days_remaining"
};

export const PLAYBACK_CONFIG = {
  SPEED_NORMAL: 1.0,
  SPEED_FAST: 1.5,
  SPEED_SLOW: 0.75
};

export const PROFILES: UserProfile[] = [
  { id: '1', name: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', color: 'bg-red-600', role: UserRole.ADMIN, trialDays: 7, isTrialActive: true },
  { id: '2', name: 'Kids', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kids', color: 'bg-blue-500', role: UserRole.USER, trialDays: 7, isTrialActive: true },
  { id: '3', name: 'Guest', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest', color: 'bg-zinc-700', role: UserRole.GUEST, trialDays: 3, isTrialActive: true }
];

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { 
    id: 'p1', 
    name: 'Basic', 
    description: 'Standard viewing for single users', 
    price: 9.99, 
    devices: 1, 
    duration: SubscriptionDuration.MONTHLY, 
    finalPrice: 9.99,
    features: ['HD Quality', '1 Screen', 'Mobile Only', 'Cloud Sync'] 
  },
  { 
    id: 'p2', 
    name: 'Premium', 
    description: 'The ultimate cinematic experience', 
    price: 19.99, 
    devices: 4, 
    duration: SubscriptionDuration.MONTHLY, 
    discountPercent: 15,
    finalPrice: 16.99,
    features: ['4K Ultra HD', '4 Screens', 'TV + Mobile', 'Offline Downloads', 'AI Trailer Synthesis'] 
  },
  { 
    id: 'p3', 
    name: 'Annual Elite', 
    description: 'One year of pure cinema power', 
    price: 199.99, 
    devices: 8, 
    duration: SubscriptionDuration.ANNUAL, 
    discountPercent: 30,
    finalPrice: 139.99,
    features: ['8K Streaming Support', '8 Screens', 'Early Access to Originals', 'Priority AI Rendering'] 
  }
];

export const LIVE_CHANNELS: StreamItem[] = [
  { id: "1", title: "SuperSport Football", category: "Sports", description: "EPL Live Match Coverage", streamUrl: "https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8", thumbnail: "https://i.ibb.co/1L4Q7Zv/abc-news.jpg", isLive: true, isFree: true },
  { id: "2", title: "BBC World News", category: "News", description: "Global Headlines 24/7", streamUrl: "https://f24hls-i.akamaihd.net/hls/live/221147/F24_EN_LO_HLS/master_2000.m3u8", thumbnail: "https://i.ibb.co/LhqZ88D/news.jpg", isLive: true, isFree: true },
  { id: "3", title: "Cartoon Network", category: "Kids", description: "All day animated classics", streamUrl: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master_2000.m3u8", thumbnail: "https://i.ibb.co/mS9R1Rz/kids.jpg", isLive: true, isFree: true },
  { id: "4", title: "Eleph TV Plus", category: "Entertainment", description: "Original Reality Shows", streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", thumbnail: "https://i.ibb.co/XW0X0X0/ent.jpg", isLive: true, isFree: false }
];

export const MOCK_MOVIES: Movie[] = [
  { id: "movie_1", title: "John Wick 4", category: "Action", description: "John Wick uncovers a path to defeating The High Table.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", thumbnail: "https://i.ibb.co/FVMZ8Pq/jw4.jpg", rating: 8.5, duration: "2:49:00", year: 2023 },
  { id: "movie_2", title: "Oppenheimer", category: "Drama", description: "The story of American scientist J. Robert Oppenheimer.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", thumbnail: "https://i.ibb.co/9v0p880/opp.jpg", rating: 8.9, duration: "3:00:00", year: 2023 },
  { id: "movie_3", title: "Spider-Man: Across the Spider-Verse", category: "Animation", description: "Miles Morales catapults across the Multiverse.", streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", thumbnail: "https://i.ibb.co/hZ2v1H0/spiderman.jpg", rating: 9.1, duration: "2:20:00", year: 2023 }
];

export const MOCK_SERIES: Series[] = [
  { id: 'show_1', title: 'The Last of Us', category: 'Popular Series', description: 'After a global pandemic destroys civilization.', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', thumbnail: 'https://i.ibb.co/6y4G1yS/tlou.jpg', rating: 8.8, seasons: 1, year: 2023 },
  { id: 'show_2', title: 'The Promise', category: 'Telenovelas', description: 'A story of love and betrayal across generations.', streamUrl: 'https://bitdash-a.akamaihd.net/s/content/media/tears_of_steel/tears_of_steel.m3u8', thumbnail: 'https://i.ibb.co/0X0X0X0/promise.jpg', rating: 7.5, seasons: 1, year: 2024 }
];

export const MOCK_EPG: EPGProgram[] = LIVE_CHANNELS.map(ch => ({
  id: `epg-${ch.id}`,
  title: `${ch.title} Morning News`,
  start: '08:00',
  end: '12:00',
  channelName: ch.title,
  description: ch.description,
  streamUrl: ch.streamUrl
}));

export const Icons = {
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Tv: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Film: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  ),
  Sports: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Trending: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Mic: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Face: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Play: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  ),
  Pause: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  ),
  Rewind: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/>
    </svg>
  ),
  Forward: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
    </svg>
  ),
  Fullscreen: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  ),
  ArrowBack: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
};