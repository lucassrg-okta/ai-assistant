# 🤖 Auth0 for GenAI Assistants — Calendar, Personal, and Sales Secure AI Agents

An AI-powered platform demonstrating:

- 🗕️ Scheduling follow-up meetings securely via delegated authorization (Google Calendar + CIBA)
- 🧠 Providing secure financial and competitive insights via RAG (Retrieval Augmented Generation) with FGA-protected documents
- 🔐 Consent management to unlock protected documents (Financial Terms acceptance)

Built with:
- 🧠 Vercel AI SDK
- 🔐 Auth0 for GenAI (MFA, delegated consent, federated tokens)
- 🛡️ Auth0 Fine-Grained Authorization (FGA)
- 🗕️ Google Calendar (via Auth0 social connection)
- 🤖 OpenAI GPT-4o-mini

---

## 🚀 Quickstart

### 1. Clone this repo

```bash
git clone https://github.com/lucas-gomes_atko/ai-assistant-demo
cd ai-assistant-demo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env.local` file

```dotenv
# Auth0
AUTH0_SECRET=your-long-random-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://calendar-api.tool
AUTH0_DOMAIN=your-tenant.us.auth0.com

# OpenFGA
FGA_API_URL=https://api.us1.fga.dev
FGA_STORE_ID=your-fga-store-id
FGA_CLIENT_ID=your-fga-client-id
FGA_CLIENT_SECRET=your-fga-client-secret
FGA_API_TOKEN_ISSUER=https://your-auth0-issuer
FGA_API_AUDIENCE=https://api.us1.fga.dev/

# OpenAI
OPENAI_API_KEY=your-openai-api-key
```

### 4. Required Auth0 Configuration

#### 🗕️ Google Social Connection Configuration

- Enable the **Google** social connection.
- Set **Scopes**:

```plaintext
https://www.googleapis.com/auth/calendar.events
```

- Set **Additional Parameters**:

```plaintext
access_type=offline
prompt=consent
```

#### 🔐 Enable Push MFA (Guardian)

- Go to **Security → Multi-factor Authentication**.
- Enable **Push Notification (Guardian Mobile App)**.
- Enroll user manually (log in and scan QR code).

#### 🔧 Create an Auth0 Application (Regular Web App)

- Callback URLs: `http://localhost:3000/api/auth/callback`
- Logout URLs: `http://localhost:3000`
- Web Origins: `http://localhost:3000`

#### 🔧 Create an Auth0 Custom API (Calendar API)

- Identifier: `https://calendar-api.tool`
- Scopes: `calendar:read`, `calendar:write`
- Signing Algorithm: RS256

### 5. FGA Setup (Fine-Grained Authorization)

Load this Authorization Model:

```fga
model
  schema 1.1

type user

type policy
  relations
    define accepted: [user]

type doc
  relations
    define public_viewer: [user:*]
    define visible_with_terms: [policy#accepted]
    define viewer: public_viewer or visible_with_terms
```

### 6. Seed Initial Data

```bash
npm run fga:init
```

### 7. Validate Setup

```bash
npm run fga:validate
npm run rag:validate
```

### 8. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🛇 Application Architecture

| Assistant | Behavior |
|:----------|:---------|
| 🗕️ Calendar Assistant | CIAM maturity analysis + meeting scheduling via CIBA |
| 🧠 Personal Assistant | Financial advice with public + protected content (Terms unlock) |
| 💼 Sales Assistant | Competitive insights protected behind Terms |

---

## 🔐 Security Model

| Flow | Enforcement |
|:-----|:------------|
| Identity | Auth0 Universal Login |
| Delegated Access | OAuth scopes: `calendar:read`, `calendar:write` |
| Fine-Grained Authorization | Public vs Protected RAG documents |
| Consent Management | Explicit user Terms acceptance via FGA |
| CIBA HITL Approvals | Calendar meeting creation |
| RAG Post-Authorization | Filtering results based on FGA authorization |

---

## 👋 Useful Commands

| Command | Purpose |
|:--------|:--------|
| `npm run dev` | Start local dev server |
| `npm run fga:init` | Seed FGA document access |
| `npm run fga:validate` | Validate document permissions |
| `npm run rag:validate` | Validate RAG embeddings + fallback |

---

## ✨ Dynamic Terms Versioning

Version control inside:

```ts
/src/lib/fga/policy_versions.ts
```

Example:

```ts
export const FINANCIAL_TERMS_VERSION = 'terms_v2';
export const FINANCIAL_TERMS_POLICY_OBJECT = `policy:${FINANCIAL_TERMS_VERSION}`;
export const FINANCIAL_TERMS_DISPLAY = `Financial Terms v2`;
```

✅ Easily bump to `terms_v3`, reseed, and force new acceptances.

---

## 🌟 Future Enhancements

- GDPR, HIPAA multi-policy support
- Multi-tenant organization-based protection
- Delegated actions beyond meetings (Doc signing, emails)

---

## 📄 License

MIT — use freely, fork widely, demo securely!

---

# 🧠 Built with 💙 by Auth0
---