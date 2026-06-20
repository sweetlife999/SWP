-- ============================================================================
-- SU Portal — structural seed: known content-block slugs
--
-- These slugs are referenced directly by the frontend (see api.content.get /
-- update and the *Page components). Seeding them empty guarantees that
-- GET /api/content/:slug never 404s and PUT is always an upsert.
--
-- This is NOT sample data — it is part of the schema contract. Keep it in
-- migrations, not in seeds/.
-- ============================================================================

INSERT INTO content_blocks (slug) VALUES
  ('home-intro'),   -- Home page hero / intro
  ('donations'),    -- Donations page body
  ('history'),      -- Members page · History tab
  ('roadmap')       -- Members page · Roadmap tab
ON CONFLICT (slug) DO NOTHING;

-- Event descriptions use dynamic slugs of the form 'event-desc-{id}'.
-- They are created on demand by the backend (upsert on first edit), so
-- nothing is seeded here for them.
