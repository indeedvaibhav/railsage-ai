# 🚂 RailSage AI

> **Autonomous Railway Operations Assistant** powered by Claude AI  
> Built for the **FAR AWAY Hackathon 2026**

![RailSage AI](https://img.shields.io/badge/Status-Live-34d399?style=flat-square) ![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square) ![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square) ![Claude AI](https://img.shields.io/badge/Claude-AI-ff6b35?style=flat-square)

---

## Overview

RailSage AI is a next-generation railway operations command center that autonomously monitors, reasons about, and responds to disruptions across India's railway network. It combines real-time train telemetry, weather data, and AI-powered reasoning to provide instant rerouting decisions, multilingual passenger announcements, and predictive maintenance alerts.

The system features a cinematic landing experience that transitions into a full-featured operations dashboard with three coordinated panels: Network Map, AI Reasoning Feed, and Multilingual Announcements.

---

## ✨ Features

### Cinematic Landing Page
- Full-screen hero image with smooth zoom animation
- Film grain texture overlay for cinematic feel
- Particle dissolve transition to dashboard
- Ambient sound design with low-frequency rumble
- Skip intro button for instant access

### Operations Dashboard
- **3-Column Command Center** — Map | AI Feed | Announcements
- **Live Clock** with IST / JST / UTC timezone toggles
- **AI Agent Status** with real-time monitoring pulse
- **4 KPI Metric Cards** with count-up animation on load

### Network Map (Leaflet)
- Dark-themed India railway map with CARTO tiles
- Color-coded train position dots (green/yellow/red)
- Clickable train markers with rich popup cards
- Route polylines for selected train tracking
- Signal fault badge with red pulse indicator
- Station labels with overlap prevention

### AI Reasoning Feed
- 9-step reasoning sequence with step numbers
- Blinking cursor on active reasoning step
- Green checkmarks on completed steps
- Auto-scroll to latest step
- Real-time timestamps on each step

### Scenario Simulator
- 4 trigger buttons: Signal Failure, Cyclone Warning, Track Block, Crowd Surge
- Each scenario generates unique 9-step reasoning sequence
- Active scenario highlights in red
- Triggers new announcements and maintenance tickets

### Incident Card
- Live incident status (ACTIVE / RESOLVED)
- APPROVE button to confirm AI recommendation
- OVERRIDE button with text input for operator alternative
- Color-coded status badges

### Multilingual Announcements
- English, Hindi (Devanagari), and Japanese (Keigo) announcements
- BROADCAST button → SENT state with green tick
- Hover border glow matching flag color
- Updates dynamically per scenario

### Train List & Detail Panel
- 5 active trains with clickable selection
- Cyan left border highlight on selected train
- Color-coded delays (red >30min, yellow <30min, green on-time)
- 6 detail boxes updating on train selection
- Maintenance ticket modal on ticket number click

### Responsive Design
- Full 3-column layout on desktop
- Bottom tab bar on mobile (<768px) switching between Map, AI Feed, Announcements
- All panels adapt to screen size without breaking

### Visual Polish
- Faint scanline animation (opacity 0.03, old monitor feel)
- Consistent panel borders (#1C2744)
- Film grain texture on landing page
- All animations use transform/opacity for 60fps performance

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8 |
| Styling | Tailwind CSS 4, Vanilla CSS |
| Animation | GSAP 3, Framer Motion 12 |
| Maps | Leaflet 1.9, React Leaflet 5 |
| AI | Anthropic Claude API (via backend) |
| Backend | Node.js, Express 5 |
| APIs | IRCTC (via RapidAPI), Open-Meteo Weather |
| Fonts | Inter, Bebas Neue, Noto Sans Devanagari, Noto Sans JP |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- npm 9+
- Anthropic API key (for AI chat)
- RapidAPI key (for train data)

### Setup

```bash
# Clone the repository
git clone https://github.com/indeedvaibhav/railsage-ai.git
cd railsage-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# Start the backend server
npm run server

# In another terminal, start the frontend
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

```
ANTHROPIC_API_KEY=your-anthropic-api-key
WEATHER_API_KEY=your-openweathermap-api-key
RAILWAY_API_KEY=your-rapidapi-key
```

---

## 📁 Project Structure

```
railsage-ai/
├── public/
│   ├── train-mountain.jpg    # Hero image
│   ├── favicon.svg           # App icon
│   └── icons.svg             # UI icons
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx         # Cinematic intro
│   │   ├── Dashboard.jsx           # 3-column layout
│   │   ├── TopBar.jsx              # Search + branding
│   │   ├── DashboardStatusBar.jsx  # Clock + metrics
│   │   ├── TrainMap.jsx            # Leaflet map
│   │   ├── AgentReasoningFeed.jsx  # 9-step AI feed
│   │   ├── IncidentCard.jsx        # Approve/Override
│   │   ├── ScenarioSimulator.jsx   # 4 scenario triggers
│   │   ├── AnnouncementsPanel.jsx  # Multilingual alerts
│   │   ├── TrainListPanel.jsx      # 5 train list
│   │   ├── TrainDetailPanel.jsx    # 6 detail boxes
│   │   ├── MaintenanceTicketModal.jsx
│   │   ├── MobileTabBar.jsx        # Mobile navigation
│   │   ├── ChatPanel.jsx           # AI chat interface
│   │   └── ...
│   ├── contexts/
│   │   ├── AgentContext.jsx        # Scenario + incident state
│   │   ├── TrainContext.jsx        # Train data + selection
│   │   └── LanguageContext.jsx     # i18n (EN/HI/JA)
│   ├── data/
│   │   ├── trainData.js            # Mock train database
│   │   ├── disruptions.js          # Active disruptions
│   │   ├── stationData.js          # Station metadata
│   │   ├── translations.js         # i18n strings
│   │   └── bootstrapData.js        # Initial dashboard data
│   ├── services/
│   │   ├── trainService.js         # Train API integration
│   │   └── chatService.js          # Claude AI integration
│   ├── utils/
│   │   └── particleScatter.js      # Landing page particles
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                   # Full design system
├── server.js                       # Express API proxy
├── .env.example
├── package.json
└── README.md
```

---

## 🏆 Hackathon Context

**FAR AWAY Hackathon 2026** — Theme: *Autonomous Systems for Public Infrastructure*

RailSage AI demonstrates how autonomous AI agents can transform railway operations by:
1. **Monitoring** — Continuous scanning of train positions, delays, and weather
2. **Reasoning** — Multi-step AI analysis of disruptions and cascade impacts
3. **Acting** — Automated rerouting, announcements, and maintenance dispatch
4. **Transparency** — Full reasoning feed visible to human operators
5. **Multilingual** — Serving India's diverse passenger base in 3 languages

---

## 📸 Demo

*Screenshot placeholder — replace with actual screenshot*

---

## 👤 Author

**Vaibhav** — [@indeedvaibhav](https://github.com/indeedvaibhav)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

<!-- Update README with feature list -->

<!-- Add setup instructions to README -->
