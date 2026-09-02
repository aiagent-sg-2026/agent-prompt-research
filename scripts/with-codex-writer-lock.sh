#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCK="$ROOT/.codex-writer.lock"
exec 9>"$LOCK"
if ! flock -n 9; then
  echo "ERROR: Codex writer lock is already held: $LOCK" >&2
  exit 73
fi
exec "$@"
