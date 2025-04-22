// lib/tools/google-calendar-create.ts
import { tool } from 'ai';
import { z } from 'zod';
import { google } from 'googleapis';
import { getGoogleAuth } from '../google';

export const googleCalendarCreateTool = tool({
  description: "Schedule a meeting on the user's primary calendar",
  parameters: z.object({
    title: z.string().describe('Title of the meeting'),
    description: z.string().optional().describe('Meeting details'),
    time: z.object({
      start: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid start time"
      }),
      end: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid end time"
      }),
      timeZone: z.string().optional()
    }),
    attendees: z.array(z.string().email()).describe('List of email addresses to invite')
  }),

  execute: async ({ title, description, time, attendees }) => {
    try {
      const auth = await getGoogleAuth();
      const calendar = google.calendar({ version: 'v3', auth });

      const event = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: title,
          description,
          start: {
            dateTime: time.start,
            timeZone: time.timeZone || 'UTC',
          },
          end: {
            dateTime: time.end,
            timeZone: time.timeZone || 'UTC',
          },
          attendees: attendees.map(email => ({ email })),
        },
      });

      return {
        status: 'success',
        link: event.data.htmlLink,
        summary: event.data.summary,
      };
    } catch (err: any) {
      if (
        err.code === 'failed_to_exchange_refresh_token' ||
        err?.message?.includes('federated_connection_refresh_token_not_found')
      ) {
        return {
          status: 'error',
          message:
            "I need permission to schedule this meeting. Please [connect your Google Calendar](/auth/login?connection=google-oauth2&prompt=consent&connection_scope=https://www.googleapis.com/auth/calendar.events).",
          needsReauth: true
        };
      }

      throw err;
    }
  }
});
