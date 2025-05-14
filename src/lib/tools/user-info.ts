// lib/tools/user-info.ts
import { tool } from 'ai';
import { z } from 'zod';
import { auth0 } from '../auth0';

export const userInfo = tool({
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

      const user = await response.json();

      return {
        // message: `Here is your profile information:`,
        message: undefined,
        user: {
          name: user.name,
          email: user.email,
          picture: user.picture,
          email_verified: user.email_verified,
          nickname: user.nickname,
          sub: user.sub,
          given_name: user.given_name,
          family_name: user.family_name,
        },
      };
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      return "Something went wrong trying to fetch user info.";
    }
  },
});
