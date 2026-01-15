
import { API_CONFIG } from '../constants';
// Updated to use StreamItem as Channel is not defined in types.ts
import { Movie, Series, StreamItem, EPGProgram, SubscriptionPlan } from '../types';

/**
 * ApiService: Web implementation of the Android Retrofit ApiService.
 * Handles network requests to the Unique TV backend.
 */
export class ApiService {
  private baseUrl = API_CONFIG.BASE_URL;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(request: any): Promise<any> {
    return this.request('auth/login', { method: 'POST', body: JSON.stringify(request) });
  }

  // Content
  // Replaced Channel with StreamItem
  async getChannels(): Promise<StreamItem[]> {
    return this.request('channels');
  }

  // Replaced Channel with StreamItem
  async getChannelsByCategory(category: string): Promise<StreamItem[]> {
    return this.request(`channels/${category}`);
  }

  async getMovies(): Promise<Movie[]> {
    return this.request('movies');
  }

  async getMovieDetails(id: string): Promise<Movie> {
    return this.request(`movies/${id}`);
  }

  async getSeries(): Promise<Series[]> {
    return this.request('series');
  }

  async getEPG(channelId: string): Promise<EPGProgram[]> {
    return this.request(`epg/${channelId}`);
  }

  // User Data (Syncing with LocalStorage for offline-first behavior)
  async getFavorites(): Promise<string[]> {
    const favorites = localStorage.getItem('user_favorites');
    return favorites ? JSON.parse(favorites) : [];
  }

  async addToFavorites(id: string): Promise<void> {
    const favorites = await this.getFavorites();
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem('user_favorites', JSON.stringify(favorites));
    }
  }

  async removeFromFavorites(id: string): Promise<void> {
    const favorites = await this.getFavorites();
    const updated = favorites.filter(f => f !== id);
    localStorage.setItem('user_favorites', JSON.stringify(updated));
  }

  // Subscription
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return this.request('subscription/plans');
  }
}

export const api = new ApiService();
