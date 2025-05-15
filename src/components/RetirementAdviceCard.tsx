// src/components/RetirementAdviceCard.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  message: string;
}

export const RetirementAdviceCard: React.FC<Props> = ({ message }) => {
  return (
    <div className="bg-gray-100 hover:bg-gray-200 transition-colors text-gray-900 rounded-lg p-3 max-w-2xl text-sm overflow-auto max-h-[75vh]">
      <ReactMarkdown>{message}</ReactMarkdown>
    </div>
  );
};
