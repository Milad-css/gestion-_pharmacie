#!/bin/bash
set -e

# Railway assigns a random PORT — configure Apache to use it
PORT=${PORT:-80}
echo "Listen ${PORT}" > /etc/apache2/ports.conf
sed -i "s/*:80/*:${PORT}/g" /etc/apache2/sites-available/000-default.conf

php artisan config:clear
php artisan migrate --force

apache2-foreground
