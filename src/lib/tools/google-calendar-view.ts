// lib/tools/google-calendar-view.ts
import { tool } from 'ai';
import { z } from 'zod';
import { google } from 'googleapis';
import { getGoogleAuth } from '../google';

export const googleCalendarViewTool = tool({
  description: "Check the user's availability between two times on their calendar",
  parameters: z.object({
    timeMin: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid start datetime"
    }),
    timeMax: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid end datetime"
    }),
    timeZone: z.string().optional() // optional timezone input
  }),

  execute: async ({ timeMin, timeMax, timeZone }) => {
    // Use provided timezone or default to 'UTC'
    const effectiveTimeZone = timeZone || 'UTC';
    try {
      const auth = await getGoogleAuth();
      const calendar = google.calendar({ version: 'v3', auth });

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin,
        timeMax,
        timeZone: effectiveTimeZone,
      });

      return {
        status: 'success',
        startDate: timeMin,
        endDate: timeMax,
        events: response.data.items ?? [],
      };
    } catch (err: any) {
      if (
        err.code === 'failed_to_exchange_refresh_token' ||
        err?.message?.includes('federated_connection_refresh_token_not_found') ||
        err?.code === 'missing_refresh_token'
      ) {
        return {
          status: 'error',
          message:
            "I need permission to check your calendar. Please [connect your Google Calendar](/auth/login?connection=google-oauth2&prompt=consent&connection_scope=https://www.googleapis.com/auth/calendar.readonly).",
          needsReauth: true
        };
      }

      throw err;
    }
  }
});