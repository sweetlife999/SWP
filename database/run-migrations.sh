#!/bin/sh
# Idempotent migration runner.
#
# Applies every database/migrations/*.sql exactly once, tracked in a
# schema_migrations table. Runs on every `docker compose up` (as a one-shot
# `migrate` service the backend waits on), so a deploy onto an existing volume
# picks up new migrations — unlike Postgres's initdb hooks, which only run on an
# empty volume. Already-applied migrations are skipped, so older non-idempotent
# migrations are never re-run.
set -eu

: "${PGHOST:=db}"
: "${PGPORT:=5432}"
: "${PGUSER:=su}"
: "${PGDATABASE:=su_portal}"
export PGPASSWORD="${PGPASSWORD:-}"
# Password for the restricted, DML-only role the backend connects as (see
# migrations/0010_app_role.sql) — never the schema-owning PGUSER above.
: "${APP_DB_PASSWORD:=su_app_dev_password}"

echo "[migrate] waiting for $PGHOST:$PGPORT ..."
until pg_isready -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" >/dev/null 2>&1; do
  sleep 1
done

psql_do() {
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -v ON_ERROR_STOP=1 \
    -v app_db_password="$APP_DB_PASSWORD" "$@"
}

psql_do -q -c "CREATE TABLE IF NOT EXISTS schema_migrations (
  filename   TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);"

# Baseline: a pre-existing database (schema already present from the old
# initdb-hook deploys) has no tracking rows. Re-running 0001_init there would
# fail on already-existing objects. If the schema exists but tracking is empty,
# mark all current migrations as applied instead of re-running them.
tracked=$(psql_do -tA -c "SELECT count(*) FROM schema_migrations;")
has_schema=$(psql_do -tA -c "SELECT to_regclass('public.events') IS NOT NULL;")
if [ "$tracked" = "0" ] && [ "$has_schema" = "t" ]; then
  echo "[migrate] existing schema with no tracking — baselining current migrations as applied"
  for f in /migrations/*.sql; do
    psql_do -q -c "INSERT INTO schema_migrations (filename) VALUES ('$(basename "$f")') ON CONFLICT DO NOTHING;"
  done
fi

applied=0
for f in /migrations/*.sql; do
  name=$(basename "$f")
  exists=$(psql_do -tA -c "SELECT 1 FROM schema_migrations WHERE filename = '$name';")
  if [ "$exists" = "1" ]; then
    echo "[migrate] skip   $name (already applied)"
    continue
  fi
  echo "[migrate] apply  $name"
  # Single transaction per file; record it in the same transaction.
  psql_do --single-transaction -f "$f" \
    -c "INSERT INTO schema_migrations (filename) VALUES ('$name');"
  applied=$((applied + 1))
done

echo "[migrate] done — $applied new migration(s) applied"
