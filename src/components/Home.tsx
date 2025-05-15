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
    <div className="px-4 py-20 max-w-7xl mx-auto w-full font-sans">
      {!user ? (
        <>
          {/* Hero Section */}
          <section className="relative text-center mb-32">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2a164d] via-[#1e1e2f] to-[#eb5424] opacity-60 blur-3xl" aria-hidden="true"></div>
            <h1 className="relative text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#eb5424] via-[#915eff] to-[#00c6ff] mb-6">
              Secure AI Agent Experiences with Auth0
            </h1>
            <p className="relative text-lg sm:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Auth for GenAI protects users and data in LLM-powered workflows. Explore how AI agents authenticate, authorize, and act securely.
            </p>
            <div className="relative flex flex-col sm:flex-row justify-center gap-5">
              <a
                href="https://auth0.com/ai/docs/user-authentication"
                className="inline-flex items-center px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:text-black text-lg font-semibold transition"
                target="_blank"
                rel="noreferrer"
              >
                Read Docs
              </a>
              <a
                href="/auth/login"
                className="inline-flex items-center px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:text-black text-lg font-semibold transition shadow-md"
              >
                Get Started
              </a>
            </div>
          </section>

          <hr className="border-gray-800 mb-24" />

          {/* How It Works */}
          <section>
            <h2 className="text-4xl font-bold text-center mb-16">The Complete Auth Solution for GenAI Apps</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
              {[
                {
                  icon: LockKeyhole,
                  title: 'User Authentication',
                  description: 'Enable AI agents to securely log in on your behalf.'
                },
                {
                  icon: Vault,
                  title: 'Token Vault',
                  description: 'Manage token access securely for APIs like Google and GitHub.'
                },
                {
                  icon: RefreshCcw,
                  title: 'Async Authorization',
                  description: 'Get user approvals before AI takes actions in the background.'
                },
                {
                  icon: BadgeCheck,
                  title: 'Fine-Grained Access',
                  description: 'Enforce tight controls — AI does only what’s explicitly permitted.'
                }
              ].map(({ icon: Icon, title, description }) => (
                <div key={title} className="p-6 bg-[#111] border border-[#2a2a2a] rounded-2xl text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#242424] mx-auto mb-4">
                    <Icon size={28} className="text-[#eb5424]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                  <p className="text-gray-400 leading-relaxed text-base">{description}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Choose Use Case */}
          <section className="mb-24">
            <h2 className="text-4xl font-bold mb-10 text-center">Choose a Use Case</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {useCases.map(({ title, description, icon: Icon, href }) => (
                <Link
                  href={href}
                  key={title}
                  className="p-6 rounded-2xl bg-[#111] border border-[#2a2a2a] hover:bg-[#1d1d1d] hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#242424] rounded-full">
                      <Icon size={24} className="text-[#eb5424]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                  </div>
                  <p className="text-gray-400 text-base leading-snug">{description}</p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
