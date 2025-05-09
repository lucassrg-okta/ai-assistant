# 🤖 Auth0 for GenAI Assistants — Calendar, Personal, and Sales Secure AI Agents

An AI-powered demo showcasing:

- 🗕️ Secure calendar scheduling via delegated CIBA (Google Calendar + Auth0 push MFA)  
- 🧠 RAG-driven basic vs. advanced financial advice with FGA-protected docs  
- 🔐 Explicit consent management for unlocking protected content  

Built with:  
- 🧠 Vercel AI SDK  
- 🔐 Auth0 for GenAI (MFA, delegated consent, federated tokens)  
- 🛡️ Auth0 Fine-Grained Authorization (FGA)  
- 🗕️ Google Calendar (via Auth0 social connection)  
- 🤖 OpenAI GPT-4o-mini  

---

## 🚀 Quickstart

### 1. Clone & install

```bash
git clone https://github.com/lucassrg-okta/ai-assistant
cd ai-assistant
npm install
```

### 2. Create `.env.local`

```env
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
FGA_API_TOKEN_ISSUER=auth.fga.dev
FGA_API_AUDIENCE=https://api.us1.fga.dev/

# OpenAI
OPENAI_API_KEY=your-openai-api-key
``` 

---

## 🔧 Auth0 Configuration

### a. Google Social Connection  (Follow the instructions on auth0.com/ai - you need a OAuth2 client setup with a test user)
- **Enable** Google under Auth0 Connections  
- **Scopes**:  
  ```
  https://www.googleapis.com/auth/calendar.events
  ```  
- **Enable Token vault**  


### b. Push MFA (Guardian)  
- Navigate to **Security → Multi-factor Authentication**  
- **Enable** Push Notifications  
- **Enroll** a test user via QR code  

### c. Auth0 Application (Regular Web App)  
- **Callback URLs**: `http://localhost:3000/api/auth/callback`  
- **Logout URLs**: `http://localhost:3000`  
- **Web Origins**: `http://localhost:3000`  

### d. Auth0 API (Custom API)  
- **Identifier**: `https://calendar-api.tool`  
- **Scopes**: `calendar:read`, `calendar:write`  
- **Signing Algorithm**: RS256  

---

## 🛡️ FGA Setup

1. Load this model in OpenFGA:

    ```fga
    model
      schema 1.1

    type user

    type policy_version
      relations
        define accepted: [user]

    type doc
      relations
        define public_viewer: [user:*]
        define visible_with_terms: [policy_version#accepted]
        define viewer: public_viewer or visible_with_terms
    ```

2. Define your policy version (run fga:init):

    ```ts
    // src/lib/fga/policy_versions.ts
    export const FINANCIAL_TERMS_VERSION       = 'terms_v2.5';
    export const FINANCIAL_TERMS_POLICY_OBJECT = `policy:${FINANCIAL_TERMS_VERSION}#accepted`;
    export const FINANCIAL_TERMS_DISPLAY       = `Financial Terms v2.5`;
    ```

---

## 📦 NPM Scripts

| Command                                | Purpose                                                        |
|----------------------------------------|----------------------------------------------------------------|
| `npm run dev`                          | Start Next.js dev server                                       |
| `npm run build`                        | Build for production                                           |
| `npm run start`                        | Run production build locally                                   |
| `npm run fga:init`                     | Seed FGA tuples (public/basic & protected docs)                |
| `npm run fga:validate`                 | Validate FGA permissions for your user                         |
| `npm run rag:validate`                 | Validate RAG retrieval & tier-filter pipeline                  |
| `npm run fga:new-policy-version <ver>` | Bump to a new Financial Terms version & reseed FGA tuples      |

---

## ✅ Seed & Validate

```bash
npm run fga:init
npm run fga:validate
npm run rag:validate
```

To bump terms (e.g. `terms_v2.6`):

```bash
npm run fga:new-policy-version terms_v2.6
```

---

## 🔍 Local Production Test

```bash
npm run build
npm run start
# or full Vercel emulation:
npx vercel dev
```

---

## 🛇 Architecture Overview

| Assistant          | Function                                                               |
|--------------------|------------------------------------------------------------------------|
| 🗕️ Calendar        | CIAM maturity analysis + meeting scheduling (CIBA + Google Calendar)   |
| 🧠 Personal        | RAG-based retirement advice (basic vs advanced gated by Terms)         |
| 💼 Sales           | RAG-based competitive insights gated by Terms                          |

---

## 🔐 Security Model

| Flow                  | Enforcement                                          |
|-----------------------|------------------------------------------------------|
| Identity              | Auth0 Universal Login                                |
| Delegated Access      | OAuth scopes → `calendar:read`, `calendar:write`     |
| Fine-Grained Auth     | Public vs Protected docs via OpenFGA                 |
| Consent Management    | Financial Terms acceptance via CIBA + FGA write      |
| HITL Approvals (CIBA) | Push MFA before meeting creation                     |

---

## 🌟 Future Enhancements

- GDPR & HIPAA multi-policy support  
- Multi-tenant org-based document protection  
- Additional delegated actions (e.g. doc signing, email send)  

---

## 📄 License

MIT — use freely, fork widely, demo securely!  

---

###### Built with 💙 by Auth0
