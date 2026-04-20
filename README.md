# TaskSphere

A **real-time collaborative task management platform** built with a modern TypeScript stack. Organize work into apps, manage tasks with Kanban boards, visualize dependencies as interactive flowcharts, and collaborate in real time — all in one place.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Monorepo (Turborepo + pnpm)           │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  apps/web    │  │  apps/api    │  │  packages/db     │  │
│  │  React+Vite  │  │  NestJS      │  │  Drizzle Schema  │  │
│  │  SPA         │◄─┤  REST + WS   │◄─┤  + Client        │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘  │
│         │                 │                                  │
│         │  WebSocket      │  PostgreSQL                      │
│         │  (Socket.IO)    │  (Drizzle ORM)                   │
│         ▼                 ▼                                  │
│  ┌──────────────────────────────┐                            │
│  │  packages/shared             │                            │
│  │  Shared types & constants    │                            │
│  └──────────────────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, React Query, React Flow, dnd-kit |
| **Backend** | NestJS, TypeScript, JWT Auth, Socket.IO, Throttler |
| **Database** | PostgreSQL, Drizzle ORM |
| **Testing** | Jest + Supertest (API), Vitest + RTL (Components), Playwright (E2E) |
| **DevOps** | Turborepo, pnpm, Husky, lint-staged, GitHub Actions CI |
| **Deployment** | Vercel (frontend), Render (API), Supabase (database) |

## Features

- **Authentication** — Register/login with JWT, profile management
- **Todo Apps** — Create multiple project workspaces
- **Task Management** — CRUD with status (Todo/In Progress/Done), priority (Low/Medium/High), sorting, and filtering
- **Multiple Views** — List view, Kanban board (drag & drop), and interactive Workflow graph
- **Workflow View** — Visualize task dependencies as a directed graph with React Flow, auto-layout via dagre, and cycle detection
- **Real-time Collaboration** — Invite collaborators (Owner/Editor/Viewer roles), live updates via WebSocket
- **Activity Feed** — Audit log of all actions per workspace
- **Dark/Light Theme** — System-aware with manual toggle
- **Command Palette** — Quick navigation with `Cmd/Ctrl+K`
- **Error Boundaries** — Graceful crash recovery UI
- **Loading Skeletons** — Polished loading states throughout
- **Rate Limiting** — Global + stricter auth endpoint throttling
- **URL-synced Filters** — Filters and sort persist in the URL

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9
- **PostgreSQL** >= 14

### 1. Clone & Install

```bash
git clone https://github.com/<your-username>/TaskSphere.git
cd TaskSphere
pnpm install
```

### 2. Environment Variables

Copy the example env files:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env.local
cp apps/web/.env.example apps/web/.env.local
```

Key variables:

| Variable | Location | Description |
|----------|----------|-------------|
| `DATABASE_URL` | `.env` | PostgreSQL connection string |
| `JWT_SECRET` | `apps/api/.env.local` | Secret for JWT signing |
| `CORS_ORIGIN` | `apps/api/.env.local` | Allowed frontend origins (comma-separated) |
| `VITE_API_URL` | `apps/web/.env.local` | Backend API URL |
| `VITE_WS_URL` | `apps/web/.env.local` | WebSocket server URL |

### 3. Database Setup

```bash
# Push schema to your database
cd packages/db
npx drizzle-kit push
```

### 4. Run Development Servers

```bash
# From the root — starts both API (port 3000) and Web (port 5173)
pnpm dev
```

## Testing

### API Unit Tests (Jest)

```bash
cd apps/api
npx jest --forceExit
```

### API Integration Tests (Supertest)

```bash
cd apps/api
npx jest --config test/jest-e2e.json --forceExit --testPathPattern="api.e2e"
```

### Frontend Component Tests (Vitest + RTL)

```bash
cd apps/web
pnpm test
```

### E2E Tests (Playwright)

```bash
# Install browser (first time)
npx playwright install --with-deps chromium

# Run with dev servers up
pnpm test:e2e
```

## Project Structure

```
TaskSphere/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── core/           # Guards, filters, constants
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # JWT authentication
│   │   │   │   ├── todo/       # Todo apps, tasks, dependencies
│   │   │   │   ├── users/      # User management
│   │   │   │   ├── drizzle/    # DB connection module
│   │   │   │   └── websocket/  # Socket.IO gateway
│   │   │   └── main.ts
│   │   └── test/               # E2E integration tests
│   └── web/                    # React SPA
│       └── src/
│           ├── api/            # Axios API layer
│           ├── components/     # UI components (shadcn, Kanban, Workflow, etc.)
│           ├── hooks/          # React Query hooks, custom hooks
│           ├── pages/          # Route pages
│           ├── stores/         # Zustand stores (auth, UI)
│           └── test/           # Test utilities & setup
├── packages/
│   ├── db/                     # Drizzle schema, relations, client
│   └── shared/                 # Shared TypeScript types
├── e2e/                        # Playwright E2E tests
├── .github/workflows/          # CI pipeline
├── turbo.json                  # Turborepo config
└── playwright.config.ts        # Playwright config
```

## Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Database | **Supabase** | Use the connection pooler URI as `DATABASE_URL` |
| API | **Render** | Runtime: Node, Build: `cd ../.. && pnpm install && pnpm turbo run build --filter=@tasksphere/api`, Start: `node dist/main.js` |
| Frontend | **Vercel** | Framework: Vite, Root: `apps/web`, set `VITE_API_URL` and `VITE_WS_URL` env vars |

## CI/CD

GitHub Actions runs on every push/PR to `main`:

- Lint (ESLint)
- Format check (Prettier)
- Type check (TypeScript)
- Build verification

Husky + lint-staged runs on every commit locally for fast feedback.

## License

MIT
