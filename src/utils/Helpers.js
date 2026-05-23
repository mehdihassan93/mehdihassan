/**
 * Helpers - Performance throttlers, DOM caches, and utilities.
 */

// Simple high-performance element caching system
const domCache = {};

/**
 * Cache and query DOM elements to avoid layout thrashing.
 * @param {string} selector 
 * @returns {HTMLElement|null}
 */
export function getElement(selector) {
  if (!domCache[selector]) {
    domCache[selector] = document.querySelector(selector);
  }
  return domCache[selector];
}

/**
 * Throttles execution of a high-rate function using requestAnimationFrame.
 * Highly recommended for mousemove, scroll, and resize event handlers.
 * @param {Function} callback 
 * @returns {Function}
 */
export function throttleRAF(callback) {
  let queued = false;
  return function(...args) {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      callback.apply(this, args);
      queued = false;
    });
  };
}
