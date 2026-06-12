"use server";

import { createClient } from '@/utils/supabase/server';
import { Logger, withPerformanceTracking } from '@/utils/logger';

export type FeedbackCategory = 'Hotfix' | 'UI_UX_Optimization' | 'Feature_Request' | 'System_Error';

export interface FeedbackReportPayload {
  category: FeedbackCategory;
  description: string;
  route_context?: string;
  browser_info?: string;
}

/**
 * Submits a new feedback report or system error to the database.
 * Automatically attaches the authenticated user's ID if available.
 *
 * @param {FeedbackReportPayload} payload - The details of the feedback or error report.
 * @returns {Promise<{ success: boolean; error?: string }>} The result of the submission.
 */
export async function submitFeedbackReport(payload: FeedbackReportPayload): Promise<{ success: boolean; error?: string }> {
  return withPerformanceTracking('submitFeedbackReport', async () => {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('feedback_reports')
        .insert({
          user_id: user?.id || null, // Allow null for system errors where user isn't authenticated yet
          category: payload.category,
          description: payload.description,
          route_context: payload.route_context,
          browser_info: payload.browser_info,
        });

      if (error) {
        Logger.error('Failed to insert feedback report into database', error);
        return { success: false, error: error.message };
      }

      Logger.info(`Feedback report submitted successfully: [${payload.category}]`);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during feedback submission';
      Logger.error('Unexpected exception in submitFeedbackReport', err);
      return { success: false, error: errorMessage };
    }
  });
}
