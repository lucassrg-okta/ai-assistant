// src/components/SingleCalendarEventCard.tsx
import React from 'react';

interface Props {
  title: string;
  date: string;
  timeRange?: string;
  link?: string;
  message?: string;
}

const formatDate = (iso?: string) => {
  const date = iso ? new Date(iso) : null;
  return date instanceof Date && !isNaN(date.getTime())
    ? date.toLocaleDateString(undefined, {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
      })
    : '—';
};

const formatTime = (iso?: string) => {
  const date = iso ? new Date(iso) : null;
  return date instanceof Date && !isNaN(date.getTime())
    ? date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : '—';
};

export const SingleCalendarEventCard: React.FC<Props> = ({ title, date, timeRange, link, message }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 text-sm text-gray-800">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        {message || 'Your meeting has been scheduled!'}
      </h3>
      <div className="space-y-2">
        <p><span className="font-medium">Title:</span> {title}</p>
        <p><span className="font-medium">Date:</span> {formatDate(date)}</p>
        <p><span className="font-medium">Time:</span> {timeRange || formatTime(date)}</p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cyan-600 underline"
          >
            View Event
          </a>
        )}
      </div>
    </div>
  );
};
