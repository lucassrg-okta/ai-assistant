import { auth0 } from '@/lib/auth0';
import type { Metadata } from 'next';

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
  const { name, email, nickname, picture, email_verified, sub, given_name, family_name } = user;

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="bg-white border p-6 rounded-lg shadow-sm space-y-6">
        <div className="flex items-center gap-6 border-b pb-6">
          <img src={picture} alt="Profile" className="rounded-full w-24 h-24 border" />
          <div>
            <p className="text-xl font-semibold">{name}</p>
            <p className="text-gray-600">{email}</p>
            <p className="text-xs text-gray-500">{email_verified ? '✅ Verified' : '❌ Not verified'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>Nickname:</strong> {nickname}</div>
          <div><strong>User ID:</strong> {sub}</div>
          <div><strong>First Name:</strong> {given_name}</div>
          <div><strong>Last Name:</strong> {family_name}</div>
        </div>

        <hr className="border-gray-200 my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>Token Expires At:</strong> {tokenSet.expiresAt ? new Date(tokenSet.expiresAt * 1000).toLocaleString() : 'N/A'}</div>
          <div><strong>Scope:</strong> {tokenSet.scope || 'N/A'}</div>
        </div>

        
      </div>
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
