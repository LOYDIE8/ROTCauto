/**
 * Core logging utility for standardizing application monitoring and performance tracking.
 */
export const Logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    console.info(`[INFO] ${new Date().toISOString()} - ${message}`, context || '');
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, context || '');
  },
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, { error, ...context });
  },
};

/**
 * Higher-order function to wrap async operations and track their execution time.
 * Helpful for monitoring serverless function limits and slow Supabase queries.
 *
 * @param operationName - An identifier for the monitored block.
 * @param asyncFn - The asynchronous function to execute and track.
 * @returns The resolved value of the `asyncFn`.
 */
export async function withPerformanceTracking<T>(
  operationName: string,
  asyncFn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  try {
    const result = await asyncFn();
    const endTime = performance.now();
    Logger.info(`PerformanceTrack: ${operationName}`, { durationMs: Math.round(endTime - startTime) });
    return result;
  } catch (error) {
    const endTime = performance.now();
    Logger.error(`PerformanceTrack Failure: ${operationName}`, error, { durationMs: Math.round(endTime - startTime) });
    throw error;
  }
}
