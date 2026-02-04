#!/usr/bin/env sh
set -e

if [ -d /var/www/html/writable ]; then
  chown -R www-data:www-data /var/www/html/writable || true
fi

echo "Waiting for database..."
tries=0
until php -r '$h=getenv("database_default_hostname")?:"db"; $u=getenv("database_default_username")?:""; $p=getenv("database_default_password")?:""; $d=getenv("database_default_database")?:""; $port=(int)(getenv("database_default_port")?:3306); $m=@new mysqli($h,$u,$p,$d,$port); exit($m && $m->connect_errno===0 ? 0 : 1);' >/dev/null 2>&1; do
  tries=$((tries+1))
  if [ "$tries" -ge 30 ]; then
    echo "Database not reachable after 30 tries, continuing..."
    break
  fi
  sleep 2
done

php /var/www/html/spark migrate --all --no-interaction || true
php /var/www/html/spark db:seed DatabaseSeeder --no-interaction || true

exec apache2-foreground
