# 🎓 Adithya - 3D AI Student Portfolio Website

An interactive, futuristic student portfolio website crafted with **HTML5**, modern **Glassmorphism CSS3**, and **Three.js (WebGL)**. It features an interactive **3D Student Avatar Guide** that tracks scrolling, changes gestures, and explains each section with synthetic audio HUD speech feedback.

---

## ✨ Features

- **🤖 Interactive 3D Student Guide**:
  - Procedurally modeled stylized student avatar with graduation cap, cyber visor, glowing eyes, articulated waving/pointing arms, and an orbiting companion drone.
  - Dynamically updates position, rotation, and pose as you scroll through different sections (*Hero, About, Skills, Projects, Terminal, Learning Journey, Contact*).
  - Head and eyes track your mouse cursor in real-time.
- **💬 Real-Time HUD Speech Bubble**:
  - Displays dynamic commentary for each section with smooth typewriter text animation.
  - Interactive Web Audio sound synthesis produces high-tech audio blips.
  - Sound FX mute toggle and minimize/expand buttons.
- **⚡ Modern Cyber Glassmorphism UI**:
  - Dark cyber aesthetic with neon cyan (`#00f0ff`), deep violet (`#8c52ff`), and emerald accents.
  - Backdrop-filter blur cards, glowing borders, and responsive grid layouts.
- **💻 Interactive AI CLI Terminal**:
  - Built-in retro-modern terminal shell supporting commands like `help`, `about`, `skills`, `projects`, `quote`, `matrix`, `contact`, and `clear`.
  - Command history navigation with `↑` and `↓` arrow keys.
- **🚀 Featured Projects & Skills Matrix**:
  - Interactive project showcase with 3D hover effects.
  - Categorized skill bars with automated viewport reveal animations.
- **📬 Functional Contact Section**:
  - Modern form with validation, submit state, and celebratory confetti effects.
  - 1-click "Copy Email" button with instant clipboard feedback.

---

## 📁 Project Structure

```
C:\Develop\My_Second_Project\ai-website/
├── index.html           # Main semantic HTML structure & sections
├── README.md            # Project documentation & instructions
├── css/
│   └── style.css        # Responsive cyber-glass styling & animations
├── js/
│   ├── three-scene.js   # Three.js scene, lighting & particle starfield
│   ├── student-guide.js # 3D Avatar model, rigging, scroll keyframes & HUD
│   └── main.js          # AI terminal logic, UI handlers & form interactions
└── assets/              # Static media & assets directory
```

---

## 🚀 How to Run Locally

### Option 1: Direct Browser Launch
Simply double-click `index.html` or open `C:\Develop\My_Second_Project\ai-website\index.html` in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: Local Web Server (Recommended)
You can start a local development server using Python:

```bash
cd C:\Develop\My_Second_Project\ai-website
python -m http.server 8080
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🛠️ Customization Guide

1. **Changing Details**: Open `index.html` to update text, project descriptions, or links.
2. **Avatar Dialog & Sections**: Edit `js/student-guide.js` inside the `sectionTransforms` object to modify avatar commentary or add new poses.
3. **Terminal Commands**: Open `js/main.js` inside the `commands` object to add custom terminal commands or easter eggs.
4. **Styling & Colors**: Adjust CSS variables at the top of `css/style.css`.
