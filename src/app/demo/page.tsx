// src/app/demo/page.tsx
/* eslint-disable react/no-unescaped-entities */
import { FINANCIAL_TERMS_DISPLAY } from '@/lib/fga/policy_versions';

export default function DemoInstructionsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center">🧠 Auth0 for GenAI Assistants — RSA Demo</h1>

      <section>
        <p className="text-center text-sm text-gray-600">
          <strong>Current Terms Version:</strong> {FINANCIAL_TERMS_DISPLAY}
        </p>
        <p className="mt-4 text-center text-sm text-gray-500">
          Secure AI Assistants: Calendar Scheduling, Financial Advice, Competitive Insights
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">👤 Personal Assistant — Flow</h2>
        <ol className="list-decimal ml-6 space-y-2">
          <li>Say "<strong>Hi</strong>" → Assistant greets using your profile</li>
          <li>Say "<strong>Who am I?</strong>" → Assistant displays Auth0 profile info</li>
          <li>Say "<strong>What's on my calendar tonight?</strong>" → Assistant checks calendar events</li>
          <li>Say "<strong>Schedule dinner with my wife tomorrow at 7pm.</strong>" → Assistant triggers CIBA async approval</li>
          <li>Say "<strong>Can you help me with retirement planning?</strong>" → Assistant shows public retirement advice</li>
          <li>Say "<strong>Yes</strong>" → Accept Financial Terms (using acceptFinancialTerms tool)</li>
          <li>Say "<strong>Can you help me with advanced retirement strategies?</strong>" → Assistant shows advanced gated advice</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">💼 Sales Assistant — Flow</h2>
        <ol className="list-decimal ml-6 space-y-2">
          <li>Switch to Sales Assistant</li>
          <li>Say "<strong>Hi</strong>" → Sales Assistant greets by name/org</li>
          <li>Say "<strong>Any competitive insights about Zeko?</strong>" → Assistant searches gated competitive RAG docs</li>
          <li>If Terms needed, Assistant offers to unlock → Accept Terms → Insights unlocked</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">🎤 Live Prompt Cheat Sheet (RSA Stage)</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>"Hi" → Greeting</li>
          <li>"Who am I?" → Profile info</li>
          <li>"What's on my calendar tonight?" → Calendar availability</li>
          <li>"Schedule dinner with my wife tomorrow at 7pm" → CIBA approval request</li>
          <li>"Can you help me with retirement planning?" → Basic public advice</li>
          <li>"Yes" → Accept Financial Terms</li>
          <li>"Can you help me with advanced retirement strategies?" → Advanced gated advice</li>
          <li>"Any competitive insights about Zeko?" (Sales Assistant) → Competitive gated insights</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">✅ Pre-Demo Validation Checklist</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Run <code>npm run fga:validate</code> → Validate FGA document permissions</li>
          <li>Run <code>npm run rag:validate</code> → Validate RAG embeddings and fallback</li>
          <li>Confirm public retirement-basic.md document accessible before starting</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">🛠 Useful Commands</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li><code>npm run dev</code> — Start local development server</li>
          <li><code>npm run fga:init</code> — Seed FGA initial tuples</li>
          <li><code>npm run fga:validate</code> — Validate user permissions</li>
          <li><code>npm run rag:validate</code> — Validate RAG search fallback</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">🎤 RSA Demo Tips</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Smile and narrate async flows ("A push approval is now sent to my device...")</li>
          <li>Speak slowly and naturally when asking the Assistant questions</li>
          <li>If CIBA flow triggers, quickly approve the push on your phone</li>
          <li>If Terms acceptance flow triggers, highlight how dynamic unlock works</li>
          <li>Celebrate "YES" moments (e.g., "We've just unlocked personalized advice!")</li>
        </ul>
      </section>

      <footer className="text-center text-sm text-gray-500 mt-10">
        Built with 💙 by Auth0 for GenAI
      </footer>
    </div>
  );
}
