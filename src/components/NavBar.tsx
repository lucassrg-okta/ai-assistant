'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';
import { User, Power } from 'lucide-react';
import Auth0Logo from './Auth0Logo';

export default function NavBar() {
  const { user, isLoading } = useUser();

  return (
    <header className="w-full fixed top-0 bg-black text-white border-b border-gray-800 py-4 px-6 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Home link */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <Auth0Logo className="h-6 w-auto" />
            <span className="text-xl font-semibold">Home</span>
          </Link>
          {/* <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-[#eb5424] font-medium">
              Home
            </Link>
          </nav> */}
        </div>

        {/* Auth / User menu */}
        {!isLoading && (
          <div className="flex items-center space-x-4">
            {!user ? (
              <Link href="/auth/login" className="flex items-center space-x-2 px-4 py-2 bg-[#eb5424] hover:bg-orange-600 rounded-full transition font-medium">
                <User className="w-5 h-5" />
                <span>Log in</span>
              </Link>
            ) : (
              <div className="relative group">
                <button className="flex items-center focus:outline-none" aria-haspopup="true">
                  <img
                    src={user.picture || ''}
                    alt={user.name || 'User avatar'}
                    className="w-10 h-10 rounded-full border-2 border-[#eb5424]"
                  />
                </button>
                <ul className="absolute right-0 mt-2 w-60 bg-gray-900 text-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <li className="px-4 py-2 border-b border-gray-800 text-sm">{user.name}</li>
                  <li>
                    <Link href="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-gray-800">
                      <User className="w-4 h-4 mr-2 text-[#eb5424]" /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/logout" className="flex items-center px-4 py-2 text-sm hover:bg-gray-800">
                      <Power className="w-4 h-4 mr-2 text-[#eb5424]" /> Log out
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
