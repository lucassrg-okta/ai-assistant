/* eslint-disable @next/next/no-img-element */

import React from 'react';

export type UserProfile = {
  name?: string;
  email?: string;
  nickname?: string;
  picture?: string;
  email_verified?: boolean;
  sub?: string;
  given_name?: string;
  family_name?: string;
};

type Props = {
  user: UserProfile;
};

export const UserProfileCard: React.FC<Props> = ({ user }) => {
  const {
    name,
    email,
    nickname,
    picture,
    email_verified,
    sub,
    given_name,
    family_name,
  } = user;

  return (
    <div className="bg-white border p-6 rounded-lg shadow-sm space-y-6">
      <div className="flex items-center gap-6 border-b pb-6">
        <img src={picture || `https://api.dicebear.com/7.x/thumbs/svg?seed=${nickname || 'user'}`} alt="Profile" className="rounded-full w-24 h-24 border" />
        <div>
          <p className="text-xl font-semibold">{name || 'No name provided'}</p>
          <p className="text-gray-600">{email || 'No email provided'}</p>
          <p className="text-xs text-gray-500">{email_verified ? '✅ Verified' : '❌ Not verified'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div><strong>Nickname:</strong> {nickname || 'N/A'}</div>
        

        <div><strong>User ID:</strong> <p className="break-all text-sm text-gray-600">{sub || 'N/A'}</p></div>
        <div><strong>First Name:</strong> {given_name || 'N/A'}</div>
        <div><strong>Last Name:</strong> {family_name || 'N/A'}</div>
      </div>
    </div>
  );
};
