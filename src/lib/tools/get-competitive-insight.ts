import { tool } from 'ai';
import { z } from 'zod';
import { fga } from '@/lib/fga/client';
import { readDocuments } from '@/lib/rag/docs';
import { LocalVectorStore } from '@/lib/rag/vector-store';

export function getCompetitiveInsightTool(user: { sub: string }) {
  return tool({
    description: 'Get competitive analysis by retrieving only documents the user is authorized to see.',
    parameters: z.object({
      question: z.string().describe('The competitive question being asked, e.g. "What’s the Q2 outlook for Zeko?"')
    }),
    execute: async ({ question }) => {
      const userId = user.sub;

      const documents = await readDocuments();
      const vectorStore = await LocalVectorStore.fromDocuments(documents);

      const results = await vectorStore.search(question, 10);

      const filtered = [];
      for (const doc of results) {
        const allowed = await fga.check({
          user: `user:${userId}`,
          relation: 'viewer', // ✅ Correct: matches the FGA model
          object: `doc:${doc.document.metadata.id}`,
        });

        if (allowed.allowed) {
          filtered.push(doc);
        }
      }

      if (filtered.length === 0) {
        return {
          message: `I searched for competitive documents, but none are currently available to you. You might need to accept updated terms to unlock more insights.`,
        };
      }

      const context = filtered.map(c => c.document.text).join('\n\n');

      return {
        message: `Here's what I found based on your access:\n\n${context}`
      };
    },
  });
}
