// src/app/api/user/unlink/route.ts
import { auth0 } from '@/lib/auth0';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth0.getSession();

  if (!session?.user?.sub) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { provider, user_id } = await req.json();

  if (!provider || !user_id) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

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

  const { access_token } = await tokenRes.json();

  const unlinkRes = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(session.user.sub)}/identities/${provider}/${user_id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!unlinkRes.ok) {
    const error = await unlinkRes.json();
    return NextResponse.json({ error }, { status: unlinkRes.status });
  }

  return NextResponse.json({ success: true });
}
