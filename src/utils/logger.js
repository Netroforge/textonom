/**
 * Logger utility that only logs in development mode
 */

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Log a message to the console only in development mode
 * @param {string} component - The component name
 * @param {string} message - The message to log
 * @param {...any} args - Additional arguments to log
 */
export const logInfo = (component, message, ...args) => {
  if (isDevelopment) {
    console.log(`[${component}] ${message}`, ...args);
  }
};

/**
 * Log an error to the console (always logs in both dev and prod)
 * @param {string} component - The component name
 * @param {string} message - The error message
 * @param {...any} args - Additional arguments to log
 */
export const logError = (component, message, ...args) => {
  console.error(`[${component}] ${message}`, ...args);
};

/**
 * Log a warning to the console only in development mode
 * @param {string} component - The component name
 * @param {string} message - The warning message
 * @param {...any} args - Additional arguments to log
 */
export const logWarning = (component, message, ...args) => {
  if (isDevelopment) {
    console.warn(`[${component}] ${message}`, ...args);
  }
};

export default {
  logInfo,
  logError,
  logWarning
};
