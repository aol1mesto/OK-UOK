# AGENTS.md

## Cursor Cloud specific instructions

This is a client-side-only React + TypeScript + Vite SPA (a QC inspector dashboard, UI in Russian). There is no backend, database, or auth — all data is mock data under `src/data`. The demo user/role is set in `src/data/mockUser.ts` (change `role` to `inspector` to hide the `/enterprises` filter).

Standard commands live in `package.json` scripts:
- Dev server: `npm run dev` (Vite, serves on `http://localhost:5173`).
- Lint: `npm run lint` (oxlint).
- Build: `npm run build` (`tsc -b` then `vite build`).

Notes:
- Node 22 is used; the update script runs `npm install` on startup, so no manual dependency setup is needed.
- The dev server binds to localhost only (no `--host`). Access it from within the VM (e.g. the Desktop pane) at `http://localhost:5173`.
- There is no automated test suite; verify changes via lint, build, and manual browser navigation across `/`, `/inspections`, `/enterprises`, `/profile`.
