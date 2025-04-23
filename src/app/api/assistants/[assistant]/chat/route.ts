import { getToolsForUser } from '@/lib/tools/registry';
import { auth0 } from '@/lib/auth0';
import { openai } from '@ai-sdk/openai';
import { streamText, Tool } from 'ai';
import { NextRequest } from 'next/server';
import { setAIContext } from '@auth0/ai-vercel';

export async function POST(req: NextRequest, { params }: { params: { assistant: string } }) {
  const assistant = params.assistant; // 'sales' or 'personal'
  const session = await auth0.getSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Parse the query parameters to get the client's timezone (default to 'UTC' if missing)
  const url = new URL(req.url);
  const timeZone = url.searchParams.get('timeZone') || 'UTC';

  // Read the JSON payload (messages and threadID)
  const { messages, id: threadID } = await req.json();
  if (!Array.isArray(messages)) {
    return new Response('Invalid payload: messages must be an array', { status: 400 });
  }
  if (!threadID || typeof threadID !== 'string') {
    return new Response('Missing or invalid threadID', { status: 400 });
  }

  // Inject the timezone into the system prompt for better context handling
  const system = getPersonalizedPrompt(session, assistant, timeZone);
  setAIContext({ threadID });

  const safeMessages = messages.filter(
    (m: any) => m.type !== 'tool-invocation' || m.toolInvocation?.state === 'result'
  );

  const rawTools = getToolsForUser(session, assistant);
  const tools = Object.fromEntries(
    Object.entries(rawTools).filter(([_, tool]) => tool !== undefined)
  ) as Record<string, Tool<any, any>>;

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

// Updated getPersonalizedPrompt to include timezone information
function getPersonalizedPrompt(session: any, assistant: string, timeZone: string): string {
  const { user } = session;
  const firstName = user?.given_name || user?.name || 'there';
  const orgName = user?.org_name || user?.app_metadata?.organization || null;
  const currentDate = new Date().toISOString().split('T')[0];

  const dateContext = `
Today's date is ${currentDate}.
Use this to interpret expressions like "tonight", "next Friday", or "in two days".
Always reason about date/time requests based on today's date and use ISO 8601 format for tool inputs.

Examples:
- "tonight" → 2025-04-23T18:00:00Z to 2025-04-23T23:59:59Z
- "tomorrow" → 2025-04-24T00:00:00Z to 2025-04-24T23:59:59Z
`;

  const timeZoneNote = `Note: The user's current timezone is ${timeZone}.`;

  if (assistant === 'sales') {
    const salesIntro = orgName
      ? `You are a helpful Sales Assistant working for ${orgName}.`
      : `You are a helpful Sales Assistant working for the user's company. Ask them which organization they're with if it's not clear.`;

    return `${salesIntro}

Greet ${firstName} and assist them in identifying business opportunities, supporting sales workflows, and offering practical recommendations.

Your responsibilities:
1. Understand Business Context:
   - Ask about their company, customers, or role.
   - If missing, ask: "Which company is this related to?"
   - Be adaptable to different industries and models.

2. Spot Opportunities:
   - Identify ways to improve productivity, reduce costs, or enhance experiences.
   - Make relevant and practical suggestions.

3. Assist with Sales Tasks:
   - Draft outreach, summarize meetings, prep content.
   - Suggest internal syncs or customer follow-ups if helpful.

4. Recommend Scheduling:
   - If scheduling makes sense, ask for:
     - Email(s)
     - Date and time
     - Meeting title
   - Confirm all details before using 'createCalendarEvent'.

5. Use Delegated Authorization:
   - Use *state: 'call'* to request user approval before scheduling.
   - Respect user rejections.

Respond in friendly Markdown. Format tool calls properly for AI SDK.

${dateContext}

${timeZoneNote}`;
  }

  if (assistant === 'personal') {
    return `You are a helpful personal assistant supporting ${firstName}'s daily tasks.
Greet them generally, but do not fetch user profile or personal data 
*unless the user explicitly requests it*. 

Never call the "userInfo" tool unless the user specifically says 
they need it or you have no other way to answer a direct user question 
about their own profile.

Greet them personally and suggest helpful actions like checking their calendar, summarizing tasks, or scheduling.
${dateContext}

${timeZoneNote}`;
  }

  return `You are an assistant.

${timeZoneNote}`;
}
