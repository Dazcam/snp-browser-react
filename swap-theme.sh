#!/bin/bash

# Usage: bash swap-theme.sh <theme>
# Themes: navy, purple, amber, emerald (default)

THEME=${1:-emerald}

# ── Reset to base slate/emerald first ─────────────────────────────────────
find src -name "*.jsx" | xargs sed -i '' \
  -e 's/blue-950/slate-900/g' \
  -e 's/blue-900/slate-800/g' \
  -e 's/blue-800/slate-700/g' \
  -e 's/blue-700/slate-600/g' \
  -e 's/blue-300/slate-400/g' \
  -e 's/blue-200/slate-300/g' \
  -e 's/blue-50/slate-100/g' \
  -e 's/cyan/emerald/g' \
  -e 's/amber/emerald/g' \
  -e 's/violet/emerald/g'

if [ "$THEME" = "navy" ]; then
  find src -name "*.jsx" | xargs sed -i '' \
    -e 's/slate-900/blue-950/g' \
    -e 's/slate-800/blue-900/g' \
    -e 's/slate-700/blue-800/g' \
    -e 's/slate-600/blue-700/g' \
    -e 's/slate-400/blue-300/g' \
    -e 's/slate-300/blue-200/g' \
    -e 's/slate-100/blue-50/g' \
    -e 's/emerald/cyan/g'

elif [ "$THEME" = "purple" ]; then
  find src -name "*.jsx" | xargs sed -i '' \
    -e 's/slate-900/purple-950/g' \
    -e 's/slate-800/purple-900/g' \
    -e 's/slate-700/purple-800/g' \
    -e 's/slate-600/purple-700/g' \
    -e 's/slate-400/purple-300/g' \
    -e 's/slate-300/purple-200/g' \
    -e 's/slate-100/purple-50/g' \
    -e 's/emerald/violet/g'

elif [ "$THEME" = "amber" ]; then
  find src -name "*.jsx" | xargs sed -i '' \
    -e 's/slate-900/stone-950/g' \
    -e 's/slate-800/stone-900/g' \
    -e 's/slate-700/stone-800/g' \
    -e 's/slate-600/stone-700/g' \
    -e 's/slate-400/stone-400/g' \
    -e 's/slate-300/stone-300/g' \
    -e 's/slate-100/stone-100/g' \
    -e 's/emerald/amber/g'
fi

echo "Theme set to: $THEME"