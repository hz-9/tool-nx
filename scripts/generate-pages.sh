#!/bin/bash

# Generate documentation pages: sync package docs, then build the VuePress docs site.

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PACKAGES_DIR="$ROOT_DIR/packages"

echo ""
echo "=== 0. Preparation phase ==="
pnpm run format
pnpm run lint
pnpm run build
pnpm run test
pnpm run api-report

echo ""
echo "=== 0. Clearing history files ==="
rm -rf ./docs/guide
rm -rf ./docs/api
rm -rf ./docs/changelog

echo ""
echo "=== 1. Syncing guide files from packages ==="
for pkg_dir in "$PACKAGES_DIR"/*/; do
  pkg_name=$(basename "$pkg_dir")
  src="$pkg_dir/docs/guide"
  dest="$ROOT_DIR/docs/guide/$pkg_name"

  if [ -d "$src" ]; then
    mkdir -p "$dest"
    cp -r "$src/"* "$dest/"
    echo "  $pkg_name: synced to docs/guide/$pkg_name"
  else
    echo "  $pkg_name: no docs/guide, skipped"
  fi
done

echo ""
echo "=== 2. Syncing API markdown files from packages ==="
for pkg_dir in "$PACKAGES_DIR"/*/; do
  pkg_name=$(basename "$pkg_dir")
  src="$pkg_dir/docs/.markdowns"
  dest="$ROOT_DIR/docs/api/$pkg_name"

  if [ -d "$src" ]; then
    mkdir -p "$dest"
    cp -r "$src/"* "$dest/"
    echo "  $pkg_name: synced to docs/api/$pkg_name"
  else
    echo "  $pkg_name: no docs/.markdowns, skipped"
  fi
done

echo ""
echo "=== 3. Syncing changelog files from packages ==="
for pkg_dir in "$PACKAGES_DIR"/*/; do
  pkg_name=$(basename "$pkg_dir")
  src="$pkg_dir/CHANGELOG.md"
  dest="$ROOT_DIR/docs/changelog/$pkg_name/README.md"

  if [ -f "$src" ]; then
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
    echo "  $pkg_name: synced to docs/changelog/$pkg_name/README.md"
  else
    echo "  $pkg_name: no CHANGELOG.md, skipped"
  fi
done

echo ""
echo "=== 4. Building VuePress docs with docs-build ==="
node packages/docs-build/lib/bin/docs-build.js docs-build.config.json

echo ""
echo "=== 5. Building VuePress static site ==="
cd docs/.vuepress
npm install
npm run docs:build
