// lib/tools/calendar-ciba.ts
import { tool } from "ai";
import { z } from "zod";
import { Auth0AI } from "@auth0/ai-vercel";
import { AccessDeniedInterrupt } from "@auth0/ai/interrupts";

import { getGoogleAuth } from "../google";
import { google } from "googleapis";

// Create a new instance of Auth0AI (or import it from a shared module)
const auth0AI = new Auth0AI();

// Export a factory function that requires a userID
export const calendarCreateAsyncTool = (userID: string) => {
  const withConfirmation = auth0AI.withAsyncUserConfirmation({
    userID,
    audience: process.env.AUTH0_AUDIENCE!, // required for token binding
    scopes: ["openid", "calendar:read", "calendar:write"],

    bindingMessage: async ({ title, time }) => {
        const cleanTitle = title.replace(/[^a-zA-Z0-9 +\-_.:,#]/g, ''); // remove invalid chars
        const start = time.start.replace(/[^a-zA-Z0-9 +\-_.:,#]/g, '');
      
        const message = `Schedule: ${cleanTitle} at ${start}`;
        return message.length > 64 ? message.slice(0, 61) + '...' : message;
    },
    
    onAuthorizationRequest: "block", // good for dev environments

    onUnauthorized: async (error) => {
      if (error instanceof AccessDeniedInterrupt) {
        return "The user declined the request.";
      }
      return `Authorization failed: ${error.message}`;
    },
  });

  return withConfirmation(
    tool({
      description: "Schedule a calendar meeting (requires confirmation)",
      parameters: z.object({
        title: z.string(),
        time: z.object({
          start: z.string().refine(val => !isNaN(Date.parse(val)), {
            message: "Invalid start time",
          }),
          end: z.string().refine(val => !isNaN(Date.parse(val)), {
            message: "Invalid end time",
          }),
        }),
        attendees: z.array(z.string().email()),
      }),

      execute: async ({ title, time, attendees }) => {
        const auth = await getGoogleAuth(); // securely fetch Google token
        const calendar = google.calendar({ version: "v3", auth });

        const event = await calendar.events.insert({
          calendarId: "primary",
          requestBody: {
            summary: title,
            start: { dateTime: time.start },
            end: { dateTime: time.end },
            attendees: attendees.map(email => ({ email })),
          },
        });

        return {
          status: "success",
          summary: event.data.summary,
          link: event.data.htmlLink,
          scheduledAt: event.data.start?.dateTime,
        };
      },
    })
  );
};
