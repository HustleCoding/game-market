# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives in `src/app` (layout, pages, `globals.css`). Shared UI is in `src/components/ui`. 3D scene pieces live in `src/components/3d` (React Three Fiber/Three.js). Static assets are in `public/`. One-off asset utilities live in `scripts/` (favicons) and `generate-textures.js` at the repo root.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the local dev server with Turbopack.
- `npm run build`: create a production build.
- `npm run start`: run the production server after a build.
- `npm run lint`: run ESLint (Next.js rules).
- `node scripts/generate-favicons.js`: rebuild favicons in `public/`.
- `node generate-textures.js`: generate texture assets.

## Coding Style & Naming Conventions
Use TypeScript and functional React components. Indentation is 2 spaces, with semicolons enabled in existing files. TailwindCSS classes are used for styling in TSX. Naming follows local patterns: PascalCase component filenames in `src/components/3d` (e.g., `Marketplace.tsx`), kebab-case filenames in `src/components/ui` (e.g., `vendor-info-panel.tsx`). Use `PascalCase` for components and `camelCase` for variables/functions. Run `npm run lint` before submitting.

## Testing Guidelines
No test framework or coverage targets are configured yet. If you add tests, prefer `*.test.ts`/`*.test.tsx` adjacent to the module or under `src/**/__tests__/`, and add the test script to `package.json` with a short note in this file or the README.

## Commit & Pull Request Guidelines
Recent history shows short, imperative commit messages with varied casing. Keep messages brief and action-oriented (e.g., `Add stall interaction analytics`). PRs should include a concise description, testing notes, and screenshots/GIFs for UI or 3D changes. Link related issues and call out any Supabase schema or seed data changes.

## Configuration & Secrets
Use `.env.local` for local configuration (see README). Only expose public Supabase keys with the `NEXT_PUBLIC_` prefix, and never commit service role keys or secrets.
