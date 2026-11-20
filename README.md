# Cannon Exteriors must-haves microsite

Static Astro site. All copy lives in `src/data/*.json`, so content updates don't touch components.

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # waste worksheet math
npm run build
```

## Updating content

1. **New must-have from the customer's list:** add an object to `src/data/musthaves.json` above the `your-list` placeholder (same fields as the others). Remove the placeholder once the list is complete.
2. **A Confirming item gets answered:** change its `status`, update `cost`, and replace or remove `note`. Hero counts update on their own.
3. **Screenshots:** drop files in `public/screenshots/`.
   - Workflow steps pick up `roofr-01.png` to `roofr-07.png` and `sf-01.png` to `sf-07.png` by step number.
   - A card shows a thumbnail when its `shots` entry points at a file that exists.
   - Files named `roofr-*` are git-ignored. Only add Cannon's own Roofr screenshots to the repo with their permission.
4. **Dates and meeting time:** `src/data/site.json`.
5. **Logos:** add `salesforce.svg`, `strongcrm.svg` or `cannon.svg` to `public/logos/`. Missing logos fall back to text. There is no Roofr logo, on purpose.

## Access

This is a draft. Nothing is published. GitHub Pages is public even for a private repo (unless the org has Enterprise Cloud private Pages). If it is published on public Pages, use an unguessable repo name. `noindex` and `robots.txt` hide it from search engines, but they are not access control, and the pricing is visible in the repo source. Get the account team's approval first.

Deploys through `.github/workflows/deploy.yml` on push to `main`.

## Do not commit

The build brief, partner quotes, and the customer's contact details. Keep them in `../cannon-microsite-inputs/`, outside this repo.
