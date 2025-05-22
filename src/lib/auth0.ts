// lib/auth0.ts
import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE, // e.g. https://calendar-api.tool
    scope: 'openid profile email offline_access read:calendar write:calendar',
  },
  appBaseUrl: process.env.AUTH0_BASE_URL,
});
