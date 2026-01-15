
import { UserProfile } from '../types';
import { TRIAL_CONFIG } from '../constants';

const PROFILE_KEY = 'unique_tv_profile';

export const SessionManager = {
  getProfile: (): UserProfile | null => {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  },
  setProfile: (profile: UserProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    // Initialize trial if not exists
    if (!localStorage.getItem(TRIAL_CONFIG.STORAGE_KEY)) {
      localStorage.setItem(TRIAL_CONFIG.STORAGE_KEY, TRIAL_CONFIG.TOTAL_DAYS.toString());
    }
  },
  getTrialDays: (): number => {
    const days = localStorage.getItem(TRIAL_CONFIG.STORAGE_KEY);
    return days ? parseInt(days, 10) : TRIAL_CONFIG.TOTAL_DAYS;
  },
  extendTrial: (days: number) => {
    localStorage.setItem(TRIAL_CONFIG.STORAGE_KEY, days.toString());
  },
  clearSession: () => {
    localStorage.removeItem(PROFILE_KEY);
  }
};
