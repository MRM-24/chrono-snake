# 🐍 Chrono Snake

A retro-inspired snake game with a dark neon-green aesthetic, built as a **single HTML file** — no frameworks, no dependencies, no build step.

---

## 🌐 Live Demo

[▶ Play Chrono Snake](https://chrono-snake.vercel.app/)

---

## 🎮 Gameplay

- **Eat bugs** to grow your snake and score points
- **Walls wrap** — hit a wall and come out the other side
- **Bombs** spawn in your path — hitting one costs a heart
- **Rare glowing bug (✨)** appears briefly — eating it restores all 3 hearts (+bonus score)
- **Bite yourself** → instant death (unless you have a shield… or a rewind charge)
- Snake **speeds up** as you level up
- **3 hearts** total. Lose all three → Game Over
- **+1 heart restored** on each level up (max 3)
- **Combo multiplier** — eat bugs quickly in succession for up to ×5 score
- Clear **Level 9** to beat the game → then keep going in **Endless mode**

## ⏳ Chrono Powers

Lean into the name — three time-bending pickups spawn during play:

| Power | Effect |
|-------|--------|
| ⏳ **Slow-time** | Everything moves at ~half speed for a few seconds |
| 🛡 **Shield** | Absorbs one bomb **or** one self-bite |
| ⏪ **Rewind** | Auto-saves you from a fatal hit — time rewinds and you keep playing (stack up to ×3) |

Active powers show as glowing pips in the corner of the grid.

## 🏆 Levels

| Level | Bugs to clear | Max bombs on screen |
|-------|--------------|---------------------|
| 1 | 3 | 2 |
| 2 | 5 | 2 |
| 3 | 7 | 3 |
| 4 | 9 | 3 |
| 5 | 11 | 4 |
| 6 | 13 | 4 |
| 7 | 15 | 5 |
| 8 | 17 | 5 |
| 9 | 19 | 5 |
| 10+ | Endless — keeps accelerating | … |

Bomb lifetime gets shorter at higher levels to prevent screen clutter.

### Difficulty presets

Pick 🌱 **Easy** / ⏱️ **Normal** / 🔥 **Hard** in the ☰ menu (persisted). Hard is faster with more bombs; Easy is gentler.

## 📱 Controls

| Mode | Input |
|------|-------|
| Joystick | Drag the on-screen thumbstick |
| D-Pad | Tap the arrow buttons |
| Swipe | Swipe anywhere on the screen (always works in fullscreen) |
| Keyboard | Arrow keys / WASD · Space pause/start/restart · Enter start/restart · F fullscreen |

Switch between Joystick and D-Pad anytime from the **☰ menu**. Inputs are **queued** (up to 3 deep), so fast double-turns never drop.

## ✨ Feel & polish

- Procedural **chiptune sound effects** (Web Audio, zero assets) with a mute toggle
- **Screen shake**, hit-stop freeze frames, and a red damage vignette on impact
- **Particle bursts** for bugs, gems, bombs, and power-ups
- **Smooth sub-cell movement** with wrap-aware interpolation
- Floating score text, combo callouts, and heart restore pulses
- Honors **`prefers-reduced-motion`** and **haptic feedback** toggle (Android)

## 📲 Fullscreen & Install

- Tap **☰ → Fullscreen** for the whole screen (swipe to steer)
- **Installable as an app** — use your browser's "Add to Home Screen" / install prompt
- **Works offline** after first visit (service worker caches the game)
- **Share your score** from the Game Over screen

## 🚑 Fairness fixes baked in

- Game **auto-pauses** when the tab/app loses focus — no more off-screen deaths
- Food can **never spawn inside your body** (exact free-cell placement)
- Filling the entire grid = **PERFECT victory** screen

---

## 🛠 Tech notes

- Single `index.html`, no build step. Extras: `manifest.json`, `sw.js`, icons (PWA).
- Game loop: `requestAnimationFrame` + fixed-timestep accumulator (consistent on 60/90/120 Hz).
- Canvas is `devicePixelRatio`-aware with device-pixel-snapped cells for crisp retro pixels.
- Security headers in `vercel.json` (CSP allows `'self'` for the service worker + font CDN).
- Dev smoke tests: `scratch/test.cjs` (jsdom, outside the repo) — 30 assertions covering movement, combos, powers, rewind, victory/endless, pause, share, and rendering.
