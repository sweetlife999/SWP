# SU Portal database image.
#
# Bundles the schema migrations + the migration runner. The migrations are no
# longer placed in /docker-entrypoint-initdb.d/ (which runs only on an empty
# volume); instead a one-shot `migrate` service runs run-migrations.sh on every
# `docker compose up`, applying any not-yet-applied migration (tracked in the
# schema_migrations table). This makes deploys onto an existing volume pick up
# new migrations. See compose.yml.
FROM postgres:16-alpine

COPY migrations/ /migrations/
COPY run-migrations.sh /usr/local/bin/run-migrations.sh
RUN chmod +x /usr/local/bin/run-migrations.sh
