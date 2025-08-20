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

### B) Overly detailed commit (too much “how”)

- **Subject:** docs: added overly detailed commit example 3.B
- **Body:** Content had been added to section 3.B, starting at line 50. This is an example for overly detailed commit. The section contain Heading with two dot point of Subject and Body with its content.

### C) Well‑structured commit (good)

- **Subject:** docs: add final example of well structured commit (#60)
- **Body:** <br>
  Adds a final example for well structured commit message. <br>
  This finalise all example for this file. <br>
  - All example commit are done. <br>
    Refs #60

---

## 4) Why Good Commit Messages Matter (Reflections)

### What makes a good commit message?

- **Clarity**: A concise subject line in imperative mood summarizing the change.
- **Context**: A short body explaining the _why_ and any trade‑offs or impacts.
- **Traceability**: References to issues/PRs and breaking changes when relevant.
- **Scope**: One logical change per commit → easier reviews and rollbacks.

### How does a clear commit message help team collaboration?

- Reviewers understand intent quickly → **faster reviews**
- Future devs (including you) can reconstruct decisions → **better maintainability**
- Easier **blame/annotate** and selective cherry‑picks or rollbacks
- Cleaner **release notes** and changelogs (especially with Conventional Commits)

### How can poor commit messages cause issues later?

- Ambiguity hides the _why_ → harder debugging and knowledge loss
- Time wasted reading code diffs to infer meaning
- Risky releases: unclear if a commit is a **fix**, **feature**, or **breaking**
- Hard to automate **changelogs** or link work to issues
