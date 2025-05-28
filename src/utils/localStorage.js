/**
 * Safely gets an item from localStorage
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - The stored value or default value
 */
export const getFromStorage = (key, defaultValue = null) => {
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
 * @param {string} key - The key to store
 * @param {any} value - The value to store
 * @returns {boolean} - True if successful, false otherwise
 */
export const setToStorage = (key, value) => {
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
 * @param {string} key - The key to remove
 * @returns {boolean} - True if successful, false otherwise
 */
export const removeFromStorage = (key) => {
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
 * @returns {boolean} - True if successful, false otherwise
 */
export const clearStorage = () => {
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
 * @param {object} preferences - User preferences object
 */
export const saveUserPreferences = (preferences) => {
  return setToStorage('luna_user_preferences', preferences);
};

/**
 * Gets user preferences
 * @returns {object} - User preferences or default values
 */
export const getUserPreferences = () => {
  return getFromStorage('luna_user_preferences', {
    theme: 'dark',
    rememberMe: false,
    notifications: true
  });
};

/**
 * Saves a dream interpretation (for free users - limited to 10)
 * @param {object} dreamData - Dream and interpretation data
 */
export const saveDreamInterpretation = (dreamData) => {
  const savedDreams = getSavedDreams();
  const newDream = {
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
 * @returns {array} - Array of saved dreams
 */
export const getSavedDreams = () => {
  return getFromStorage('luna_saved_dreams', []);
};

/**
 * Removes a specific dream interpretation
 * @param {number} dreamId - ID of the dream to remove
 */
export const removeDreamInterpretation = (dreamId) => {
  const savedDreams = getSavedDreams();
  const updatedDreams = savedDreams.filter(dream => dream.id !== dreamId);
  return setToStorage('luna_saved_dreams', updatedDreams);
};

/**
 * Clears all saved dreams
 */
export const clearSavedDreams = () => {
  return removeFromStorage('luna_saved_dreams');
}; 