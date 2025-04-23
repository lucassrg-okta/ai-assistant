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

  // Get the client's current timezone from the browser
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Pass the timezone as a query parameter to the chat API
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
  } = useChat({
    id: threadID,
    api: `/api/assistants/${assistant}/chat?timeZone=${encodeURIComponent(timeZone)}`,
    maxSteps: 5,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to chat.</div>;

  return (
    <div className="space-y-6">
      {messages.map((message: Message) => (
        <div
          key={message.id}
          className={message.role === 'user' ? 'user-message' : 'bot-message'}
        >
          <strong>
            {message.role === 'user' ? (
              <img
                src={user.picture}
                alt="User"
                className="inline-block w-6 h-6 rounded-full mr-2"
              />
            ) : (
              '🤖'
            )}
          </strong>

          {message.parts?.map((part, index) => {
            if (part.type === 'text') {
              const isProfileRepeat =
                part.text.includes('Your email is') &&
                messages.some(m =>
                  m.parts?.some(p =>
                    p.type === 'tool-invocation' &&
                    p.toolInvocation?.state === 'result' &&
                    (p.toolInvocation as any)?.result?.user
                  )
                );

              const isReauthRepeat =
                (part.text.includes('connect your Google Calendar') ||
                  part.text.includes('need permission')) &&
                messages.some(m =>
                  m.parts?.some(p =>
                    p.type === 'tool-invocation' &&
                    p.toolInvocation?.state === 'result' &&
                    (p.toolInvocation as any)?.result?.needsReauth
                  )
                );

              if (isProfileRepeat || isReauthRepeat) return null;

              return (
                <div key={`text-${message.id}-${index}`} className="text-sm text-zinc-800">
                  <ReactMarkdown>{part.text}</ReactMarkdown>
                </div>
              );
            }

            if (
              part.type === 'tool-invocation' &&
              part.toolInvocation?.state === 'result' &&
              'result' in part.toolInvocation
            ) {
              const result = (part.toolInvocation as any).result;
              return (
                <React.Fragment key={`tool-content-${index}`}>
                  {result?.user && result?.user.email && (
                    <div className="my-4 flex justify-start">
                      <div className="bg-white border rounded-lg p-4 shadow-md max-w-md">
                        {result.message && (
                          <div className="text-sm text-zinc-700 mb-3">
                            <ReactMarkdown>{result.message}</ReactMarkdown>
                          </div>
                        )}
                        <UserProfileCard user={result.user} />
                      </div>
                    </div>
                  )}

                  {result.message && !result?.user?.email && (
                    <div className="text-sm text-zinc-800 mb-3">
                      <ReactMarkdown>{result.message}</ReactMarkdown>
                    </div>
                  )}

                  {result.needsReauth && result.message && (
                    <div className="bg-yellow-100 border border-yellow-300 p-4 rounded mb-2">
                      <ReactMarkdown>{result.message}</ReactMarkdown>
                    </div>
                  )}
                </React.Fragment>
              );
            }

            // For tool invocations with state "call", notify the user that an authorization request was sent.
            if (part.type === 'tool-invocation' && part.toolInvocation.state === 'call') {
              return (
                <div
                  key={`tool-call-${part.toolInvocation.toolCallId}`}
                  className="bg-blue-50 border p-4 rounded mb-4"
                >
                  <p className="mb-2 font-semibold">
                    Authorization Request Sent
                  </p>
                  <p className="text-sm text-zinc-800">
                    An authorization request has been sent to your device. Please check your mobile app and approve the request to schedule the meeting.
                  </p>
                </div>
              );
            }

            return null;
          })}
        </div>
      ))}

      <div className="chat-input-container">
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
          <button type="submit" className="run-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
