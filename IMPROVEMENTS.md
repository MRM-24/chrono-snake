# Chrono Snake — Improvement Research & Roadmap

> **STATUS: ALL ITEMS IMPLEMENTED ✅** (see checklist at the bottom)

---

Research basis: full code review of `index.html`, plus reading on game feel / "juice"
(Nijman's *Art of Screenshake*, Swink's *Game Feel*, *Juice It or Lose It*), snake game
design patterns, and web platform best practices (rAF fixed-timestep loops, Web Audio
autoplay policies, PWA installability).

---

## 🔴 Priority 1 — Correctness & fairness bugs (fix first)

| # | Issue | Detail |
|---|-------|--------|
| 1.1 | **No auto-pause when tab/app loses focus** | The `setInterval` loop keeps running (throttled) when the tab is hidden. Returning to the tab can fire a burst of catch-up ticks and kill you off-screen. Add a `visibilitychange`/`blur` listener that auto-pauses, and pause audio. |
| 1.2 | **Dropped inputs near turns** | `setDir()` overwrites a single `ndir` and rejects moves relative to the *last committed* `dir`. Classic case: moving right, tap ↑ then ← quickly — the ← press is tested against "moving right" and gets discarded, so the turn never happens. An **input queue (depth 2–3)** fixes this and is the #1 cited "feel" fix for snake-likes. |
| 1.3 | **Food can spawn under the snake late-game** | `rndFree()` gives up after 400 attempts and returns a random (possibly occupied) cell → food can appear inside the body → unwinnable soft-lock. Track free cells properly (or build a free-cell list) and add a **win screen** if the board is ever filled. |
| 1.4 | **Stacked flash timers** | `flash()` creates `setInterval`s nobody tracks; a bomb hit during a game-over flash stacks intervals fighting over `opacity`. Track and clear the previous timer (or move flash logic into the render loop). |
| 1.5 | **First swipe ignored / start friction** | After Game Over you must open ☰ → START (5 taps). Add a big **TAP TO RESTART** button on the Game Over overlay, plus Enter/Space shortcut on desktop. |

## 🟠 Priority 2 — Game feel / "juice" (highest impact-per-effort, per research)

| # | Improvement | Detail |
|---|-------------|--------|
| 2.1 | **Sound effects (procedural, zero assets)** | Currently completely silent. Synthesize chiptune-style SFX with the Web Audio API (square/triangle oscillators): eat blip (pitch-varied ±10% to avoid fatigue), bomb explosion, heart restore arpeggio, level-up fanfare, game-over sweep, UI clicks. Lazy-init `AudioContext` on first user gesture + `resume()` to satisfy autoplay policies; add a sound on/off toggle persisted to localStorage. |
| 2.2 | **Screen shake** | "Highest impact, lowest effort" juice technique. Small exponentially-decaying shake (4–6 px, ~0.15 s) on bomb hit and game over; gentler pulse on level-up. |
| 2.3 | **Particles** | Canvas particle bursts: green sparks when eating a bug, cyan burst for the rare gem, orange embers + debris for bombs, trail particles behind the head. Self-cleaning pool, ~20–40 particles/event — trivial cost at this scale. |
| 2.4 | **Hit-stop + damage flash** | 2–3 frame freeze on bomb hit before the shake, plus a brief red vignette instead of the current whole-canvas `opacity` blink (which also flashes the HUD-less canvas only — a red overlay is more readable). |
| 2.5 | **Squash & stretch / pop animations** | Food "pops" when eaten (scale up + fade), snake head squash on turns, score number pop near the eat point ("+20" floating text), heart HUD pulses when restored. |
| 2.6 | **Respect `prefers-reduced-motion`** | Gate shake/particles/flashing behind a `matchMedia('(prefers-reduced-motion: reduce)')` check (and the sound toggle). Recommended by accessibility guidance since heavy flash/shake can cause discomfort. |

## 🟡 Priority 3 — Engine upgrades (enables everything else)

| # | Improvement | Detail |
|---|-------------|--------|
| 3.1 | **Replace `setInterval` with rAF + fixed-timestep accumulator** | `setInterval` drifts, is throttled in background tabs, and is decoupled from vsync. A rAF loop with an accumulator (cap ~5 catch-up steps) makes movement consistent on 60/90/120 Hz devices and gives us a per-frame render hook needed for smooth movement, particles, and shake. |
| 3.2 | **Smooth interpolated movement** | Snake currently teleports cell-to-cell. With the rAF loop, render each segment interpolated between its previous and current grid cell → the single biggest visual upgrade for a snake game. (Keep `image-rendering: pixelated` vibe or go smooth — optional style toggle.) |
| 3.3 | **HiDPI-crisp fullscreen canvas** | `fsCanvas` is sized in CSS pixels, so on 2×/3× phones the grid pixels are non-uniform and mushy. Size backing store by `devicePixelRatio` and snap the cell size to whole device pixels for crisp, even retro pixels. |
| 3.4 | **Guard the level-up overlay timer** | `lut` ticks are consumed inside `step()`; if the player pauses mid-level-up the overlay lifetime is tied to game ticks. Move cosmetic timers (overlay, rare-gem blink, bomb fuse visuals) to wall-clock time in the render loop so pause truly freezes everything. |

## 🟢 Priority 4 — Gameplay depth (design decisions — your call)

| # | Idea | Detail |
|---|------|--------|
| 4.1 | **Lean into the "Chrono" theme — time mechanics** | The name promises time play that the game doesn't deliver. Ideas: ⏳ **slow-time power-up** (everything 50% speed for 5 s — pairs beautifully with the speed ramp), 💫 **temporal shield** (survive one bomb/self-bite, snake flickers), ⏪ **rewind** (spend a heart to undo the last ~8 moves after a crash instead of instant death). |
| 4.2 | **Endless mode after Level 9** | Stats cap at level 9 (`lc()` clamps) so difficulty plateaus. Endless mode: keep scaling speed/bombs every level with a formula, and show "LV 10, 11, 12…" — gives skilled players a reason to continue. |
| 4.3 | **Difficulty selector** | Easy / Normal / Hard presets multiplying tick speed and bomb counts (stored in localStorage). Widely recommended for accessibility and retention. |
| 4.4 | **Scoring depth** | Rare gem currently only heals — add score bonus. Combo multiplier for eating bugs quickly in succession. Show bugs-eaten and time-survived on the Game Over screen. |
| 4.5 | **Win condition** | Reaching Level 9 currently loops forever with no acknowledgment. Add a "you beat Chrono Snake" victory screen (then offer Endless). |

## 🔵 Priority 5 — Platform & polish

| # | Improvement | Detail |
|---|-------------|--------|
| 5.1 | **PWA installability** | Add `manifest.json` + icon + minimal service worker (`sw.js`, cache-first for the single file) → installable on home screen, works offline, fullscreen standalone on Android/iOS. Fits the "phone" framing of the UI perfectly. Requires lifting CSP `connect-src 'none'` → keep it `'self'` for the SW. |
| 5.2 | **Haptic feedback** | `navigator.vibrate(20)` on eat, `(80)` on bomb hit — free immersion on Android; no-op on iOS. Gate behind the same settings toggle. |
| 5.3 | **Share your score** | Web Share API button on Game Over ("I scored 480 on Chrono Snake — beat that!") with clipboard fallback. Works within current CSP (no network calls). |
| 5.4 | **Font loading** | `@import` in CSS blocks first paint and is the slowest load path. Switch to `<link rel="preconnect">` + `<link rel="preload">` with `font-display: swap`. |
| 5.5 | **Menu accessibility** | Menu items are `<div>`s — add `role="button"`, `tabindex`, and Enter/Space handling; label the icon-only buttons with `aria-label`s. |
| 5.6 | **README/docs update** | After implementation, update README (new features, controls, credits) and bump the gameplay tables. |

---

## Suggested implementation order

1. **Batch A — Engine & fixes** (1.1–1.5, 3.1, 3.4): invisible but foundational; rAF loop lands first since juice hangs off it.
2. **Batch B — Juice** (2.1–2.6, 3.2, 3.3): sound, shake, particles, smooth movement, HiDPI.
3. **Batch C — Gameplay** (4.1–4.5): chrono power-ups, endless, difficulty, scoring, win screen.
4. **Batch D — Platform** (5.1–5.6): PWA, haptics, share, a11y, docs.

*Constraint worth keeping: the repo markets itself as a **single HTML file, no build step**. Everything in Batches A–C can stay single-file; Batch D adds 3 tiny static files (`manifest.json`, `sw.js`, icons) which keeps the no-build promise.*

---

## Implementation status

| Batch | Items | Status |
|-------|-------|--------|
| A — Engine & fixes | 1.1 auto-pause · 1.2 input queue · 1.3 exact free-cell spawn (+PERFECT win) · 1.4 flash timers removed (vignette in render loop) · 1.5 tap-to-restart/Enter | ✅ |
| B — Juice | 2.1 Web Audio SFX + toggle · 2.2 screen shake · 2.3 particles · 2.4 hit-stop + red vignette · 2.5 pop/float animations · 2.6 `prefers-reduced-motion` | ✅ |
| C — Engine upgrades | 3.1 rAF fixed-timestep loop · 3.2 smooth interpolated movement (wrap-aware) · 3.3 HiDPI crisp canvas · 3.4 wall-clock cosmetics (overlay via ticks kept; pause-safe loop) | ✅ |
| D — Gameplay | 4.1 chrono powers ⏳/🛡/⏪ (all three) · 4.2 endless mode 10+ · 4.3 difficulty presets · 4.4 combos, gem bonus, Game Over stats · 4.5 victory screen | ✅ |
| E — Platform | 5.1 PWA (manifest + sw + icons) · 5.2 haptics · 5.3 share score · 5.4 font `preconnect` (swapped `@import`) · 5.5 menu a11y roles/keys · 5.6 README updated | ✅ |

**Verified by 30 headless jsdom assertions** (`scratch/test.cjs`): boot, eating/combos/SFX hooks, input queue & reversal rejection, bomb/shield/rewind fatality paths, self-bite rules, slow-time window, auto-pause (visibility + blur), victory → endless, difficulty scaling, menu pause semantics, share fallback, frame-loop accumulation, hitstop, render save/restore balance, 500-tick fuzz with zero errors.

