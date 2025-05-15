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
  className?: string;
  isConnected: boolean;
  userId?: string;
}

export const LinkSocialAccountButton: React.FC<Props> = ({
  provider,
  label,
  icon,
  className = '',
  isConnected,
  userId,
}) => {
  const containerBase = 'flex items-center justify-between w-full rounded-lg p-4 shadow-inner';
  const connectedBg = 'bg-gray-700 border border-gray-600';
  const notConnectedBg = 'bg-gray-800 border border-gray-600';

  return (
    <div className={`${containerBase} ${isConnected ? connectedBg : notConnectedBg}`}>      
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full">
          <FontAwesomeIcon icon={icon} className="text-2xl text-[#eb5424]" />
        </div>
        <p className="text-base font-medium text-white">{label}</p>
      </div>

      <div>
        {isConnected ? (
          <form action={unlinkAccount} className="">
            <input type="hidden" name="provider" value={provider} />
            <input type="hidden" name="user_id" value={userId ?? ''} />
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Disconnect
            </button>
          </form>
        ) : (
          <form action={linkAccount} className="">
            <input type="hidden" name="connection" value={provider} />
            <button
              type="submit"
              className={`px-5 py-2 text-sm font-semibold bg-orange-500 text-white rounded-md hover:bg-orange-600 transition ${className}`}
            >
              Connect
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
