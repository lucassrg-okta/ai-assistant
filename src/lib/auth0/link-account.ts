// lib/auth0/link-account.ts
'use server';

import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';

export async function linkAccount(formData: FormData): Promise<void> {
  const connection = formData.get('connection')?.toString();
  if (!connection) throw new Error('Missing connection name');

  const session = await auth0.getSession();
  const id_token_hint = session?.tokenSet?.idToken;

  if (!id_token_hint) {
    console.error('Missing ID token for linking. Session:', session);
    throw new Error('You must be logged in to link an account.');
  }

  const params = new URLSearchParams({
    scope: 'link_account openid profile offline_access',
    requested_connection: connection,
    id_token_hint,
    returnTo: '/profile',
  });

  redirect(`/auth/login?${params.toString()}`); // ✅ correct path for App Router
}
