'use client';

import React, { useEffect, useState } from 'react';
import { useSocialProviders } from '@/lib/hooks/useSocialProviders';
import { LinkSocialAccountButton } from './LinkSocialAccountButton';
import type { Auth0Identity } from '@/lib/types/auth0identity';

export const ConnectedAccounts: React.FC = () => {
  const [identities, setIdentities] = useState<Auth0Identity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const providers = useSocialProviders();

  useEffect(() => {
    const fetchIdentities = async () => {
      try {
        const res = await fetch('/api/user/identities');
        if (!res.ok) {
          throw new Error('Failed to fetch identities');
        }

        const data = await res.json();
        setIdentities(data);
      } catch (err: unknown) {
        console.error('Error fetching user identities:', err);
        setError('Could not load connected accounts.');
      } finally {
        setLoading(false);
      }
    };

    fetchIdentities();
  }, []);

  const linkedProviderSet = new Set(identities.map((id) => id.provider));

  return (
    <div className="text-sm bg-white border border-gray-200 rounded p-6 mt-10 max-w-md w-full">
      <h2 className="text-lg font-semibold mb-3">Connected Accounts</h2>

      {loading && <p className="text-gray-500">Loading connected accounts...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && providers.map((p) => {
        const linkedIdentity = identities.find((id) => id.provider === p.provider);

        return (
            <LinkSocialAccountButton
            key={p.provider}
            provider={p.provider}
            label={p.label}
            icon={p.icon}
            className={p.buttonClass}
            isConnected={!!linkedIdentity}
            userId={linkedIdentity?.user_id} // ✅ pass it here
            />
        );
        })}
    </div>
  );
};
