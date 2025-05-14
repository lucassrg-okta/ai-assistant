'use client';

import React from 'react';
import { useChat, Message } from '@ai-sdk/react';
import { useUser } from '@auth0/nextjs-auth0';
import ReactMarkdown from 'react-markdown';
import { useThreadID } from '@/lib/hooks/useThreadID';
import type { AssistantType } from '@/lib/types/assistants';
import { ToolResultRender } from './ToolResultRender';

export default function Chat({ assistant }: { assistant: AssistantType }) {
  const { user, isLoading } = useUser();
  const threadID = useThreadID(assistant);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isThinking,
  } = useChat({
    id: threadID,
    api: `/api/assistants/${assistant}/chat?timeZone=${encodeURIComponent(timeZone)}`,
    maxSteps: 5,
  });

  const filteredMessages = messages.filter(
    (message) =>
      !(
        message.parts?.[0]?.type === 'tool-invocation' &&
        message.parts?.[0]?.toolInvocation?.state === 'call'
      )
  );

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to chat.</div>;

  return (
    <div className="space-y-6">
      {filteredMessages.map((message: Message) => (
        <div
          key={message.id}
          className={`flex items-start space-x-2 transition-all duration-300 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.role === 'user' ? (
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-end">
                <div className="bg-blue-100 text-blue-900 rounded-lg p-3 max-w-2xl">
                  {message.parts?.map((part, index) =>
                    part.type === 'text' ? (
                      <div key={`text-${message.id}-${index}`} className="text-sm">
                        <ReactMarkdown>{part.text}</ReactMarkdown>
                      </div>
                    ) : null
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(message.createdAt ?? Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <img src={user.picture} alt="User" className="w-8 h-8 rounded-full" />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="text-xl">🤖</div>
              <div className="flex flex-col">
                <div className="bg-gray-100 text-gray-900 rounded-lg p-3 max-w-2xl">
                  {message.parts?.map((part, index) => {
                    if (part.type === 'text') {
                      return (
                        <div key={`text-${message.id}-${index}`} className="text-sm">
                          <ReactMarkdown>{part.text}</ReactMarkdown>
                        </div>
                      );
                    }

                    if (part.type === 'tool-invocation') {
                      const { state, toolName } = part.toolInvocation;

                      if (state === 'result') {
                        const result = (part.toolInvocation as any).result;
                        return (
                          <ToolResultRender
                            key={`tool-result-${message.id}-${index}`}
                            state="result"
                            result={result}
                            toolName={toolName}
                          />
                        );
                      }

                      if (state === 'call') {
                        return (
                          <ToolResultRender
                            key={`tool-call-${message.id}-${index}`}
                            state="call"
                            toolName={toolName}
                          />
                        );
                      }
                    }

                    return null;
                  })}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(message.createdAt ?? Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {isThinking && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 animate-pulse">
          <div className="text-xl">🤖</div>
          <span>Assistant is typing...</span>
        </div>
      )}

      <div className="chat-input-container mt-6">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <textarea
            className="message-input"
            placeholder="Ask a question"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
          />
          <button type="submit" className="run-button">Submit</button>
        </form>
      </div>
    </div>
  );
}
