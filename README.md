# 🤖 Auth0 Auth for GenAI Assistants — Calendar, Personal, and Sales Secure AI Agents

An AI-powered demo showcasing:

- Authentication with Passkeys and linking (connection) with Google Social connection
- 🗕️ Secure calendar scheduling via delegated CIBA (Google Calendar + Auth0 push MFA)  
- 🧠 RAG-driven basic vs. advanced financial advice with FGA-protected docs  
- 🔐 Explicit consent management for unlocking protected content  

Built with:  
- 🧠 Vercel AI SDK  
- 🔐 Auth0 Auth for GenAI (MFA, delegated consent, federated tokens)  
- 🛡️ Auth0 Fine-Grained Authorization (FGA)  
- 🗕️ Google Calendar (via Auth0 social connection)  
- 🤖 OpenAI GPT-4o-mini  

---

🛠 Built With
This AI-powered assistant demo was created using:

- Auth0 Auth for GenAI
- Auth0 Guardian / Guardian SDK
- Next.js App Router
- Vercel AI SDK
- Auth0 Next.js SDK
- Auth0 AI (Vercel) SDK
- Auth0 Fine-Grained Authorization (FGA) for document-level access control
- Auth0 OpenFGA SDK
- Google Calendar integration via delegated consent
- In-memory RAG (Retrieval-Augmented Generation) for secure, tiered document access
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
- **Access Settings**:
  - Allow Skipping User Consent: off
  - Allow Offline Access: on

API ID is used for CIBA authentication flow (Auth0 Audience).

### e. Authorize Auth0 Application to Use the Management API
- Navigate to the Client application **→ APIs**
- Click on the toggle to **Authorize** Auth0 Management API
- Under permissions, check:

  ```text
  ✅ read:users
  ✅ update:users
  ✅ read:connections

- Click **Update**

### e. Setup Client-initiated Account Linking
- [Follow the Quickstart documentation](https://auth0.com/ai/docs/client-initiated-account-linking)

---

## 🛡️ FGA Setup

1. Load this model in OpenFGA:

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
        define viewer: public_viewer or visible_with_terms
        define visible_with_terms: [policy#accepted]
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


# Testing Auth for GenAI

Questions you can ask the AI assistant to validate how it manages identity, authorization, and delegated access.
Each question triggers a real tool call with behavior based on user permissions, connected accounts, or user approvals.

- *Who am I?* 
  - 🔧 Tool triggered: userInfo 
  - 📖 Returns Auth0 user profile (name, email, picture)
  - ✅ No approval or consent required


- *What events do I have for tonight?*
  - 🔧 Tool triggered: googleCalendarViewTool
  - 📖 Fetches Google Calendar events
  - 🔐 Requires a connected Google account
  - ✅ No extra approval if already connected

- *Schedule a meeting with my financial advisor for 6:30pm tonight*
  - 🔧 Tool triggered: calendarCreateAsyncTool (CIBA)
  - 📖 Requests delegated user approval (via CIBA) to create a calendar event
  - 🔐 Prompts user with a push notification to approve/consent
  - ✅ If approved, schedules the meeting using user Google Calendar

- *Please provide some retirement advice before my meeting with the financial advisor*
  - 🔧 Tool triggered: getRetirementAdviceTool
  - 📖 Searches in-memory RAG documents the user is authorized to view (via FGA)
  - 🧠 If advanced content is gated, assistant offers basic tips or prompts to accept Terms
  - ✅ Conditional access based on user permission level

- *I need more detailed advice before the meeting*
  - 🔧 Tool triggered: acceptFinancialTermsTool (CIBA)
  - 📖 Prompts user to accept the Financial Terms via delegated authorization
  - 🔐 If user approve, the assistant grants access by writing a tuple to FGA
  - 📚 Additional retirement advice documents become available via RAG

---


## 📄 License

MIT — use freely, fork widely, demo securely!  

---

###### Built with 💙 by Auth0
