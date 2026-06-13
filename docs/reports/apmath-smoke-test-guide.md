# AP/EIE Smoke Test Guide

- Phase: 0.5
- Purpose: provide read-only operational smoke checks before AP Math refactor PRs.
- Scope: Worker API reachability/CORS and GitHub Pages browser load/login-screen checks.

## Principles

- Do not write production data.
- Do not hardcode IDs, passwords, tokens, or session values.
- Do not click save, attendance, homework, consultation, student edit, class edit, timetable save, or OMR save controls.
- Treat `401` and `403` API responses as reachable when the endpoint requires auth.
- Treat `500` API responses as failures.

## API Smoke

Run:

```bash
node tools/smoke-api.mjs
```

Supported environment variables:

```bash
AP_API_BASE=https://ap-math-os-v2612.js-pdf.workers.dev/api
EIE_API_BASE=https://wangji-eie-os.js-pdf.workers.dev/api
WANGJI_API_BASE=https://wangji-common-worker.js-pdf.workers.dev/api
PAGES_ORIGIN=https://icefoxtail.github.io
SMOKE_API_TIMEOUT_MS=12000
```

Checks:

- AP Worker responds with a non-500 status.
- EIE Worker responds with a non-500 status.
- Wangji common Worker responds with a non-500 status.
- CORS preflight does not return `Access-Control-Allow-Origin: *`.
- CORS preflight echoes the expected Pages origin.
- A bad read-only endpoint does not expose stack traces, route paths, SQL errors, or internal details.

The script uses only read-only `GET` and `OPTIONS` requests.

## Browser Smoke

Install/prepare Playwright outside this script:

```bash
npm install -D playwright
npx playwright install chromium
node tools/smoke-browser.mjs
```

If Playwright is not installed, the script exits with setup instructions.

Supported environment variables:

```bash
AP_BASE_URL=https://icefoxtail.github.io/AP------/apmath/
EIE_BASE_URL=https://icefoxtail.github.io/AP------/eie/
AP_SMOKE_ID=
AP_SMOKE_PW=
EIE_SMOKE_ID=
EIE_SMOKE_PW=
SMOKE_HEADLESS=1
```

If ID/PW variables are missing, the browser smoke does not attempt login. It only checks that the page loads and that a login screen or dashboard/app shell is detectable.

If ID/PW variables are supplied, the script attempts login and checks for dashboard/navigation text. Credentials are read only from environment variables.

## Failure Interpretation

- API `500`: Worker failure; investigate before merging refactor work.
- API `401` or `403`: acceptable for auth-required endpoints if worker is reachable.
- CORS `*`: fail; CORS is too permissive for the checked origin.
- Missing CORS header: fail for the API smoke target; verify Worker OPTIONS handling.
- Browser page load fail: check GitHub Pages deployment, route path, and service worker state.
- Console/pageerror fail: inspect the reported browser error before merging refactor work.
- Playwright missing: not a product failure, but browser smoke is unverified until the dependency is prepared.

## Use In Next Refactor PR

Before merging a `student.js`, `classroom.js`, `dashboard.js`, or `report.js` split PR:

1. Run `node tools/smoke-api.mjs`.
2. Run `node tools/smoke-browser.mjs` with no credentials for a page-load smoke.
3. Optionally run browser smoke with smoke-only credentials through environment variables.
4. Record results in the PR or `docs/reports/apmath-smoke-test-result.md`.
