#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$ROOT_DIR/backup"

mkdir -p "$BACKUP_DIR"

month_number="$(date +%m)"
day_raw="$(date +%d)"
hour_minute="$(date +%H.%M)"

# Remove leading zero from day.
day="${day_raw#0}"

case "$month_number" in
  01) month_name="Gennaio" ;;
  02) month_name="Febbraio" ;;
  03) month_name="Marzo" ;;
  04) month_name="Aprile" ;;
  05) month_name="Maggio" ;;
  06) month_name="Giugno" ;;
  07) month_name="Luglio" ;;
  08) month_name="Agosto" ;;
  09) month_name="Settembre" ;;
  10) month_name="Ottobre" ;;
  11) month_name="Novembre" ;;
  12) month_name="Dicembre" ;;
  *) month_name="Mese" ;;
esac

base_name="Backup_${day} ${month_name}_${hour_minute}"

if command -v zstd >/dev/null 2>&1; then
  extension="tar.zst"
else
  extension="tar.gz"
fi

output_path="$BACKUP_DIR/${base_name}.${extension}"
sequence=1
while [[ -e "$output_path" ]]; do
  output_path="$BACKUP_DIR/${base_name}_$(printf '%02d' "$sequence").${extension}"
  sequence=$((sequence + 1))
done

if [[ "$extension" == "tar.zst" ]]; then
  tar \
    --exclude='./.git' \
    --exclude='./backup' \
    --exclude='./node_modules' \
    --exclude='./.local' \
    --exclude='./.agents' \
    --exclude='./.env' \
    --exclude='./.env.*' \
    --exclude='./artifacts/wedding-app/.env' \
    --exclude='./artifacts/wedding-app/.env.*' \
    --exclude='./coverage' \
    --exclude='./**/dist' \
    -cf - \
    -C "$ROOT_DIR" . | zstd -19 -T0 -o "$output_path"
else
  GZIP=-9 tar \
    --exclude='./.git' \
    --exclude='./backup' \
    --exclude='./node_modules' \
    --exclude='./.local' \
    --exclude='./.agents' \
    --exclude='./.env' \
    --exclude='./.env.*' \
    --exclude='./artifacts/wedding-app/.env' \
    --exclude='./artifacts/wedding-app/.env.*' \
    --exclude='./coverage' \
    --exclude='./**/dist' \
    -czf "$output_path" \
    -C "$ROOT_DIR" .
fi

bytes="$(wc -c < "$output_path" | tr -d '[:space:]')"
printf 'Backup creato: %s\nDimensione: %s bytes\n' "$output_path" "$bytes"
