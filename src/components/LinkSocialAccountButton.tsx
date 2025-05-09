'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckCircle, PlusCircle } from 'lucide-react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { linkAccount } from '@/lib/auth0/link-account';

type Props = {
  provider: string;
  label: string;
  icon: IconDefinition;
  className: string;
  isConnected: boolean;
};

export const LinkSocialAccountButton: React.FC<Props> = ({
  provider,
  label,
  icon,
  className,
  isConnected,
}) => {
  return (
    <div className="flex items-center justify-between w-full max-w-md mb-3">
      <div className="flex items-center gap-2 text-gray-800">
        <FontAwesomeIcon icon={icon} className="text-xl" />
        <span>{label}</span>
      </div>

      {isConnected ? (
        <button
          disabled
          className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
        >
          <CheckCircle className="w-4 h-4 text-green-600" />
          Connected
        </button>
      ) : (
        <form action={linkAccount}>
          <input type="hidden" name="connection" value={provider} />
          <button
            type="submit"
            className={`flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-md transition ${className}`}
          >
            <PlusCircle className="w-4 h-4" />
            Connect
          </button>
        </form>
      )}
    </div>
  );
};
