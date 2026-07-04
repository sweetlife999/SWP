# Sprint 5 Retrospective

## What went well

1. **The frontend gained a real safety net.** We added E2E smoke tests in `frontend/src/tests/smoke`, which gave the team a fast way to verify that the most important pages still load and that the basic user-facing flows are intact.
2. **The architecture review made the project easier to reason about.** Reviewing `docs/architecture` helped the team reconnect the implementation with the static structure, runtime flow, and deployment view, so the project was no longer just a set of folders and scripts.
3. **The sprint produced reusable knowledge, not just code.** The smoke-test setup and architecture documentation captured assumptions that used to live in team members’ heads, which makes it easier to repeat the same setup in local development, review, and deployment.

## What did not go well

1. **The smoke tests still cover only the most visible surfaces.** They are useful as a first line of defense, but they do not yet exercise deeper user journeys or backend-backed edge cases.
2. **The architecture docs need active upkeep.** The review was valuable, but the diagrams and notes will only stay useful if future code changes are reflected back into `docs/architecture` instead of being left to drift.
3. **We paid too little attention to the mobile version of the website.** Developing the mobile version in parallel with the PC version proved convenient, but this approach required more time than we had available within a single sprint. Consequently, the mobile version's refinement was repeatedly postponed.

## What we changed compared to the previous Sprint

- We moved beyond unit and integration coverage by adding frontend smoke tests, so the team now checks the app from a user-visible entry point instead of relying only on internal API-level tests.
- We made architecture a working artifact instead of a reference artifact by explicitly reviewing `docs/architecture` during the sprint, which gave the team a shared view of the system structure and deployment path.

## Action points for the next Sprint

1. Polish the actual project structure & architecture, fix bugs that were found.
2. Keep `docs/architecture` current by assigning ownership for updates whenever a change affects structure, runtime behavior, or deployment.
3. Make mobile version of the website more convinient for the users and fix bugs related to this.  
