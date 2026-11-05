#!/usr/bin/env bash

set -euo pipefail

EXPECTED_BRANCH="srm_changes"
CURRENT_BRANCH="$(git branch --show-current)"
COMMIT_MESSAGE="${*:-Deploy UI updates}"

if [[ -z "$CURRENT_BRANCH" ]]; then
  echo "Deployment stopped: Git is not currently on a branch."
  exit 1
fi

if [[ "$CURRENT_BRANCH" != "$EXPECTED_BRANCH" ]]; then
  echo "Deployment stopped: switch to '$EXPECTED_BRANCH' before deploying (current: '$CURRENT_BRANCH')."
  exit 1
fi

echo "Running lint checks..."
npm run lint

echo "Building the production UI..."
npm run build

echo "Preparing source changes..."
git add -A

if git diff --cached --quiet; then
  echo "No new source changes to commit."
else
  git commit -m "$COMMIT_MESSAGE"
fi

echo "Pushing '$CURRENT_BRANCH' to GitHub..."
git push origin "$CURRENT_BRANCH"

echo "Deployment triggered successfully."
echo "GitHub Pages: https://manikandansugu.github.io/convocation/"
