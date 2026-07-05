# Development Process and Configuration Management

## 1. Git Workflow Timeline
```mermaid
gitGraph
    %% --- SPRINT 1 & 2: INITIALIZATION & MVP v0 ---
    commit id: "init"
    commit id: "add initially haved data (PR #2)"
    commit id: "mvp0 (PR #3)"
    commit id: "add license & linter fixes"
    commit id: "change md files, add autodeploy (PR #5)"
    commit id: "complete week 2 report"

    %% --- SPRINT 3 START: DOCKER & FRONTEND REDESIGN ---
    branch dockerization
    checkout dockerization
    commit id: "dockerize frontend & update README"
    checkout main
    merge dockerization id: "PR #13: Dockerization"
    
    branch improve-frontend
    checkout improve-frontend
    commit id: "redesign frontend (6 pages)"
    commit id: "homepage redesign to dep-tint"
    commit id: "activate mock interactive elements"
    commit id: "fix admin UX & replace mock data"
    checkout main
    merge improve-frontend id: "PR #14: Frontend Overhaul"

    %% --- BACKEND SETUP & DATABASE DESIGN ---
    branch db-discussion
    checkout db-discussion
    commit id: "initial db schema"
    commit id: "changes-to-initial-db"
    checkout main
    merge db-discussion id: "PR #51: DB Schema"

    branch sprint3-features
    checkout sprint3-features
    commit id: "feat: implement backend & endpoints"
    commit id: "feat: connected backend with frontend"
    commit id: "fix backend configs & DB creds"
    
    checkout main
    branch responsive-layout
    checkout responsive-layout
    commit id: "responsive-layout-67"
    checkout main
    merge responsive-layout id: "PR #59: Mobile Layout"
    merge sprint3-features id: "PR #61/62: Backend Deploy"

    %% --- SPRINT 4: REFACTORING & INTEGRATION ---
    branch sprint4-integration
    checkout sprint4-integration
    commit id: "feat: event format & age fields"
    commit id: "feat: photo upload via Thumbor"
    commit id: "feat: editable event detail page"
    commit id: "fix: load Google Fonts non-blocking"
    commit id: "fix: apply DB migrations on deploy"
    checkout main
    merge sprint4-integration id: "PR #71: Error Skeletons"

    %% --- RECENT WORK (JUNE 28 - 29) ---
    branch feature-homepage
    checkout feature-homepage
    commit id: "feat: news endpoint on backend"
    checkout main
    merge feature-homepage id: "PR #73: Home Endpoints"

    branch assignment-4
    checkout assignment-4
    commit id: "docs: fill SemVer release (MVP v2.0.0)"
    commit id: "feat: manage members page in admin panel"
    checkout main
    merge assignment-4 id: "PR #74: Assignment 4 Docs"

    branch assignment04_2
    checkout assignment04_2
    commit id: "update user stories"
    commit id: "final adjustments"
    checkout main
    merge assignment04_2 id: "PR #76: UAT & Final Adjustments"

    branch customer-feedback
    checkout customer-feedback
    commit id: "fix: lint issues"
    commit id: "fix: navlink to admin member"
    checkout main
    merge customer-feedback id: "PR #77: Customer Feedback S4"
```


## 2. What the Timeline Shows

The diagram is a compact history of the repository’s development. It starts with the initial project setup and MVP work, then shows separate feature branches for dockerization, frontend redesign, database schema work, backend features, responsive layout, sprint 4 integration, homepage/news work, assignment documentation, user-story and UAT cleanup, and finally customer-feedback fixes.

The important pattern is that work happens on topic branches and is only brought back into `main` through pull requests. In other words, the diagram is not just a list of commits: it shows how the team uses branching to isolate work, review it, and merge it in a controlled way.


## 3. Workflow Execution & Triggers

    Isolation: No team member commits directly to main. Every feature, document rewrite, or bugfix begins by branching off main into a dedicated feature branch (e.g., sprint4-integration).

    Continuous Integration (CI): As developers push commits, automated GitHub Actions are triggered to run linting scripts (ruff / ESLint), type-checking pipelines (mypy), and the other required checks listed in the Definition of Done.

    Config & secrets: Configuration is treated as a tracked quality area, not an afterthought. The repo documents `app/config.py` as the critical module for app configuration and secrets loading, and the Definition of Done explicitly forbids committing secrets, credentials, or personal data.

    Traceability: Pull Requests are opened to merge the feature branch back into main. The PR must explicitly link to its corresponding issue or assignment milestones so the work can be traced from requirement to implementation.

    Workflow-state: The issue tracker is the source of live execution state. The current user-story index is used for stable IDs and membership, while the issue tracker keeps the current Work Status and sprint assignment. After merge, the issue Work Status is set to `Done`.

    Review & Merge: Another teammate reviews the changes, verifies the pipeline is green, and completes the merge request, deploying the code to the VPS environment.


