"use client";

import { useEffect } from 'react';
import { Logger } from '@/utils/logger';
import { ShieldAlert, RefreshCcw } from 'lucide-react';
import { submitFeedbackReport } from '@/services/feedback';

/**
 * Global Next.js Error Boundary to catch and gracefully handle unexpected runtime exceptions.
 * Automatically logs errors via the structured Logger and presents a tactical UI recovery option.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error using our standardized Logger
    Logger.error('Unhandled runtime exception caught by GlobalError boundary', error, { digest: error.digest });

    // Attempt to automatically log it to the database as a 'System_Error'
    submitFeedbackReport({
      category: 'System_Error',
      description: `Auto-caught Exception: ${error.message}\nStack: ${error.stack || 'No stack trace'}`,
    }).catch(err => {
      console.error('Failed to log system error to database within boundary', err);
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4 font-mono">
      <div className="max-w-xl w-full bg-[var(--dark-grey)] border border-red-900/50 p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>

        <div className="flex flex-col items-center text-center space-y-6">
          <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse" />

          <div>
            <h1 className="text-2xl text-red-500 uppercase tracking-widest mb-2">System Failure</h1>
            <p className="text-sm text-gray-400 uppercase">
              A critical anomaly has disrupted the current operation. Support command has been notified.
            </p>
          </div>

          <div className="w-full bg-black/50 p-4 border border-red-950/30 text-left overflow-x-auto">
            <p className="text-xs text-red-400 font-mono break-words">
              {error.message || 'Unknown exception'}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">Digest: {error.digest}</p>
            )}
          </div>

          <button
            onClick={() => reset()}
            className="flex items-center gap-2 bg-transparent border border-gray-700 hover:border-gray-500 hover:bg-gray-800 text-gray-300 uppercase px-6 py-3 transition-colors text-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            Initialize Recovery Sequence
          </button>
        </div>
      </div>
    </div>
  );
}
