# SU Portal database image.
#
# Bundles the schema migrations into a Postgres image. On first start with an
# empty data volume, the official entrypoint runs every *.sql in
# /docker-entrypoint-initdb.d once, in alphabetical order (0001 → 0002 → 0003).
# Build/run it from the project root via the top-level compose.yml.
#
# NOTE: init scripts run only on a fresh volume. To re-apply from scratch in
# dev: `docker compose down -v && docker compose up -d`. In production, manage
# subsequent schema changes with new numbered migrations / a migration tool.
FROM postgres:16-alpine

COPY migrations/ /docker-entrypoint-initdb.d/
