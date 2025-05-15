'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useSocialProviders } from '@/lib/hooks/useSocialProviders';
import { LinkSocialAccountButton } from './LinkSocialAccountButton';
import type { Auth0Identity } from '@/lib/types/auth0identity';

export const ConnectedAccounts: React.FC = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const [identities, setIdentities] = useState<Auth0Identity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const providers = useSocialProviders();

  useEffect(() => {
    const fetchIdentities = async () => {
      try {
        const res = await fetch('/api/user/identities');
        if (!res.ok) throw new Error('Failed to fetch identities');
        const data = await res.json();
        setIdentities(data);
      } catch (err: unknown) {
        console.error(err);
        setError('Could not load linked accounts.');
      } finally {
        setLoading(false);
      }
    };
    fetchIdentities();
  }, []);

  if (loading || isUserLoading) {
    return <p className="text-sm text-gray-400">Loading linked accounts...</p>;
  }
  if (error || !user?.sub) {
    return <p className="text-sm text-red-500">{error ?? 'User not found'}</p>;
  }

  const isAnyLinkable = providers.some(p => !identities.some(id => `${id.provider}|${id.user_id}` === user.sub && id.provider === p.provider));
  if (!isAnyLinkable) return null;

  return (
    <div className="mt-10 max-w-3xl w-full mx-auto p-6 bg-gray-800 border border-gray-700 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-4">Linked Accounts</h2>
      <div className="space-y-4">
        {providers.map((p) => {
          const linked = identities.find(id => id.provider === p.provider);
          return (
            <LinkSocialAccountButton
              key={p.provider}
              provider={p.provider}
              label={p.label}
              icon={p.icon}
              className={p.buttonClass}
              isConnected={!!linked}
              userId={linked?.user_id}
            />
          );
        })}
      </div>
    </div>
  );
};
