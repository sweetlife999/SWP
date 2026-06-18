-- ============================================================================
-- SU Portal — development sample data (NOT for production)
--
-- Small, representative dataset so the API and admin panel have something to
-- render locally. Safe to re-run: it TRUNCATEs the data tables first.
-- Content-block slugs are NOT touched here (they are structural — see
-- migrations/0002_content_seed.sql).
-- ============================================================================

BEGIN;

TRUNCATE survey_responses, survey_questions, surveys,
         events, members, kanban_projects
  RESTART IDENTITY CASCADE;   -- CASCADE clears kanban_columns/cards/tags/... too

-- ── Events ──────────────────────────────────────────────────────────────────
INSERT INTO events (title, description, event_date, event_time, department,
                    cover_class, foot_text, foot_label, featured, status_text) VALUES
  ('Open Town Hall',        'Quarterly all-hands with the Student Union.',
     '2026-07-02', '18:00', 'core',  'cover-a', '32 participants', NULL,        TRUE,  'Registration open'),
  ('Media Workshop',        'Hands-on session on event coverage & reels.',
     '2026-06-25', '16:30', 'media', 'cover-b', 'Limited seats',   'Register',  FALSE, 'Registration open'),
  ('Spring Cleanup Drive',  'Campus volunteering day with SU:Active.',
     '2026-05-10', NULL,    'active','cover-c', '120 attended',    NULL,        FALSE, 'Event concluded');

-- ── Members ─────────────────────────────────────────────────────────────────
INSERT INTO members (name, department, role, meta, bio, recent, sort_order) VALUES
  ('Anna Petrova',  'core',   'CO-LEAD · B21-AI',   '2 years in SU',
     'Leads strategy and partnerships.', ARRAY['Town Hall','Budget review'], 0),
  ('Ivan Sidorov',  'active', 'Logistics',          '1 year in SU',
     'Keeps events running on the ground.', ARRAY['Cleanup Drive'], 0),
  ('Mariya Volkova','media',  'Content Lead',       '1 year in SU',
     'Runs the SU social channels.', ARRAY['Reels series','Workshop'], 0);

-- ── Surveys + questions ─────────────────────────────────────────────────────
INSERT INTO surveys (department, title, description, flow_title, eyebrow,
                     est_minutes, closes_at, published) VALUES
  ('core', 'Event Feedback', 'Tell us how the Town Hall went.',
     'Event Feedback', 'Your voice shapes the next one', 2,
     '2026-07-09 23:59+03', TRUE);

INSERT INTO survey_questions (survey_id, position, type, title, hint,
                              options, scale_low, scale_high, scale_mid) VALUES
  (1, 0, 'single', 'Did you attend?',          'Pick one',
     ARRAY['Yes, in person','Yes, online','No'], NULL, NULL, NULL),
  (1, 1, 'scale',  'How useful was it?',        'Rate 1–5',
     NULL, 'Not useful', 'Very helpful', 3),
  (1, 2, 'multi',  'Topics you want next time', 'Pick any',
     ARRAY['Budget','Events','Clubs','Facilities'], NULL, NULL, NULL),
  (1, 3, 'text',   'Anything else?',            'Optional',
     NULL, NULL, NULL, NULL);

-- ── Survey responses (answers keyed by question id) ─────────────────────────
INSERT INTO survey_responses (survey_id, answers) VALUES
  (1, '{"1":"Yes, in person","2":5,"3":["Events","Clubs"],"4":"Great session!"}'),
  (1, '{"1":"Yes, online","2":4,"3":["Budget"],"4":""}'),
  (1, '{"1":"No","2":2,"3":["Facilities","Events"]}');

-- ── Kanban: one project, five columns ───────────────────────────────────────
INSERT INTO kanban_projects (name, slug, color) VALUES
  ('SU:Core Board', 'su-core', '#4f46e5');

INSERT INTO kanban_columns (project_id, key, label, color, order_index, is_protected)
SELECT p.id, c.key, c.label, c.color, c.ord, c.protected
FROM kanban_projects p,
     (VALUES
        ('backlog', 'Backlog', '#64748b', 0::smallint, TRUE),
        ('next',    'Up Next', '#0ea5e9', 1::smallint, FALSE),
        ('doing',   'Doing',   '#f59e0b', 2::smallint, FALSE),
        ('review',  'Review',  '#a855f7', 3::smallint, FALSE),
        ('done',    'Done',    '#22c55e', 4::smallint, TRUE)
     ) AS c(key, label, color, ord, protected)
WHERE p.slug = 'su-core';

-- ── Kanban cards (column referenced by key) ─────────────────────────────────
INSERT INTO kanban_cards (project_id, column_id, title, description, priority,
                          blocker, progress_pct, progress_label, deadline, order_index)
VALUES
  ((SELECT id FROM kanban_projects WHERE slug = 'su-core'),
   (SELECT c.id FROM kanban_columns c JOIN kanban_projects p ON p.id = c.project_id
      WHERE p.slug = 'su-core' AND c.key = 'doing'),
   'Book the main hall', 'Confirm date with facilities.', 'p-high', TRUE, 40,
   'Awaiting reply', '2026-07-01', 0),
  ((SELECT id FROM kanban_projects WHERE slug = 'su-core'),
   (SELECT c.id FROM kanban_columns c JOIN kanban_projects p ON p.id = c.project_id
      WHERE p.slug = 'su-core' AND c.key = 'backlog'),
   'Design Town Hall poster', NULL, 'p-mid', FALSE, NULL, NULL, NULL, 0);

-- ── Kanban card children (tags / assignees / meta) ──────────────────────────
INSERT INTO kanban_card_tags (card_id, label, color) VALUES
  ((SELECT id FROM kanban_cards WHERE title = 'Book the main hall'),      'Logistics', '#3b82f6'),
  ((SELECT id FROM kanban_cards WHERE title = 'Design Town Hall poster'), 'Media',     '#a855f7');

INSERT INTO kanban_card_assignees (card_id, initials, bg) VALUES
  ((SELECT id FROM kanban_cards WHERE title = 'Book the main hall'),      'IS', '#4f46e5'),
  ((SELECT id FROM kanban_cards WHERE title = 'Design Town Hall poster'), 'MV', '#db2777');

INSERT INTO kanban_card_meta (card_id, order_index, icon, text, urgent, soon) VALUES
  ((SELECT id FROM kanban_cards WHERE title = 'Book the main hall'), 0, 'clock', 'Due Fri', TRUE, FALSE);

COMMIT;
