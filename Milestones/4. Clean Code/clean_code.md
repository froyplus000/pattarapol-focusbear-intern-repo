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

## Code Formatting & Style — Reflection

**Setup summary.**
I initialized a small JS project in a folder called "eslint-prettier-test-config" and added ESLint + Prettier with Airbnb base rules:

- `eslint`
- `prettier`
- `eslint-config-airbnb-base`
- `eslint-plugin-import`
- `eslint-config-prettier`
- `eslint-plugin-prettier`

Config files:

- `.eslintrc.json` extends `["airbnb-base", "plugin:prettier/recommended"]`;
- `.prettierrc.json` sets single quotes, semicolons, trailing commas.
- `package.json` I added scripts for `lint`, `lint:fix`, `format`, and `format:check`.

**Why formatting is important.**

- Consistent style reduces cognitive load and review time; PRs focus on logic instead of nits.
- Automated formatting eliminates bikeshedding and keeps diffs clean (smaller, more readable).
- A checked-in config makes behavior identical across teammates, editors, and CI.
- Lint rules catch real issues early (unused code, dangerous equality, import mistakes).

**What the linter detected (first run).**

- `no-unused-vars`: a demo function (`bad`) was declared but never used.
- `no-console`: warned about `console.log` left in the code.
- `eqeqeq`: flagged `==` and required `===`.
- (When testing style) `prefer-const`: suggested `const` where a `let` wasn’t reassigned.
- Prettier formatting changes: quotes → single, add semicolons, normalize spacing/indent.

**Fixes and what auto-fixed vs manual.**

- Auto-fixed by tools: quote style, semicolons, spacing/indentation, `prefer-const`.
- Manual changes: remove/use unused variables; change `==` to `===`; either remove `console.log`, suppress it for a single line, or relax `no-console` per project policy.
- Note: “Missing script” errors were resolved by adding the `scripts` in `package.json`.

**Did formatting make the code easier to read?**
Yes. After `npm run format` and addressing lints, the code became visually uniform and easier to scan. Consistent indentation and quote/semicolon rules made functions quicker to understand. Linting also surfaced a small logic risk (`==` vs `===`) and a dead symbol (unused function), which would have added noise in future PRs.

**Result.**
After fixes, `npm run lint` and `npm run format:check` pass. The repo now enforces Airbnb style consistently, and the toolchain (ESLint + Prettier) is ready to run locally and in CI to keep the codebase clean.

---

# Naming Variables & Functions

## What makes a good name?

- **Communicates intent:** the _why/what_, not the _how_.
- **Domain language:** use terms the team/business already uses.
- **Specific & unambiguous:** prefer `retryLimit` over `n`; `unitPrice` over `p`.
- **Consistent casing:** `camelCase` for vars/functions, `PascalCase` for classes/types.
- **Good boolean prefixes:** `is/has/can/should` (e.g., `isAdmin`, `hasAccess`).
- **Include units when relevant:** `timeoutMs`, `distanceKm`.
- **Avoid noise/abbrev:** skip `mgr`, `svc`, `tmp1`. Spell it out unless it’s universally known (`id`, `url`).

## Tiny messy → clean examples

### Example 1 (JS): subtotal with optional discount

**Before (unclear):**

```js
function p(a, b, c) {
  const r = a * b;
  const d = c ? r * 0.9 : r;
  return d;
}
```

**After (clear):**

```js
function calculateSubtotal(unitPrice, quantity, hasDiscount) {
  const subtotal = unitPrice * quantity;
  return hasDiscount ? subtotal * 0.9 : subtotal;
}
```

Why better: intent is obvious from names; booleans read naturally; fewer mental hops.

---

### Example 2 (JS): date formatting

**Before:**

```js
function fmt(d) {
  const t = new Date(d);
  return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`;
}
```

**After:**

```js
function formatDateISO(dateInput) {
  const date = new Date(dateInput);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
```

Why better: function name says _what_; parameter clarifies _what kind_ of value; parts are named.

---

## What can go wrong with poor names?

- **Misuse & bugs:** devs pass the wrong values or flip booleans (`flag`, `x`, `y`).
- **Slower reviews & onboarding:** readers must reverse-engineer meaning.
- **Inconsistent APIs:** similar things end up with different names (`count` vs `total`).
- **Hidden units:** timeouts in seconds vs milliseconds cause subtle defects.

## Reflection (what I did & learned)

**What makes a good variable/function name?** <br>
Clear intent, domain terms, consistent casing, boolean prefixes (`is/has/can/should`), and units in names when relevant. Names should let a reader guess behavior without opening the function.

**What issues can arise from poorly named variables?** <br>
Ambiguity leads to wrong usage and defects (e.g., mixing units, negated booleans like `notReady`), slower reviews, and duplicated logic when teammates don’t realize two things are the same concept.

**How did refactoring improve readability?** <br>
Renaming `p(a,b,c)` to `calculateSubtotal(unitPrice, quantity, hasDiscount)` made the purpose self-evident and reduced comments needed. In the date example, `formatDateISO(dateInput)` and sub-parts (`yyyy`, `mm`, `dd`) made intent and output format obvious at a glance.

---

# Writing Small, Focused Functions (RPG: Gather Wood)

## Best practices (short)

- One job per function with a clear name.
- Keep the “story” at the top (orchestrator) and details in tiny helpers.
- Use early returns to avoid deep nesting.

---

## Before — one function doing everything

```js
function gather(player) {
  console.log("Start gather");
  if (!player) {
    console.log("no player");
    return 0;
  }
  if (player.stamina < 5) {
    console.log("too tired");
    return 0;
  }

  let amount = 1;
  if (player.tool === "axe") {
    console.log("using axe");
    amount = 3;
  } else {
    console.log("no axe");
  }

  console.log("chopping...");
  player.stamina -= 5;
  player.wood = (player.wood || 0) + amount;

  console.log(
    `gathered ${amount}, wood=${player.wood}, stamina=${player.stamina}`
  );
  return amount;
}
```

**Problems:** mixed checks, rule calculation, and state changes all in one place. Harder to test or reuse parts.

---

## After — tiny, single-purpose helpers

```js
const STAMINA_COST = 5;

function canGather(player) {
  const ok = !!player && player.stamina >= STAMINA_COST;
  console.log(ok ? "can gather" : " cannot gather");
  return ok;
}

function woodYield(tool) {
  const amount = tool === "axe" ? 3 : 1;
  console.log(tool === "axe" ? "axe yield=3" : "hands yield=1");
  return amount;
}

function gatherWood(player) {
  console.log("Start gather");
  if (!canGather(player)) return 0;

  const amount = woodYield(player.tool);
  console.log(" chopping...");
  player.stamina -= STAMINA_COST;
  player.wood = (player.wood || 0) + amount;

  console.log(
    `gathered ${amount}, wood=${player.wood}, stamina=${player.stamina}`
  );
  return amount;
}

// tiny demo
const p = { stamina: 10, tool: "axe", wood: 0 };
gatherWood(p); // logs the steps
```

**Why better:** the orchestrator (`gatherWood`) reads like a 3-step story: check → compute → apply. Each helper has one clear job and a tiny body.

---

## Reflection

**Why is breaking down functions beneficial?** <br>
Small, single-purpose functions make the code easier to read, test, and change. If the wood yield rule changes later (e.g., different tools), I only touch `woodYield` without risking the stamina or validation logic.

**What issues can arise from large functions?** <br>
Mixed concerns make it hard to see the intent, increase bugs when changing one rule, and slow reviews because readers must mentally separate checks, calculations, and state updates.

**How did refactoring improve the structure?** <br>
The “before” mixed validation, yield rules, and state mutation. The “after” has:

- `canGather(player)` for the guard,
- `woodYield(tool)` for the simple rule, and
- `gatherWood(player)` orchestrating the sequence.
  The console logs now narrate the flow, and each piece is small enough to reason about instantly.

---

# Avoiding Code Duplication (DRY) — RPG Example

## DRY in one line

**Don’t Repeat Yourself (DRY)** means putting shared logic in one place so a change only needs to be made once.

---

## Before — duplicated checks & updates

```js
function gatherWood(player) {
  console.log(" gather wood");
  if (!player || player.stamina < 5) {
    console.log(" tired");
    return 0;
  }
  const amount = player.tool === "axe" ? 3 : 1;
  player.stamina -= 5;
  player.wood = (player.wood || 0) + amount;
  console.log(`+${amount} wood, stamina=${player.stamina}`);
  return amount;
}

function mineOre(player) {
  console.log(" mine ore");
  if (!player || player.stamina < 5) {
    console.log(" tired");
    return 0;
  }
  const amount = player.tool === "pickaxe" ? 2 : 1;
  player.stamina -= 5;
  player.ore = (player.ore || 0) + amount;
  console.log(`+${amount} ore, stamina=${player.stamina}`);
  return amount;
}
```

**What’s duplicated?**

- The **stamina check** (`!player || player.stamina < 5`)
- The **stamina deduction** (`player.stamina -= 5`)
- The **inventory update** pattern
- The **log messaging** shape

---

## After — one tiny helper for the shared steps

```js
const STAMINA_COST = 5;

function canAct(player) {
  const ok = !!player && player.stamina >= STAMINA_COST;
  if (!ok) console.log(" tired");
  return ok;
}

function finishAction(player, resourceKey, amount) {
  player.stamina -= STAMINA_COST;
  player[resourceKey] = (player[resourceKey] || 0) + amount;
  console.log(`+${amount} ${resourceKey}, stamina=${player.stamina}`);
  return amount;
}

function gatherWood(player) {
  console.log(" gather wood");
  if (!canAct(player)) return 0;
  const amount = player.tool === "axe" ? 3 : 1;
  return finishAction(player, "wood", amount);
}

function mineOre(player) {
  console.log(" mine ore");
  if (!canAct(player)) return 0;
  const amount = player.tool === "pickaxe" ? 2 : 1;
  return finishAction(player, "ore", amount);
}

// quick demo
const p = { stamina: 10, tool: "axe", wood: 0, ore: 0 };
gatherWood(p); // runs shared checks + updates via helpers
mineOre(p);
```

**Why this is better**

- The stamina policy and update live in **one place** (`canAct`, `finishAction`).
- Adding a new action (e.g., `fish()`) reuses the helpers—no copy-paste.

---

## Reflection

**What were the issues with duplicated code?**

- The stamina rules and inventory update logic were copy-pasted in multiple functions. Any tweak to stamina cost or the logging format would require edits in several places, risking inconsistent behavior and missed fixes.

**How did refactoring improve maintainability?**

- I extracted the shared logic into `canAct` (guard) and `finishAction` (apply effects). Now stamina policy and the update pattern are centralized, so changes happen once. New actions can reuse the helpers, keeping functions short and consistent.

---

# Refactoring Code for Simplicity (RPG: Heal Action)

## Common refactoring techniques (short list)

- **Inline needless abstractions** (remove generic wrappers you don’t use).
- **Use guard clauses** instead of deep nesting.
- **Replace complex conditionals with clear parameters / small helpers.**
- **Eliminate duplication** and magic numbers.
- **Prefer simple data flow** (explicit inputs/outputs) over cleverness.

---

## Before — overly engineered for a simple heal

```js
// rpg/over-engineered-heal.js
function executeAction(ctx) {
  // ctx = { player, action: { kind, payload }, config }
  const { player, action, config } = ctx;
  const merged = Object.assign({ cost: 0, log: true }, config || {});
  const pre = merged.pre || function () {};
  const post = merged.post || function () {};

  pre(ctx);

  let result;
  if (action && action.kind === "heal") {
    const amount = Array.isArray(action.payload)
      ? action.payload.reduce((a, b) => a + b, 0)
      : Number(action.payload || 0);
    if (!isFinite(amount)) return { ok: false, reason: "bad-amount" };
    player.hp = Math.min(player.maxHp, player.hp + amount);
    if (merged.log) console.log(`healed ${amount}`);
    result = { ok: true, amount };
  } else if (action && action.kind === "heal-crit") {
    const amt = Number(action.payload) * 2;
    player.hp = Math.min(player.maxHp, player.hp + amt);
    if (merged.log) console.log(`healed ${amt} (crit)`);
    result = { ok: true, amount: amt };
  } else {
    return { ok: false, reason: "unknown-action" };
  }

  post(ctx, result);
  return { ...result, player: { ...player } };
}
```

**What made it complex?**

- Generic **action executor** with hooks (`pre/post`) nobody needs here.
- Multiple payload shapes (number _or_ array) and duplicate “heal/crit” branches.
- Extra config merging and result copying that add noise to a tiny feature.

---

## After — simple, readable heal

```js
// rpg/simple-heal.js
function heal(player, amount, { crit = false, log = true } = {}) {
  if (!Number.isFinite(amount) || amount <= 0) {
    if (log) console.log(" invalid heal amount");
    return { ok: false, reason: "bad-amount" };
  }

  const final = crit ? amount * 2 : amount;
  player.hp = Math.min(player.maxHp, player.hp + final);

  if (log) console.log(` heal +${final} (hp=${player.hp}/${player.maxHp})`);
  return { ok: true, amount: final };
}

// tiny demo
const p = { hp: 12, maxHp: 20 };
heal(p, 3); // normal heal
heal(p, 3, { crit: true }); // crit heal
```

**Why this is simpler**

- One clear function with explicit params (`amount`, `crit`), no generic executor.
- Guard clause for invalid input, no deep branching.
- No duplicated “heal” vs “heal-crit” logic; a single code path handles both.

---

## Reflection

**What made the original code complex?** <br>
It tried to be generic (action executor, hooks, config merging, multiple payload shapes) for a single action. That introduced extra branches, duplication, and mental overhead without real benefit.

**How did refactoring improve it?** <br>
I removed generic scaffolding, used a single `heal(player, amount, { crit })` API, added a guard clause, and unified the logic. The function now reads top-down, is easy to test, and changes (e.g., new crit multiplier) are localized to one place.

---

# Commenting & Documentation

## Best practices

- Prefer explaining **why** over restating **what**. Names and small functions should make the “what” obvious.
- Document non-obvious **business rules**, **trade-offs**, **assumptions**, **invariants**, and **edge cases**.
- Use **constants** and **clear names** to eliminate comments that just decode magic numbers.
- For public APIs, add a brief **JSDoc**: what it does, parameters, return, errors, side effects.
- Keep comments **close** to the code they explain and keep them **up to date**.
- Link out to specs, tickets, or papers when the reasoning lives elsewhere.
- Avoid noise: comments should earn their keep; delete outdated comments promptly.

---

## Poorly commented code (before)

Problems: comments repeat the code, hide magic numbers, and don’t explain intent or constraints.

```js
// gather wood function
function gw(p, t) {
  // check stamina
  if (p.stamina < 5) {
    // not enough stamina
    return 0;
  }
  // add 3 if axe else 1
  const a = p.tool === "axe" ? 3 : 1;
  // night penalty
  const amt = t === "night" ? a - 1 : a;
  // update stamina
  p.stamina = p.stamina - 5;
  // update wood
  p.wood = (p.wood || 0) + amt;
  // return amount
  return amt;
}
```

---

## Clear code with useful comments (after)

Improvements: self-explanatory names, constants remove magic numbers, a short JSDoc focuses on intent and edge cases; a single inline note captures a non-obvious policy.

```js
const GATHER_STAMINA_COST = 5;
const AXE_YIELD = 3;
const HAND_YIELD = 1;

/**
 * Gather wood based on tool and time of day.
 * Night reduces yield by 1 (minimum 0). Deducts stamina cost on success.
 * Returns the amount gathered.
 */
function gatherWood(player, timeOfDay) {
  if (player.stamina < GATHER_STAMINA_COST) return 0;

  const baseYield = player.tool === "axe" ? AXE_YIELD : HAND_YIELD;

  // Temporary balance rule: nights are less productive than days.
  const yieldWithTime =
    timeOfDay === "night" ? Math.max(0, baseYield - 1) : baseYield;

  player.stamina -= GATHER_STAMINA_COST;
  player.wood = (player.wood || 0) + yieldWithTime;

  return yieldWithTime;
}
```

Why this is better:

- Names and constants make the code readable without line-by-line narration.
- The JSDoc explains behavior, side effects, and corner cases.
- A single inline comment captures the business reason for the night penalty.

---

## Reflection

**When should you add comments?**

- When intent is not obvious from code alone (business rules, domain constraints).
- To record decisions and trade-offs (links to specs or tickets).
- To warn about pitfalls (performance hotspots, security assumptions, concurrency hazards).
- To describe side effects or invariants that callers must respect.

**When should you avoid comments and instead improve the code?**

- When a comment restates the code (“subtract 5 from stamina”). Use clear names and constants instead.
- When a comment compensates for vague names or long functions. Prefer renaming and extracting smaller functions.
- When comments try to explain magic numbers. Replace them with named constants.
- When the code can be made self-documenting with better structure.

**What were the issues with the poorly commented code?**

- Comments merely narrated each line, duplicated the code, and hid intent.
- Magic numbers made behavior unclear; no explanation of why night penalizes yield.
- Vague names (`gw`, `p`, `t`) forced comments to explain basics.

**How did refactoring improve it?**

- Clear names and constants removed the need for most comments.
- A focused JSDoc and one inline business-rule comment captured the important “why.”
- The function became easier to scan, safer to change, and simpler to reuse.

---

# Handling Errors & Edge Cases

## Strategies (quick list)

- Use **guard clauses** to fail fast on invalid inputs.
- **Validate inputs and ranges** (types, null/undefined, non-negative, finite numbers).
- Prefer **clear return shapes** (e.g., `{ ok: false, reason }`) or throw typed errors consistently.
- **Avoid silent failures**; surface why the action failed.
- Centralize **constants** and **policies** to avoid magic numbers.
- Keep core logic **pure** where possible; isolate side effects.

---

## Example: Crafting a potion (before → after)

### Before — no validation, silent negatives

```js
// craft-before.js
function craftPotion(player, inventory) {
  // costs: 2 herb, 1 water, 5 stamina
  inventory.herb -= 2;
  inventory.water -= 1;
  player.stamina -= 5;
  inventory.potion = (inventory.potion || 0) + 1;
  console.log("crafted 1 potion");
  return 1;
}
```

Issues:

- No checks for missing player/inventory.
- Can drive counts negative if resources are insufficient.
- No explanation when crafting should fail.
- Magic numbers; no guard clauses.

### After — guard clauses and clear outcomes

```js
// craft-after.js
const COST = Object.freeze({ herb: 2, water: 1, stamina: 5 });

function hasResources(inv) {
  return inv && inv.herb >= COST.herb && inv.water >= COST.water;
}

function canSpendStamina(p) {
  return p && p.stamina >= COST.stamina;
}

function craftPotion(player, inventory) {
  if (!player || !inventory) return { ok: false, reason: "missing-data" };
  if (!Number.isFinite(player.stamina) || player.stamina < 0) {
    return { ok: false, reason: "invalid-stamina" };
  }
  if (!Number.isFinite(inventory.herb) || !Number.isFinite(inventory.water)) {
    return { ok: false, reason: "invalid-inventory" };
  }
  if (!hasResources(inventory))
    return { ok: false, reason: "insufficient-resources" };
  if (!canSpendStamina(player)) return { ok: false, reason: "tired" };

  inventory.herb -= COST.herb;
  inventory.water -= COST.water;
  player.stamina -= COST.stamina;
  inventory.potion = (inventory.potion || 0) + 1;

  console.log("crafted 1 potion");
  return { ok: true, crafted: 1 };
}

// tiny demo
const player = { stamina: 7 };
const inv = { herb: 3, water: 1, potion: 0 };
console.log(craftPotion(player, inv)); // { ok: true, crafted: 1 }
console.log(craftPotion(player, inv)); // { ok: false, reason: 'insufficient-resources' }
```

Why the “after” is better:

- Guard clauses stop early on missing/invalid data.
- Prevents negative resource/stamina counts.
- Returns a structured result explaining failures.
- Constants remove magic numbers.

---

## Reflection

**What was the issue with the original code?** <br>
It assumed valid inputs, subtracted blindly, and never explained failures. That could push inventory and stamina negative, making state inconsistent and bugs hard to trace.

**How does handling errors improve reliability?** <br>
Early validation and guard clauses prevent invalid state transitions, making outcomes predictable. Clear failure reasons help users and developers diagnose issues quickly. Centralized constants and explicit checks reduce hidden assumptions and make future changes safer.

---

# Writing Unit Tests for Clean Code

## Unit Testing Demo with Jest

- Setup small project with Jest installed on unit-test-clean-code branch
- config script for test -> `jest`
- write a simple sum function
- write a simple unit test case using Jest
- tried run with `npm run test`
- tried run `npx jest --watch`
- Every test run correctly

### sum.js

```js
// sum.js
function sum(a, b) {
  if (
    typeof a !== "number" ||
    typeof b !== "number" ||
    !Number.isFinite(a) ||
    !Number.isFinite(b)
  ) {
    throw new TypeError("sum expects finite numbers");
  }
  return a + b;
}

module.exports = { sum };
```

### sum.test.js

```js
// sum.test.js
const { sum } = require("./sum");

describe("sum", () => {
  test("adds 2 + 3 = 5", () => {
    expect(sum(2, 3)).toBe(5);
  });

  test("handles negatives", () => {
    expect(sum(-2, 7)).toBe(5);
  });

  test("works with zero", () => {
    expect(sum(0, 0)).toBe(0);
  });

  test("rejects non-numbers", () => {
    expect(() => sum("2", 3)).toThrow(TypeError);
  });

  test("rejects NaN/Infinity", () => {
    expect(() => sum(NaN, 1)).toThrow();
    expect(() => sum(Infinity, 1)).toThrow();
  });
});
```

---

## Reflection

### Why unit tests help keep code clean <br>

Unit tests encourage small, single-purpose functions with clear inputs and outputs. They document expected behavior, catch regressions quickly, and make refactoring safer because behavior is locked in by the tests.

### What issues did I find while testing <br>

While writing the tests, I noticed a few clarity gaps in the function’s expected behavior (e.g., what to do with unusual or borderline inputs) and some naming/assumption inconsistencies that weren’t obvious when just reading the code. The tests helped surface these quickly and made me tighten the function’s “contract” so its behavior is predictable. Overall, I really liked using Jest, its jest --watch mode was especially convenient for development because it reruns only the affected tests on save, giving fast feedback and encouraging small, incremental improvements.

---
