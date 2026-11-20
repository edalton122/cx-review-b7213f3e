#!/bin/bash
# Builds the site and publishes it to the gh-pages branch of the repo in `origin`.
# Third-party and customer screenshots (public/screenshots/roofr-*) are left out of the published build.
# Usage: scripts/publish.sh
set -euo pipefail
cd "$(dirname "$0")/.."

REMOTE=$(git remote get-url origin)
OWNER_REPO=$(echo "$REMOTE" | sed -E 's#.*github.com[:/]##; s#\.git$##')
OWNER=${OWNER_REPO%%/*}
REPO=${OWNER_REPO##*/}

HOLD=$(mktemp -d)
restore() { mv "$HOLD"/roofr-* public/screenshots/ 2>/dev/null || true; rmdir "$HOLD" 2>/dev/null || true; }
trap restore EXIT
mv public/screenshots/roofr-* "$HOLD"/ 2>/dev/null || true

npm test
SITE="https://$OWNER.github.io" BASE="/$REPO/" npm run build
touch dist/.nojekyll

TMP=$(mktemp -d)
cp -R dist/. "$TMP"/
cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-$OWNER}" -c user.email="${GIT_AUTHOR_EMAIL:-noreply@example.com}" commit -qm "Publish $(date -u +%Y-%m-%dT%H:%MZ)"
git push -f "$REMOTE" gh-pages
echo "Published: https://$OWNER.github.io/$REPO/"
