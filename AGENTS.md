<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Baladz Website Project

Website resmi Baladz — platform informasi pesantren/pendidikan Islam, penerimaan santri baru (PSB), berita/kegiatan, dan manajemen konten website.

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript check
- `npm run check` — Run lint + typecheck + build

## Code Style & Conventions
- TypeScript strict mode, no `any`
- Named exports, PascalCase components, camelCase utils
- Tailwind CSS utility classes, responsive mobile-first
- 2-space indentation

## Project Structure
```
src/
  app/                    # Next.js App Router routes (/admin, /psb, /kebijakan-privasi, /syarat-ketentuan)
  components/
    baladz/               # Baladz site components (PublicSite, AdminDashboard, PsbInfo, etc.)
  content/                # Content models & defaults (site-content.ts)
public/
  images/
    baladz/               # Baladz site image assets
```
