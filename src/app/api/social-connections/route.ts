// src/app/api/social-connections/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
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
      console.error('Failed to fetch token', tokenData);
      return NextResponse.json({ error: 'token_failed', details: tokenData }, { status: 500 });
    }

    const accessToken = tokenData.access_token;

    const strategies = ['google-oauth2', 'github', 'facebook'];
    const params = new URLSearchParams();
    strategies.forEach((s) => params.append('strategy', s));
    params.set('fields', 'name,display_name');
    params.set('include_fields', 'true');
    params.set('per_page', '100');

    const connRes = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/connections?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const connections = await connRes.json();

    if (!connRes.ok) {
      console.error('Failed to fetch connections', connections);
      return NextResponse.json({ error: 'connections_failed', details: connections }, { status: 500 });
    }

    return NextResponse.json(
      connections.map((conn: any) => ({
        provider: conn.name,
        label: conn.display_name || conn.name,
      }))
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Unhandled error in social-connections route', err);
    return NextResponse.json({ error: 'unhandled', message }, { status: 500 });
  }
}
