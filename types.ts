export interface StreamItem {
  id: string;
  title: string;
  category: string;
  description: string;
  streamUrl: string;
  thumbnail: string;
  isLive: boolean;
  isFree: boolean;
  duration?: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  rating: number;
  duration: string;
  year: number;
  streamUrl?: string;
  trailerUrl?: string;
  isGeneratingTrailer?: boolean;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  rating: number;
  seasons: number;
  year: number;
  streamUrl?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: UserRole;
  trialDays: number;
  isTrialActive: boolean;
}

export enum SubscriptionDuration {
  MONTHLY = "Monthly",
  QUARTERLY = "Quarterly",
  BIANNUAL = "6 Months",
  ANNUAL = "Yearly"
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  devices: number;
  duration: SubscriptionDuration;
  discountPercent?: number;
  finalPrice: number;
  features: string[];
}

export interface UserSubscription {
  userId: string;
  planId: string;
  planName: string;
  devices: number;
  deviceIds: string[];
  startDate: number;
  endDate: number;
  isActive: boolean;
  paymentMethod: string;
  transactionId: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message?: string;
  subscription?: UserSubscription;
}

export enum NavigationTab {
  HOME = 'home',
  LIVE_TV = 'live_tv',
  VOD = 'vod',
  SERIES = 'series',
  KIDS = 'kids',
  SPORTS = 'sports',
  NEWS = 'news',
  FAVORITES = 'favorites',
  AI_SUGGEST = 'ai_suggest',
  SETTINGS = 'settings',
  VIDEO_LAB = 'video_lab'
}

export interface EPGProgram {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  channelName: string;
  streamUrl?: string;
}

export interface SportsEvent {
  title: string;
  status: string;
  score?: string;
  time: string;
  league: string;
}

export interface NewsItem {
  title: string;
  snippet: string;
  url: string;
  source: string;
}