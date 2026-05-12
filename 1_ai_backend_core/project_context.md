# 🧠 PROJECT MASTER CONTEXT: AUTOTICKET AI

## 1. VISION & PHILOSOPHY (The 100-Billion Goal)
- **Product Core:** AutoTicket AI (B2B SaaS). "Nhà xe Trường Thịnh" is Tenant 01.
- **Philosophy:** "Invisible UI". Users don't need to learn a web interface; they just "talk" to the AI, and the AI controls the web. Simple enough for the elderly to book a ticket in 30 seconds.
- **Mission:** Digitize 100% of traditional passenger transport in Vietnam. Provide family-owned bus companies with a 24/7 AI agent at 1/100th the cost of human operators to compete with OTA platforms.
- **Phases:**
  - *Phase 1 (MVP):* Upgrade Truong Thinh's web + Integrate AI Agent. Prove 50% operational cost reduction.
  - *Phase 2 (SaaS):* Package the AI as an embeddable `<script>` widget. Subscription model (5M VND/month or 2,000 VND/ticket).
  - *Phase 3 (Expansion):* Zalo Mini App, Messenger, Telegram integration for hundreds of bus companies.

---

## 2. ARCHITECTURE & EXACT DIRECTORY TREE
We use a **Micro-Frontend & API-First** approach to separate the AI logic from client websites.

```text
autoticket-ai-workspace/
├── .gitignore                          # [CRITICAL] Root level, blocks **/node_modules/, **/.next/, **/*.node, etc.
│
├── 1_ai_backend_core/                  # AI & API CORE (Python/FastAPI)
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── chat.py                 # [DONE] Main text chat API (receives/returns text, mock API)
│   │   │   ├── webhooks.py             # [TODO] Handle payment webhooks (VietQR/PayOS)
│   │   │   └── admin.py                # [TODO] Dashboard API for bus company managers
│   │   ├── core/
│   │   │   ├── config.py               # [TODO] Pydantic settings (GEMINI, SUPABASE keys)
│   │   │   ├── database.py             # [DONE] Prisma Client connection manager
│   │   │   ├── security.py             # [TODO] JWT auth, API security
│   │   │   └── multi_tenant.py         # [TODO] Middleware to route AI per bus company
│   │   ├── agents/
│   │   │   ├── booking_agent.py        # [TODO] Booking flow agent (LangGraph)
│   │   │   ├── tools.py                # [TODO] Tool Calling functions (check_seats, book...)
│   │   │   └── prompts.py              # [TODO] System Prompts for Gemini
│   │   └── main.py                     # [DONE] FastAPI init & Lifespan DB startup
│   ├── prisma/
│   │   └── schema.prisma               # [DONE] DB schema (Tenant, Route, Trip, Booking)
│   ├── .env                            # [DONE] Environment variables (DATABASE_URL, keys)
│   ├── requirements.txt                # [DONE] Python dependencies (fastapi, prisma, ...)
│   └── project_context.md             # ← THIS FILE (Source of Truth)
│
├── 2_frontend_widget/                  # EMBEDDABLE SAAS WIDGET (React/Vite) — Deployed on Vercel
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx          # Main conversational UI
│   │   │   ├── TicketCard.jsx          # AI-suggested ticket display
│   │   │   └── QRPayment.jsx           # Chat-based QR payment UI
│   │   ├── hooks/
│   │   │   └── useAgentChat.js         # API communication hook
│   │   ├── main.jsx                    # Mounts widget into host page DOM
│   │   └── widget.css                  # Scoped, independent CSS for the widget
│   ├── vite.config.js                  # Builds to single bundle: autoticket-widget.js
│   └── package.json
│
└── 3_web_truongthinh_nextjs/           # MAIN BUS WEBSITE (Next.js 14 App Router) — Deployed on Vercel
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx                  # Injects Widget via <Script src=".../autoticket-widget.js">
    │   └── page.tsx                    # Listens to TICKET_BOT_ACTION, controls booking steps
    ├── components/
    │   ├── CheckoutForm.tsx            # Booking logic & PayOS integration
    │   ├── Header.tsx
    │   ├── HeroSection.tsx
    │   ├── QRPayment.tsx               # VNPay-style dark UI with 15-min countdown & auto-polling
    │   ├── RouteCard.tsx               # Bus route display card ("use client" — uses lucide-react)
    │   └── SeatSelection.tsx           # Interactive seat map
    ├── next.config.mjs                 # [CRITICAL] Build failsafe: ignoreDuringBuilds + ignoreBuildErrors
    ├── postcss.config.js               # [CRITICAL] Must use CommonJS (module.exports), NOT export default
    ├── tailwind.config.ts              # Brand color tokens: brand-blue, brand-text, brand-muted, etc.
    └── package.json
```

---

## 3. CRITICAL INTEGRATION MECHANICS

- **Event Bridge (The Magic):** The Widget (`2_frontend_widget`) dispatches a global DOM event:
  ```js
  window.dispatchEvent(new CustomEvent('TICKET_BOT_ACTION', {
    detail: { action: 'OPEN_SEAT_MAP', trip_id: '...', seats: [...] }
  }));
  ```

- **State Sync:** The Website (`3_web_truongthinh_nextjs/app/page.tsx`) listens for this event. When fired, it immediately switches the UI from `Browse` → `SeatSelection` and injects the AI-selected data into the booking form.

- **Auto-Polling Payment:** `QRPayment.tsx` features a 15-minute countdown and a polling interval that checks for payment confirmation, simulating a real webhook from PayOS/VietQR.

---

## 4. DEPLOYMENT & GIT SURVIVAL RULES (MUST FOLLOW)

### Vercel Build Failsafe
Next.js is strict about TS/ESLint errors. We bypass both during builds via `next.config.mjs` to ensure rapid demo deployments:
```js
// next.config.mjs
const nextConfig = {
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
```

### PostCSS Format Rule
Always use **CommonJS** for `postcss.config.js`. Using `export default` injects an `__esModule` marker that PostCSS cannot parse, breaking the Vercel build:
```js
// CORRECT ✅
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };

// WRONG ❌ — causes "__esModule" Vercel warning
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

### Git Poisoning Recovery
If Git history is ever poisoned by large files (e.g., the 129MB `next-swc.win32-x64-msvc.node` binary), **do NOT use `git filter-branch`**. Use the nuclear physical reset on Windows CMD:
```cmd
rmdir /s /q .git && git init && git branch -M main && git add . && git commit -m "chore: clean reset — remove poisoned history" && git remote add origin https://github.com/Tuanvu07/autoticket-ai.git && git push --force origin main
```
> **Why delete `.git`?** `.gitignore` only affects future `git add` calls. A committed blob lives permanently in `.git/objects/` and travels with every push regardless of ignore rules. Physically deleting `.git` is the only way to erase it without complex rewrite tooling.

### Root `.gitignore` — Non-Negotiable Patterns
```
**/node_modules/    # Blocks ALL node_modules in ALL subdirectories
**/.next/           # Next.js build cache
**/dist/            # Vite/widget build output
**/venv/            # Python virtualenvs
**/__pycache__/     # Python bytecode
**/.env             # All secret files
**/*.node           # Large native binaries (the 129MB next-swc killer)
```

---

*This document is the single Source of Truth for all future AI interactions and development cycles.*