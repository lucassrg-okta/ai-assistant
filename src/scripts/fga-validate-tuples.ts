import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getFgaClient } from '@/lib/fga/client';
import { readDocuments } from '@/lib/rag/docs';
import { FINANCIAL_TERMS_POLICY_OBJECT } from '@/lib/fga/policy_versions'; // ✅ dynamic terms version

const fga = getFgaClient();

async function validateUserAccess(userId: string) {
  console.log(`🔎 Validating document access for user: ${userId}\n`);

  const documents = await readDocuments();
  if (!documents.length) {
    console.error('❌ No documents found in /rag/assets/docs');
    return;
  }

  const termsAccepted = await fga.check({
    user: `user:${userId}`,
    relation: 'accepted',
    object: FINANCIAL_TERMS_POLICY_OBJECT,
  });

  console.log(termsAccepted.allowed
    ? `✅ User has accepted the Financial Terms (${FINANCIAL_TERMS_POLICY_OBJECT})`
    : `❌ User has NOT accepted the Financial Terms (${FINANCIAL_TERMS_POLICY_OBJECT})`);

  for (const doc of documents) {
    const docId = doc.metadata.id;
    const fgaObject = `doc:${docId}`;

    try {
      const result = await fga.check({
        user: `user:${userId}`,
        relation: 'viewer',
        object: fgaObject,
      });

      if (result.allowed) {
        console.log(`✅ User can access document: ${docId}`);
      } else {
        console.warn(`⚠️  User CANNOT access document: ${docId}`);
      }
    } catch (error) {
      console.error(`❌ Error checking access to ${docId}:`, error);
    }
  }

  console.log('\n✅ FGA Validation Complete.');
}

// ✅ Here is YOUR real user ID injected automatically:
const testUserId = 'google-oauth2|104645697642238009468';

validateUserAccess(testUserId).catch((err) => {
  console.error('❌ Validation script failed:', err);
  process.exit(1);
});
