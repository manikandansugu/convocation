# Campus Trust Convocation Portal

A responsive student convocation portal built with React, TypeScript, and Vite.

## Project structure

```text
src/
├── assets/                 Static images imported by the application
├── components/
│   ├── layout/             Application shell components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── ui/                 Reusable, presentation-only UI components
│       └── Icon.tsx
├── config/                 Static configuration and application metadata
│   ├── navigation.ts
│   └── student.ts
├── pages/                  Route-level page components
│   ├── StudentInformationPage.tsx
│   ├── IdentityVerificationPage.tsx
│   ├── PaymentPage.tsx
│   ├── GuestAdditionPage.tsx
│   └── ConvocationPassPage.tsx
├── types/                  Shared TypeScript data contracts
│   └── registration.ts
├── App.css                 Application component styles
├── App.tsx                 Application composition and page selection
├── index.css               Global tokens and reset styles
└── main.tsx                React entry point
```

## Conventions

- Components and pages use PascalCase filenames.
- Configuration, types, and utilities use descriptive lowercase filenames.
- Shared UI stays independent of feature-specific business logic.
- Page state remains inside its page until multiple features need it.
- Shared domain models belong in `src/types`.
- Static navigation and application metadata belong in `src/config`.
- Components use named exports; the root `App` retains its default export.
- Imports are ordered from external packages to internal modules and styles.

As the application grows, each substantial domain can move to
`src/features/<feature-name>/` with its own components, hooks, services, and
types. API calls should be isolated in `src/services` rather than placed
directly in page components.

## Commands

```bash
npm run dev
npm run dev:api
npm run test:payment
npm run build
npm run lint
npm run preview
```

## Razorpay test payments

Razorpay Checkout is backed by a small Node payment API in `server/`. The API
creates the order with a server-owned amount, verifies the checkout signature,
and confirms that the payment is captured before the registration continues.

1. Copy `.env.example` to `.env.local`.
2. Add the Razorpay test key ID and secret to `.env.local`. Never add the secret
   to a `VITE_` variable or commit it to Git.
3. Run `npm run dev` to start both the payment API and Vite.

Use `npm run dev:web` and `npm run dev:api` only when you want to run the two
development services in separate terminals.

For production, deploy `server/` to a Node host, configure its environment
variables there, and set `VITE_API_BASE_URL` to that HTTPS service before
building the GitHub Pages frontend. The in-memory issued-order store is suitable
for the current single-instance demo; use a shared database before running more
than one payment API instance.
