/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { useChat, Message } from '@ai-sdk/react';
import { useUser } from '@auth0/nextjs-auth0';
import ReactMarkdown from 'react-markdown';
import { useThreadID } from '@/lib/hooks/useThreadID';
import type { AssistantType } from '@/lib/types/assistants';
import { UserProfileCard } from '@/components/UserProfileCard';

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
            <>
              <div className="flex items-center space-x-2">
                <div className="flex flex-col items-end">
                  <div className="bg-blue-100 hover:bg-blue-200 transition-colors text-blue-900 rounded-lg p-3 max-w-2xl">
                    {message.parts?.map((part, index) =>
                      part.type === 'text' ? (
                        <div key={`text-${message.id}-${index}`} className="text-sm">
                          <ReactMarkdown>{part.text}</ReactMarkdown>
                        </div>
                      ) : null
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(message.createdAt ?? Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <img
                  src={user.picture}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className="text-xl">🤖</div>
                <div className="flex flex-col">
                  <div className="bg-gray-100 hover:bg-gray-200 transition-colors text-gray-900 rounded-lg p-3 max-w-2xl">
                    {message.parts?.map((part, index) => {
                      if (part.type === 'text') {
                        return (
                          <div key={`text-${message.id}-${index}`} className="text-sm">
                            <ReactMarkdown>{part.text}</ReactMarkdown>
                          </div>
                        );
                      }
                      if (
                        part.type === 'tool-invocation' &&
                        part.toolInvocation?.state === 'result' &&
                        'result' in part.toolInvocation
                      ) {
                        const toolResult = (part.toolInvocation as any).result;
                        return (
                          <div key={`tool-profile-${index}`} className="flex flex-col space-y-2">
                            {toolResult?.user && toolResult?.user.email && (
                              <>
                                {toolResult.message && (
                                  <div className="text-sm text-zinc-700">
                                    <ReactMarkdown>{toolResult.message}</ReactMarkdown>
                                  </div>
                                )}
                                <UserProfileCard user={toolResult.user} />
                              </>
                            )}
                            {toolResult?.message && !toolResult?.user?.email && (
                              <div className="text-sm text-zinc-800">
                                <ReactMarkdown>{toolResult.message}</ReactMarkdown>
                              </div>
                            )}
                          </div>
                        );
                      }
                      if (part.type === 'tool-invocation' && part.toolInvocation?.state === 'call') {
                        return (
                          <div
                            key={`tool-call-${part.toolInvocation.toolCallId}`}
                            className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-yellow-800"
                          >
                            <p className="font-semibold mb-1">🔔 Waiting for Authorization...</p>
                            <p>Please approve the authorization request sent to your mobile device.</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(message.createdAt ?? Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Typing indicator */}
      {isThinking && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 animate-pulse">
          <div className="text-xl">🤖</div>
          <span>Assistant is typing...</span>
        </div>
      )}

      {/* Input Area */}
      <div className="chat-input-container mt-6">
        <form
          onSubmit={handleSubmit}
          className="chat-input-form"
        >
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
          <button type="submit" className="run-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
