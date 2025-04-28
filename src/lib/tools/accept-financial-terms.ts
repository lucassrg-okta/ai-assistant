import { tool } from 'ai';
import { z } from 'zod';
import { Auth0AI } from '@auth0/ai-vercel';
import { fga } from '@/lib/fga/client';
import { FINANCIAL_TERMS_POLICY_OBJECT, FINANCIAL_TERMS_DISPLAY } from '@/lib/fga/policy_versions';

const auth0AI = new Auth0AI();

export function acceptFinancialTermsTool(user: { sub: string }) {
  return auth0AI.withAsyncUserConfirmation({
    userID: user.sub,
    audience: process.env.AUTH0_AUDIENCE!,
    scopes: ['openid'],
    bindingMessage: async () => {
      const cleanDisplay = FINANCIAL_TERMS_DISPLAY.replace(/[^a-zA-Z0-9 +\-_.:,#]/g, '');
      const message = `Accept: ${cleanDisplay}`;
      return message.length > 64 ? message.slice(0, 61) + '...' : message;
    },
    onAuthorizationRequest: async (authReq, poll) => {
      console.info('Authorization request to accept Terms sent.');
    },
    onUnauthorized: async (error) => {
      return `❌ Authorization to accept Terms was denied: ${error.message}`;
    }
  })(
    tool({
      description: `Accept the ${FINANCIAL_TERMS_DISPLAY} to unlock personalized advice.`,
      parameters: z.object({}),
      execute: async () => {
        const userId = user.sub;

        const check = await fga.check({
          user: `user:${userId}`,
          relation: 'accepted',
          object: FINANCIAL_TERMS_POLICY_OBJECT,
        });

        if (check.allowed) {
          return {
            message: `✅ You have already accepted the ${FINANCIAL_TERMS_DISPLAY}!`,
          };
        }

        await fga.write({
          writes: [
            { user: `user:${userId}`, relation: 'accepted', object: FINANCIAL_TERMS_POLICY_OBJECT }
          ],
        });

        return {
          message: `✅ You have accepted the ${FINANCIAL_TERMS_DISPLAY}! Personalized advice is now unlocked.`,
        };
      },
    })
  );
}
