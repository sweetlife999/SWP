# LLM Usage Report — Week 3

## Tools used

- **Claude Code (Anthropic)** — primary AI assistant used throughout the sprint via the CLI (`claude` command in terminal).

## How it was used

### Frontend implementation (Assignments 2 & 3)

Claude Code was used extensively to implement the frontend of the Student Union Portal:

- Generating React/TypeScript components (pages, modals, admin UI)
- Replacing hardcoded mock data with typed API stub wrappers (`frontend/src/lib/api.ts`)
- Implementing inline `contentEditable` editing pattern for admin content management
- Fixing React + `contentEditable` incompatibility (children vs `dangerouslySetInnerHTML`)
- Writing CI workflows (ESLint, `tsc --noEmit`, link-check)
- Debugging TypeScript errors

### Documentation and process artefacts (Assignment 3)

Claude Code was used to generate:

- `docs/definition-of-done.md`
- `docs/roadmap.md`
- `docs/user-stories.md` index table
- `CHANGELOG.md`
- GitHub Issue templates (4 types)
- Extended PR template
- Skeleton report files (`reports/week3/`)

## Limitations and team effort

- All user story content, acceptance criteria, MoSCoW prioritisation, and story point estimates were produced by the team (not AI-generated).
- The customer meeting notes, transcript, and review summary are written by team members only.
- Sprint retrospective and reflection are written by team members only.
- All AI-generated code and docs were reviewed, edited, and approved by team members before commit.
- Claude Code does not have access to GitHub — issues, project boards, milestones, and releases were created manually by the team.

## Disclosure

AI tool usage is disclosed as required by the course policy.
