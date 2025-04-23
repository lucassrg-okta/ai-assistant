import { auth0 } from '@/lib/auth0';
import type { Metadata } from 'next';
import { UserProfileCard } from '@/components/UserProfileCard';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const session = await auth0.getSession();

  if (!session?.user) {
    return <div className="p-6">You must be logged in to view this page.</div>;
  }

  const { user, tokenSet } = session;
  const idToken = tokenSet.idToken;

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {/* ✅ Use shared profile card */}
      <UserProfileCard user={user} />

      {/* ✅ Only token info lives here */}
      <div className="mt-10 text-sm bg-white border border-gray-200 rounded p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Token Expires At:</strong>{' '}
            {tokenSet.expiresAt ? new Date(tokenSet.expiresAt * 1000).toLocaleString() : 'N/A'}
          </div>
          <div>
            <strong>Scope:</strong> {tokenSet.scope || 'N/A'}
          </div>
        </div>
      </div>

      {/* ✅ Debug: Show full tokens only when needed */}
      <details className="mt-10 text-sm bg-gray-50 border border-gray-200 rounded p-4">
        <summary className="cursor-pointer font-semibold text-blue-700">Debug: View Full Tokens</summary>
        <div className="mt-4 space-y-6">
          <div>
            <p className="font-semibold mb-1">Access Token</p>
            <textarea
              readOnly
              value={tokenSet.accessToken}
              className="w-full text-xs p-3 bg-gray-100 rounded border font-mono resize-none"
              rows={6}
            />
            <a
              href={`https://jwt.io/?token=${tokenSet.accessToken}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-600 underline"
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
                className="w-full text-xs p-3 bg-gray-100 rounded border font-mono resize-none"
                rows={6}
              />
              <a
                href={`https://jwt.io/?token=${idToken}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 underline"
              >
                Decode ID Token on jwt.io
              </a>
            </div>
          )}
        </div>
      </details>
    </main>
  );
}
