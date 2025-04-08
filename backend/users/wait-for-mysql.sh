#!/bin/sh
set -e

#definidas var
if [ -z "$DB_HOST" ]; then
    echo "Error: La variable MYSQLDB_HOST no está definida."
    exit 1
fi

echo "Esperando a que MySQL esté disponible en $DB_HOST:3306..."
while ! nc -z "$DB_HOST" 3306; do
    echo "MySQL aún no está listo. Esperando..."
    sleep 2
done

echo "MySQL está disponible. Iniciando aplicación..."
exec "$@"
