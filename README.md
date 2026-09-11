# CruiseOps Antigua — Production GitHub Pages Build

Mobile-first cruise port operations workspace backed by the existing Supabase project.

## Hosting
- GitHub Pages via GitHub Actions
- Node 24-compatible workflow (Actions runtime)
- Hash routing for reliable GitHub Pages navigation

## Supabase
Project ref: `itgdvppxnplgwdaadszm`

The browser uses only the Supabase publishable key. Never place a service-role key in this repository.

## Admin user management
The app includes **Settings → User Management**, visible only to administrators. Admins can:
- invite users
- assign roles
- activate/deactivate users
- resend unconfirmed invitations
- see confirmation and last sign-in status

The secure Edge Function is deployed as `admin-user-management` and requires a valid JWT plus an active `admin` profile. It uses the server-side `SUPABASE_SERVICE_ROLE_KEY`; that secret must never be committed to GitHub.

## Roles
`admin`, `port_manager`, `port_agent`, `tours_agent`, `finance`, `viewer`

## Production setup
See `PRODUCTION_SETUP.md` for Auth URLs, Brevo SMTP, storage, and deployment checks.
