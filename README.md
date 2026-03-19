# 🐍 Chrono Snake

A retro-inspired snake game with a dark neon-green aesthetic, built as a **single HTML file** — no frameworks, no dependencies, no build step.

---

## 🌐 Live Demo

[▶ Play Chrono Snake](https://your-project.vercel.app)

---

## 🎮 Gameplay

- **Eat bugs** to grow your snake and score points
- **Walls wrap** — hit a wall and come out the other side
- **Bombs** spawn in your path — hitting one costs a heart
- **Rare glowing bug (✨)** appears briefly — eating it restores all 3 hearts
- **Bite yourself** → instant death regardless of hearts
- Snake **speeds up** as you level up
- **3 hearts** total. Lose all three → Game Over
- **+1 heart restored** on each level up (max 3)
- Dying sends you back to **Level 1**

---

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

Bomb lifetime gets shorter at higher levels to prevent screen clutter.

---

## 📱 Controls

| Mode | Input |
|------|-------|
| Joystick | Drag the on-screen thumbstick |
| D-Pad | Tap the arrow buttons |
| Swipe | Swipe anywhere on the screen (always works in fullscreen) |
| Keyboard | Arrow keys or WASD · Space to pause · F to toggle fullscreen |

Switch between Joystick and D-Pad anytime from the **☰ menu**.

---

## 📲 Fullscreen Mode

Tap **☰ → Fullscreen** to expand the game to your entire screen. The canvas scales to fit any screen size and orientation. Swipe to steer, tap ⏸ to pause, tap ☰ to access the menu.

---

## 🛠️ Built With

- Vanilla HTML5, CSS3, JavaScript — no frameworks
- Canvas API for game rendering
- CSS custom properties + `clamp()` for responsive design
- Google Fonts — [Orbitron](https://fonts.google.com/specimen/Orbitron) + [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono)

---

## 📄 License

MIT — free to use, modify and distribute.
