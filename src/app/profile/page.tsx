

import NavBar from '@/components/NavBar';
import { auth0 } from '@/lib/auth0';
import { UserProfileCard } from '@/components/UserProfileCard';
import { ConnectedAccounts } from '@/components/ConnectedAccounts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">You must be logged in to view this page.</div>;
  }

  const { user, tokenSet } = session;
  const idToken = tokenSet.idToken;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <NavBar />

      {/* Main content */}
      <main className="pt-24 flex-grow max-w-3xl mx-auto px-6 space-y-8 pb-12">
        <h1 className="text-3xl md:text-4xl font-bold">Profile</h1>

        {/* User profile info */}
        <section className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <UserProfileCard user={user} />
        </section>

        {/* Linked accounts */}
        <section className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <ConnectedAccounts />
        </section>

        {/* Token metadata */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong className="text-gray-300">Token Expires At:</strong>{' '}
              <span className="text-gray-200">
                {tokenSet.expiresAt
                  ? new Date(tokenSet.expiresAt * 1000).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
            <div>
              <strong className="text-gray-300">Scope:</strong>{' '}
              <span className="text-gray-200">{tokenSet.scope || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Debug / full tokens */}
        <details className="bg-gray-800 border border-gray-700 rounded-2xl p-4 text-sm">
          <summary className="cursor-pointer font-semibold text-orange-500">
            Debug: View Full Tokens
          </summary>
          <div className="mt-4 space-y-6 text-gray-200">
            <div>
              <p className="font-semibold mb-1">Access Token</p>
              <textarea
                readOnly
                value={tokenSet.accessToken}
                className="w-full text-xs p-3 bg-gray-900 rounded border border-gray-600 font-mono resize-none"
                rows={6}
              />
              <a
                href={`https://jwt.io/?token=${tokenSet.accessToken}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-orange-500 underline"
              >
                Decode Access Token on jwt.io
              </a>
            </div>
            {idToken && (
              <div>
                <p className="font-semibold mb-1">ID Token</p>
                <textarea
                  readOnly
                  value={idToken}
                  className="w-full text-xs p-3 bg-gray-900 rounded border border-gray-600 font-mono resize-none"
                  rows={6}
                />
                <a
                  href={`https://jwt.io/?token=${idToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-orange-500 underline"
                >
                  Decode ID Token on jwt.io
                </a>
              </div>
            )}
          </div>
        </details>
      </main>

    </div>
  );
}
