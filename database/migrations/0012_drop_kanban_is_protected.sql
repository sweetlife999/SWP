-- kanban_columns.is_protected was never read by any query or endpoint (no
-- column-delete feature exists); dead schema flagged in code review. The
-- 0004 seed that references it runs earlier in sequence, so fresh databases
-- are unaffected.
ALTER TABLE kanban_columns DROP COLUMN IF EXISTS is_protected;
