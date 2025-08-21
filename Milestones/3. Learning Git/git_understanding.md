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

# Git Concepts: Staging vs. Committing

## 1. Difference Between Staging and Committing

- **Staging (`git add`)**:  
  Staging is the step where you prepare specific changes to be included in your next commit. Think of it like a "shopping cart" — you pick which files/changes you want to include before finalizing them.
- **Committing (`git commit`)**:  
  Committing takes everything that’s staged and records it permanently in the Git history. Each commit has a unique ID (hash) and usually includes a commit message that describes the changes.

---

## 2. Why Git Separates Staging and Committing

Git separates these steps to give developers **flexibility and control**:

- You can stage only part of your changes (e.g., a single function or line) while leaving others unstaged.
- It allows you to organize your commits into meaningful chunks instead of dumping everything at once.
- It helps create a cleaner commit history that is easier to review and understand.

---

## 3. When You Would Stage Without Committing

- When you want to **group related changes** together before committing.
- When you’re **still working** but want to prepare certain files in advance.
- When you need to **commit only some changes** from a file but not the entire file. (e.g., `git add -p` lets you stage line-by-line).

---

## 4. Experiment Results

1. Modified a file.
2. Ran `git add <file>` → File moved to staging.
3. Checked `git status` → File showed as staged, ready to commit.
4. Ran `git reset HEAD <file>` → File removed from staging, changes still in working directory.
5. Ran `git commit -m "Update file"` → Changes saved to repository history.

This confirmed the difference between staging (temporary prep area) and committing (permanent history).

---
