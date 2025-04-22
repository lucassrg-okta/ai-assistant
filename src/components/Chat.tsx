'use client';

import React from 'react';
import { useChat, Message } from '@ai-sdk/react';
import { useUser } from '@auth0/nextjs-auth0';
import ReactMarkdown from 'react-markdown';
import { useThreadID } from '@/lib/hooks/useThreadID';



export default function Chat() {
  const { user, isLoading } = useUser();
  const threadID = useThreadID();
  console.log('Thread ID being used by useChat:', threadID);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
  } = useChat({
    id: threadID,
    api: '/api/chat',
    maxSteps: 5,
  });

  const handleToolApprove = async (toolCallId: string, args: any, toolName: string) => {
    try {
      const result = await fetch(`/api/tools/${toolName}`, {
        method: 'POST',
        body: JSON.stringify(args),
        headers: { 'Content-Type': 'application/json' },
      }).then(res => res.json());

      await addToolResult({ toolCallId, result });
    } catch (err: any) {
      await addToolResult({
        toolCallId,
        result: {
          status: 'error',
          message: 'Tool execution failed: ' + err.message,
        },
      });
    }
  };

  const handleToolReject = async (toolCallId: string) => {
    await addToolResult({
      toolCallId,
      result: {
        status: 'rejected',
        message: 'User declined to run this tool.',
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to chat.</div>;

  return (
    <>
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
            // ✅ Handle plain text
            if (part.type === 'text') {
              return (
                <ReactMarkdown key={`text-${message.id}-${index}`}>
                  {part.text}
                </ReactMarkdown>
              );
            }

            // ✅ Handle tool results
            if (part.type === 'tool-invocation' && part.toolInvocation.state === 'result') {
              const result = part.toolInvocation.result;

              if (result?.needsReauth && result.message) {
                return (
                  <div key={`reauth-${index}`} className="bg-yellow-100 border border-yellow-300 p-4 rounded mb-2">
                    <ReactMarkdown>{result.message}</ReactMarkdown>
                  </div>
                );
              }

              return (
                <div key={`tool-result-${index}`} className="bg-zinc-50 border rounded p-3 my-2">
                  <strong>Tool Result:</strong>
                  <pre className="mt-2 text-sm text-zinc-700">{JSON.stringify(result, null, 2)}</pre>
                </div>
              );
            }

            // ✅ Handle interactive tool approval
            if (part.type === 'tool-invocation' && part.toolInvocation.state === 'call') {
              const callId = part.toolInvocation.toolCallId;
              const args = part.toolInvocation.args;
              const toolName = part.toolInvocation.toolName;

              return (
                <div key={`tool-call-${callId}`} className="bg-blue-50 border p-4 rounded mb-4">
                  <p className="mb-2 font-semibold">⚙️ Tool Request: <code>{toolName}</code></p>
                  <pre className="text-sm bg-white border rounded p-2">{JSON.stringify(args, null, 2)}</pre>
                  <div className="mt-3 flex gap-4">
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded"
                      onClick={() => handleToolApprove(callId, args, toolName)}
                    >
                      ✅ Yes, do it
                    </button>
                    <button
                      className="bg-gray-300 px-4 py-2 rounded"
                      onClick={() => handleToolReject(callId)}
                    >
                      ❌ No
                    </button>
                  </div>
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
    <button
      type="submit"
      className="run-button"
    >
      Submit
    </button>
  </form>
</div>
    </>
  );
}
