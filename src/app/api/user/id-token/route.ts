// route.ts
import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await auth0.getSession(req); // ✅ now you're passing a NextRequest

  if (!session?.idToken) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });
  }

  return NextResponse.json({ id_token: session.idToken });
}
