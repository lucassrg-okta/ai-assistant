// lib/tools/calendar-ciba.ts
import { tool } from "ai";
import { z } from "zod";
import { Auth0AI } from "@auth0/ai-vercel";
import { AccessDeniedInterrupt } from "@auth0/ai/interrupts";
import { getGoogleAuth } from "../google";
import { google } from "googleapis";

const auth0AI = new Auth0AI();

// Export a factory function that requires a userID
export const calendarCreateAsyncTool = (userID: string) => {

  //wrap a
  return auth0AI.withAsyncUserConfirmation(
  // Wrap the tool in a CIBA (push-to-approve) flow ─ the code below
  // describes *who* must approve and scope of the authorization
    {
      userID, //Auth0 subject (sub) that must approve.
      audience: process.env.AUTH0_AUDIENCE!, // API audience for token binding; required by CIBA.
      scopes: ["openid", "calendar:read", "calendar:write"], // Minimal OAuth scopes the downstream tool needs.

       /** Push‑notification text shown in the Auth0 Guardian SDK. */
      bindingMessage: async ({ title, time }) => {
        const cleanTitle = title.replace(/[^a-zA-Z0-9 +\-_.:,#]/g, '');
        const start = time.start.replace(/[^a-zA-Z0-9 +\-_.:,#]/g, '');
        const message = `Schedule: ${cleanTitle} at ${start}`;
        return message.length > 64 ? message.slice(0, 61) + '...' : message;
      },
      onAuthorizationRequest: async (authReq, poll) => {
        console.info("An authorization request has been sent to your device. Please check your mobile app and approve the request to schedule the meeting.");      
        return; // Return void
      },
      onUnauthorized: async (error) => {
        if (error instanceof AccessDeniedInterrupt) {
          return "The user declined the request.";
        }
        return `Authorization failed: ${error.message}`;
      },
  })(
    tool(
      {
      //tool schema definition
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
          timeZone: z.string().optional() // include optional timezone here as well
        }),
        attendees: z.array(z.string().email()),
      }),
    //tool execution
      execute: async ({ title, time, attendees }) => {
        const effectiveTimeZone = time.timeZone || 'UTC';
        try {
          const auth = await getGoogleAuth(); //fetch access token on Token Vault
          const calendar = google.calendar({ version: "v3", auth });

          const event = await calendar.events.insert({
            calendarId: "primary",
            requestBody: {
              summary: title,
              start: {
                dateTime: time.start,
                timeZone: effectiveTimeZone,
              },
              end: {
                dateTime: time.end,
                timeZone: effectiveTimeZone,
              },
              attendees: attendees.map(email => ({ email })),
            },
          });

          return {
            status: "success",
            summary: event.data.summary,
            link: event.data.htmlLink,
            scheduledAt: event.data.start?.dateTime,
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
      },
    })
  );
};
