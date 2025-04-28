import dotenv from 'dotenv';
dotenv.config(); // ✅ Load env

import { getFgaClient } from '@/lib/fga/client'; // ✅ Now only loads when needed

const fga = getFgaClient(); // ✅ init after dotenv loaded


/** Checks if a user can read a given document */
export async function canReadDoc(userId: string, docId: string) {
  const allowed = await fga.check({
    user: `user:${userId}`,
    relation: 'reader',
    object: `doc:${docId}`,
  });

  return allowed.allowed;
}

/** Checks if a user has accepted a given policy */
export async function hasAcceptedTerms(userId: string, policyId: string) {
  const allowed = await fga.check({
    user: `user:${userId}`,
    relation: 'accepted_terms',
    object: `policy:${policyId}`,
  });

  return allowed.allowed;
}

/** Checks if a user is a member of a specific tier (e.g., virtual, live) */
export async function isMemberOfTier(userId: string, tierId: string) {
  const allowed = await fga.check({
    user: `user:${userId}`,
    relation: 'member',
    object: `tier:${tierId}`,
  });

  return allowed.allowed;
}
