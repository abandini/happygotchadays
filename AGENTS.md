# Repository Guidelines

## Project Structure & Module Organization
HappyGotchaDays is a Cloudflare Workers PWA served from `src/index.js`. API routes live under `src/routes` (auth, pets, photos, social, search) and share middleware in `src/middleware`. Edge AI helpers are in `src/ai`, while static assets ship as JS modules in `src/frontend`. Shared utilities (ID, JWT, password, etc.) reside in `src/utils`. Data migrations are organized in `migrations/` with numbered SQL files. Tests are grouped by scope inside `tests/unit`, `tests/integration`, and `tests/e2e`. Deployment and worker configuration is managed by `wrangler.toml`.

## Build, Test, and Development Commands
Use `npm install` once to bootstrap. Run `npm run dev` to start Wrangler’s local worker on `http://localhost:8787`. `npm run deploy` pushes to production; use `npm run deploy:preview` for feature validation. Apply schema updates with `npm run db:migrate:local` during development and `npm run db:migrate` against remote D1. For a quick health check, run `curl http://localhost:8787/health`.

## Coding Style & Naming Conventions
This repository uses native ES modules (`"type": "module"`) and Vitest. Prefer 2-space indentation, single quotes for strings, and `camelCase` for variables/functions, mirroring existing files like `src/index.js`. Route files expose factory functions exporting a configured Hono router. Keep middleware pure and async. Document non-trivial flows with short block comments above the handler rather than inline noise. When adding frontend assets, mirror the `.js` wrappers in `src/frontend`.

## Testing Guidelines
Vitest discovers files ending with `.test.js`. Place new fast-running specs under `tests/unit`, contract-level tests under `tests/integration`, and Worker-level smoke tests in `tests/e2e`. Run `npm test` before opening a PR; use `npm run test:coverage` when touching auth, storage, or security-sensitive code. Seed any D1 fixtures via test helpers instead of hitting production bindings.

## Commit & Pull Request Guidelines
Follow the existing history by writing concise, capitalized commit subjects such as `Add pet anniversaries feed` or prefixed fixes like `Fix: Handle empty photos`. Group related changes into a single commit whenever practical. For pull requests, include a summary, testing notes (`npm test`, migrations run), and link any Cloudflare preview URL or issue tracker reference. Attach screenshots or JSON samples when altering API responses or UI assets, and call out updates to `wrangler.toml` or migrations explicitly.

## Security & Configuration Tips
Keep secrets in Wrangler (`npx wrangler secret put JWT_SECRET`) and avoid committing `.env` files. When introducing new bindings (KV, R2, D1), document the required names in `wrangler.toml` and update this guide if conventions change.
