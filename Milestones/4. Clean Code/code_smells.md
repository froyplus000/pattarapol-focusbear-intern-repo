# Identifying & Fixing Code Smells

A code smell is a surface sign that something may be wrong with the design. Smells don’t always mean bugs, but they often predict future pain: unclear intent, hard changes, hidden defects, or slow reviews.

## Common smells and quick refactors

### 1) Magic Numbers & Strings

**Problem:** Hidden meaning; hard to change consistently.

**Before**

```js
function gatherWood(player) {
  if (player.stamina < 5) return 0;
  const amount = player.tool === "axe" ? 3 : 1;
  player.stamina -= 5;
  player.wood = (player.wood || 0) + amount;
  return amount;
}
```

**After**

```js
const STAMINA_COST = 5;
const YIELD = Object.freeze({ axe: 3, hands: 1 });

function gatherWood(player) {
  if (player.stamina < STAMINA_COST) return 0;
  const amount = YIELD[player.tool] ?? YIELD.hands;
  player.stamina -= STAMINA_COST;
  player.wood = (player.wood || 0) + amount;
  return amount;
}
```

---

### 2) Long Functions

**Problem:** Mixed responsibilities; hard to read/test/change.

**Before**

```js
function resolveTurn(player, enemy) {
  // check stamina, roll hit, compute damage, apply poison, log, drop loot...
}
```

**After**

```js
function canAct(p) {
  return p.stamina >= 5;
}
function hitChance(p, e) {
  return Math.min(0.95, 0.7 + (p.dex - e.agi) * 0.01);
}
function damage(p) {
  return p.attack;
}
function applyDamage(target, amount) {
  target.hp = Math.max(0, target.hp - amount);
}

function resolveTurn(player, enemy, rand = Math.random) {
  if (!canAct(player)) return { ok: false, reason: "tired" };
  if (rand() > hitChance(player, enemy)) return { ok: true, hit: false };
  const dmg = damage(player);
  applyDamage(enemy, dmg);
  return { ok: true, hit: true, dmg };
}
```

---

### 3) Duplicate Code

**Problem:** Fixes must be repeated in many places.

**Before**

```js
function gatherWood(p) {
  if (p.stamina < 5) return 0;
  p.stamina -= 5;
  p.wood = (p.wood || 0) + 1;
  return 1;
}
function mineOre(p) {
  if (p.stamina < 5) return 0;
  p.stamina -= 5;
  p.ore = (p.ore || 0) + 1;
  return 1;
}
```

**After**

```js
const COST = 5;
function perform(p, key, amount) {
  if (p.stamina < COST) return 0;
  p.stamina -= COST;
  p[key] = (p[key] || 0) + amount;
  return amount;
}
const gatherWood = (p) => perform(p, "wood", 1);
const mineOre = (p) => perform(p, "ore", 1);
```

---

### 4) Large Classes (God Objects)

**Problem:** One class knows/does everything; high coupling.

**Before**

```js
class GameManager { // combat, inventory, save/load, quests, UI routing... }
```

**After (split by responsibility)**

```js
class CombatService {
  attack(attacker, defender) {
    /* ... */
  }
}
class InventoryService {
  add(inv, item, qty) {
    /* ... */
  }
}
class SaveService {
  save(state) {
    /* ... */
  }
  load() {
    /* ... */
  }
}
// Composition at the edges:
class Game {
  constructor() {
    this.combat = new CombatService();
    this.inventory = new InventoryService();
    this.save = new SaveService();
  }
}
```

---

### 5) Deeply Nested Conditionals

**Problem:** Hard to follow; grows exponentially with new cases.

**Before**

```js
function equip(player, item) {
  if (player) {
    if (item) {
      if (item.type === "weapon") {
        if (!player.inCombat) {
          player.weapon = item;
          return true;
        }
      }
    }
  }
  return false;
}
```

**After (guard clauses)**

```js
function equip(player, item) {
  if (!player || !item) return false;
  if (item.type !== "weapon") return false;
  if (player.inCombat) return false;
  player.weapon = item;
  return true;
}
```

---

### 6) Commented-Out Code

**Problem:** Noise; hides intent; falls out of date.

**Before**

```js
function heal(p, amt) {
  // p.hp = p.hp + amt; // old formula
  p.hp = Math.min(p.maxHp, p.hp + amt);
}
```

**After**

```js
function heal(p, amt) {
  p.hp = Math.min(p.maxHp, p.hp + amt);
}
// If the old rule matters, reference it in commit history or link an issue.
```

---

### 7) Inconsistent Naming

**Problem:** Cognitive load; bugs from misunderstanding.

**Before**

```js
function calc(p, n) {
  p.hp = Math.min(p.mhp, p.hp + n);
} // p, n, mhp?
```

**After**

```js
function applyHeal(player, healingAmount) {
  player.hp = Math.min(player.maxHp, player.hp + healingAmount);
}
```

---

## Refactor summary (what changed)

- Replaced magic numbers/strings with named constants and lookup maps.
- Split long functions into small helpers with single responsibilities.
- Deduplicated repeated logic via a tiny reusable function.
- Broke a “manager” concept into services by responsibility.
- Flattened nested conditionals with guard clauses.
- Deleted commented-out code in favor of version control.
- Standardized naming to clear, domain-specific terms.

---

## Reflection

**What code smells did you find in your code?**
Magic numbers and strings, long functions mixing multiple concerns, duplicate code across similar actions, an all-in-one manager object, deeply nested conditionals, commented-out dead code, and inconsistent naming.

**How did refactoring improve the readability and maintainability of the code?**
Named constants and maps made intent explicit and centralised change points. Short, single-purpose helpers clarified flow and made testing straightforward. Shared helpers removed repetition, so policy changes happen in one place. Splitting responsibilities reduced coupling. Guard clauses flattened logic and improved scanability. Removing dead code reduced noise, and consistent naming aligned code with the game domain.

**How can avoiding code smells make future debugging easier?**
Clear names, small functions, and single sources of truth shrink the search space when something breaks. Guard clauses and consistent structure make edge cases visible early. With less duplication and fewer giant classes, stack traces and diffs are smaller and more precise, leading to faster root-cause isolation and safer fixes.

---
