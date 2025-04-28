import { tool } from 'ai';
import { z } from 'zod';
import { fga } from '@/lib/fga/client';
import { readDocuments } from '@/lib/rag/docs';
import { LocalVectorStore } from '@/lib/rag/vector-store';
import { FGAFilter } from '@auth0/ai';
import { FINANCIAL_TERMS_POLICY_OBJECT } from '@/lib/fga/policy_versions';

export function getRetirementAdviceTool(user: { sub: string }) {
  return tool({
    description: 'Get retirement planning advice based on available documents.',
    parameters: z.object({
      question: z
        .string()
        .describe('The user’s financial question, e.g., "How should I allocate my 401(k)?"'),
    }),
    execute: async ({ question }) => {
      const userId = user.sub;

      // 1) load & index
      const documents = await readDocuments();
      const vectorStore = await LocalVectorStore.fromDocuments(documents);

      // 2) terms‐accepted?
      const accepted = await fga.check({
        user: `user:${userId}`,
        relation: 'accepted',
        object: FINANCIAL_TERMS_POLICY_OBJECT,
      });

      // 3) build an FGA retriever for viewer permissions
      const retriever = FGAFilter.create({
        buildQuery: (hit) => ({
          user: `user:${userId}`,
          object: `doc:${hit.document.metadata.id}`,
          relation: 'viewer',
        }),
      });

      // 4) search + permission filter
      const rawHits = await vectorStore.search(
        accepted.allowed
          ? `advanced retirement strategies: ${question}`
          : question,
        5
      );
      const hits = await retriever.filter(rawHits);

      // 5) pick “advanced” vs “basic” tier
      let tiered = hits.filter((h) =>
        h.document.metadata.tier === (accepted.allowed ? 'advanced' : 'basic')
      );
      if (tiered.length === 0) {
        tiered = hits;
      }

      const snippets = tiered.map((h) => h.document.text);

      // 6) if they haven’t accepted and no basic content → trigger T&C flow
      if (!accepted.allowed && snippets.length === 0) {
        return {
          message:
            '🔒 To access personalized retirement advice, you need to accept the Financial Terms. Would you like to proceed?',
          trigger_terms_acceptance: true,
        };
      }

      // 7) otherwise prefix & return
      const prefix = accepted.allowed
        ? '📚 Here are your **advanced** retirement planning strategies:\n\n'
        : '📚 Here are your **basic** retirement planning tips:\n\n';

      return {
        message: prefix + snippets.join('\n\n'),
      };
    },
  });
}
