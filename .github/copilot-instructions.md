## Repo snapshot

- Entry point: `src/app.js` — a minimal Express server (listens on port 3000, single GET '/' route).
- Static frontend: `public/` (contains `index.html`, `login.html`, `css/`, `js/`). `public/js/main.js` is currently empty.
- Database schema: `src/models/ReLifeBD.sql` — SQL file with intended schema; there is no DB driver or connection code present.
- Package manifest: `package.json` depends on `express` and currently has no `start`/`dev` scripts; README instructs to run `node src/app.js`.

## Big-picture architecture (what to know)

- This is a tiny monolithic Express app: a single server file (`src/app.js`) is the main runtime. It serves JSON via API routes and the static `public/` assets (not wired yet).
- Data flow is currently in two stages: static frontend in `public/` and a planned backend storage represented by `src/models/ReLifeBD.sql`. There is no ORM or DB client code yet.
- The project favors convention over configuration: add routes/controllers under `src/` and static files under `public/`.

## What an AI agent should do first (practical priorities)

1. Wire static assets in `src/app.js` if serving them is required: use express.static and `path.join(__dirname, '..', 'public')`.
2. Look for missing pieces before implementing features: if a feature needs persistence, add a DB client (e.g., `sqlite3`, `mysql2`, or `pg`) and a small config in `src/config`.
3. Add scripts to `package.json` (`start`, `dev`) and include dev dependency `nodemon` for iterative work.

## Project-specific patterns & conventions

- Single-entry Express: modify `src/app.js` to register new routers. Preferred pattern: create `src/routes/*.js` exporting an Express Router and `require('./routes/xyz')(router)` in `src/app.js`.
- Static assets live in `public/`. Keep client-side logic in `public/js/` and styles in `public/css/`.
- Database/schema lives in `src/models/ReLifeBD.sql`. Treat this as the source of truth for schema-related work — add migration scripts or a README note when introducing an actual DB driver.

## Examples (how to modify safely)

- Serve static files (add to `src/app.js`):

  const path = require('path');
  app.use(express.static(path.join(__dirname, '..', 'public')));

- Add a JSON API route in `src/routes/users.js`:

  const express = require('express');
  const router = express.Router();
  router.post('/api/users', (req, res) => { /* validate and persist */ });
  module.exports = router;

  Then mount in `src/app.js`: `app.use(require('./routes/users'))`.

## How to run & debug (developer workflow)

- Install deps: `npm install` (adds express). Then start server: `node src/app.js` (per README).
- Recommended dev workflow (agent may add to repo):
  - Add `npm i -D nodemon` and package.json scripts:
    - `"start": "node src/app.js"`
    - `"dev": "nodemon src/app.js"`
  - Use PowerShell-compatible commands when suggesting terminal instructions.

## Integration & external dependencies

- Currently the only declared runtime dependency is `express` (v5). There are no DB clients, no authentication libraries, and no testing framework. When adding integrations, also add configuration stubs in `src/config` and document expected env vars in `README.md`.

## Safety checks and discovery steps before edits

1. Confirm whether serving static `public/` is desired — check `public/index.html` and `login.html` for expected endpoints.
2. If persisting data, search the repo for any env/config conventions; none exist, so create `src/config/index.js` and update README.
3. Avoid removing `src/models/ReLifeBD.sql` — it's the only DB schema present.

## Useful file references

- `src/app.js` — main server
- `public/index.html`, `public/login.html` — frontend pages
- `public/js/main.js` — client script (currently empty)
- `src/models/ReLifeBD.sql` — DB schema
- `package.json`, `README.md` — run instructions and metadata

If anything here is unclear or you'd like me to expand sections (e.g., produce route templates, add scripts to package.json, or wire DB connectivity), tell me which area to iterate on.
