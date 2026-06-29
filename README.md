# 🚂 RailSage AI

> **India's Smartest Railway Companion** — powered by Claude AI
> Built for the **FAR AWAY Hackathon 2026** · Theme: *Autonomous Systems for Public Infrastructure*

[![Status](https://img.shields.io/badge/Status-Live-34d399?style=flat-square)](https://railsage-ai.vercel.app)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square)](https://vitejs.dev)
[![Claude AI](https://img.shields.io/badge/Claude-AI-ff6b35?style=flat-square)](https://anthropic.com)
[![React Router](https://img.shields.io/badge/React_Router-7-ca4245?style=flat-square)](https://reactrouter.com)

🌐 **Live Demo:** [railsage-ai.vercel.app](https://railsage-ai.vercel.app)
📁 **Repository:** [github.com/indeedvaibhav/railsage-ai](https://github.com/indeedvaibhav/railsage-ai)
👥 **Team:** Aditya Dixit & Vaibhav Tripathi

---

## Overview

RailSage AI is a next-generation autonomous railway assistant that helps India's 24M+ daily passengers make smarter travel decisions. It combines real-time train telemetry, weather data, and Claude AI-powered reasoning to deliver proactive delay alerts, intelligent rerouting decisions, multilingual passenger announcements, and predictive maintenance alerts — before passengers even leave home.

The app features a **cinematic landing experience** that transitions into a **multi-page command center** with dedicated pages for live tracking, AI-powered alerts, journey planning, and a natural-language assistant.

---

## ✨ Features

### 🎬 Cinematic Landing Page
- Full-screen hero image with smooth GSAP zoom animation
- Particle dissolve transition powered by canvas rendering
- Film grain texture overlay for cinematic feel
- Ambient sound design with low-frequency rumble
- Skip intro button for instant dashboard access

### ⚡ Dashboard — Network Overview
- Live KPI cards: Active Trains, On Time %, Delayed %, Incidents
- Real-time clock with IST / JST / UTC timezone toggles
- AI Agent status with animated pulse indicator
- Active disruption alert banner
- Quick-action cards linking to all pages
- Top 4 active trains with one-tap navigation to Tracker

### 🗺️ Tracker — Live Train Map
- Dark-themed India railway map (Leaflet + CARTO tiles)
- Color-coded train position dots (green / yellow / red)
- Clickable train markers with rich popup cards
- Route polylines for selected train
- Signal fault badge with red pulse indicator
- Full train list + 6-field detail panel side-by-side

### ⚠️ Alerts — AI Operations Center
- **Scenario Simulator** — 4 triggers: Signal Failure, Cyclone Warning, Track Block, Crowd Surge
- **AI Reasoning Feed** — 9-step autonomous reasoning with live timestamps, blinking cursor on active step, green checkmarks on completed steps
- **Incident Card** — APPROVE or OVERRIDE AI recommendations with operator input
- **Multilingual Announcements** — English, Hindi (Devanagari), Japanese (Keigo) — updated per scenario
- Maintenance ticket modal (MTX-XXXX) auto-raised by AI agent
- Active disruption banner with severity levels

### 🧭 Journey Planner
- Origin → Destination input with date selection
- AI-powered route suggestions *(coming soon)*
- Designed for door-to-door journey planning

### 💬 Chat — Ask RailSage
- Full-page natural language assistant powered by Claude API
- Ask anything: train status, delays, alternatives, platform info
- Quick-action chips: Check train status, Plan a journey, Find alternatives
- Multilingual responses (EN / HI / JA)

### ⚙️ Settings
- Language toggle: English, हिंदी, 日本語
- App info and team credits

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4, Vanilla CSS |
| Animation | GSAP 3, Framer Motion 12 |
| Maps | Leaflet 1.9, React Leaflet 5 |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Backend | Node.js, Express 5 |
| External APIs | IRCTC via RapidAPI, Open-Meteo Weather |
| Fonts | Inter, Bebas Neue, Noto Sans Devanagari, Noto Sans JP |
| Deploy | Vercel (frontend), Node.js server |

---

## 📁 Project Structure

```
railsage-ai/
├── public/
│   ├── train-mountain.jpg          # Hero image
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx         # Cinematic intro with GSAP + particles
│   │   ├── Navbar.jsx              # Top navigation bar (desktop)
│   │   ├── MobileTabBar.jsx        # Bottom tab bar (mobile)
│   │   ├── Dashboard.jsx           # Overview: KPIs + quick actions + train summary
│   │   ├── DashboardStatusBar.jsx  # Live clock + metrics + agent status
│   │   ├── DisruptionBanner.jsx    # Active alert banner
│   │   ├── TrainMap.jsx            # Leaflet map with live train positions
│   │   ├── TrainListPanel.jsx      # Scrollable list of active trains
│   │   ├── TrainDetailPanel.jsx    # 6-field detail view for selected train
│   │   ├── AgentReasoningFeed.jsx  # 9-step AI reasoning with animations
│   │   ├── IncidentCard.jsx        # Approve / Override incident handler
│   │   ├── ScenarioSimulator.jsx   # 4 disruption scenario triggers
│   │   ├── AnnouncementsPanel.jsx  # EN / HI / JA multilingual broadcasts
│   │   ├── ChatPanel.jsx           # Full-page Claude AI chat interface
│   │   ├── MaintenanceTicketModal.jsx
│   │   └── ChatMessage.jsx
│   ├── layouts/
│   │   └── AppLayout.jsx           # Shared layout: Navbar + Outlet + MobileTabBar
│   ├── pages/
│   │   ├── DashboardPage.jsx       # /dashboard
│   │   ├── TrackerPage.jsx         # /tracker
│   │   ├── AlertsPage.jsx          # /alerts
│   │   ├── ChatPage.jsx            # /chat
│   │   ├── JourneyPage.jsx         # /journey
│   │   └── SettingsPage.jsx        # /settings
│   ├── contexts/
│   │   ├── AgentContext.jsx        # Scenario + incident + metrics state
│   │   ├── TrainContext.jsx        # Train data + selection state
│   │   └── LanguageContext.jsx     # i18n (EN / HI / JA)
│   ├── data/
│   │   ├── trainData.js            # Mock train database
│   │   ├── disruptions.js          # Active disruptions
│   │   ├── stationData.js          # Station metadata
│   │   ├── translations.js         # i18n strings
│   │   └── bootstrapData.js        # Seed data for initial render
│   ├── services/
│   │   ├── trainService.js         # IRCTC + Open-Meteo API integration
│   │   └── chatService.js          # Claude API integration
│   ├── utils/
│   │   └── particleScatter.js      # Canvas particle animation for landing
│   ├── App.jsx                     # Route definitions
│   ├── main.jsx                    # BrowserRouter entry point
│   └── index.css                   # Full design system + CSS variables
├── server.js                       # Express API proxy (keeps keys server-side)
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- npm 9+
- Anthropic API key (for AI chat)
- RapidAPI key (for IRCTC train data)

### Setup

```bash
# Clone the repository
git clone https://github.com/indeedvaibhav/railsage-ai.git
cd railsage-ai

# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env
# Edit .env with your API keys

# Terminal 1 — Start the backend proxy
npm run server

# Terminal 2 — Start the frontend
npm run dev
```

App runs at `http://localhost:5173`

### Environment Variables

```env
ANTHROPIC_API_KEY=your-anthropic-api-key
WEATHER_API_KEY=your-openweathermap-api-key
RAILWAY_API_KEY=your-rapidapi-key
```

### Routes

| Route | Page |
|---|---|
| `/` | Landing page (cinematic intro) |
| `/dashboard` | Network overview |
| `/tracker` | Live train map + list |
| `/alerts` | AI reasoning + incidents |
| `/journey` | Journey planner |
| `/chat` | Ask RailSage (Claude AI) |
| `/settings` | Language + preferences |

---

## 🏆 Hackathon Context

**FAR AWAY Hackathon 2026** — Theme: *Autonomous Systems for Public Infrastructure*

RailSage AI demonstrates a full **Monitor → Reason → Act → Explain** loop for autonomous railway operations:

1. **Monitor** — Continuous scanning of 847+ active trains, delays, and weather across all zones
2. **Reason** — Multi-step Claude AI analysis of disruptions and cascade impacts (9-step feed)
3. **Act** — Automated rerouting decisions, multilingual passenger announcements, maintenance dispatch
4. **Explain** — Full reasoning chain visible to human operators with Approve / Override control
5. **Multilingual** — Serving India's diverse passenger base in English, Hindi, and Japanese

### The Problem We're Solving

> 24M+ daily Indian Railways passengers have zero proactive intelligence. They learn of delays after leaving home, get no AI-powered recommendations, and must piece together information from a dozen fragmented sources.

RailSage flips this: **Know Before You Go.**

---

## 📸 Screenshots

| Page | Description |
|---|---|
| Landing | Cinematic hero with particle dissolve |
| Dashboard | KPI overview + quick actions + active trains |
| Tracker | Live map + train list + detail panel |
| Alerts | AI reasoning feed + incident card + announcements |
| Chat | Full-page Claude AI assistant |

---

## 👥 Team

| Name | GitHub |
|---|---|
| Vaibhav Tripathi | [@indeedvaibhav](https://github.com/indeedvaibhav) |
| Aditya Dixit | — |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
