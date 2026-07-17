export const APP_NAME = 'PackWise AI';
export const APP_DESCRIPTION = 'Your AI-powered smart travel companion';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  TOKEN: 'packwise_token',
  THEME: 'packwise_theme',
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const DEFAULT_THEME = THEMES.LIGHT;

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const TRAVEL_PREFERENCE_OPTIONS = [
  { value: 'solo', label: 'Solo' },
  { value: 'couple', label: 'Couple' },
  { value: 'family', label: 'Family' },
  { value: 'group', label: 'Group' },
  { value: 'business', label: 'Business' },
];
