# NOOR CLASSES

Premium 1-on-1 home tuition and global live online tutoring website.

## Included
- Futuristic WebGL/Three.js hero with orbiting curriculum boards
- Responsive dark + gold premium UI
- Grade 1–12 and board-aware curriculum explorer
- Dynamic 7-step student/parent inquiry form
- Home vs online conditional fields
- Zod + React Hook Form validation
- Tutor recruitment portal
- Persistent student inquiry storage with Supabase
- Instant owner email notifications with Resend
- SEO metadata

## Run locally
```bash
npm install
npm run dev
```
Then open http://localhost:3000

## Production inquiry setup

### 1. Supabase
Create a Supabase project, open SQL Editor, and run `supabase/schema.sql` once.

Add these server-side variables in Vercel:
- `SUPABASE_URL` — Project Settings > API > Project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Project Settings > API > service_role secret

Never prefix the service role key with `NEXT_PUBLIC_` and never expose it in browser code.

### 2. Resend email alerts
Create a Resend API key and add:
- `RESEND_API_KEY`
- `LEAD_NOTIFICATION_EMAIL` — the inbox where NOOR should receive new lead alerts
- `RESEND_FROM_EMAIL` — optional; use a verified sending domain for production. Until then the route defaults to `NOOR Classes <onboarding@resend.dev>`.

### 3. Redeploy
After adding environment variables, redeploy the latest production deployment in Vercel.

## Lead reliability
The inquiry API validates input, saves the lead first, then attempts the email notification. A temporary email failure does not delete a successfully stored lead. The browser is only shown success after database storage succeeds.

## Next production upgrades
Add spam/rate-limit protection, privacy/consent pages, authenticated admin lead management, tutor document storage, and WhatsApp Business notifications.
