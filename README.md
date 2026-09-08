# ResumeForge AI

**Build. Optimize. Get Hired.**

A full-stack, AI-powered ATS resume builder. React + Vite on the frontend, Node/Express + MongoDB on the backend, Claude (Anthropic API) for AI writing and analysis.

```
resume-builder/
  client/   React + Vite frontend
  server/   Express + MongoDB backend (+ Claude AI service layer)
```

## Features

- Landing page, template marketplace (10 ATS-friendly templates), pricing
- Email/password auth (JWT + bcrypt), protected routes, persistent sessions
- Dashboard with stats, resume cards, demo resume loader
- Split-screen resume builder: section nav, form, live preview, AI assistant panel
- 13 resume sections (personal, summary, experience, education, skills, projects,
  achievements, certifications, languages, awards, volunteer, publications, links)
  with add/edit/delete/duplicate/reorder (drag & drop) and collapse
- Claude-powered AI writing: generate/improve/shorten summaries, experience & project
  bullets, achievement descriptions - grounded in what you actually wrote, never
  fabricating metrics or experience
- Job description analyzer + resume-to-job keyword matching + honest tailoring suggestions
- Explainable ATS Optimization Score engine (Formatting / Keywords / Experience / Skills /
  Projects / Structure) with concrete recommendations
- LaTeX source editor (Monaco) for manual control + `.tex` export
- Server-side PDF export (Puppeteer renders the same ATS-safe HTML the preview uses -
  real selectable text, not a screenshot)
- Autosave (debounced), version snapshots, resume duplication
- Command palette (Cmd/Ctrl+K), keyboard shortcuts (Cmd/Ctrl+S save, Cmd/Ctrl+P print)
- Dark/light/system theme, fully responsive, subtle Three.js background on the landing page

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- An Anthropic API key (for AI features - the app runs fine without one, AI endpoints
  will just return a clear "not configured" message)

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env      # then fill in MONGODB_URI, JWT_SECRET, ANTHROPIC_API_KEY
npm install
npm run dev                # http://localhost:5000
```

### 2. Frontend

```bash
cd client
cp .env.example .env       # defaults to http://localhost:5000/api, adjust if needed
npm install
npm run dev                 # http://localhost:5173
```

Open http://localhost:5173, register an account, and click **Load Demo Resume** on the
dashboard to explore the builder with sample data.

## Notable engineering decisions

- **PDF export** uses server-side Puppeteer rendering of the same HTML template the live
  preview uses (`server/services/htmlResumeService.js`), producing a real, text-selectable,
  vector PDF - not a screenshot. If Chromium can't launch in a given environment, the
  export endpoint fails gracefully with a message pointing users to browser Print instead.
- **LaTeX**: there's a full LaTeX generation engine (`server/services/latexService.js`) and
  a Monaco-based editor for manual editing/export of the `.tex` source. There is no sandboxed
  `pdflatex` toolchain in this environment, so editing the LaTeX source does not feed a live
  PDF compile - the editor's preview pane mirrors your structured resume data (the same one
  used for PDF export), and this is called out directly in the UI so it's never misleading.
- **ATS scoring** is a transparent, deterministic, explainable engine (`server/services/atsService.js`)
  with a documented weight breakdown. It's called an "ATS Optimization Score" everywhere in
  the UI, never a guaranteed real-world ATS result.
- **Templates** share one rendering engine and one ATS-safe structure (single column,
  standard headings, no tables/graphics/text-in-images); only typography, color, and
  spacing vary per template, so switching templates never regresses ATS compatibility.

## Environment variables

See `server/.env.example` and `client/.env.example`. Never commit real `.env` files -
only `.env.example` (with placeholder values) should be checked in.

## Scripts

| Location | Command | Description |
|---|---|---|
| `server/` | `npm run dev` | Start the API with nodemon |
| `server/` | `npm start` | Start the API (production) |
| `client/` | `npm run dev` | Start the Vite dev server |
| `client/` | `npm run build` | Production build to `client/dist` |
| `client/` | `npm run preview` | Preview the production build |
