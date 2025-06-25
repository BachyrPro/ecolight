#!/bin/sh

host="$1"
port="$2"
shift 2
cmd="$@"

echo "⏳ En attente de $host:$port..."

until nc -z "$host" "$port"; do
  echo "⚠️  $host:$port non disponible. Nouvelle tentative dans 2s..."
  sleep 2
done

echo "✅ $host:$port est prêt. Lancement de l'application..."
exec $cmd
