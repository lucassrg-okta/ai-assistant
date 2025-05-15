'use client';

import React, { useEffect, useRef } from 'react';
import { useChat, Message } from '@ai-sdk/react';
import { useUser } from '@auth0/nextjs-auth0';
import ReactMarkdown from 'react-markdown';
import { useThreadID } from '@/lib/hooks/useThreadID';
import type { AssistantType } from '@/lib/types/assistants';
import { ToolResultRender } from './ToolResultRender';

// Tools whose UI replaces plain-text messages
const toolsThatHandleTheirOwnUI = new Set([
  'calendarView',
  'calendarCreate',
  'userInfo',
]);

// Human-friendly titles
const assistantTitles: Record<AssistantType, string> = {
  sales: 'Sales Assistant',
  personal: 'Personal Assistant',
};

export default function Chat({ assistant }: { assistant: AssistantType }) {
  const { user, isLoading } = useUser();
  const threadID = useThreadID(assistant);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id: threadID,
    api: `/api/assistants/${assistant}/chat?timeZone=${encodeURIComponent(timeZone)}`,
    maxSteps: 5,
  });

  // auto-scroll inside grey container
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full text-gray-400">Loading chat…</div>;
  }
  if (!user) {
    return <div className="flex justify-center items-center h-full text-gray-400">Please log in to chat.</div>;
  }

  const title = assistantTitles[assistant] || assistant;

  return (
    <div className="flex flex-col h-[85vh] bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 py-15 z-20 h-16 bg-black flex items-center justify-center px-6">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      </header>

      {/* Chat area */}
      <div className="flex flex-col flex-grow overflow-hidden px-6 py-4">
        {/* Scrollable grey container */}
        <div className="flex-grow overflow-hidden">
          <div
            ref={scrollRef}
            className="h-full w-full max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-lg p-6 space-y-6 overflow-y-auto"
          >
            {messages.map((message: Message) => {
              // skip initial tool call
              const first = message.parts?.[0];
              if (
                first?.type === 'tool-invocation' &&
                first.toolInvocation?.state === 'call' &&
                !('result' in first.toolInvocation)
              ) {
                return null;
              }

              // detect markdown-only or custom UI
              const toolPart = message.parts?.find((p) => p.type === 'tool-invocation') as any;
              const toolName = toolPart?.toolInvocation?.toolName;
              const isOnlyMarkdown =
                message.parts?.length === 2 &&
                message.parts[0].type === 'text' &&
                message.parts[1].type === 'tool-invocation' &&
                message.parts[1].toolInvocation?.state === 'result' &&
                message.parts[1].toolInvocation?.result?.message?.trim() ===
                  (message.parts[0] as any).text?.trim();
              const hasCustomUI = toolName && toolsThatHandleTheirOwnUI.has(toolName);
              const shouldRenderText = !(isOnlyMarkdown || hasCustomUI);

              const bubbleBase = 'relative rounded-2xl shadow-md p-4 max-w-[80%]';
              const userBubble = 'bg-orange-600 text-white self-end';
              const assistBubble = 'bg-gray-800 text-gray-100 self-start';
              const timeColor = message.role === 'user' ? 'text-orange-200' : 'text-gray-400';

              return (
                <div key={message.id} className="flex items-end w-full space-x-2">
                  {message.role === 'assistant' && (
                    <div className="text-orange-400 text-2xl">🤖</div>
                  )}

                  <div className={`${bubbleBase} ${message.role === 'user' ? userBubble : assistBubble}`}>  
                    {message.parts?.map((part, i) => {
                      if (part.type === 'text' && shouldRenderText) {
                        return (
                          <div key={i} className="mb-2">
                            <ReactMarkdown>{(part as any).text}</ReactMarkdown>
                          </div>
                        );
                      }
                      if (part.type === 'tool-invocation') {
                        const invocation = part.toolInvocation;
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
                        return <ToolResultRender key={i} state="call" toolName={toolName} />;
                      }
                      return null;
                    })}
                    <div className={`text-xs ${timeColor} mt-1 text-right`}>
                      {new Date(
                        message.createdAt ?? Date.now()
                      ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <img
                      src={user.picture}
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-orange-500"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Input */}
        <div className="w-full max-w-4xl mx-auto mt-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 bg-gray-800 rounded-full">
            <textarea
              className="flex-1 bg-transparent resize-none outline-none text-white placeholder-gray-500 text-base leading-tight px-4 py-2 h-12"
              placeholder="Ask a question..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); handleSubmit(e);
                }
              }}
              rows={1}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition h-12"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
