/**
 * Creates a star object for canvas animation
 * @param {number} canvasWidth - Width of the canvas
 * @param {number} canvasHeight - Height of the canvas
 * @returns {object} - Star object with position and animation properties
 */
export const createStar = (canvasWidth, canvasHeight) => ({
  x: Math.random() * canvasWidth,
  y: Math.random() * canvasHeight,
  size: Math.random() * 1.5 + 0.5,
  opacity: Math.random() * 0.8 + 0.2,
  twinkleSpeed: Math.random() * 0.02 + 0.01
});

/**
 * Updates a star's twinkling animation
 * @param {object} star - Star object to update
 */
export const updateStarTwinkle = (star) => {
  star.opacity += star.twinkleSpeed;
  if (star.opacity > 1 || star.opacity < 0.1) {
    star.twinkleSpeed = -star.twinkleSpeed;
  }
};

/**
 * Draws a star on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {object} star - Star object to draw
 */
export const drawStar = (ctx, star) => {
  ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
  ctx.fill();
};

/**
 * Creates an array of stars for canvas animation
 * @param {number} count - Number of stars to create
 * @param {number} canvasWidth - Width of the canvas
 * @param {number} canvasHeight - Height of the canvas
 * @returns {array} - Array of star objects
 */
export const createStarField = (count, canvasWidth, canvasHeight) => {
  return Array(count).fill().map(() => createStar(canvasWidth, canvasHeight));
};

/**
 * Animates the star field
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {array} stars - Array of star objects
 * @param {number} canvasWidth - Width of the canvas
 * @param {number} canvasHeight - Height of the canvas
 */
export const animateStarField = (ctx, stars, canvasWidth, canvasHeight) => {
  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // Update and draw each star
  stars.forEach(star => {
    updateStarTwinkle(star);
    drawStar(ctx, star);
  });
};

/**
 * Smooth scroll to element
 * @param {string} elementId - ID of the element to scroll to
 * @param {number} offset - Offset from the top (default: 0)
 */
export const smoothScrollTo = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Easing functions for animations
 */
export const easing = {
  // Ease in quad
  easeInQuad: (t) => t * t,
  
  // Ease out quad
  easeOutQuad: (t) => t * (2 - t),
  
  // Ease in out quad
  easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  // Ease in cubic
  easeInCubic: (t) => t * t * t,
  
  // Ease out cubic
  easeOutCubic: (t) => (--t) * t * t + 1,
  
  // Ease in out cubic
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
};

/**
 * Animate a value over time
 * @param {number} from - Starting value
 * @param {number} to - Ending value
 * @param {number} duration - Duration in milliseconds
 * @param {function} easingFunction - Easing function to use
 * @param {function} onUpdate - Callback function called with current value
 * @param {function} onComplete - Callback function called when animation completes
 */
export const animateValue = (from, to, duration, easingFunction = easing.easeInOutQuad, onUpdate, onComplete) => {
  const startTime = performance.now();
  const difference = to - from;
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunction(progress);
    const currentValue = from + (difference * easedProgress);
    
    onUpdate(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  requestAnimationFrame(animate);
};

/**
 * Debounce function to limit how often a function can be called
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit how often a function can be called
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {function} - Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}; 