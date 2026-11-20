#!/bin/bash
# Builds the site and publishes it to the gh-pages branch of the repo in `origin`.
# Roofr screenshots (public/screenshots/roofr-*) are left out of the published build unless INCLUDE_ROOFR=1;
# without them each concern page shows a "your Roofr screen goes here" panel.
# Usage: scripts/publish.sh   or   INCLUDE_ROOFR=1 scripts/publish.sh
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$(pwd)

REMOTE=$(git remote get-url origin)
OWNER_REPO=$(echo "$REMOTE" | sed -E 's#.*github.com[:/]##; s#\.git$##')
OWNER=${OWNER_REPO%%/*}
REPO=${OWNER_REPO##*/}

HOLD=$(mktemp -d)
restore() { mv "$HOLD"/roofr-* "$ROOT/public/screenshots/" 2>/dev/null || true; rmdir "$HOLD" 2>/dev/null || true; }
trap restore EXIT
if [ "${INCLUDE_ROOFR:-0}" != "1" ]; then
  mv public/screenshots/roofr-* "$HOLD"/ 2>/dev/null || true
fi

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
