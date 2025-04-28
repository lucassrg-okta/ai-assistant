// src/app/api/assistants/[assistant]/chat/route.ts

import { NextRequest } from 'next/server';
import { getToolsForUser } from '@/lib/tools/registry';
import { auth0 } from '@/lib/auth0';
import { openai } from '@ai-sdk/openai';
import { streamText, Tool } from 'ai';
import { setAIContext } from '@auth0/ai-vercel';
import { getSalesPrompt } from '@/prompts/sales-assistant';
import { getPersonalPrompt } from '@/prompts/personal-assistant';
import { getDefaultPrompt } from '@/prompts/default-assistant';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const assistant = pathname.split('/')[3]; // 'personal' or 'sales'

  const session = await auth0.getSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const timeZone = url.searchParams.get('timeZone') || 'UTC';
  const { messages, id: threadID } = await req.json();

  if (!Array.isArray(messages)) {
    return new Response('Invalid payload: messages must be an array', { status: 400 });
  }
  if (!threadID || typeof threadID !== 'string') {
    return new Response('Missing or invalid threadID', { status: 400 });
  }

  const system = getPersonalizedPrompt(session, assistant, timeZone);
  setAIContext({ threadID });

  // ✅ Only keep finalized messages (filter out tool "call" messages)
  const safeMessages = messages.filter(
    (m: any) =>
      m.type !== 'tool-invocation' || m.toolInvocation?.state === 'result'
  );

  const rawTools = getToolsForUser(session, assistant);
  const tools = Object.fromEntries(
    Object.entries(rawTools).filter(([_, tool]) => tool !== undefined)
  ) as Record<string, Tool<any, any>>;

  // ✅ STREAM RESPONSE CLEANLY (no onToolCall)
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: safeMessages,
    tools,
    system,
    maxSteps: 5,
    onError(error) {
      console.error('streamText error:', error);
    },
  });

  return result.toDataStreamResponse();
}

function getPersonalizedPrompt(session: any, assistant: string, timeZone: string): string {
  const { user } = session;
  const firstName = user?.given_name || user?.name || 'there';
  const orgName = user?.org_name || user?.app_metadata?.organization || null;
  const currentDate = new Date().toISOString().split('T')[0];

  if (assistant === 'sales') {
    return getSalesPrompt(firstName, orgName, currentDate, timeZone);
  }

  if (assistant === 'personal') {
    return getPersonalPrompt(firstName, currentDate, timeZone);
  }

  return getDefaultPrompt(currentDate, timeZone);
}
