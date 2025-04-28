import { cosineSimilarity, embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

// add this export so callers can type the hits:
export type DocumentWithScore = {
  document: {
    text: string;
    metadata: { id: string; tier?: string };
  };
  score: number;
};

export class LocalVectorStore {
  private static db: {
    embedding: number[];
    value: { text: string; metadata: { id: string; tier?: string } };
  }[] = [];

  static async fromDocuments(documents: {
    text: string;
    metadata: { id: string };
  }[]) {
    LocalVectorStore.db = [];

    // split into chunks
    const allChunks = documents.flatMap((doc) =>
      doc.text
        .split(".")
        .map((chunk) => ({
          text: chunk.trim(),
          metadata: { id: doc.metadata.id },
        }))
        .filter((c) => c.text.length > 0)
    );

    // embed them
    const { embeddings } = await embedMany({
      model: openai.embedding("text-embedding-3-small"),
      values: allChunks.map((c) => c.text),
    });

    embeddings.forEach((emb, i) => {
      LocalVectorStore.db.push({
        embedding: emb,
        value: allChunks[i],
      });
    });

    return {
      search: async (
        query: string,
        k = 3
      ): Promise<DocumentWithScore[]> => {
        const { embedding } = await embed({
          model: openai.embedding("text-embedding-3-small"),
          value: query,
        });

        return LocalVectorStore.db
          .map((item) => ({
            document: item.value,
            score: cosineSimilarity(embedding, item.embedding),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, k);
      },
    };
  }
}
