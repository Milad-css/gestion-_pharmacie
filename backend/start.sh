#!/bin/bash

# Start server immediately so Railway health check passes
php artisan serve --host=0.0.0.0 --port=${PORT:-8000} &
SERVER_PID=$!

# Run migrations in background while server is starting
php artisan migrate --force

# Keep container alive
wait $SERVER_PID
