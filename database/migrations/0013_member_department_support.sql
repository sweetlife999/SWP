-- ============================================================================
-- SU Portal — add the "support" department value
--
-- Issue #81: SU:Support is a fourth department members can belong to
-- (alongside Core/Active/Media) — not a separate CEO/assistant role.
--
-- ALTER TYPE ... ADD VALUE cannot run inside the same transaction as other
-- statements that use the new value, so this stays its own migration and is
-- never combined with a later file that reads/writes 'support' rows.
-- ============================================================================


ALTER TYPE department ADD VALUE IF NOT EXISTS 'support';
