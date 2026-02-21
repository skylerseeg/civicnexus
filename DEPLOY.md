# Civic Nexus OS — Vercel Deploy in 5 Minutes

## Option A: Vite + React (Fastest)

```bash
# 1. Scaffold
npm create vite@latest civicnexus -- --template react
cd civicnexus

# 2. Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Replace tailwind.config.js
```

**tailwind.config.js:**
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**src/index.css** — replace entire file with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```bash
# 4. Drop in the component
# Copy CivicNexusOS.jsx → src/App.jsx (replace entire file)

# 5. Run locally
npm run dev

# 6. Deploy to Vercel
npm install -g vercel
vercel
# Follow prompts — framework: Vite, build: npm run build, output: dist
```

Done. Your app is live.

---

## Option B: Next.js (if you want API routes later for Supabase)

```bash
npx create-next-app@latest civicnexus --tailwind --app
cd civicnexus

# Copy CivicNexusOS.jsx → app/page.jsx
# Add "use client" as first line of page.jsx

vercel
```

---

## Adding Supabase (for real data persistence)

```bash
npm install @supabase/supabase-js
```

Create `.env.local`:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Tables to create in Supabase:
- `donors` (id, name, org, amount, stage, tier, named_space, days_in_stage)
- `rocks` (id, name, owner, due, status, metric)
- `vtp_checkpoints` (id, name, spec, status)
- `competitor_flags` (id, competitor, note, created_at)

---

## What's Built (Sprint 1 MVP)

| Feature | Status |
|---------|--------|
| Capital gauge ($0 → $20M, $12M floor marker) | ✅ |
| Donor kanban (5 stages, advance/back) | ✅ |
| Log new pledge modal | ✅ |
| Edit existing donor | ✅ |
| 14-day nudge warning (Meeting stage) | ✅ |
| Capital → Construction gate unlocking | ✅ |
| VTP checkpoint pass/fail/block | ✅ |
| Jan 1 construction deadline alert | ✅ |
| Q1 Rocks board (10 rocks, status swipe) | ✅ |
| Race to the Rink competitor flag | ✅ |
| Mobile-first bottom nav | ✅ |

## Next Sprints

- **Sprint 2:** Supabase persistence + auth (role-based: Board / Fundraiser / PM)
- **Sprint 3:** Federal grant % calculator (live as committed $ changes)
- **Sprint 4:** VTP photo upload to Supabase Storage
- **Sprint 5:** Email/SMS nudge automations via Resend or Twilio
