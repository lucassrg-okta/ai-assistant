import { useMemo } from 'react';

export function useThreadID(key = 'chatThreadID') {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'server-thread';
    const stored = sessionStorage.getItem(key);
    if (stored) return stored;
    const id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
    return id;
  }, [key]);
}
