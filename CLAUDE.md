# Calorie Tracker Mobile — Claude Guidance

## Project Overview

Tauri v2 + React 19 + TypeScript mobile app for tracking calories and exercise. Connected to a REST API at `http://localhost:8080`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | Tauri v2 |
| UI framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` — no `tailwind.config.js`) |
| Component library | shadcn/ui (Radix Nova preset) |
| Server state | React Query v5 (`@tanstack/react-query`) |
| Routing | react-router-dom v7 |
| HTTP client | axios with auth interceptors |
| Forms | react-hook-form v7 + Zod v3 + @hookform/resolvers v3 |
| Charts | recharts v3 |
| Date utilities | date-fns v4 |

## Development Commands

```bash
# Dev server (web only)
pnpm dev

# TypeScript check + production build
pnpm build

# Tauri dev (native window)
pnpm tauri dev

# Tauri production build
pnpm tauri build
```

## SSL Workaround (Required on This Machine)

This machine's Node.js does not trust the npm registry certificate. Two workarounds are required:

**For pnpm installs** — already configured globally:
```bash
pnpm config set strict-ssl false
```

**For shadcn CLI commands** — prefix with `NODE_OPTIONS`:
```bash
$env:NODE_OPTIONS = "--use-system-ca"
pnpm dlx shadcn@latest add <component>
```

Without this, shadcn commands fail with SSL certificate errors.

## Architecture — Clean Architecture (4 Layers)

```
src/
├── domain/          # Layer 1: pure business rules, no external deps
│   ├── entities.ts  # All TypeScript interfaces and enums
│   └── repositories/  # Pure interfaces (contracts), 1 per resource
│
├── application/     # Layer 2: use cases — 1 class, 1 execute() method
│
├── infrastructure/  # Layer 3: concrete implementations
│   ├── api/client.ts         # axios instance with auth + 401 interceptors
│   └── repositories/         # Implement domain interfaces
│
├── di/container.ts  # Module-level singleton — wires repos + use cases
│
└── presentation/    # Layer 4: React
    ├── context/AuthContext.tsx  # Auth state, localStorage, auth:logout event
    ├── hooks/                   # React Query hooks, 1 file per resource
    ├── layouts/                 # AuthLayout + AppLayout (bottom nav)
    ├── components/              # Shared components
    └── pages/                   # Route components
```

## SOLID Principles Applied

| Principle | Implementation |
|-----------|---------------|
| **S** | `AuthRepositoryImpl` only handles HTTP — localStorage is AuthContext's responsibility |
| **S** | Each use case has a single `execute()` method with one purpose |
| **O** | New data source = new impl class, no changes to use cases or hooks |
| **L** | Any `IFoodRepository` implementation can substitute another |
| **I** | 9 small repository interfaces, not one god `IRepository` |
| **D** | Use cases depend on `IXxxRepository` abstractions, never on concrete impls |

## Key Design Decisions

### Auth Flow
- Token stored in `localStorage('auth_token')`
- On `AuthContext` mount: reads token → calls `GET /auth/me` → sets user or clears auth
- Axios interceptor fires `window.dispatchEvent(new Event('auth:logout'))` on any 401
- `AuthContext` listens with `useEffect` and calls `clearAuth()`

### Data Enrichment
The API returns only IDs in relational fields. Two repositories enrich their responses:
- `DailyLogRepositoryImpl.getByDate()` — extracts unique `food_id`s, fetches food details via `Promise.allSettled`, builds a Map, attaches `food` object to each `MealEntry`
- `ExerciseLogRepositoryImpl.getByDate()` — same pattern for `exercise_id` → `Exercise`

### React Query Key Conventions
```
['dailyLog', date]         ['exerciseLogs', date]
['foods', 'search', query] ['exercises', 'search', query, category]
['weightLogs']             ['measurements']
['goals', 'active']        ['profile']
['me']
```

### Mobile Layout
- Bottom nav: `fixed bottom-0 inset-x-0 z-50 h-16 border-t bg-background/95 backdrop-blur`
- Page content: `flex-1 overflow-y-auto pb-20` (prevents bottom nav overlap)
- Food/exercise search: `<Sheet side="bottom">` (more native-feeling than Dialog)

### Dependency Versions — Do Not Upgrade Without Care
- **Zod must stay at v3** (`^3.23.8`) — Zod v4 is incompatible with `@hookform/resolvers` v3
- **@hookform/resolvers must stay at v3** (`^3.10.0`) — v5+ requires Zod v4

## Adding New Features

1. Add interface to `src/domain/entities.ts` if new shape is needed
2. Add/extend repository interface in `src/domain/repositories/`
3. Create use case(s) in `src/application/<resource>/`
4. Implement repository in `src/infrastructure/repositories/`
5. Register in `src/di/container.ts`
6. Add React Query hook in `src/presentation/hooks/`
7. Build the page/component in `src/presentation/`

## API Base URL

`http://localhost:8080` — configured in `src/infrastructure/api/client.ts`. Change there only; all other code uses the `container` singleton.
