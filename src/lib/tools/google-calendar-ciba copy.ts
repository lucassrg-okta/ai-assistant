// lib/tools/calendar-ciba.ts
// ------------------------------------------------------------
// Imports
// ------------------------------------------------------------
import { tool } from "ai";
import { z } from "zod";
import { Auth0AI } from "@auth0/ai-vercel";
import { AccessDeniedInterrupt } from "@auth0/ai/interrupts";
import { getGoogleAuth } from "../google";
import { google } from "googleapis";

const auth0AI = new Auth0AI();

/**
 * createCalendarToolForUser
 * -------------------------
 * Factory that returns *one* “create-event” tool,
 * already wrapped with CIBA confirmation for **this** user.
 *
 * @param userID – the Auth0 user who must approve the action
 */
export function calendarCreateAsyncTool(userID: string) {
  // Wrap the tool in a CIBA (push-to-approve) flow ─ the code below
  // describes *who* must approve and *what* kind of token we want.
  const withCIBA = auth0AI.withAsyncUserConfirmation({
    
    userID, // ➜ Auth0 user who must approve the request
    audience: process.env.AUTH0_AUDIENCE!, // ➜ “Audience” = API identifier that will appear in the token’s `aud` claim
    scopes: ["openid", "calendar:read", "calendar:write"], // ➜ Scopes the token will carry *after* the user taps “Approve”

    bindingMessage: buildBindingMessage, // ➜ Text shown in the push notification (max 64 chars by spec)
    onAuthorizationRequest: notifyUserInterface, // ➜ Runs right after we send the push” 
    onUnauthorized: handleRejection, // ➜ Runs if the user hits “Deny” or any auth error occurs
  });

  // ----------------------------------------------------------
  // The underlying tool definition
  // ----------------------------------------------------------
  const createEventTool = tool({
    description: "Create a Google Calendar event (requires user confirmation via push)",
    parameters: eventSchema(),
    execute: createGoogleCalendarEvent, //API call
  });

  // Return the wrapped tool ✔
  return withCIBA(createEventTool);
}

// ------------------------------------------------------------
// Helper functions (kept below for readability)
// ------------------------------------------------------------

/** Zod schema for the tool’s arguments */
function eventSchema() {
  return z.object({
    title: z.string(),
    time: z.object({
      start: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid start time" }),
      end: z.string().refine(v => !isNaN(Date.parse(v)),   { message: "Invalid end time" }),
      timeZone: z.string().optional()
    }),
    attendees: z.array(z.string().email()),
  });
}

/** Builds the CIBA binding-message (max 64 chars, safe chars only) */
async function buildBindingMessage({ title, time }: any) {
  const clean = (s: string) => s.replace(/[^a-zA-Z0-9 +\-_.:,#]/g, "");
  const msg  = `Schedule: ${clean(title)} at ${clean(time.start)}`;
  return msg.length > 64 ? msg.slice(0, 61) + "…" : msg;
}

/** Runs when the push is sent but before the user responds */
async function notifyUserInterface() {
  console.info(
    "Please check your Auth0 Guardian app: approve the request to schedule this meeting."
  );
  // You could also emit an event, update React state, etc.
}

/** Handles explicit denial or other auth errors */
async function handleRejection(err: Error) {
  if (err instanceof AccessDeniedInterrupt) {
    return "❌ You declined the request.";
  }
  return `Authorization failed: ${err.message}`;
}

/** The real Google Calendar API call */
async function createGoogleCalendarEvent({ title, time, attendees }: any) {
  const tz   = time.timeZone || "UTC";
  try {
    const auth     = await getGoogleAuth();                 // already scoped
    const calendar = google.calendar({ version: "v3", auth });

    const { data } = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: title,
        start: { dateTime: time.start, timeZone: tz },
        end:   { dateTime: time.end,   timeZone: tz },
        attendees: attendees.map((email: string) => ({ email })),
      },
    });

    return {
      status: "success",
      summary: data.summary,
      link: data.htmlLink,
      scheduledAt: data.start?.dateTime,
    };
  } catch (err: any) {
    const needsReauth =
      err.code === "failed_to_exchange_refresh_token" ||
      err.message?.includes("federated_connection_refresh_token_not_found");

    if (needsReauth) {
      return {
        status: "error",
        needsReauth: true,
        message:
          "I need permission to access your calendar. Please [connect Google Calendar](/auth/login?connection=google-oauth2&prompt=consent&connection_scope=https://www.googleapis.com/auth/calendar.events).",
      };
    }
    throw err;
  }
}
