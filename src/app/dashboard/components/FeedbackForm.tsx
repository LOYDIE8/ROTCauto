"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { submitFeedbackReport } from '@/services/feedback';

const feedbackSchema = z.object({
  category: z.enum(['Hotfix', 'UI_UX_Optimization', 'Feature_Request', 'System_Error'] as const),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description is too long'),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

/**
 * Renders the feedback submission form for users.
 * Allows categorization of feedback into hotfixes, UI optimizations, or feature requests.
 *
 * @returns {JSX.Element} The rendered feedback form component.
 */
export default function FeedbackForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      category: 'Feature_Request',
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const payload = {
      ...data,
      route_context: window.location.pathname,
      browser_info: navigator.userAgent,
    };

    try {
      // Direct call since the service function is imported directly and will execute on the server context if setup properly, or we can use a server action.
      // Next.js allows importing server actions directly. We'll simulate the server action call via an API endpoint conceptually if it fails.
      // But actually, we need to export the service function with 'use server' to call it directly.
      // We will create a local inline server action.
      const response = await submitFeedbackReport(payload);
      if (response.success) {
        setSuccess(true);
        reset();
      } else {
        setError(response.error || 'Failed to submit feedback.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[var(--dark-grey)] border border-gray-800 p-8 max-w-2xl mx-auto relative overflow-hidden shadow-2xl">
      {/* Tactical corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--neon-cyan)]"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--neon-cyan)]"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--neon-cyan)]"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--neon-cyan)]"></div>

      <div className="mb-6 border-b border-gray-800 pb-4">
        <h2 className="text-xl font-mono text-[var(--neon-cyan)] uppercase">Field Report Submission</h2>
        <p className="text-sm font-mono text-gray-400 mt-1 uppercase">Log UI/UX anomalies, feature requests, or hotfixes.</p>
      </div>

      {success ? (
        <div className="bg-green-900/20 border border-green-500/50 p-6 rounded text-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-mono text-green-400 mb-2 uppercase">Report Received</h3>
          <p className="text-sm font-mono text-gray-300">Your feedback has been securely transmitted to Command.</p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-6 text-xs font-mono text-[var(--neon-cyan)] hover:text-cyan-300 uppercase transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-950/50 border border-red-500/50 p-4 rounded flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm font-mono">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-mono text-gray-400 uppercase">Report Category</label>
            <select
              {...register('category')}
              className="w-full bg-black/50 border border-gray-700 px-4 py-3 text-white font-mono focus:outline-none focus:border-[var(--neon-cyan)] transition-colors appearance-none"
            >
              <option value="Feature_Request">Feature Request</option>
              <option value="UI_UX_Optimization">UI/UX Optimization</option>
              <option value="Hotfix">Immediate Hotfix</option>
              <option value="System_Error">System Error</option>
            </select>
            {errors.category && (
              <p className="text-red-400 text-xs font-mono">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono text-gray-400 uppercase">Detailed Description</label>
            <textarea
              {...register('description')}
              rows={5}
              className="w-full bg-black/50 border border-gray-700 px-4 py-3 text-white font-mono focus:outline-none focus:border-[var(--neon-cyan)] transition-colors resize-none"
              placeholder="Describe the anomaly or request in detail..."
            />
            {errors.description && (
              <p className="text-red-400 text-xs font-mono">{errors.description.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--neon-cyan)] hover:bg-cyan-400 text-black font-mono font-bold uppercase py-3 px-4 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Transmitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
