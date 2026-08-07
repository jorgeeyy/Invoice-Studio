# Invoice Studio — Frontend

React SPA for Invoice Studio: create, edit, and manage clients, products, and invoices with live invoice previews, PDF downloads, and full responsive layouts.

## Stack

- **React 19** + **TypeScript**
- **Vite 8** build tool
- **Tailwind CSS v4** (CSS-first theme tokens in `src/index.css`)
- **TanStack Query v5** for server state
- **React Router v7**
- **Zod** for form validation
- **lucide-react** icons

## Requirements

- Node.js 20+ (LTS recommended)
- npm

## Setup

```bash
cd frontend
npm install
```

## Running

```bash
npm run dev
```

Starts the dev server at `http://localhost:5173`.

The app talks to the backend API at `http://localhost:8000/api` by default. Override with a `.env` file:

```bash
VITE_API_URL=http://localhost:8000/api
```

**Demo login:** `demo@example.com` / `demo1234`

## Scripts

| Command            | Description                            |
| ------------------ | --------------------------------------- |
| `npm run dev`      | Start the Vite dev server               |
| `npm run build`    | Type-check (`tsc -b`) and production build to `dist/` |
| `npm run preview`  | Serve the production build locally      |
| `npm run lint`     | Run oxlint                              |

## Project structure

```
src/
  api/                 # API request wrappers (auth, clients, invoices, products, business)
  components/          # shared UI (Toast, InvoicePreview, invoice templates, layout, ui)
  hooks/               # TanStack Query hooks (useInvoices, useClients, useProducts, useSession, ...)
  lib/                 # utilities and Zod validation schemas
  pages/               # route-level pages (Dashboard, Login, Signup, Landing, invoices/, clients/, products/, settings/)
  types/               # TypeScript domain types
  App.tsx              # routing + providers
  main.tsx             # app bootstrap
```

## Pages

- `/` — Marketing landing page
- `/login`, `/signup` — Authentication (HttpOnly-cookie session)
- `/dashboard` — Home overview
- `/invoices`, `/invoices/:id`, `/invoices/:id/edit`, `/invoices/create` — Invoice management, live preview, print/download
- `/print/:id` — Print-only invoice sheet
- `/clients` — Client list + CRUD
- `/products` — Product list + CRUD
- `/settings` — Business profile, payment details, theme

## Auth

Sessions use an HttpOnly cookie (`invoice_studio`) set by the backend `/api/auth/login` and `/api/auth/register`. The frontend never stores the token — the session hook (`useSession`) reflects the cookie and drives route protection.