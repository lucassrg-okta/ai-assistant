# ✨ RSA 2025 Live Demo Prompt List ✨

## Personal Assistant Flow (Auth0 + FGA + GenAI)

1. **Greeting**  
> "Hi"

✅ Assistant should greet you personally by name.

---

2. **Profile Fetch**  
> "Who am I?"

✅ Assistant should show your Auth0 profile: name, email, picture.

---

3. **Calendar View: Today/Tonight**  
> "What's on my calendar tonight?"

✅ Assistant should fetch upcoming calendar events (today or tonight).

---

4. **Calendar Scheduling (HITL/CIBA)**  
> "Schedule dinner with my wife tomorrow at 7pm."

✅ Assistant should trigger async CIBA flow for event approval.

✅ Approve request → Assistant schedules meeting.

---

5. **Financial Advice (RAG basic public docs)**  
> "Can you help me with retirement planning?"

✅ Assistant should retrieve basic retirement advice (public doc).

✅ Should **NOT ask** for financial terms yet!

---

6. **Prompt for Personalized Advanced Advice (Terms Unlock)**  
(After basic advice shown)

Assistant will say:  
> "If you'd like more personalized advice, I can guide you to accept Financial Terms."

You answer:  
> "Yes, I want more personalized retirement advice."

✅ Assistant should trigger consent flow (Terms acceptance).

✅ After acceptance → advanced retirement strategies unlocked.

---

7. **Final Bonus (if time)**  
> "Schedule a meeting with my buddies for next Saturday afternoon."

✅ Calendar scheduling flow runs again with async user confirmation.

---

## Sales Assistant Flow (Competitive Intelligence)

Switch to **Sales Assistant** tab/page.

1. **Greeting**  
> "Hi"

✅ Sales Assistant greets based on your name and (if available) organization.

---

2. **Competitive Analysis**  
> "Any competitive insights about Zeko?"

✅ Assistant attempts RAG search competitive documents.

✅ If gated, offers Terms acceptance to unlock competitive summaries.

---

# ✨ Important Reminders

- Always approve async HITL flows quickly (watch mobile / browser).
- Accept Terms when prompted to unlock gated documents.
- If fallback advice is shown, no need for Terms immediately.

✅ Live validation scripts:  
```bash
npm run fga:validate
npm run rag:validate
