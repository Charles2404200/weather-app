#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
BACKEND_PORT="${BACKEND_PORT:-8000}"

echo "[entrypoint] Starting backend on port ${BACKEND_PORT}..."
cd /app/backend
python3 -m uvicorn app.main:app --host 0.0.0.0 --port "${BACKEND_PORT}" &

echo "[entrypoint] Starting frontend on port ${PORT}..."
cd /app/frontend
exec npm start -- -p "${PORT}"
