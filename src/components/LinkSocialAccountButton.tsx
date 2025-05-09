'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { linkAccount } from '@/lib/auth0/link-account';
import { unlinkAccount } from '@/lib/auth0/unlink-account';

interface Props {
  provider: string;
  label: string;
  icon: IconDefinition;
  className: string;
  isConnected: boolean;
  userId?: string;
}

export const LinkSocialAccountButton: React.FC<Props> = ({
  provider,
  label,
  icon,
  className,
  isConnected,
  userId,
}) => {
  return (
    <div className="flex items-center justify-between gap-6 rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
          <FontAwesomeIcon icon={icon} className="text-xl text-gray-700" />
        </div>
        <p className="text-base font-medium text-gray-900">{label}</p>
      </div>

      <div>
        {isConnected ? (
          <form action={unlinkAccount}>
            <input type="hidden" name="provider" value={provider} />
            <input type="hidden" name="user_id" value={userId ?? ''} />
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition"
            >
              Disconnect
            </button>
          </form>
        ) : (
          <form action={linkAccount}>
            <input type="hidden" name="connection" value={provider} />
            <button
              type="submit"
              className={`px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${className}`}
            >
              Connect
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
