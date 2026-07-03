# Go Business — Referral Dashboard

A Vite + React (JSX) single-page application for the Go Business referral coding assessment.

## Features

- Cookie-based JWT authentication (js-cookie, `jwt_token`)
- Protected routes with automatic redirect to `/login`
- Referral dashboard: overview metrics, service summary, referral link/code sharing
- Searchable and sortable referrals table (API-driven) with client-side pagination (10 rows/page)
- Referral detail page with graceful not-found handling
- 404 page (public, not wrapped in ProtectedRoute)

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Tech Stack

- **Framework**: Vite + React 19 (JSX)
- **Routing**: react-router-dom (BrowserRouter in App.jsx, not main.jsx)
- **Auth storage**: js-cookie (cookie name: `jwt_token`)
- **Styling**: Vanilla CSS (`src/index.css`)

## Architecture

```
src/
  main.jsx              createRoot → <App /> only
  App.jsx               BrowserRouter + all Routes
  index.css             design tokens + all component styles
  lib/
    api.js              fetch layer: signIn, fetchReferrals, fetchReferralById
    format.js           date → YYYY/MM/DD, profit → $1,234 (en-US, 0 decimals)
    hooks.js            useDebouncedValue, useReferralFeed
    clipboard.js        navigator.clipboard with execCommand fallback
  components/
    ProtectedRoute.jsx  cookie check → children or Navigate to /login
    Navbar.jsx          brand link, Primary nav, Log out
    SiteFooter.jsx      brand, Footer nav, © 2024
    OverviewMetrics.jsx metric tiles from metrics[]
    ServiceSummary.jsx  4 tiles from serviceSummary
    ShareReferral.jsx   readonly link/code + Copy buttons + aria-live feedback
    ReferralsTable.jsx  search, sort, table, pagination
  pages/
    LoginPage.jsx
    DashboardPage.jsx
    ReferralDetailPage.jsx
    NotFoundPage.jsx
vercel.json             SPA rewrite for deep links
```

## Routes

| Route                  | Access    | Behavior                     |
| ---------------------- | --------- | ---------------------------- |
| `/login`               | Public    | Authenticated → redirect `/` |
| `/`                    | Protected | Referral Dashboard           |
| `/dashboard/referrals` | —         | Redirects to `/`             |
| `/referral/:id`        | Protected | Detail page                  |
| `*`                    | Public    | 404 page                     |

## Test Credentials

```
Email:    admin@example.com
Password: admin123
```

## Live Deploy

https://go-business-beta.vercel.app/login
