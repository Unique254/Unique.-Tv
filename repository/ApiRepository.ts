
import { API_CONFIG } from '../constants';
// Updated to use StreamItem as Channel is not exported from types.ts
import { Movie, Series, StreamItem, EPGProgram, SubscriptionPlan } from '../types';

export class ApiRepository {
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
}

export const api = new ApiRepository();
