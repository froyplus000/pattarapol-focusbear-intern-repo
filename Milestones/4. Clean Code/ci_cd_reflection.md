# CI/CD Reflection

## What is the purpose of CI/CD?

**Continuous Integration (CI)** automatically runs checks (build, tests, linters) whenever code is pushed or a PR is opened. It gives fast feedback, keeps the main branch healthy, and prevents “works on my machine” issues by running in a clean cloud environment.
**Continuous Delivery/Deployment (CD)** automates packaging and releasing once CI is green (with or without a manual approval step).
**In this repo:** we added a CI workflow scoped to `Milestones/4. Clean Code/ci-cd-demo/` that installs dependencies and runs Jest tests for the tiny `sum(a, b)` example. This protects the repo without touching unrelated folders.

## How does automating style checks improve project quality?

Automating style checks (markdown lint, spell check, ESLint/Prettier) creates a consistent baseline, reduces PR nitpicks, and catches issues early. It keeps docs and code readable and lowers cognitive load for reviewers.
**Note:** while our current demo automates tests, the exact same workflow pattern can run `markdownlint` and `cspell` (or ESLint) the moment you add those scripts; CI then enforces them on every PR.

## What are some challenges with enforcing checks in CI/CD?

- **Tuning rules vs. noise:** over-strict linters or dictionaries cause false positives and frustration.
- **Performance:** slow pipelines reduce developer feedback; scoping by path (as we did) and caching dependencies helps.
- **Parity:** differences between local machines and CI can cause surprises; Husky pre-commit hooks help keep them aligned.
- **Flaky checks:** nondeterministic tests or external network calls can block merges.
- **Adoption:** contributors need clear docs on how to fix failures and how to run checks locally.

## How do CI/CD pipelines differ between small projects and large teams?

- **Small projects:** usually one or two quick jobs (lint + unit tests). Optimize for simplicity and speed; failures are easy to triage.
- **Large teams:** multi-stage pipelines (unit, integration, e2e, security scans, artifacts, deploy previews), parallel test matrices, required status checks, protected branches, and promotion flows (dev → staging → prod) with approvals. The goal shifts from just “catch issues” to **scalable reliability** and **release safety** at team/org level.

## Implementation Summary

- A **GitHub Actions** workflow at `.github/workflows/ci-cd-demo.yml` that runs **only** when files under `Milestones/4. Clean Code/ci-cd-demo/**` change.
- A tiny **Jest** test suite for `src/sum.js` to demonstrate automated verification.
- An optional **Husky pre-commit** hook at the repo root that runs those tests locally **only** when commits touch the demo folder—fast feedback before pushing.

---
