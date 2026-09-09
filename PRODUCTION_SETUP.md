# CruiseOps Antigua — final production setup

## 1. GitHub Pages
Use **Settings → Pages → Source: GitHub Actions**.
The workflow is `.github/workflows/deploy-pages.yml` and uses current Pages actions.

## 2. Supabase Auth URLs
In Supabase → Authentication → URL Configuration:
- Site URL: `https://blxcks.github.io/Cruise-Ops-Anu/`
- Redirect URL: `https://blxcks.github.io/Cruise-Ops-Anu/`

## 3. Custom SMTP
In Supabase → Authentication → SMTP, enable custom SMTP and enter the SMTP credentials supplied by your transactional email provider.
Recommended sender: `no-reply@auth.your-domain.example` (use a verified sender/domain).
Do not put SMTP credentials in this repository or frontend code.

## 4. Email confirmation
Keep **Confirm email** enabled for production.
The frontend sends confirmation/reset links back to the GitHub Pages site.

## 5. Password security
The project is currently on the Supabase Free plan. Supabase's leaked-password protection is a Pro-and-above feature. Upgrade when ready and enable it under Auth password security.

## 6. User roles
New signups default to `viewer`. Authorized admins/managers should promote operational staff to `port_agent`, `port_manager`, or `admin`.

## 7. Storage
Private bucket: `cruiseops-documents`.
Documents are uploaded through the authenticated frontend and opened with short-lived signed URLs.

## 8. Security
The database has RLS enabled on all operational tables. Public execution of the profile bootstrap SECURITY DEFINER function has been revoked. Foreign-key indexes were added and overlapping permissive SELECT policies were removed.

## 9. Important test sequence
1. Create a new user.
2. Receive confirmation email.
3. Confirm email.
4. Sign in.
5. Verify the profile is `viewer`.
6. Promote the test user to `port_agent` in Supabase.
7. Create/edit a port call.
8. Create task, medical case, transfer, hotel booking, vendor and service request.
9. Upload/open a document.
10. Test on phone and desktop.
11. Verify sign-out/sign-in and password reset.
