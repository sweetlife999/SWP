# How to Contribute

## 1. Cloning the Repository

```bash
git clone https://github.com/sweetlife999/SWP.git
cd SWP
```

## 2. Creating a branch

For each issue, feature, or bugfix, create a separate branch off the `main`:

```bash
git checkout -b feature/feature-name
# or
git checkout -b bugfix/short-description
```

> **Why?** The entire development process in the project is based on feature branches. A PR is only created from such a branch, making review and automated checks easier.

## 3. Installing dependencies

### Backend (Python)

```bash
cd backend
pip install -r requirements-dev.txt
```

### Frontend (React)

```bash
cd frontend
npm ci
```

## 4. Formatting and linting

- **Python** – we use `ruff`. Run:

  ```bash
  ruff check .
  ruff format --check .
  ```

- **TypeScript/JavaScript** – we use `eslint` and `tsc`. Run:

  ```bash
  npm run lint
  npm run type-check
  ```

> **Important**: CI checks for both linters. Commits that do not pass are rejected.

## 5. Tests

### Backend

- Unit tests (`pytest` without the `integration` marker):

  ```bash
  pytest -m "not integration"
  ```

- Integration tests (require a working DB, run by default):

  ```bash
  pytest --cov=app
  ```

### Frontend

- Smoke tests with Playwright:

  ```bash
  npm run test:smoke
  ```

> **Requirements**: all affected modules must have ≥ 30 % coverage (see `docs/testing.md`). Add new tests when modifying logic.

## 6. CI / quality checks

When a Pull Request is opened, the following checks run automatically:

| Step | What is checked |
|------|-----------------|
| Backend lint | `ruff` |
| Frontend lint | `eslint` + `tsc` |
| Backend tests | `pytest` (+ coverage) |
| Frontend smoke | Playwright |
| Dependency audit | `pip-audit` (Python) |
| Link-check | External link validation in documentation |

All steps must pass successfully, otherwise the PR will not be accepted.

## 7. Pull Request formatting

1. **Title** – briefly describes the essence (≤ 50 characters).  
   Example: `feat: add events page to admin panel`.
2. **Body** – specifies:  
   - The issue/task linked (`Fixes #123`).  
   - What changed and why (briefly).  
   - How to check (which tests/commands to run).  
3. **Labels** – use `feat`, `fix`, `refactor`, `docs`, `test`, `chore`.  
4. **Review requirements** – at least one approving review from a colleague.  
   A self-approval is not enough.

## 8. Documentation updates

Any changes to public API, configuration, or user interface require updating the corresponding files in `docs/`.  
When adding new diagrams or ADRs, store them in `docs/architecture/`.  
If you modify behavior that affects end‑users, update `README.md` and `CHANGELOG.md`.

## 9. Releases & release management

After a PR is merged into `main` – tag a release following semantic versioning (e.g. `v2.1.0`).  
Update `CHANGELOG.md` according to the project's template.  
Documentation is published automatically via GitHub Pages.

## 10. Common questions

- **Where to find the coding style?** — look at the configuration for `ruff` (`backend/pyproject.toml`) and `eslint` (`frontend/.eslintrc.json`).  
- **How to add a new dependency?** – add it to `backend/requirements-dev.txt` (Python) or `frontend/package.json` (JS) and pin the version. Then run the corresponding lint/test to make sure CI does not fail.  
- **Where to place new tests?** – place backend tests in `backend/tests/` and frontend smoke tests in `frontend/src/tests/smoke/`.

---
