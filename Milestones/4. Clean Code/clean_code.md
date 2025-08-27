# Clean Code

A small set of principles that make code easier to read, change, and trust—especially when teams grow and requirements evolve.

## Core Principles

### 1) Simplicity — “Do the simplest thing that works”

- Prefer straightforward solutions over “clever” ones.
- Reduce scope: fewer branches, fewer concepts, fewer moving parts.
- Split complex tasks into small, single-purpose functions.
- Avoid speculative features (“You Aren’t Gonna Need It” — YAGNI).

---

### 2) Readability — “Code is read far more than it’s written”

- Use clear, consistent names that reveal intent.
- Prefer early returns over deep nesting.
- Keep functions short; keep a single level of abstraction per function.
- Write minimal, useful comments to explain _why_, not _what_.

---

### 3) Maintainability — “Optimize for change”

- Separate concerns (I/O, validation, domain logic).
- Encapsulate behavior behind small interfaces.
- Remove duplication (DRY) but avoid over-abstracting.
- Write tests for critical paths and bug fixes.

---

### 4) Consistency — “Same problems, same patterns”

- Adopt a style guide (e.g., ESLint + Prettier, EditorConfig).
- Keep naming, file layout, and error handling uniform.
- Follow project conventions for modules, HTTP status codes, logging, etc.

---

### 5) Efficiency — “Fast enough, but not prematurely complex”

- Focus on clarity first; optimize with evidence (profiling, flame charts).
- Use appropriate data structures and avoid needless work in hot paths.
- Beware micro-optimizations that harm readability.

---

## Messy Code Example (Before)

```python
def s(l):
    x=0
    for i in range(0,len(l)):
        if type(l[i])==int or type(l[i])==float:
            x=x+l[i]
        else:
            x=x+0
    return x
```

### Why it’s hard to read

- **Bad naming:** `s`, `l`, `x` don’t explain purpose.
- **Unclear intent:** Reader must infer it’s summing numbers.
- **Unnecessary complexity:** manual index loop, redundant checks.
- **Hidden behavior:** silently ignores non-numbers instead of failing.

---

## Clean Code Example (After)

```python
def sum_numbers(numbers: list[float]) -> float:
    # Return the sum of all numeric values in the list
    total = 0.0
    for n in numbers:
        if isinstance(n, (int, float)):
            total += n
    return total
```

### What improved

- **Clear naming:** `sum_numbers`, `numbers`, `total`.
- **Type hints + docstring:** explains what the function does and expects.
- **Simpler loop:** direct iteration instead of indexing.
- **Readability:** easy for another developer to understand at a glance.

---

This tiny example already illustrates all the clean code principles:

- **Simplicity:** one job only.
- **Readability:** self-explanatory names + docstring.
- **Maintainability:** future devs can modify it without guessing.
- **Consistency:** standard Python idioms (loop, type check).
- **Efficiency:** no unnecessary overhead.

---
