// src/app/api/user/identities/route.ts
import { auth0 } from '@/lib/auth0';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const session = await auth0.getSession();

  if (!session?.user?.sub) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

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

  if (!tokenRes.ok) {
    console.error('Failed to get management token', tokenData);
    return NextResponse.json({ error: 'token_failed' }, { status: 500 });
  }

  const userId = session.user.sub;

  const userRes = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}?fields=identities&include_fields=true`,
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );

  const user = await userRes.json();

  if (!userRes.ok) {
    return NextResponse.json({ error: 'user_fetch_failed', details: user }, { status: 500 });
  }

  return NextResponse.json(user.identities);
}
