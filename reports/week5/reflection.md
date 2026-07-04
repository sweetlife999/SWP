# Reflection — Week 5

## Learning points

- **Documenting architecture made the design reviewable, not just explainable.** The architecture artifact in `docs/architecture` turned the system into something the team could inspect from three angles at once: static structure, runtime flow, and deployment topology. The diagrams-as-code approach also meant the model stayed versioned with the code instead of drifting into a stale slide deck.
- **ADRs helped the team justify choices instead of treating them as defaults.** Recording ADRs for single-admin JWT auth, Pydantic boundary validation, and Docker Compose deployment forced each decision to state its context, trade-offs, and quality requirement link. That made the reasoning behind security, reliability, and deployment choices explicit enough to defend in review.
- **The workflow became more disciplined once configuration was centralized.** The smoke tests, Playwright config, and deployment workflow all encode assumptions that used to live in people's heads: HashRouter routes need `/#/...`, Vite can be started automatically for smoke runs, and mocked API responses keep the suite stable. Once that configuration was written down, the team could run the same checks locally, in CI, and on deployment without manual setup.
- **The customer review closed the loop between documentation and delivery.** Presenting the live increment and capturing feedback turned the architecture and test work into something the customer could actually react to. The accepted increment confirmed that the team had built the right thing, not just a technically correct thing.

## Validated assumptions

- **Confirmed:** diagrams-as-code is a maintainable way to keep architecture current. The component, sequence, and deployment diagrams stayed close to the implementation and can be updated when the system changes, instead of being recreated from scratch.
- **Confirmed:** ADRs are most useful when they are tied to concrete quality requirements. The single-admin auth, request validation, and deployment ADRs directly map to the security, reliability, and reachability/performance goals, so they are not just historical notes.
- **Confirmed:** the smoke-test setup is intentionally isolated from the backend. Mocked `/api/*` responses, stable fixtures, and a Playwright web server startup make the frontend smoke tests repeatable even when the backend is unavailable.
- **Confirmed:** the workflow can support delivery and verification at the same time. The same increment that was tagged as MVP v2 was also exercised by smoke tests, CI checks, and the customer review, which gave the release a stronger evidence trail.
- **Confirmed:** the customer review is a decision point, not a ceremony. The review of the delivered increment produced concrete follow-up items and confirmed which parts of the MVP v2 scope were accepted as-is.

## Friction and gaps

- **Architecture documentation still needs active maintenance.** The diagrams and ADRs are useful only while they reflect the live system; if future changes are not traced back into the docs, the architecture view will lose value quickly.
- **Smoke tests cover the main public surfaces, but not the whole frontend.** The current suite checks that the home, members, events, questionnaires, and admin login pages render against mocked data, but it does not yet exercise deeper user flows or edge cases.
- **Configuration is better organized now, but it is still spread across several files.** The team now depends on Playwright config, fixtures, compose files, and deployment scripts working together; that is manageable, but it means changes in one place can still break the workflow if they are not coordinated.
- **Customer feedback creates more value when it is fed back into the backlog immediately.** The review was productive, but the team still has to protect the habit of turning each comment into a tracked action instead of leaving it as informal context.

## Planned response

- Keep `docs/architecture` and the ADR set current whenever the architecture changes, so the documentation stays a living part of the delivery workflow.
- Extend the smoke-test layer gradually so the frontend checks more than page rendering, while keeping the fixtures and configuration centralized.
- Preserve the release discipline used for MVP v2: treat each increment as something that must be documented, tested, deployed, and reviewable end to end.
- Carry the customer review findings directly into the backlog and the next sprint plan, so the accepted increment becomes a base for improvement rather than a stopping point.
- Keep refining the workflow around a simple rule: if a setup step, route assumption, or deployment action is repeated more than once, it should be captured in config or documentation.
