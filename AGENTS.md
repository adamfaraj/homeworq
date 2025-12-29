# Repository Guidelines

## Project Structure & Module Organization
- `be/` is reserved for backend services and APIs.
- `fe/` is reserved for the frontend app and UI assets.
- `infra/` is reserved for infrastructure, provisioning, and deployment configs.
- `README.md` contains the product overview and feature scope.

Keep new modules contained within their area (for example, `fe/src/` for UI code, `be/src/` for services, `infra/terraform/` for IaC). Add a short README inside each top-level folder once code lands.

## Build, Test, and Development Commands
No build or test tooling is checked in yet. When you add tooling, document commands here with one-line explanations, e.g.:
- `npm run dev` - run the frontend locally
- `npm test` - execute unit tests
- `make deploy` - apply infrastructure changes

## Coding Style & Naming Conventions
- Default to 2-space indentation for JSON/YAML and 4-space indentation for code unless the language’s formatter specifies otherwise.
- Prefer `kebab-case` for folder names and `snake_case` or `camelCase` for code identifiers, matching the language norms.
- If you introduce a formatter or linter (for example, `prettier`, `eslint`, `black`, `ruff`), add the config at the repo root and document it here.

## Testing Guidelines
- Choose a framework that matches the stack (for example, `vitest`/`jest` for frontend, `pytest` for backend).
- Name tests by feature or module, e.g. `task_scheduler.test.ts` or `test_task_scheduler.py`.
- Note any coverage expectations once defined (target %, required paths).

## Commit & Pull Request Guidelines
- There is no commit history yet; follow Conventional Commits until a team standard is established (example: `feat: add task reminder model`).
- PRs should include: a concise summary, testing notes, and screenshots for UI changes.
- Link related issues or product requirements when available.

## Configuration & Secrets
- Do not commit secrets or API keys. Use `.env` files and provide `.env.example` when needed.
- Document required environment variables in the relevant module README.
