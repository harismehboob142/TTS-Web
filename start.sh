#!/usr/bin/env bash
set -e

source venv/bin/activate
export $(grep -v '^#' .env | xargs) 2>/dev/null || true

echo "Starting backend..."
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

echo "Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

echo ""
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:8000"
echo ""

wait
