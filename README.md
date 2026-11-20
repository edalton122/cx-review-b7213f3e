# Cannon Exteriors: seven concerns microsite

Static Astro site in Cannon's branding: an overview page plus one page per concern (`src/pages/[slug].astro`). All copy lives in `src/data/*.json`, so content updates don't touch components.

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # waste worksheet math
npm run build
```

## Updating content

1. **Concern pages:** `src/data/concerns.json` holds each concern's question, answer, status, cost, open item, hero photo, and the Roofr and Salesforce sides (screenshot, caption, bullet points). Order in the file is the tab order.
2. **A Confirming item gets answered:** change the concern's `status`, `statusNote`, `cost` and `confirm`. Update the matching row in `src/data/cost.json` and the list in `src/data/open-items.json`. Overview counts update on their own.
3. **Screenshots:** drop files in `public/screenshots/` and point `roofr.shot` or `sf.shot` at them.
   - If `name-full.png` exists next to `name.png`, the lightbox opens the full version (used for the cropped Salesforce shots).
   - Files named `roofr-*` are git-ignored, and a missing Roofr file shows a "your Roofr screen goes here" panel. The current ones are generic examples from Roofr's help center; replace them with Cannon's own and only commit those with permission.
4. **Page extras** (flow lanes, worksheet, coverage table, timeline, e-signature options, cost lines, team roles) live in `src/components/modules/`.
5. **Dates and meeting time:** `src/data/site.json`. Brand assets: `public/brand/` (gold logo) and `public/photos/` (job photos).

## Access

This is a draft. GitHub Pages is public even for a private repo (unless the org has Enterprise Cloud private Pages). If it is published on public Pages, use an unguessable repo name. `noindex` and `robots.txt` hide it from search engines, but they are not access control, and the pricing is visible in the repo source. Get the account team's approval first.

Publish with `scripts/publish.sh`. It runs the tests, builds with the right base path, leaves out the `roofr-*` screenshots (set `INCLUDE_ROOFR=1` to include them), and pushes `dist/` to the `gh-pages` branch. In the repo's Pages settings, set the source to the `gh-pages` branch. (A GitHub Actions workflow would also work, but pushing workflow files needs a token with the `workflow` scope.)

## Do not commit

The build brief, partner quotes, and the customer's contact details. Keep them in `../cannon-microsite-inputs/`, outside this repo.
