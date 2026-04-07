#!/usr/bin/env bash
set -euo pipefail

corepack pnpm install --frozen-lockfile

if [ -n "${DATABASE_URL:-}" ]; then
  corepack pnpm --filter @wedding-app/db run push
fi
