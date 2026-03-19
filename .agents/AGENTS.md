# AGENTS.md - AMPerformance Project

This file coordinates all agentic coding work in the AMPerformance e-commerce project.

---

## AGENT ORCHESTRATION (Sub-Agent System)

You are the **Project Lead.** When the user assigns a task, you must first determine which Specialist Sub-Agent is best suited for the job. Adopt the persona, rules, and focus of that agent by reading their specific configuration file.

### Available Sub-Agent Roles

You have access to 5 specialized roles. You must load the context of the selected role from .agents/system/roles/:

1. AGENT-FRONTEND "The UI/UX Builder" (.agents/system/roles/frontend.md)
    - Activate when: Task involves visual components, layouts, styling, animations, or user interactions.
    - Focus: src/components/, src/app/ (client logic), src/app/globals.css.

1. AGENT-BACKEND "The Data Architect" (.agents/system/roles/backend.md)
    - Activate when: Task involves Supabase, database schema, API routes, authentication, or data fetching logic.
    - Focus: src/lib/supabase/, src/app/api/, src/types/, .env configuration.

1. AGENT-QA-TESTING "The Inspector" (.agents/system/roles/qa-testing.md)
    - Activate when: Task involves debugging, refactoring, or verifying completed work.
    - Focus: Code quality, linting, PRD compliance, edge cases.

1. AGENT-DevOps Specialist (.agents/system/roles/devops.md)
    - Activate when: Task involves deployment, environment configuration, CI/CD, or build optimization.
    - Focus: Root-level files (.env, vercel.json, package.json).

1. AGENT-Security Specialist (.agents/system/roles/security.md)
    - Activate when: Task involves auditing code, RLS policies, authentication flows, or secrets management.
    - Focus: Security reviews, SQL Policies, Dependency auditing.

### Skills & External Templates

We operate on a "Knowledge First, Skills Second" basis.

1. Context Injection: Before any task, you MUST read the relevant files in .agents/knowledge/ (PRD, SCHEMA, DESIGN) to understand the specific project constraints.
2. Skill Loading:
    - Check .agents/system/skills/ for local, project-adapted skills.
    - If a standard industry tool is needed (e.g., Shadcn UI, Supabase CLI), you are authorized to use the corresponding npx command defined in the Role's configuration.

3. Execution: Always layer the external tool/template capability on top of the local project knowledge. Do not use generic templates blindly; adapt them to the InfernoGym schema and design system.

### Workflow

1. Analyze Request: "User wants to implement the Shopping Cart."
2. Select Role: "This involves state logic and UI. I will activate Frontend Engineer."
3. Load Context: Read role-frontend.md, DESIGN.md, and PRD.md.
4. Load Skills: Identify relevant skills (e.g., skill-react-component) or external tools (npx shadcn-ui).
5. Execute: Perform the task.
6. Hand-off: If a task requires multiple roles (e.g., Create API -> Then Connect UI), complete the first part and explicitly tell the user: "Backend part done. Switching to Frontend Engineer to connect the UI."

---

## Project Overview

E-commerce platform for gym/CrossFit equipment with direct catalog sales and personalized consulting for "Build Your Gym" projects.

---

## Build Commands

| Command | Description |
| `npm run dev` | Start development server (<http://localhost:3000>) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

**Note**: No test framework configured yet.

---

## Code Style Guidelines

### TypeScript

- Strict mode enabled in `tsconfig.json`
- Use explicit types for props and function parameters
- Import types: `import { type X }` or `import type { X }`
- Path alias: `@/*` maps to `./src/*`

### React Components

- Server Components by default (no directive)
- Client Components: Add `'use client';` at top
- Use PascalCase for component names
- Define interfaces inline for component props
- Use named exports for components

```tsx
// Client component pattern
'use client';

import React from 'react';

interface ProductCardProps {
  product: { id: string; name: string; price: number };
}

export default function ProductCard({ product }: ProductCardProps) {
  return <div>{product.name}</div>;
}
```

### Imports Order

1. React/Next imports
2. Third-party libraries (lucide-react, framer-motion)
3. @supabase imports
4. @/ imports (local modules)
5. CSS imports

### TailwindCSS

- Use CSS variables from `globals.css`: `--color-brutal-black`, `--color-neon-green`
- Use `bg-white/5`, `border-white/10` for subtle dark UI
- Use `text-white/40`, `text-white/20` for muted text
- Reuse `.brutal-btn`, `.brutal-border`, `.brutal-shadow` classes

### Naming Conventions

- Components: PascalCase (`ProductCard.tsx`)
- Hooks: camelCase with `use` prefix (`useMobile.ts`)
- Contexts: PascalCase with `Context` suffix (`AuthContext.tsx`)
- Utils: camelCase (`utils.ts`)
- Pages: lowercase (`page.tsx`, `catalogo/page.tsx`)

### Error Handling

- Wrap sensitive components with ErrorBoundary
- Use try/catch for async operations
- Provide user-friendly error messages

---

## Before Starting Any Work

**ALWAYS** read the following documents before beginning any task:

1. **`.agents/knowledge/PRD.md`** - Product requirements and scope
2. **`.agents/knowledge/TECH_STACK.md`** - Technology decisions and dependencies
3. **`.agents/knowledge/DESIGN.md`** - Visual guidelines and component patterns
4. **`.agents/knowledge/SCHEMA.md`** - Data models and database structure
5. **`.agents/workflows/WORKFLOW.md`** - Current task status and work log

---

## Workflow Management

### Before Beginning

1. Review `.agents/workflows/WORKFLOW.md` to understand current task status
2. Check if there are pending tasks that should be prioritized
3. Read relevant sections from `.agents/knowledge/*`

### During Work

1. Update `.agents/workflows/WORKFLOW.md` with:
   - Task you're working on (mark as `in-progress`)
   - Notes about progress
   - Any blockers or decisions made

### After Completing

1. Mark tasks as `completed` in WORKFLOW.md
2. Add work summary to the log section
3. Run `npm run lint` to check code quality
4. Verify changes work with `npm run dev`

---

## Architecture Notes

- **Next.js App Router**: Pages in `src/app/`
- **Components**: `src/components/`
- **Context**: `src/context/`
- **Lib/Utils**: `src/lib/`
- **Hooks**: `src/hooks/`
- **API Routes**: `src/app/api/*`

### State Management

- Use React Context for global state (AuthContext, CartContext)
- Local state with `useState` for component-specific state

### Data Fetching

- Server Components for initial data load
- Client Components with `'use client'` for interactivity
- Supabase for database operations

---

## Key Files Reference

| File | Purpose |
| `src/app/globals.css` | Global styles, Tailwind config, design tokens |
| `src/lib/utils.ts` | cn() utility for className merging |
| `src/lib/supabase/client.ts` | Supabase browser client |
| `src/lib/supabase/server.ts` | Supabase server client |
| `src/context/AuthContext.tsx` | Authentication state |
| `src/context/CartContext.tsx` | Shopping cart state |

---

## Environment Variables

### Local Development

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Security Classification

| Variable | Type | Exposure | Where to Set |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | ✅ Safe in frontend | `.env` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | ✅ Safe in frontend | `.env` |
| `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY` | Public | ✅ Safe in frontend | `.env` |
| `APP_URL` | Public | ✅ Safe in frontend | `.env` |
| **`SUPABASE_SERVICE_ROLE_KEY`** | **Secret** | ❌ **Never expose** | Vercel Secrets / GHA Secrets |
| **`MERCADOPAGO_ACCESS_TOKEN`** | **Secret** | ❌ **Never expose** | Vercel Secrets / GHA Secrets |
| `CMS_USER`, `CMS_PASS` | Secret | ❌ Local only | Never commit |

### Production Deployment (Vercel)

Add these as **Environment Variables** in Vercel Dashboard → Settings → Environment Variables:

```env
# Public (OK in frontend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=your-mp-public-key
APP_URL=https://your-domain.com

# Secret (Server-side only, NOT in .env for production)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
MERCADOPAGO_ACCESS_TOKEN=your-mp-access-token
```

### GitHub Actions Secrets

For CI/CD, add secrets in: **Repository Settings → Secrets and Variables → Actions**

```yaml
# Example workflow usage
- name: Deploy
  env:
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

### ⚠️ NEVER DO

- ❌ Commit `.env` to git
- ❌ Add service role keys to `.env` in production
- ❌ Expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code
- ❌ Push secrets to GitHub public repos

### File Reference

- `.env.example` - Template with all variables (safe to commit)
- `.env` - Local secrets (gitignored, never commit)

---

## Questions or Unclear Requirements

If the PRD, design, or schema doesn't cover something:

1. Note it in WORKFLOW.md as a blocker/question
2. Ask the user for clarification
3. Document any decisions made in WORKFLOW.md

## COMMAND: AUDIT_PROJECT

When the user requests “What's left to do?”, ‘Audit’, or “Next Steps”:

1. **Reading:** Carefully read PRD.md, SCHEMA.md, and WORKFLOW.md.
2. **Gap Analysis:** Compare PRD requirements vs WORKFLOW history.
3. **Output:** Generate a structured report in Markdown with the following format:

```bash
### 🚧 Status Report: {ProjectName}

#### ✅ Completed (Summary of WORKFLOW.md)

- Setup Next.js + Tailwind.
- Visual Catalog MVP.

#### 🔴 Critical / Blocking (Prevents progress)

- **Final Schema Definition:** The SCHEMA.md file is a draft; no SQL has been executed in Supabase.
- **Connection to Supabase:** No verified environment variables.

#### 🟡 Next Logical Steps (Short-Term Roadmap)

1. Validate and Execute Schema in Supabase.
2. Implement Auth and middleware.
3. Create TypeScript types (`src/types/database.ts`).
4. Create helper functions (`lib/supabase/queries.ts`).

#### 🟢 Improvements / Technical Debt (Optional)

- Migrate hardcoded styles to DESIGN.md variables.
```

---
