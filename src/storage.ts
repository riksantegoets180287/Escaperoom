import { Progress, AdminConfig, DEFAULT_ADMIN_CONFIG } from './types';

const PROGRESS_KEY = 'virusvrij_progress_v1';
const ADMIN_CONFIG_KEY = 'virusvrij_admin_v1';

export function getProgress(): Progress {
  const saved = sessionStorage.getItem(PROGRESS_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    completedGames: {},
    skippedGames: {},
    attempts: {},
    startTime: Date.now()
  };
}

export function saveProgress(progress: Progress) {
  sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function getAdminConfig(): AdminConfig {
  const saved = localStorage.getItem(ADMIN_CONFIG_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse admin config', e);
    }
  }
  return DEFAULT_ADMIN_CONFIG;
}

export function saveAdminConfig(config: AdminConfig) {
  localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(config));
}
