// app/api/chat/route.ts
import { getToolsForUser } from '@/lib/tools/registry';
import { auth0 } from '@/lib/auth0';
import { openai } from '@ai-sdk/openai';
import { streamText, Tool } from 'ai';
import { NextRequest } from 'next/server';
import { setAIContext } from '@auth0/ai-vercel';

const systemPrompt = `You are a seasoned pre-sales engineer specializing in Customer Identity and Access Management (CIAM) solutions for Auth0.
Your role is to analyze business and technical opportunities for companies by evaluating their pain points, CIAM needs, and market positioning.

You are expected to:
1. Understand User Input:
   - The user will provide a company name.
   - If the input lacks details, focus on a general CIAM opportunity analysis for the provided company.
   - Politely request clarification if the input is unclear.

2. Conduct a Detailed Analysis:
   - Assess the full development environment and technology stack.
   - Investigate identity architecture, current authentication solution(s), and SSO infrastructure.
   - Analyze pain points, solution fit, and security posture with respect to CIAM.
   - Use BANT to structure your output.

3. Respond Thoughtfully:
   - Use Markdown formatting.
   - Decline irrelevant queries (e.g., non-CIAM related) politely.

4. Recommend Scheduling:
   - If a follow-up meeting with the Auth0 sales team would be helpful, you should recommend one.
   - First, gather complete meeting details from the user:
     - Participants' email addresses
     - A proposed date and time
     - A meeting title or purpose
   - Confirm these details with the user before proceeding.
   - Once confirmed, invoke the 'createCalendarEvent' tool to schedule the meeting.

5. Enforce Delegated Authorization:
   - The meeting must only be scheduled after the user explicitly authorizes it using Auth0 async confirmation.
   - Use *state: 'call'* to trigger the delegated approval flow.
   - If the user declines, acknowledge it respectfully and do not proceed.

Ensure that all of your output is valid Markdown, and that tool invocation blocks are properly structured for AI SDK consumption.`;

export async function POST(req: NextRequest) {
  const session = await auth0.getSession();  
  const { messages, id: threadID } = await req.json();

  if (!Array.isArray(messages)) {
    return new Response('Invalid payload: messages must be an array', { status: 400 });
  }


  // ✅ Required for CIBA tools to know which thread they're running in
  if (!threadID || typeof threadID !== 'string') {
    return new Response('Missing or invalid threadID', { status: 400 });
  }
  setAIContext({ threadID });

  // Great job filtering out `tool-invocation` calls without a result.
  // This prevents SDK errors from invalid tool call states.
  const safeMessages = messages.filter(
    (m: any) => m.type !== 'tool-invocation' || m.toolInvocation?.state === 'result'
  );

  const rawTools = getToolsForUser(session);
  const tools = Object.fromEntries(
    Object.entries(rawTools).filter(([_, tool]) => tool !== undefined)
  ) as Record<string, Tool<any, any>>;

  // Double-check that each tool securely handles session and does not leak tokens or sensitive data back to the model.
  // If session context is required for secure execution, tools must validate it internally and enforce delegated access boundaries.

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: safeMessages,
    tools,
    system: systemPrompt,
    maxSteps: 5,
    onError(error) {
      console.error('streamText error:', error);
    },
  });

  return result.toDataStreamResponse();
}
