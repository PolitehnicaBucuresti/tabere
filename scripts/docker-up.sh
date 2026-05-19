#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

docker compose up --build -d

mapping="$(docker compose port web 3000)"
port="${mapping##*:}"

echo ""
echo "Poli Summer Camp → http://127.0.0.1:${port}"
echo "(mapped host port ${port} → container 3000)"
