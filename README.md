# 🐂 TypingBull

<p align="center">
  <img src="public/favicon.svg" alt="TypingBull Logo" width="96" height="96" />
</p>

<p align="center">
  <strong>Next-Gen Gamified Touch Typing Platform with Real-Time Multiplayer, 3D Virtual Hands, Classroom Lab & AI Tutor</strong>
</p>

<p align="center">
  <a href="https://github.com/RishabhDev817/TypingBull"><img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://github.com/RishabhDev817/TypingBull"><img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://github.com/RishabhDev817/TypingBull"><img src="https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://github.com/RishabhDev817/TypingBull"><img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" /></a>
  <a href="https://github.com/RishabhDev817/TypingBull"><img src="https://img.shields.io/badge/Three.js-3D_Hands-black?logo=three.js&logoColor=white" alt="Three.js" /></a>
  <a href="https://github.com/RishabhDev817/TypingBull"><img src="https://img.shields.io/badge/Cloudflare-Workers_%26_Durable_Objects-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare" /></a>
  <a href="https://github.com/RishabhDev817/TypingBull"><img src="https://img.shields.io/badge/i18n-9_Languages-blue" alt="i18n Supported" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" /></a>
</p>

---

## 📖 Overview

**TypingBull** is a high-performance, immersive touch-typing platform built from the ground up to make typing mastery captivating, pedagogically sound, and competitively exciting.

Moving beyond dry, monotone typing drills, TypingBull integrates:
- **Real-Time Multiplayer Speedway** powered by Cloudflare Durable Objects.
- **TypingBull Classroom Lab** for schools and computer labs with live teacher monitoring.
- **BullBot AI Tutor** driven by Google Gemini for keystroke diagnostics and targeted drill generation.
- **Interactive 3D Virtual Hands & Keyboard** for authentic touch-typing ergonomics.
- **Phaser & Three.js Gamified Arcade Modes** for typists of all ages.
- **Universal 9-Language Localization (i18n)**, viral glassmorphic score cards, and rich feedback loops.

---

## ✨ Key Features & What's New

### 🏎️ Real-Time Multiplayer Speedway (Practice Ground)
- **Live Head-to-Head Racing**: Compete in real-time against live human typists or intelligent AI challenger bots across custom lobbies or quick-match queues.
- **Edge-Powered WebSockets**: Ultra-low latency state synchronization utilizing Cloudflare Workers & Durable Objects (with a standalone Node.js fallback server).
- **Anti-Cheat & Result Validation**: Server-side keystroke cadence verification, pacing checks, and completion validation to ensure fair competition.
- **Race Telemetry & Podiums**: Live raceway progress bars, real-time WPM feeds, dynamic car placement, and post-race winner podiums.
- **Instant Invite Links**: Shareable room links (`?room=ROOM_CODE`) supporting spectator and racer modes.

### 🏫 TypingBull Classroom Mode (For Schools & Labs)
- **Zero-Account Setup**: Privacy-first, COPPA/FERPA-compliant architecture requiring no student accounts, emails, or passwords.
- **Teacher Live Control Center**:
  - Launch rooms instantly with 6-character access codes.
  - Choose from curated curriculum passages or input custom assignments.
  - Live synchronized countdowns and test starts.
  - Real-time student progress dashboard (WPM, accuracy %, errors, active position, completion status).
  - One-click student moderation (kick/ban) and detailed end-of-session grade books.
- **Student Experience**:
  - Instant join with room code and display name.
  - Fun animal avatar selection (Bull, Fox, Owl, Panda, Lion, Falcon, etc.).
  - Distraction-free synchronized typing canvas with instant accuracy feedback.
  - Post-test scorecards and performance summaries.

### 🤖 BullBot AI Tutor (Google Gemini)
- **Intelligent Cadence Diagnostics**: Analyzes typing flow to detect hesitation spikes, finger fatigue, and troublesome bigrams/trigrams.
- **Weak-Key Remediation**: Identifies problematic key clusters and dynamically generates custom practice drills to rewire muscle memory.
- **Comprehensive AI Tutor Reports**: Generates deep diagnostic evaluations, encouraging advice, and milestone badges.
- **Resilient Fallback**: Automatic failover between Gemini models, rate-limit resilience, and input sanitization.

### 🖐️ Interactive 3D Virtual Hands & Keyboard
- **Anatomical Touch-Typing Guides**: Translucent 3D hands overlay showing optimal finger placement (home row resting positions, reach angles, and thumb spacebar handling).
- **Dynamic Key Animations**: Real-time 3D key depression with tactile audio feedback powered by Howler.js.
- **Ergonomic Customization**: Switchable skin tones, hand transparency toggles, and visual finger-to-key color coding.

### 🎮 Arcade Mini-Games Hub
- **Lilypad Leap**: A vibrant, educational river hopping adventure tailored for young typists and beginners—hop across water lilies by typing target words accurately before they submerge.
- **Neon Velocity**: A high-cadence synthwave cyber-highway runner built with Phaser—dodge traffic and shift lanes through raw typing velocity.

### 📈 Structured Curriculum & Custom Drills
- **Progressive Learning Path**: Modular stations from Home Row fundamentals, Upper & Bottom rows, to Numbers, Symbols, Punctuation, and Capitalization.
- **Interactive Train Map**: Visual chapter map with station milestones, star ratings, and unlockable achievements.
- **Flexible Practice Suite**: Timed tests (15s, 30s, 60s, 120s), word count goals, custom text drill uploads, and streak tracking.

### 🌍 Dynamic 9-Language Localization (i18n)
TypingBull is fully translated and localized across 9 major languages:
- 🇺🇸 **English** (`en`)
- 🇪🇸 **Spanish** (`es`)
- 🇯🇵 **Japanese** (`ja`)
- 🇫🇷 **French** (`fr`)
- 🇩🇪 **German** (`de`)
- 🇧🇷 **Portuguese** (`pt`)
- 🇰🇷 **Korean** (`ko`)
- 🇮🇹 **Italian** (`it`)
- 🇮🇳 **Hindi** (`hi`)

*Includes fully localized navigation, lessons, practice texts, games, feedback modals, and legal pages.*

### 📸 Viral Glassmorphic Score Sharing
- **1-Click Shareable Cards**: Generates high-resolution branded glassmorphic score cards on an HTML5 canvas (`html-to-image`).
- **Universal Social Sharing**: Direct sharing to X (Twitter), WhatsApp, LinkedIn, Web Share API, and one-click image download / clipboard copy.
- **Tiered Badges**: Custom ranking badges (Typing Prodigy, Speed Demon, Swift Typist, Steady Typer) based on verified WPM and accuracy metrics.

### 📬 Built-in User Feedback & Resend Integration
- Integrated in-app Feedback & Review modal for feature requests, bug reports, and ratings.
- Cloudflare Pages serverless function (`functions/api/feedback.ts`) connected to **Resend** for instant HTML alert emails to maintainers.

### ⚡ Enterprise SEO & Performance
- **React 19 Code-Splitting**: Route-level lazy loading (`React.lazy` + `Suspense`) for sub-second First Contentful Paint.
- **Google Search Central Compliant**: Multi-resolution SVG/ICO favicon suite, 1200x630 OpenGraph cards, JSON-LD structured schemas, dynamic XML sitemaps with XSL styling, and strict H1 semantic hierarchy.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript 6, Vite 8 |
| **Styling & Design System** | Tailwind CSS v4, Framer Motion 13, GSAP 3 |
| **3D & Game Engines** | Three.js, Phaser 4, Howler.js |
| **Real-Time Networking** | Cloudflare Workers, Durable Objects, Node.js `ws` |
| **AI & LLM Services** | Google Gemini (`@google/generative-ai`) |
| **Serverless & Emails** | Cloudflare Pages Functions, Resend API |
| **Icons & Media** | Lucide React, HTML-to-Image |
| **Linting & Code Quality**| Oxlint, TypeScript strict mode |

---

## 📁 Project Structure

```text
TypingBull/
├── functions/                     # Cloudflare Pages Serverless Functions
│   └── api/
│       └── feedback.ts            # Resend email feedback dispatcher
├── public/                        # Static assets, favicons, sitemaps, robots.txt
│   ├── assets/                    # High-res logos & OpenGraph images
│   ├── audio/                     # Keystroke & game sound effects
│   └── videos/                    # Classroom video tutorials & posters
├── server/                        # Standalone WebSocket & API servers
│   ├── classroom/                 # ClassroomManager, Room state & cleanup
│   ├── multiplayer/               # Speedway room & anti-cheat ResultValidator
│   ├── standaloneClassroom.ts     # Standalone Node.js classroom server (:3002)
│   ├── standaloneMultiplayer.ts   # Standalone Node.js multiplayer server (:3001)
│   └── geminiChat.ts              # Gemini API handler & sanitization
├── src/
│   ├── components/
│   │   ├── classroom/             # Teacher/student lobbies, monitoring & typing arena
│   │   ├── educational/           # SEO pedagogical guide sections
│   │   ├── feedback/              # Native feedback modal & star ratings
│   │   ├── game/                  # Lilypad Leap & Neon Velocity games
│   │   ├── keyboard/              # 3D interactive keyboard & hand overlays
│   │   ├── navigation/            # Header, Sidebar, BottomNav, Footer
│   │   ├── practice-ground/       # Multiplayer Speedway UI & race tracks
│   │   └── social/                # Viral Score Card generator & sharing
│   ├── context/                   # React Contexts (i18n, Theme, Audio, Stats)
│   ├── data/                      # Lessons, practice corpora, classroom curricula
│   ├── engine/                    # Typing telemetry, WPM calculators & diagnostics
│   ├── hooks/                     # Custom React hooks (sockets, SEO, audio, timer)
│   ├── i18n/                      # 9-Language dictionaries and translator utilities
│   ├── pages/                     # Lazy-loaded page routes
│   │   ├── ClassroomLandingPage.tsx
│   │   ├── ClassroomPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LearnPage.tsx
│   │   ├── PlayPage.tsx
│   │   ├── PracticePage.tsx
│   │   └── RoadmapPage.tsx
│   └── App.tsx                    # Top-level routing, suspense, and layout
├── workers/
│   └── multiplayer/               # Cloudflare Worker with Durable Objects
└── vite.config.ts                 # Vite config with dev WebSocket plugins
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **pnpm**
- *(Optional)* A free **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey) for the AI Tutor.

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/RishabhDev817/TypingBull.git

# Navigate to project directory
cd TypingBull

# Install dependencies
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and configure your keys:

```env
# Google Gemini API Key for BullBot AI Tutor
GEMINI_API_KEY=your_gemini_api_key_here

# (Optional) Cloudflare / Resend keys for production feedback
# RESEND_API_KEY=re_xxxxxxxxx
```

> **Note:** TypingBull runs completely out of the box even without an API key! If no Gemini key is provided, BullBot gracefully switches to smart local heuristics.

### 3. Run Local Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> 💡 **Built-in WebSockets:** Vite dev server automatically proxies live multiplayer and classroom WebSockets (`/practice-ground-ws` and `/classroom-ws`) right out of the box!

---

## 🕹️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite development server with built-in WebSocket proxies |
| `npm run build` | Compiles TypeScript and builds production bundle into `dist/` |
| `npm run preview` | Previews production build locally with full WebSocket support |
| `npm run lint` | Runs ultra-fast Oxlint check across the codebase |
| `npm run multiplayer` | Starts standalone Node.js multiplayer server on port 3001 |
| `npm run classroom` | Starts standalone Node.js classroom server on port 3002 |
| `npm run deploy` | Builds the app and deploys to Cloudflare Pages |
| `npm run deploy:worker` | Deploys multiplayer Durable Objects to Cloudflare Workers |

---

## 🌐 Deployment

### Cloudflare Pages (Frontend & Functions)
TypingBull is fully configured for Cloudflare Pages with single-command deployments:

```bash
npm run deploy
```

Static routing redirects (`public/_redirects`), security headers (`public/_headers`), and serverless API endpoints (`functions/`) are automatically applied.

### Cloudflare Workers (Global Multiplayer & Classroom)
To deploy the edge WebSocket server:

```bash
npm run deploy:worker
```

---

## 🤝 Contributing

Contributions are warmly welcomed! Whether you want to add new typing mini-games, expand curriculum passages, contribute new language translations, or optimize keyboard layouts:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'feat: add AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/RishabhDev817">Rishabh</a> & the TypingBull Community.
</p>
