/**
 * Utility to retry a promise-returning function with exponential backoff.
 * 
 * @param {Function} fn - The function that returns a Promise to be retried.
 * @param {number} maxRetries - Maximum number of retry attempts.
 * @param {number} initialDelay - Initial delay in milliseconds.
 * @param {number} timeout - Request timeout in milliseconds.
 * @returns {Promise<any>} - Resolves with the function's result or rejects after max retries.
 */
export const retryFetch = async (fn, maxRetries = 3, initialDelay = 1000, timeout = 30000) => {
  let attempt = 0;
  
  while (attempt <= maxRetries) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      );
      
      // Wait for either the function to resolve/reject, or the timeout
      const result = await Promise.race([fn(), timeoutPromise]);
      return result;
    } catch (error) {
      attempt++;
      console.error(`[retryFetch] Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt > maxRetries) {
        throw new Error(`Failed after ${maxRetries} retries: ${error.message}`);
      }
      
      // Calculate exponential backoff delay: initialDelay * 2^(attempt - 1)
      const delay = initialDelay * Math.pow(2, attempt - 1);
      console.log(`[retryFetch] Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};