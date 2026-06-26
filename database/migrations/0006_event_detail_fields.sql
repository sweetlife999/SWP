-- ============================================================================
-- SU Portal — editable event detail fields
--
-- The event page hardcoded the schedule, organizers and location address.
-- These columns make them per-event editable. schedule/organizers are JSON
-- arrays of small objects; location_address is the free-text address line.
-- ============================================================================


ALTER TABLE events ADD COLUMN IF NOT EXISTS schedule         JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE events ADD COLUMN IF NOT EXISTS organizers       JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_address TEXT  NOT NULL DEFAULT '';

