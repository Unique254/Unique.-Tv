
import { gemini, GeminiService } from '../repository/GeminiRepository';
import { api, ApiRepository } from '../repository/ApiRepository';

/**
 * ServiceLocator: Provides singleton instances of repositories and services.
 * Parallels the 'di' package in the Android structure.
 */
class ServiceLocator {
  private static instance: ServiceLocator;
  
  public gemini: GeminiService = gemini;
  public api: ApiRepository = api;

  public static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }
}

export const di = ServiceLocator.getInstance();
