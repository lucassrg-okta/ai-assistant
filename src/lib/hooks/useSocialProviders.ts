// src/lib/hooks/useSocialProviders.ts
import { useEffect, useState } from 'react';
import { faGoogle, faGithub, faFacebook } from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { SocialProviderStyle } from '@/lib/types/socialproviderstyle';

const iconMap: Record<string, IconDefinition> = {
  'google-oauth2': faGoogle,
  'github': faGithub,
  'facebook': faFacebook,
};

const styleMap: Record<string, string> = {
  'google-oauth2': 'bg-blue-600 hover:bg-blue-700 text-white',
  'github': 'bg-gray-800 hover:bg-black text-white',
  'facebook': 'bg-blue-800 hover:bg-blue-900 text-white',
};

type RawProvider = {
  provider: string;
  label: string;
};

export function useSocialProviders(): SocialProviderStyle[] {
  const [providers, setProviders] = useState<SocialProviderStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/social-connections')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: RawProvider[]) => {
        const styled = data
          .map((provider) => {
            const icon = iconMap[provider.provider];
            const buttonClass = styleMap[provider.provider];
            if (!icon || !buttonClass) return null;
  
            return { ...provider, icon, buttonClass };
          })
          .filter((p): p is SocialProviderStyle => p !== null);
        setProviders(styled);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return providers;
}
