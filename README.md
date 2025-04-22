# 🤖 Auth0-AI Calendar Assistant

An AI-powered assistant that analyzes CIAM (Customer Identity and Access Management) maturity and proposes follow-up meetings — but only schedules them after secure, delegated user authorization via Auth0 and Google Calendar integration.

Built with:
- 🧠 Vercel AI SDK
- 🔐 Auth0 Auth4GenAI (MFA, delegated consent, federated tokens)
- 📅 Google Calendar (via Auth0 social connection)

---

## 🚀 Quickstart

1. Clone this repo:

   ```bash
   git clone https://github.com/lucas-gomes_atko/ai-assistant-demo
   cd ai-calendar-assistant
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file:

   ```env
   AUTH0_SECRET=...
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=https://your-tenant.us.auth0.com
   AUTH0_CLIENT_ID=...
   AUTH0_CLIENT_SECRET=...
   AUTH0_AUDIENCE=https://calendar-api.tool
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

6. Log in with a Google-connected user who has push MFA enabled

7. Interact with the AI:
   - Ask a CIAM-related question
   - Provide meeting details when prompted
   - Approve the delegated authorization via push notification
   - 🎉 The assistant will schedule the meeting on your behalf

---

## 🔧 What You Need to Set Up

### ✅ Auth0 Auth4GenAI Configuration

This application follows the official [Auth0 for GenAI guide](https://auth0.com/ai).

1. **Create an Auth0 Application** (Regular Web App)

2. **Create a Custom API**
   - Identifier: `https://calendar-api.tool`
   - Scopes: `calendar:read`, `calendar:write`

3. **Enable Google Social Connection**
   - Add the scope:
     ```
     https://www.googleapis.com/auth/calendar.events
     ```
   - Set:
     - `access_type=offline`
     - `prompt=consent`

4. **Enable Push MFA**
   - Enable Guardian push notification in MFA settings
   - Enroll your test user after logging in

---

## 🧠 What This Assistant Does

1. Analyzes CIAM maturity based on user input
2. Proposes a follow-up meeting if appropriate
3. Collects meeting details from the user (title, time, participants)
4. Triggers a delegated authorization request via CIBA
5. Waits for user approval before executing the scheduling action

---

## 🔐 Security Model

| Flow                | How It's Enforced                            |
|---------------------|----------------------------------------------|
| Identity            | Auth0 Universal Login with Google            |
| Scoped access       | `calendar:read`, `calendar:write` via API    |
| Delegated execution | `withAsyncUserConfirmation()`                |
| Token access        | `getAccessTokenForConnection()` only         |
| MFA confirmation    | Push-based approval before tool execution    |

---

## 📄 License

MIT — use freely, fork widely, demo securely!
