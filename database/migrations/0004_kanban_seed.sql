-- ============================================================================
-- SU Portal — kanban structural seed
--
-- The board needs a project and its five columns to exist before any card can
-- be created (cards FK to both project_id and column_id). This is structural
-- seed, not sample data: it creates the single SU:Core board and its columns.
-- Idempotent so re-running is safe.
-- ============================================================================


INSERT INTO kanban_projects (name, slug, color)
VALUES ('SU:Core Board', 'su-core', '#22C55E')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO kanban_columns (project_id, key, label, color, order_index, is_protected)
SELECT p.id, c.key, c.label, c.color, c.ord, c.protected
FROM kanban_projects p
CROSS JOIN (VALUES
  ('backlog', 'Backlog',     '#9CA3AF', 0::smallint, FALSE),
  ('next',    'Up next',     '#60A5FA', 1::smallint, FALSE),
  ('doing',   'In progress', '#F59E0B', 2::smallint, FALSE),
  ('review',  'Review',      '#A78BFA', 3::smallint, FALSE),
  ('done',    'Done',        '#22C55E', 4::smallint, TRUE)
) AS c(key, label, color, ord, protected)
WHERE p.slug = 'su-core'
ON CONFLICT (project_id, key) DO NOTHING;

