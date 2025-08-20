# Understanding Good Commit Messages

## 1) Best Practices

- Write in the **imperative** mood: “Add…”, “Fix…”, “Refactor…”
- Keep the **subject ≤ 50 chars**; capitalize, **no period** at the end
- Add a **blank line** after the subject
- Provide a **body (wrap at ~72 chars)** explaining _what_ and _why_ (not just how)
- Reference **issues/PRs** when relevant (e.g., “Refs #123”, “Fixes #45”)
- Commit **one logical change** per commit
- Prefer **Conventional Commits** when teams agree:  
  `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `perf:`, `ci:` etc.

### Conventional Commits examples

- `feat: add pagination to task list`
- `fix: handle null userId in auth middleware`
- `docs: clarify API rate limits`
- `refactor: extract validation into helper`

---

## 2) Good vs Bad in the Wild (What to Look For)

When browsing an open‑source project’s history (e.g., React or Node.js), notice:

**Good**

- Clear subject + body
- Mentions the problem and the approach
- Links to issues/PRs and breaking changes callouts

**Bad**

- Vague: `update`, `fix stuff`, `changes`
- No context in the body
- Multiple unrelated changes in one commit

---

## 3) Three Example Commits (you will create in your repo)

> Feel free to copy these exact messages when you commit.

### A) Vague commit (bad on purpose)

- **Subject:** modified content
- **Body:** file content had been modified
