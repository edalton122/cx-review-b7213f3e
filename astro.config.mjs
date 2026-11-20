import { defineConfig } from 'astro/config';

// For GitHub Pages, set SITE and BASE at build time (the deploy workflow does this).
// Locally both are empty, so the site runs at http://localhost:4321/
const site = process.env.SITE || undefined;
const base = process.env.BASE || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
});
