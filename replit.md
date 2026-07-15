# Kanz Bakery

A full-stack web application for Kanz Bakery — a premium artisan bakery platform. Customers can browse the menu, view product details with ingredients and allergens, rate and review products, and submit catering or bulk order inquiries.

## Run & Operate

- `pnpm --filter @workspace/kanz-bakery run dev` — run the frontend (port auto-assigned, preview at `/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, preview at `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS v4, wouter (routing), TanStack React Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v4), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)
- Fonts: Playfair Display (headings) + DM Sans (body)

## Where things live

```
artifacts/kanz-bakery/src/
  pages/          # Route pages: home, menu, product-detail, catering, about, contact
  components/     # Shared UI components (product-card, dietary-badge, skeleton-card, layout/)
  index.css       # Design tokens: warm amber/cream palette, Playfair Display + DM Sans
  App.tsx         # Router setup (wouter)

artifacts/api-server/src/routes/
  categories.ts   # GET /categories, GET /categories/:id
  products.ts     # GET /products, GET /products/:id, GET /products/slug/:slug
  reviews.ts      # GET /reviews?productId=, POST /reviews
  catering.ts     # GET /catering-inquiries, POST /catering-inquiries, GET /catering-inquiries/:id
  catalog.ts      # GET /catalog/featured, /catalog/stats, /catalog/top-rated, /catalog/search

lib/
  api-spec/openapi.yaml   # OpenAPI contract (source of truth)
  api-client-react/       # Generated React Query hooks
  api-zod/                # Generated Zod validation schemas
  db/src/schema/          # Drizzle tables: categories, products, reviews, catering-inquiries
```

## Architecture decisions

- **OpenAPI-first**: All API contracts live in `lib/api-spec/openapi.yaml`. Frontend hooks and backend Zod validators are both generated from it — never hand-written.
- **Reviews are flat, not nested**: Reviews live at `/api/reviews?productId=` (not `/products/:id/reviews`) to avoid Orval TS2308 name collisions from combined path+query params.
- **Product slugs**: Products have both `id` and `slug` fields. The frontend uses slug-based URLs (`/menu/:slug`) for SEO; the API supports both `GET /products/:id` and `GET /products/slug/:slug`.
- **Moderation-ready reviews**: The `reviews` table has an `approved` boolean (default `true`) so a future admin panel can add moderation without a schema change.
- **Catering inquiry status**: `catering_inquiries.status` defaults to `"pending"` — structured for future workflow (quoting, confirmation, payment).
- **No auth in v1**: The build prompt explicitly deferred payment and authentication to future phases. The backend structure (route organization, DB schema) makes it straightforward to add Replit Auth or Clerk later.

## Product

- **Home** (`/`) — Hero, featured products, catalog stats, category grid, top-rated items, bakery story, catering CTA
- **Menu** (`/menu`) — Full product catalog with category filter, search, dietary label filters
- **Product Detail** (`/menu/:slug`) — Full product page with ingredients, allergens, reviews, star rating submission
- **Catering** (`/catering`) — Multi-field inquiry form for bulk orders, events, weddings, corporate catering
- **About** (`/about`) — Bakery story, values, baking philosophy, team
- **Contact** (`/contact`) — Address, hours, phone, email, contact form

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any `lib/db/src/schema/` change, run `pnpm run typecheck:libs` before typechecking artifacts — the API server imports DB tables from the generated declarations.
- After any `lib/api-spec/openapi.yaml` change, run codegen before touching frontend or backend code.
- The Orval config locks `info.title` to `Api` — do not change it or generated filenames will break.
- Do not use `@workspace/api-client-react/api` as an import path — the package only exports from its root.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
