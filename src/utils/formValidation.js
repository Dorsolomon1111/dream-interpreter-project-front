/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates name fields
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid name
 */
export const isValidName = (name) => {
  return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name);
};

/**
 * Validates sign-up form data
 * @param {object} formData - Form data to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validateSignUpForm = (formData) => {
  const errors = {};
  
  if (!isValidName(formData.firstName)) {
    errors.firstName = 'First name must be at least 2 characters and contain only letters';
  }
  
  if (!isValidName(formData.lastName)) {
    errors.lastName = 'Last name must be at least 2 characters and contain only letters';
  }
  
  if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors;
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates sign-in form data
 * @param {object} formData - Form data to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validateSignInForm = (formData) => {
  const errors = {};
  
  if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!formData.password || formData.password.length < 1) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 