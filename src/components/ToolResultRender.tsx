// src/components/ToolResultRender.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { UserProfileCard, UserProfile } from './UserProfileCard';

export type ToolResult = {
  message?: string;
  user?: UserProfile;
  needsReauth?: boolean;
  tool_only?: boolean;
};

type Props = {
  result?: ToolResult;
  state?: 'call' | 'result';
  toolName?: string;
};


const toolsThatRequireApproval = new Set([
  'calendarCreate',
  'acceptFinancialTerms',
]);

export const ToolResultRender: React.FC<Props> = ({ result, state, toolName }) => {
  if (state === 'call') {
    const isApprovalTool = toolName && toolsThatRequireApproval.has(toolName);

    if (isApprovalTool) {
        return (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-yellow-800">
            <p className="font-semibold mb-1">🔔 Waiting for Authorization...</p>
            <p>The assistant is waiting for you to approve this request before continuing.</p>
        </div>
        );
    }

    return (
        <div className="rounded px-3 py-2">
          <p className="text-sm text-gray-600 italic">
            The assistant is thinking…
          </p>
        </div>
      );
    }      
  

  if (!result) return null;

  if (result.user?.email) {
    return (
      <div className="flex flex-col space-y-3">
        <UserProfileCard user={result.user} />
      </div>
    );
  }

  if (result.message && !result.user?.email) {
    return (
      <div className="text-sm text-zinc-800">
        <ReactMarkdown>{result.message}</ReactMarkdown>
      </div>
    );
  }

  if (result.needsReauth && result.message) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-yellow-800">
        <p className="font-semibold mb-1">🔐 Authorization Required</p>
        <ReactMarkdown>{result.message}</ReactMarkdown>
      </div>
    );
  }

  return null;
};
