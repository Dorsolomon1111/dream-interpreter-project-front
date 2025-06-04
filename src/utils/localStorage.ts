// Interfaces for Luna app data
interface UserPreferences {
  theme: string;
  rememberMe: boolean;
  notifications: boolean;
}

interface DreamData {
  dreamText: string;
  interpretation: string;
}

interface SavedDream extends DreamData {
  id: number;
  timestamp: string;
}

/**
 * Safely gets an item from localStorage
 */
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely sets an item in localStorage
 */
export const setToStorage = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage for key "${key}":`, error);
    return false;
  }
};

/**
 * Safely removes an item from localStorage
 */
export const removeFromStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage for key "${key}":`, error);
    return false;
  }
};

/**
 * Clears all localStorage data
 */
export const clearStorage = (): boolean => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Specific functions for Luna app data

/**
 * Saves user preferences
 */
export const saveUserPreferences = (preferences: UserPreferences): boolean => {
  return setToStorage('luna_user_preferences', preferences);
};

/**
 * Gets user preferences
 */
export const getUserPreferences = (): UserPreferences => {
  return getFromStorage('luna_user_preferences', {
    theme: 'dark',
    rememberMe: false,
    notifications: true
  });
};

/**
 * Saves a dream interpretation (for free users - limited to 10)
 */
export const saveDreamInterpretation = (dreamData: DreamData): boolean => {
  const savedDreams = getSavedDreams();
  const newDream: SavedDream = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...dreamData
  };
  
  // Limit to 10 dreams for free users
  const updatedDreams = [newDream, ...savedDreams].slice(0, 10);
  return setToStorage('luna_saved_dreams', updatedDreams);
};

/**
 * Gets saved dream interpretations
 */
export const getSavedDreams = (): SavedDream[] => {
  return getFromStorage<SavedDream[]>('luna_saved_dreams', []);
};

/**
 * Removes a specific dream interpretation
 */
export const removeDreamInterpretation = (dreamId: number): boolean => {
  const savedDreams = getSavedDreams();
  const updatedDreams = savedDreams.filter((dream: SavedDream) => dream.id !== dreamId);
  return setToStorage('luna_saved_dreams', updatedDreams);
};

/**
 * Clears all saved dreams
 */
export const clearSavedDreams = (): boolean => {
  return removeFromStorage('luna_saved_dreams');
}; 