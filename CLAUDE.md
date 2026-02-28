# Bypass Heart Health — New Cardio Project Rules

## Stack
- Frontend: Ionic 8 + React + TypeScript + Capacitor (one codebase: web + iOS + Android)
- Backend: reuse old_cardio/backend as-is (Node/Express/Prisma/PostgreSQL)

## Coding Rules

### SOLID + Modular
- Single-responsibility components — layout separate from logic
- Icons all go through `src/lib/icons.ts` (swap icon library in one file)
- Mock/static data in separate files (e.g. `src/data/mock_*.ts`) — swap to API in one place
- AI/risk logic stays backend-only

### Style
- Comments: casual, short, human-written — like `// hardcoded for now, Phase 2 will hit API`
- NO over-documentation, no JSDoc blocks everywhere
- No over-engineering — no abstractions for one-time use
- No error handling for impossible cases

### Keep It Simple
- Don't add features not asked for
- Don't create helpers for single-use operations
- Minimum complexity for current task

## Design System (from ref images — PMX Health inspired)

### Colors
- Background: deep green-black (`#0a0f0d` or `#060d08`)
- Surface/card: `#0f1a12` or `#111c14`
- Primary text: white `#ffffff`
- Secondary text: `#8a9a8c`
- Accent/highlight: lime-green `#a3e635` or `#84cc16`
- Borders: subtle `#1e2d20`

### Typography
- Large bold headings (display size)
- Mixed case for section labels (e.g. "MEASURE", "MONITOR")
- Clean sans-serif throughout

### Components
- Dark cards with subtle green borders
- Neon green line graphs / progress bars
- Stats displayed large and prominent
- Mobile phone mockup showcase sections
- Minimal nav bar (logo left, links center, Login + CTA right)

## Folder Structure (new_cardio/frontend/)
```
src/
  components/     # reusable UI components
  pages/          # full page components (one per route)
  lib/
    icons.ts      # all icons — swap library here
    theme.ts      # colors, typography constants
  data/
    mock_*.ts     # static mock data files
  hooks/          # custom React hooks
  types/          # TypeScript interfaces
```

## Current Phase
**Phase 1: UI only** — no backend API calls yet, all data is mocked/static.

## Deploy Pattern (when ready)
Same as old_cardio — GitHub Actions → server 157.180.18.119 → PM2 + Nginx
