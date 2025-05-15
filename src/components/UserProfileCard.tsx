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
    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xl max-w-2xl mx-auto mt-6">
      <div className="flex items-center gap-6 border-b border-gray-200 pb-6">
        <img
          src={picture || `https://api.dicebear.com/7.x/thumbs/svg?seed=${nickname || 'user'}`}
          alt="Profile"
          className="rounded-full w-20 h-20 border border-gray-300 shadow-sm object-cover"
        />
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold text-gray-900 leading-tight">
            {name || 'No name provided'}
          </p>
          <p className="text-sm text-gray-600">{email || 'No email provided'}</p>
          <p className="text-xs text-teal-600 font-medium">
            {email_verified ? '✔️ Verified' : '❌ Not verified'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm text-gray-800">
        <div>
          <span className="font-medium text-gray-700">Nickname:</span>{' '}
          <span className="text-gray-600">{nickname || 'N/A'}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">User ID:</span>
          <p className="break-words text-gray-600 text-xs mt-1">{sub || 'N/A'}</p>
        </div>
        <div>
          <span className="font-medium text-gray-700">First Name:</span>{' '}
          <span className="text-gray-600">{given_name || 'N/A'}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Last Name:</span>{' '}
          <span className="text-gray-600">{family_name || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};
