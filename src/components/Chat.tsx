// src/components/Chat.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChat, Message } from '@ai-sdk/react';
import { useUser } from '@auth0/nextjs-auth0';
import ReactMarkdown from 'react-markdown';
import { useThreadID } from '@/lib/hooks/useThreadID';
import type { AssistantType } from '@/lib/types/assistants';
import { ToolResultRender } from './ToolResultRender';
import { Clipboard, ArrowRight } from 'lucide-react'

const toolsThatHandleTheirOwnUI = new Set([
  'calendarView',
  'calendarCreate',
  // other tools that render their own UI
]);

const assistantTitles: Record<AssistantType, string> = {
  sales: 'Sales Assistant',
  personal: 'Personal Assistant',
};

function isFullMarkdownMessage(message: Message) {
  if (!message.parts || message.parts.length !== 2) return false;
  const [first, second] = message.parts;
  return (
    first.type === 'text' &&
    second.type === 'tool-invocation' &&
    second.toolInvocation?.state === 'result' &&
    second.toolInvocation?.result?.message?.trim() === (first as any).text?.trim()
  );
}



export default function Chat({ assistant }: { assistant: AssistantType }) {
  const { user, isLoading } = useUser();
  const threadID = useThreadID(assistant);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;  
  const [showExamples, setShowExamples] = useState(false);

  const hideTimestamps = process.env.NEXT_PUBLIC_HIDE_TIMESTAMPS === 'true';
  const examples = [
    'Who am I?',
    'Schedule a meeting with my financial advisor tomorrow at 1pm',
    'Show me my upcoming events this week',    
    'Provide me some retirement advice in preparation for my meeeting',
    'Provide me some advanced retirement advice',
  ];


  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit } =
    useChat({
      id: threadID,
      api: `/api/assistants/${assistant}/chat?timeZone=${encodeURIComponent(timeZone)}`,
      maxSteps: 5,
    });

  // Auto-scroll to bottom on each new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading)
    return <div className="flex justify-center items-center h-full text-gray-400">Loading chat…</div>;
  if (!user)
    return <div className="flex justify-center items-center h-full text-gray-400">Please log in to chat.</div>;

  const title = assistantTitles[assistant] || assistant;
  const pickExample = (ex: string) => {
    // simulate a change event
    handleInputChange({
      target: { value: ex }
    } as React.ChangeEvent<HTMLTextAreaElement>);
    setShowExamples(false);
  };


  return (
    <div className="flex flex-col h-[85vh] bg-black text-white">
      {/* Title */}
      <header className="sticky top-0 z-10 bg-black py-15">
        <h1 className="text-center text-3xl font-bold">{title}</h1>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden px-6 py-4">
        <div className="h-full max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-lg p-4 overflow-y-auto">
          {messages.map((message: Message) => {
            // skip tool invocation CALL entries
            const first = message.parts?.[0];
            if (
              first?.type === 'tool-invocation' &&
              first.toolInvocation?.state === 'call' &&
              !('result' in first.toolInvocation)
            ) {
              return null;
            }

            const toolPart = message.parts?.find(p => p.type === 'tool-invocation') as any;
            const toolName = toolPart?.toolInvocation?.toolName;
            const isOnlyMd = isFullMarkdownMessage(message);
            const hasCustomUI = toolName && toolsThatHandleTheirOwnUI.has(toolName);
            const shouldRenderText = !(isOnlyMd || hasCustomUI);

            const bubbleBase = 'relative rounded-2xl shadow-md p-4 max-w-[80%]';
            const userBubble = 'bg-orange-600 text-white self-end';
            const assistBubble = 'bg-gray-800 text-gray-100 self-start';
            const timeColor = message.role === 'user' ? 'text-orange-200' : 'text-gray-400';


            return (
              <div key={message.id} className="flex items-end w-full space-x-3 mb-3">
                {message.role === 'assistant' && (
                  <div className="text-2xl text-orange-400">🤖</div>
                )}

                <div className={`${bubbleBase} ${message.role === 'user' ? userBubble : assistBubble}`}>  
                  {message.parts?.map((part, i) => {
                    // Text part
                    if (part.type === 'text' && shouldRenderText) {
                      return (
                        <div key={i} className="prose prose-sm prose-invert mb-2">
                          <ReactMarkdown>{(part as any).text}</ReactMarkdown>
                        </div>
                      );
                    }

                    // Tool invocations
                    if (part.type === 'tool-invocation') {
                      const invocation = part.toolInvocation;

                      // ** short-circuit: don't show card for retirement advice **
                      if (toolName === 'getRetirementAdvice' && invocation.state === 'result') {
                        return null;
                      }

                      if (invocation.state === 'result' && 'result' in invocation) {
                        return (
                          <ToolResultRender
                            key={i}
                            state="result"
                            toolName={toolName}
                            result={invocation.result}
                          />
                        );
                      }

                      // for 'call' or 'partial-call'
                      return (
                        <ToolResultRender key={i} state="call" toolName={toolName} />
                      );
                    }

                    return null;
                  })}

                {!hideTimestamps && (
                  <div className={`text-xs ${timeColor} mt-1 text-right`}>   
                    {new Date(message.createdAt ?? Date.now()).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  )}
                </div>
                  

                {message.role === 'user' && (
                  <img
                    src={user.picture!}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full border-2 border-orange-500"
                  />
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input + Examples */}
      <div className="sticky bottom-0 bg-black py-4">
        <div className="max-w-4xl mx-auto relative">
          <form
            onSubmit={handleSubmit}
            className="h-12 flex items-center gap-2 bg-gray-800 rounded-full px-4"
          >
                        <button
              type="button"
              onClick={() => setShowExamples(x => !x)}
              className="px-3 py-0 text-small bg-gray-700 hover:bg-gray-600 rounded-full text-white transition"
            >
              
            <ArrowRight className="w-3 h-5 mr-3 flex-shrink-0 text-gray-400 hover:text-gray-200" />
            </button>

            <textarea
              className="flex-1 bg-transparent resize-none outline-none text-white placeholder-gray-500 px-4 py-2 h-full text-base"
              placeholder="Ask a question..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
            />
            <button
              type="submit"
              className="px-6 py-1 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition"
            >
              Send
            </button>
          </form>

          {showExamples && (
            <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-[80vw] max-w-xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {examples.map(ex => (
                <button
                  key={ex}
                  onClick={() => pickExample(ex)}
                  className="w-full text-left text-white px-4 py-3 border-b border-gray-700 last:border-none hover:bg-gray-700 transition"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}