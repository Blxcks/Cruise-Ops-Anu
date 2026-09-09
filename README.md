# CruiseOps Antigua — Production Web Build

Frontend: GitHub Pages  
Backend: existing Supabase project `itgdvppxnplgwdaadszm`

## GitHub Pages
Recommended source: **GitHub Actions** using `.github/workflows/deploy-pages.yml`.
The app uses hash routing (`#/...`) so navigation does not depend on server-side rewrites.

## Supabase production checklist
1. Configure the GitHub Pages site URL under Authentication → URL Configuration.
2. Add the GitHub Pages URL as an allowed redirect URL.
3. Configure a production SMTP provider under Authentication email settings.
4. Keep email confirmation enabled.
5. Enable leaked-password protection when the Supabase project is on a plan that supports it.
6. Assign `admin`, `port_manager`, or `port_agent` roles manually to operational staff; new signups default to `viewer`.
7. Review Storage bucket policies and keep `cruiseops-documents` private.

The browser uses only the Supabase publishable key. Never place a secret/service-role key in this repository.
