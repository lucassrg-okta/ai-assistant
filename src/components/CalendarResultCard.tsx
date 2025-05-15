// src/components/CalendarResultCard.tsx
import React from 'react';

interface CalendarEvent {
  kind?: string;
  summary?: string;
  title?: string;
  start?: { dateTime?: string } | string;
  end?: { dateTime?: string } | string;
  location?: string;
  htmlLink?: string;
  link?: string;
}

interface Props {
  events?: CalendarEvent[];
  startDate?: string;
  endDate?: string;
}

const formatDate = (input?: string | { dateTime?: string }) => {
  const iso = typeof input === 'string' ? input : input?.dateTime;
  const date = iso ? new Date(iso) : null;
  return date instanceof Date && !isNaN(date.getTime())
    ? date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—';
};

export const CalendarResultCard: React.FC<Props> = ({ events, startDate, endDate }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 text-sm text-gray-800">
      <h3 className="text-base font-semibold mb-4 text-gray-900">Your upcoming events</h3>
      <ul className="space-y-4">
        {(!events || events.length === 0) && (
          <li className="text-sm text-gray-500">No events scheduled.</li>
        )}
        {events?.map((event, idx) => {
          const title = event.title || event.summary || 'Untitled Event';
          const start = formatDate(event.start);
          const end = formatDate(event.end);
          const link = event.link || event.htmlLink;

          return (
            <li
              key={idx}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 transition shadow-sm"
            >
              <p className="font-medium text-gray-900 mb-1">{title}</p>
              <p className="text-xs text-gray-600">🕒 {start} → {end}</p>
              {event.location && <p className="text-xs text-gray-500">📍 {event.location}</p>}
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-600 underline"
                >
                  View event
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
