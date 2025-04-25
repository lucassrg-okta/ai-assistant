'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';
import {
  Briefcase,
  Clock,
  LockKeyhole,
  Vault,
  RefreshCcw,
  BadgeCheck
} from 'lucide-react';

const useCases = [
  {
    title: 'Sales Assistant',
    description: 'Summarizes calls and accesses CRM data securely.',
    icon: Briefcase,
    href: '/assistants/sales'
  },
  {
    title: 'Personal Assistant',
    description: 'Schedules appointments and handles personal tasks.',
    icon: Clock,
    href: '/assistants/personal'
  }
];

export default function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) return null;

  return (
    <main className="px-4 py-12 max-w-6xl mx-auto">
      {!user ? (
        <>
          {/* Hero */}
          <section className="text-center mb-24">
            <h1 className="text-4xl font-bold mb-3 text-blue-900">
              Secure AI Agent Experiences with Auth0
            </h1>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto text-base">
              Auth0 for GenAI protects users and data in LLM-powered workflows. Explore how AI agents authenticate, authorize, and act securely.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="https://auth0.com/ai/docs/user-authentication"
                className="btn btn-outline-primary"
                target="_blank"
                rel="noreferrer"
              >
                Read Docs
              </a>
              <a href="/auth/login" className="btn btn-primary">
                Get Started
              </a>
            </div>
          </section>

          <hr className="border-gray-200 mb-16" />

          {/* How It Works */}
          <section>
            <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-700">
              <div className="p-6 border rounded-lg bg-white text-center">
                <LockKeyhole size={24} className="text-blue-600 mx-auto mb-2" />
                <strong className="block mb-2 text-blue-700">1. User Authentication</strong>
                <p>The AI needs to know who you are. You log in with Auth0 so it can act with your identity.</p>
              </div>
              <div className="p-6 border rounded-lg bg-white text-center">
                <Vault size={24} className="text-blue-600 mx-auto mb-2" />
                <strong className="block mb-2 text-blue-700">2. Token Vault</strong>
                <p>Auth0 securely stores access tokens that allow the AI to connect to apps like Google or Slack.</p>
              </div>
              <div className="p-6 border rounded-lg bg-white text-center">
                <RefreshCcw size={24} className="text-blue-600 mx-auto mb-2" />
                <strong className="block mb-2 text-blue-700">3. Async Authorization</strong>
                <p>The AI runs in the background, but asks for your approval before doing anything sensitive.</p>
              </div>
              <div className="p-6 border rounded-lg bg-white text-center">
                <BadgeCheck size={24} className="text-blue-600 mx-auto mb-2" />
                <strong className="block mb-2 text-blue-700">4. Fine-Grained Access</strong>
                <p>Auth0 makes sure the AI only sees or does what you’re allowed to — no more, no less.</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Choose Use Case */}
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Choose a Use Case</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {useCases.map(({ title, description, icon: Icon, href }) => (
                <Link
                  href={href}
                  key={title}
                  className="border rounded-lg p-6 shadow-sm hover:shadow-md transition bg-white"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <Icon size={28} className="text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-snug">{description}</p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
