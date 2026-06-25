-- ============================================================================
-- SU Portal — add format and age fields to events
--
-- The event detail page previously hardcoded "Оффлайн" / "18+" because the
-- schema had no columns for them. These make both editable per event.
-- ============================================================================

BEGIN;

ALTER TABLE events ADD COLUMN IF NOT EXISTS event_format TEXT NOT NULL DEFAULT 'Оффлайн';
ALTER TABLE events ADD COLUMN IF NOT EXISTS age_limit    TEXT NOT NULL DEFAULT '18+';

COMMIT;
