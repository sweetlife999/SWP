-- Document the distinction between members' two similarly-named boolean flags
-- (flagged as a confusing/likely-duplicate pair in code review — verified
-- `is_active` is genuinely used by the frontend as a member-status badge,
-- so it is not dead code and must not be dropped):
--   active     — soft-delete flag; WHERE active = TRUE gates every read query.
--   is_active  — "currently active member" vs. alumni/inactive status label,
--                shown in the admin form and member detail view; does not
--                affect which members are returned by any query.
COMMENT ON COLUMN members.active IS
  'Soft-delete flag. Every read query filters WHERE active = TRUE; '
  'set to false instead of deleting a row.';

COMMENT ON COLUMN members.is_active IS
  'Member-status label (currently active vs. alumni/inactive), shown in the '
  'admin form and member detail view. Does not gate query visibility — see '
  'the active column for that.';
