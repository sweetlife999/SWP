-- Least-privilege role for the backend's DATABASE_URL. Until now the app
-- connected as the same role that owns the schema and runs DDL migrations
-- (PGUSER/su) — a compromised backend or a bug in application code could run
-- arbitrary DDL. This role gets only the DML it actually needs.
--
-- APP_DB_PASSWORD is threaded in via run-migrations.sh; see compose.yml /
-- compose.local.yml for where the backend's DATABASE_URL then uses it.
-- Default for ad-hoc psql runs that don't pass -v app_db_password=...
\if :{?app_db_password}
\else
\set app_db_password su_app_dev_password
\endif
--
-- psql variable substitution doesn't reach inside a dollar-quoted DO block,
-- so the existence check and CREATE ROLE use \if/\gset instead.
SELECT NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'su_app') AS need_create \gset
\if :need_create
CREATE ROLE su_app LOGIN PASSWORD :'app_db_password';
\endif

GRANT CONNECT ON DATABASE su_portal TO su_app;
GRANT USAGE ON SCHEMA public TO su_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO su_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO su_app;

-- Tables/sequences added by later migrations (still run as the owner role)
-- are granted to su_app automatically, without a follow-up migration.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO su_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO su_app;
