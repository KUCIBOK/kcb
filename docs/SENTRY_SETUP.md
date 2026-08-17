# Sentry setup (internal guidance)

IMPORTANT: Do NOT commit your Sentry DSN or any private auth token to the repository. Always set `VITE_SENTRY_DSN` via your deployment provider (Vercel) or in a local, gitignored `.env.local` file. The repo should never contain production DSNs.

This document explains where to find the DSN, how to configure environment variables, how to test Sentry locally or in preview, and how to upload sourcemaps.

## Where to find the DSN
1. Open https://sentry.io and select your organization.
2. Select the project (or create a new React project).
3. Go to Project Settings → Client Keys (DSN) (or Setup → SDK → Client Keys).
4. Copy the DSN (format: `https://<public_key>@o<org_id>.ingest.sentry.io/<project_id>`).

## Local environment (.env)
- Create a file named `.env.local` at the repository root (do not commit secrets).
- Add the DSN:

```
VITE_SENTRY_DSN="https://<public_key>@o<org_id>.ingest.sentry.io/<project_id>"
```

Notes:
- The app initializes Sentry only when `import.meta.env.PROD` is true (production builds).
- To test locally with Sentry enabled, run a production build then preview:

```bash
yarn build
yarn preview
```

## Vercel (production / preview)
1. On dashboard.vercel.com open the project.
2. Settings → Environment Variables → Add.
   - Key: `VITE_SENTRY_DSN`
   - Value: your DSN
   - Environment: `Preview` or `Production` as needed
3. Optionally set `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, and `SENTRY_RELEASE` for sourcemap uploads in CI.

## Uploading sourcemaps (optional but recommended)
Prerequisites: set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` in CI or locally.

Example release flow (set `SENTRY_RELEASE` to a unique string, e.g. the git SHA or version):

```bash
export SENTRY_RELEASE=$(git rev-parse --short HEAD)
export SENTRY_AUTH_TOKEN=<<your token>>
export SENTRY_ORG=<<your-org>>
export SENTRY_PROJECT=<<your-project>>
yarn build
yarn sentry:upload-sourcemaps
```

The project `package.json` already contains a `sentry:upload-sourcemaps` script which uses `sentry-cli`.

## Testing Sentry (internal-only)
- A test component is available at `src/components/dev/TestSentryButton.jsx`. This file is intentionally in a `dev/` folder and is not used anywhere in the public app by default.
- **Do not** add this button to the `/global` page or other public pages. Keep it internal.

How to use it safely:
1. Create a local-only dev route or import the component manually in a developer-only panel.
2. Ensure you only expose it when `import.meta.env.DEV` or when an internal flag is present.

Example (dev-only route snippet):

```jsx
// src/pages/DevTools.jsx (create this file locally, do NOT commit it to public pages)
import TestSentryButton from '../components/dev/TestSentryButton'

export default function DevTools() {
  if (!import.meta.env.DEV) return null
  return <div className="p-6"><TestSentryButton /></div>
}
```

Then run `yarn dev` and visit the dev route (if you add a route locally) or run `yarn build && yarn preview` to test Sentry in preview.

## Verification checklist
- Sentry DSN set in `.env.local` or in Vercel env vars.
- `yarn build && yarn preview` shows errors in Sentry after clicking the internal test button.
- Replays and transactions visible in Sentry when sampling rates are enabled.

## Security note
- The DSN public key is safe to use in client code, but do not expose or commit private auth tokens (`SENTRY_AUTH_TOKEN`). Use CI / Vercel environment variables for those.

If you want, I can add an internal-only dev route file to the repo (guarded by `import.meta.env.DEV`) that imports the test button; I will not expose it on any public route like `/global`.
