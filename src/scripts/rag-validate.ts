import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { readDocuments } from '@/lib/rag/docs';
import { LocalVectorStore } from '@/lib/rag/vector-store';
import { cosineSimilarity } from 'ai';

async function validateRAG() {
  console.log('🔎 Starting RAG Validation...');

  const documents = await readDocuments();
  console.log(`✅ Loaded ${documents.length} documents.`);

  const vectorStore = await LocalVectorStore.fromDocuments(documents);
  console.log('✅ Embeddings created successfully.');

  const queries = [
    "basic retirement planning",
    "advanced retirement planning strategies",
    "catch-up contributions for retirement",
    "tax-efficient withdrawals in retirement",
    "Roth IRA conversion strategy",
  ];

  for (const query of queries) {
    console.log(`\n🔍 Searching for query: "${query}"`);
    const results = await vectorStore.search(query, 5);

    results.forEach((res, idx) => {
      console.log(`  ${idx + 1}. Doc ID: ${res.document.metadata.id} (Score: ${res.score.toFixed(2)}, Tier: ${res.document.metadata.tier})`);
    });

    const foundAdvanced = results.some(res => res.document.metadata.tier === 'advanced');

    if (foundAdvanced) {
      console.log(`✅ Advanced document found for query: "${query}"`);
    } else {
      console.warn(`⚠️  Only basic documents found for query: "${query}"`);
    }
  }

  console.log('\n✅ RAG Validation Complete.');
}

validateRAG().catch((err) => {
  console.error('❌ RAG validation script failed:', err);
  process.exit(1);
});
