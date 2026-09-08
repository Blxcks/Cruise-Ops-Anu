# CruiseOps Antigua — GitHub Pages + Supabase Test Build

Mobile-first port-agent operations app backed by the existing Supabase project.

## What changed for GitHub Pages

- Uses **hash-based SPA routing** (`#/dashboard`, `#/portcalls`, `#/tasks`, etc.).
- No server-side rewrite is required, so GitHub Pages will not turn normal navigation into 404s.
- Port Call workspaces use `#/portcalls/<call-id>` so individual calls remain addressable and refresh-safe.
- Includes a GitHub Pages `404.html` fallback and `.nojekyll`.
- Supabase remains the backend; the browser uses the publishable key and Supabase RLS.

## Deploy to GitHub Pages

1. Create a GitHub repository, e.g. `cruiseops-antigua`.
2. Upload **all files in this folder** to the repository root.
3. In GitHub: **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site.

The site will normally be available at:
`https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY/`

## Supabase

This build is configured for the existing CruiseOps Antigua Supabase project. Do not replace the publishable key with a service-role key. RLS remains responsible for database access control.

## Important test-build notes

- This is still a field-test build, not a final production security/operations release.
- Documents currently store metadata only; binary file upload/storage is not implemented in this build.
- There is no automated email/notification layer yet.
- Do not put sensitive production information into the test environment until the remaining production controls are reviewed.
