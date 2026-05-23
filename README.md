# 🎞️ MEHDI HASSAN // PORTFOLIO ENGINE // KCH-LDN

Welcome to the encrypted core code of Mehdi Hassan's cinematic, high-performance, dark-noir developer portfolio. 

Designed for ultimate visual immersion, procedural audio feedback, and locked **60fps performance**, this architecture transitions a legacy monolithic prototype into an elite, build-less, and modular web application.

---

## ⚡ Architectural Blueprint (Native ES Modules)

The portfolio is engineered using pure separation of concerns and runs natively in the browser via ES Modules, completely avoiding complex bundling steps (Vite/Webpack) for ultra-fast maintenance:

```
mehdi-portfolio/
├── index.html               # Semantic HTML5 shell, JSON-LD Schema, & inline SVG Favicon
├── style.css                # ITCSS styles with modern layout containment
├── robots.txt               # Crawler controls with Agentic SEO directives
├── ai.txt                   # Dedicated plain-text profile digest for LLM agents
├── og-preview.png           # Cinematic link sharing preview card
├── resume.html              # High-contrast, printable resume blueprints
└── src/                     # Core JavaScript (Native ESM)
    ├── bootstrap.js         # Bootloader and event wire-up orchestrator
    ├── components/
    │   ├── AudioEngine.js   # Procedural Web Audio synthesizer (GC optimized)
    │   ├── VisualEngine.js  # GPU cursor trails, lens blurs, and scrolling reels
    │   ├── ConsoleCore.js   # Timezone clocks, climate hovers, and terminals
    │   └── FormHandler.js   # Secure EmailJS transmission controller
    └── utils/
        ├── EventBus.js      # Decoupled Pub-Sub event broker
        └── Helpers.js       # requestAnimationFrame throttlers & DOM caches
```

---

## 🎨 Premium Features & Cinematic Physics

### 1. Zero-Footprint Web Audio Synthesizer
* **Ambient Breathing Space Hum**: Detuned deep sine waves (55Hz / 55.4Hz) with a slow triangle oscillator filtered sweep (120Hz cutoff) modulated by an LFO to simulate organic breathing.
* **Tactile Mechanical UI Ticks**: Ultra-short 20ms pitch-decayed oscillator burst mixed with high-passed noise crackles to deliver instant, tangible feedback on hovering interactives.
* **Dynamic Transition Swooshes**: Clean bandpass-filtered noise sweeps triggered on section transitions.
* **Aperiodic Analog CRT Noise**: An analog television static hiss that fades in during idle intervals.

### 2. High-Performance GPU Compositing & Paint Containment
* **Zero Reflow/Layout Cycles**: Cursors, parallax, and lens offsets are compiled to run via GPU compositing (`transform: translate3d(x, y, 0)`) to eliminate Layout/Paint cycles on the CPU.
* **Layout containment (`content-visibility: auto`)**: Applied onto offscreen section trees. This instructs the browser to skip layout calculations for elements outside the viewport, yielding significant Core Web Vitals (LCP and INP) performance gains.
* **RAF Throttlers**: High-frequency mouse movement and scrollSnap vectors are throttled using custom requestAnimationFrame schedulers.

### 3. Sat-Link Form Submission & Double-Redundant Clear
* Operates client-side using the official `@emailjs/browser` SDK.
* Integrates a **double-redundant inputs clearing routine** (`form.reset()` coupled with manual input field value clearing) upon success to fully prevent message submission loops.
* Fires an automated confirmer confirmations auto-reply in the background.

---

## 🔒 Security & Compliance Overwatch

* **GDPR Compliance (100% airtight)**: Collects zero tracking cookies or marketing telemetry. Features a beautifully styled monospace data privacy notice inside the transmission panel declaring that Name and Email parameters are processed solely to respond to contact requests. Exempts the site from annoying cookie consent popups!
* **HIPAA Compliance (Non-applicable)**: Does not store or process Protected Health Information (PHI).
* **WCAG 2.2 Accessibility (Audited AA)**: Complete screen-reader layout overwatch, semantic document outline flow, and custom dynamic focus states for dial controls.

---

## 🤖 Agentic SEO & Search Optimization (ai.txt)

* **JSON-LD Schema**: Injected standard Person structure metadata for indexing optimization.
* **robots.txt Crawler Rules**: Explicitly opens crawling paths for leading AI search engines (Gemini, Claude, GPTBot, Perplexity) to index credentials for recruitment queries.
* **ai.txt Profile Digest**: A state-of-the-art plain-text profile index at the root directory listing skills, education, projects, and contacts, allowing LLM recruitment agents to instantly ingest Mehdi's portfolio!

---

## 🔑 Secret Easter Eggs

* **Timeline sunset transit sequence**: Typing `kch2ldn` anywhere on your keyboard (or double-tapping the navbar transit link, or triple-tapping the screen on mobile devices) triggers a cinematic full-screen sunset transit cross-fading Kochi's warm dusk skyline into London's rainy midnight.
* **20s TV Static Screen**: Left idle for 20 seconds, the viewport dissolves into an analog signal-lost static glitch screen with looping CRT white noise. Pressing any key or moving the cursor heals the feed instantly.

---

## 🚀 Deployment (GitHub Actions)

The repository features an automated GitHub Actions deployment workflow at `.github/workflows/deploy.yml`. 

Whenever you push changes to your `main` branch, the workflow automatically deploys your latest portfolio live to **GitHub Pages**!
