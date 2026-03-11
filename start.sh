#!/bin/bash
# FaceBlend AI - Start all services

echo "🚀 Starting FaceBlend AI..."

# Kill any existing processes on our ports
fuser -k 3000/tcp 2>/dev/null
fuser -k 3001/tcp 2>/dev/null

# Start backend
cd "$(dirname "$0")/server"
echo "→ Starting backend on http://localhost:3001"
node index.js &
SERVER_PID=$!

sleep 1

# Start frontend
cd "$(dirname "$0")/client"
echo "→ Starting frontend on http://localhost:3000"
npm run dev &
CLIENT_PID=$!

echo ""
echo "✅ FaceBlend AI is running!"
echo "   App:    http://localhost:3000"
echo "   API:    http://localhost:3001"
echo ""
echo "   To enable real face swap: set REPLICATE_API_TOKEN in server/.env"
echo "   Get free token at: https://replicate.com"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait and handle shutdown
trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null; echo 'Stopped.'" INT TERM
wait
