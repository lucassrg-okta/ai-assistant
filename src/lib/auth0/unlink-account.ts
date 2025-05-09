// src/lib/auth0/unlink-account.ts
'use server';

import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';

export async function unlinkAccount(formData: FormData): Promise<void> {
  const provider = formData.get('provider')?.toString();
  const userId = formData.get('user_id')?.toString();

  if (!provider || !userId) throw new Error('Missing parameters');

  const session = await auth0.getSession();
  const primaryUserId = session?.user?.sub;

  if (!primaryUserId) throw new Error('Not authenticated');

  // Get Management API token
  const tokenRes = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    console.error('Failed to get management token', tokenData);
    throw new Error('Unlink failed (token)');
  }

  const unlinkRes = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(primaryUserId)}/identities/${provider}/${userId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );

  if (!unlinkRes.ok) {
    const error = await unlinkRes.json();
    console.error('Unlink error:', error);
    throw new Error('Unlink failed');
  }

  // Optional: redirect or revalidate
  redirect('/profile'); // or no-op if using client refresh
}
