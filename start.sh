#!/usr/bin/env bash
set -euo pipefail

MODE="${MODE:-${1:-backend}}"
PORT="${PORT:-8000}"

case "$MODE" in
	backend)
		echo "[start.sh] Mode: backend"
		echo "[start.sh] Starting FastAPI backend on port ${PORT}..."
		cd backend
		exec python -m uvicorn app.main:app --host 0.0.0.0 --port "${PORT}"
		;;

	frontend)
		echo "[start.sh] Mode: frontend"
		echo "[start.sh] Installing frontend dependencies..."
		cd frontend
		# Prefer ci if lockfile exists, otherwise fallback to install
		if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then
			npm ci
		else
			npm install
		fi

		echo "[start.sh] Starting Next.js frontend on port ${PORT}..."
		# Assume Railway build step already ran `npm run build`
		exec npm start
		;;

	*)
		echo "[start.sh] Unknown MODE '$MODE'. Use 'backend' or 'frontend'." >&2
		exit 1
		;;
esac
