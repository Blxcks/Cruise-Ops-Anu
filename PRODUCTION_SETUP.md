# CruiseOps Antigua — Production Setup

1. GitHub Pages: keep the repository publishing from the `main` branch using the included GitHub Actions workflow.
2. Supabase Auth → URL Configuration:
   - Site URL: `https://blxcks.github.io/Cruise-Ops-Anu/`
   - Redirect URL: `https://blxcks.github.io/Cruise-Ops-Anu/`
3. Supabase Auth → SMTP: use the verified Brevo sender and Brevo SMTP credentials. Do not commit SMTP credentials.
4. Keep email confirmation enabled for production accounts.
5. Admin: your Xavier account is assigned `admin` in `public.profiles`.
6. Admin user management: the deployed Edge Function is `admin-user-management` and the frontend calls it only after the current session is authenticated. The function independently verifies the caller's profile is an active admin.
7. Storage: `cruiseops-documents` is private; the frontend uses signed URLs.
8. New public signups should remain `viewer` until an administrator assigns an operational role.

## First admin test
1. Sign in as the admin account.
2. Open Settings → User Management.
3. Confirm your own account appears as Admin / Active.
4. Invite a test staff account as Viewer or Port Agent.
5. Confirm the invitation arrives through Brevo.
6. Change the test account's role and confirm it updates.
7. Deactivate it and confirm its status changes.
8. Reactivate it.

Never paste the Supabase service-role key or Brevo SMTP password into the frontend, GitHub repository, or chat.
