// lib/tools/user-info.ts
import { tool } from 'ai';
import { z } from 'zod';
import { auth0 } from '../auth0';

export const userInfoTool = tool({
  description: "Get information about the currently logged-in user.",
  parameters: z.object({}),
  execute: async () => {
    const session = await auth0.getSession();

    if (!session) {
      return "There is no user logged in.";
    }

    try {
      const response = await fetch(
        `https://${process.env.AUTH0_DOMAIN}/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${session.tokenSet.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        return "I couldn't verify your identity.";
      }

      return {
        result: await response.json(),
      };
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      return "Something went wrong trying to fetch user info.";
    }
  },
});
