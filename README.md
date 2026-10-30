# Caisse Salle — starter application

Application React/Vite responsive, installable as a PWA, with Supabase Auth + PostgreSQL. Admin can create/edit/delete transactions; viewer can only read the dashboard, journal and daily closings.

## Features
- Cash balance calculated from opening balance + cash receipts - cash expenses - bank deposits + bank withdrawals.
- TPE, bank transfer and cheque receipts are tracked separately and do not increase physical cash.
- Expense payment method determines whether cash is reduced (only `Cash`).
- Transaction journal, date filter, dashboard and daily cash closing comparison.
- Supabase Row Level Security policies for admin/viewer roles.

## Setup
1. Create a Supabase project.
2. In SQL Editor, run `supabase/schema.sql`.
3. In Supabase Authentication, enable Email/Password and create your user account.
4. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (publishable/anon key only; never service_role).
5. In Supabase SQL Editor, find your user UUID under Authentication > Users and run the admin profile insert shown at the bottom of `supabase/schema.sql`.
6. Create the salle owner account in Authentication > Users, then add their profile with role `viewer` using the UUID.
7. Run locally: `npm install`, `npm run dev`. Production build: `npm run build`.
8. Push to GitHub and import the repository into Vercel. Add the same two environment variables in Vercel project settings, then deploy.

## Important setup notes
- This is a starter version; it has not been connected to your real Supabase project or deployed to Vercel because those require your project credentials and account actions.
- The PWA manifest, SVG app icon, and basic service worker are included for installability and app-shell caching. Financial data still requires a network connection.
- Current cash balance is computed from all transactions. Enter one opening-balance transaction for the starting cash. For accurate daily closing, keep all transactions dated correctly. Test on a separate Supabase project before entering real financial records.
- Viewer has no UI editing controls, and RLS blocks edits at the database level. Only share the viewer's own login credentials with the salle owner; never share your admin account.
