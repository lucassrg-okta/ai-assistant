'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckCircle, PlusCircle, XCircle } from 'lucide-react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { linkAccount } from '@/lib/auth0/link-account';
import { unlinkAccount } from '@/lib/auth0/unlink-account';

type Props = {
    provider: string;
    label: string;
    icon: IconDefinition;
    className: string;
    isConnected: boolean;
    userId?: string;
  };
  
  export const LinkSocialAccountButton: React.FC<Props> = ({
    provider,
    label,
    icon,
    className,
    isConnected,
    userId, 
  }) => {
    return (
    <div className="flex items-center justify-between w-full max-w-md mb-3">
      <div className="flex items-center gap-2 text-gray-800">
        <FontAwesomeIcon icon={icon} className="text-xl" />
        <span>{label}</span>
      </div>

      {isConnected ? (
  <form action={unlinkAccount}>
    <input type="hidden" name="provider" value={provider} />
    <input type="hidden" name="user_id" value={userId || ''} />
    <button
  type="submit"
  disabled={!userId}
  className="text-red-600 text-sm flex items-center gap-1 border border-red-200 px-3 py-1.5 rounded hover:bg-red-50 disabled:opacity-50"
>
  <XCircle className="w-4 h-4" />
  Disconnect
</button>
  </form>
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
