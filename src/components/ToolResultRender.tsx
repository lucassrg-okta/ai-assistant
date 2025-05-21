import React from 'react';
import ReactMarkdown from 'react-markdown';
import { UserProfileCard, UserProfile } from './UserProfileCard';
import { CalendarResultCard } from './CalendarResultCard';
import { SingleCalendarEventCard } from './SingleCalendarEventCard';
import { RetirementAdviceCard } from './RetirementAdviceCard';

export type ToolResult = {
  message?: string;
  user?: UserProfile;
  needsReauth?: boolean;
  tool_only?: boolean;
  events?: {
    title: string;
    start: string;
    end: string;
    location?: string;
    link?: string;
  }[];
  startDate?: string;
  endDate?: string;
  summary?: string;
  scheduledAt?: string;
  link?: string;
};

type Props = {
  result?: ToolResult;
  state?: 'call' | 'result';
  toolName?: string;
};

// Tools that require CIBA-style approval on device
const toolsThatRequireApproval = new Set([
  'calendarCreate',
  'acceptFinancialTerms',
]);

// Calendar tools
const calendarToolNames = new Set(['calendarView', 'calendarCreate']);

export const ToolResultRender: React.FC<Props> = ({ result, state, toolName }) => {
  // Handle tool invocation in 'call' state
  if (state === 'call') {
    const isApprovalTool = toolName && toolsThatRequireApproval.has(toolName);

    if (isApprovalTool) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded-lg shadow-sm text-sm">
          <p className="font-semibold mb-1">🔔 Approval Requested on Your Device</p>
          <p>
            A request has been sent to your mobile device for approval (CIBA flow).
            Please check your phone to continue.
          </p>
        </div>
      );
    }

    return (
      <div className="px-3 py-2 text-sm italic text-gray-500">
        The assistant is working on that…
      </div>
    );
  }

  if (!result) return null;

  // Suppress duplicate for getRetirementAdvice (rendered separately)
  if (toolName === 'getRetirementAdvice' && result.message) {
    return null;
  }
  
  const isCalendar = toolName && calendarToolNames.has(toolName);

  if (typeof result === 'object' && toolName === 'calendarView' && result.events?.length === 0) {
    // show raw message if present, otherwise a default notice
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 text-sm text-gray-800">
        {result.message ? (
          <ReactMarkdown>{result.message}</ReactMarkdown>
        ) : (
          <p>It looks like you have no events scheduled for this period.</p>
        )}
      </div>
    );
  }
  
  // Render single calendar event creation card
  if (toolName === 'calendarCreate' && result.summary && result.scheduledAt) {
    return (
      <SingleCalendarEventCard
        title={result.summary}
        date={result.scheduledAt}
        link={result.link}
        message={result.message}
      />
    );
  }

  // Render calendarView list
  if (isCalendar && result.events && result.events.length > 0 && !result.message) {
    return (
      <CalendarResultCard
        events={result.events}
        startDate={result.startDate}
        endDate={result.endDate}
      />
    );
  }

  // Render user profile card
  if (result.user?.email) {
    return (
      <div className="mt-6 w-full p-2">
        <div className="p-5">
          <UserProfileCard user={result.user} />
        </div>
      </div>
    );
  }

  // Render generic result message
  // if (result.message && !result.user?.email && !calendarToolNames.has(toolName ?? '')) {
    if (typeof result === 'string' ) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 text-sm text-gray-800 space-y-2 overflow-auto">
        <ReactMarkdown
          components={{
            strong: (props) => <strong className="font-semibold text-gray-900" {...props} />,
            em: (props) => <em className="italic text-gray-600" {...props} />,
            p: (props) => <p className="leading-relaxed text-sm text-gray-800" {...props} />,
            a: (props) => (
              <a
                className="text-orange-600 underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
          }}
        >
          {result}
        </ReactMarkdown>
      </div>
    );
  }

  // Render reauth state if explicitly flagged
  if (result.needsReauth && result.message) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded-lg shadow-sm text-sm">
        <p className="font-semibold mb-1">🔐 Authorization Required</p>
        <ReactMarkdown>{result.message}</ReactMarkdown>
      </div>
    );
  }

  return null;
};
