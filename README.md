<div align="center">

<a href="https://github.com/Thranae/packwise">
  <img src=".github/assets/packwise-banner.svg" alt="PackWise AI Header Banner" width="100%" />
</a>

<br /><br />

[![CI Build](https://img.shields.io/github/actions/workflow/status/Thranae/packwise/ci.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI%20BUILD)](https://github.com/Thranae/packwise/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/LICENSE-MIT-2563EB?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![React 19](https://img.shields.io/badge/REACT-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite 6](https://img.shields.io/badge/VITE-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/NODE.JS-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/AI-GEMINI_2.5_FLASH-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Dexie.js](https://img.shields.io/badge/STORAGE-DEXIE_INDEXEDDB-F59E0B?style=for-the-badge&logo=databricks&logoColor=white)](https://dexie.org/)
[![Capacitor](https://img.shields.io/badge/MOBILE-CAPACITOR_8_%26_EXPO-1192EE?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![MongoDB](https://img.shields.io/badge/DATABASE-MONGODB_ATLAS-00ED64?style=for-the-badge&logo=mongodb&logoColor=black)](https://www.mongodb.com/)

<br />

<p align="center">
  <a href="https://codespaces.new/Thranae/packwise">
    <img src="https://github.com/codespaces/badge.svg" alt="Open in GitHub Codespaces" height="28" />
  </a>
  &nbsp;&nbsp;
  <a href="https://stackblitz.com/github/Thranae/packwise">
    <img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz" height="28" />
  </a>
</p>

<p align="center">
  <b>PackWise AI</b> is an enterprise-grade, offline-first autonomous travel operating system engineered for volatile real-world connectivity. Powered by a self-healing multi-LLM orchestrator, high-performance 60 FPS 3D spatial mapping, and cross-platform native execution across Web PWA, iOS, and Android.
</p>

<p align="center">
  <a href="#-system-architecture">Explore Architecture</a> •
  <a href="#-core-engineering-highlights">Key Innovations</a> •
  <a href="#-offline-first-synchronization-engine">Offline Data Layer</a> •
  <a href="#-multi-provider-ai-routing-matrix">AI Matrix</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-monorepo-structure">Repository Layout</a>
</p>

<br />

<a href="https://github.com/Thranae/packwise">
  <img src=".github/assets/app-preview.jpg" alt="PackWise Application Interface Showcase" width="100%" style="border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);" />
</a>

<br />

</div>

---

## ⚡ Architectural Paradigm Shift

Most travel applications fail travelers when they need them the most: in underground subways, transcontinental flights, and foreign countries with spotty roaming connections. Furthermore, relying on a single AI endpoint leads to catastrophic rate limits and timeouts during peak usage.

PackWise was constructed from first principles to solve these foundational issues:

| Dimension | Traditional Travel Software | PackWise Autonomous OS |
| :--- | :--- | :--- |
| **AI Reliability** | Single API point of failure (Crashes on HTTP 429/500) | Multi-LLM self-healing router with zero downtime |
| **Data Availability** | Network-dependent (Blank screens offline) | Offline-first Dexie DB with background sync |
| **Spatial Interface** | Flat, static list forms | 60 FPS Three.js globe & MapLibre GL satellite |
| **Runtime Portability** | Fragmented separate platforms | Unified monorepo: PWA, Capacitor 8, & Expo |
| **Authentication Security** | Vulnerable localStorage JWTs | Rotating Dual-JWT with HttpOnly SameSite cookies |

---

## 🏛️ System Architecture

PackWise utilizes a decoupled client-gateway topology optimized for sub-15ms local interaction latency, intelligent AI orchestration, and deterministic remote reconciliation.

```mermaid
flowchart TD
    classDef clientStyle fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef serverStyle fill:#0f172a,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef aiStyle fill:#1e1b4b,stroke:#a855f7,stroke-width:2px,color:#f8fafc;
    classDef extStyle fill:#022c22,stroke:#10b981,stroke-width:2px,color:#f8fafc;

    subgraph ClientLayer["1. Client Layer · Universal Cross-Platform"]
        WebClient["React 19 Web App\n(Vite 6 + Tailwind v4 + Framer Motion)"]:::clientStyle
        PWAServiceWorker["Service Worker Cache\n(Workbox Offline Shell)"]:::clientStyle
        MobileApp["Native Apps\n(Capacitor 8 iOS/Android + Expo)"]:::clientStyle
        DexieDB[("Dexie.js IndexedDB\nLocal-First Store")]:::clientStyle
        SyncEngine["Sync Mutation Queue\n(Idempotent Action Log)"]:::clientStyle
        
        WebClient <--> DexieDB
        MobileApp <--> DexieDB
        WebClient --- PWAServiceWorker
        DexieDB <--> SyncEngine
    end

    subgraph GatewayLayer["2. Gateway Layer · Hardened Node.js & Express"]
        SecurityShield["Security Perimeter\n(Helmet, Mongo-Sanitize, HPP, CORS)"]:::serverStyle
        AuthService["Auth & Token Service\n(Rotating JWT + HttpOnly Cookies)"]:::serverStyle
        RateLimiter["Adaptive Rate Limiter\n(Express-Rate-Limit)"]:::serverStyle
        Controllers["Core API Controllers\n(Trips, Budgets, Flights, Weather)"]:::serverStyle
        DocEngine["Document Exporter\n(Streaming PDFKit & DOCX)"]:::serverStyle
        
        SecurityShield --> RateLimiter --> AuthService --> Controllers
        Controllers --> DocEngine
    end

    subgraph AIRoutingLayer["3. Multi-LLM Orchestrator · Self-Healing AIRouter"]
        RouterEngine{"Task Classifier &\nLatency Evaluator"}:::aiStyle
        GeminiPrimary["Google Gemini 2.5 Flash\n(Primary: Structured JSON Planning)"]:::aiStyle
        GroqFast["Groq Llama 3 / OSS 120B\n(Primary: Low-Latency Streaming)"]:::aiStyle
        OpenAIFallback["OpenAI GPT-4o / Sol\n(Secondary Fallback)"]:::aiStyle
        MistralFallback["Mistral Large\n(Tertiary Fallback)"]:::aiStyle
        OpenRouterPool["OpenRouter Distributed Pool\n(Emergency Cluster Fallback)"]:::aiStyle

        RouterEngine -->|Planning / JSON| GeminiPrimary
        RouterEngine -->|Conversational Chat| GroqFast
        GeminiPrimary -.->|On 429/5xx| GroqFast
        GroqFast -.->|Failover| OpenAIFallback
        OpenAIFallback -.->|Failover| MistralFallback
        MistralFallback -.->|Failover| OpenRouterPool
    end

    subgraph ExternalTelemetry["4. Persistent State & Real-Time APIs"]
        MongoDB[("MongoDB Atlas\nPrimary Document Store")]:::extStyle
        WeatherAPI["OpenWeatherMap\nLive Atmospheric Telemetry"]:::extStyle
        AviationAPI["AviationStack Radar\nLive Flight Price Tracking"]:::extStyle
        MediaPool["Unsplash / Pexels / Pixabay\nMulti-Key Dynamic Image Rotation"]:::extStyle
        DispatchAPI["Brevo Email & Twilio SMS\nScheduled Push Notifications"]:::extStyle
    end

    SyncEngine <==>|Bi-directional Sync on Online Event| GatewayLayer
    Controllers --> AIRoutingLayer
    Controllers --> MongoDB
    Controllers --> WeatherAPI
    Controllers --> AviationAPI
    Controllers --> MediaPool
    Controllers --> DispatchAPI
```

---

## 💎 Core Engineering Highlights

### 1. 📶 Offline-First Synchronization Engine
- **Zero-Latency Interactions**: Every state mutation (trip creation, expense logging, packing checklist updates) commits immediately to the client's local **Dexie.js (IndexedDB)** instance.
- **Ordered Mutation Queue**: Offline transactions are assigned an idempotency hash and appended to an atomic queue.
- **Automatic Reconnection Reconciliation**: When the client regains network connection, the synchronization manager dispatches a batch reconciliation payload to `/api/trips/sync`, resolving conflicts using deterministic server timestamps and updating MongoDB Atlas atomically.

```mermaid
sequenceDiagram
    autonumber
    actor Traveler as ✈️ Traveler
    participant UI as React 19 Frontend
    participant DB as Dexie.js (IndexedDB)
    participant Worker as Sync Worker
    participant API as Express API Gateway
    participant Cloud as MongoDB Atlas

    Traveler->>UI: Adds expense / edits itinerary (Offline in flight)
    UI->>DB: Instant local write to IndexedDB
    UI->>DB: Push operation to `offlineSyncQueue`
    UI-->>Traveler: Render optimistic state at 60 FPS (Zero lag)
    
    Note over Traveler,API: Airplane lands · Network connection restored
    Worker->>Worker: Detect `window.online` event
    Worker->>DB: Retrieve queued mutation operations
    Worker->>API: POST /api/trips/sync (Batch payload)
    API->>Cloud: Atomic upsert with version checks
    Cloud-->>API: Persisted state confirmation
    API-->>Worker: 200 OK (Reconciled documents)
    Worker->>DB: Purge processed mutation queue
    Worker->>UI: Emit state update badge (Synced)
```

---

### 2. 🧠 Multi-Provider AI Routing Matrix
PackWise eliminates vendor lock-in and API outage risks through an autonomous task classifier and dynamic circuit breaker:

| Tier | Provider | Model ID | Primary Responsibility | SLA Latency |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1 (Planning)** | Google Gemini | `gemini-2.5-flash` | Strict Schema Itineraries, Activity Geo-Tagging | ~850ms |
| **Tier 1 (Chat)** | Groq Cloud | `openai/gpt-oss-120b` | Real-time conversational streaming assistant | ~280ms |
| **Tier 2 (Fallback)** | OpenAI | `gpt-4o` | Complex reasoning fallback & validation | ~1100ms |
| **Tier 3 (Fallback)** | Mistral AI | `mistral-large-latest` | Multilingual localization & cultural notes | ~950ms |
| **Tier 4 (Emergency)** | OpenRouter | `meta-llama/llama-3.3-70b` | Distributed failover cluster | ~1400ms |

---

### 3. 🌐 3D Spatial Maps & Interactive Canvas
- **Three.js & React-Globe.gl**: Interactive 3D globe visualization rendering global flight paths, destination coordinates, and day-night orbital terminators.
- **MapLibre GL & Leaflet Integration**: High-density satellite and street vector maps with customized dark-mode Carto tiles and smooth marker zooming.
- **Spline 3D Scene Runtime**: Embedded 3D interactive assets with gesture and scroll-linked micro-animations.

---

### 4. 🛡️ Enterprise Security Architecture
- **Dual-Token Refresh Security**: Access tokens (15-minute expiry) paired with rotating refresh tokens (7-day expiry) stored exclusively inside `HttpOnly`, `SameSite=Strict`, `Secure` cookies.
- **Defense-in-Depth Middleware**:
  - `helmet`: Comprehensive Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), and X-Frame-Options.
  - `express-mongo-sanitize`: Eliminates NoSQL injection vectors by sanitizing user-supplied payload keys.
  - `hpp`: Protects against HTTP Parameter Pollution attacks.
  - `express-rate-limit`: Per-IP throttling on authentication, trip generation, and notification dispatches.

---

### 5. 🌐 3D Spatial Canvas & Dynamic Travel Intelligence
PackWise integrates hardware-accelerated 3D spatial computing powered by Three.js and MapLibre GL dark vector tiles:

- **60 FPS Hardware Acceleration**: GPU-optimized spatial rendering decoupled from main-thread state logic for jitter-free mobile exploration.
- **Transcontinental Great-Circle Paths**: Dynamic vector curves rendering global flight trajectories with spring physics and interactive destination telemetry.
- **In-Flight Zero-Packet Autonomy**: Local Dexie.js (IndexedDB) commits mutations in < 4ms even at 38,000 feet without network connectivity.

---

## 📁 Monorepo Structure

```text
packwise/
├── client/                     # Web Frontend & Hybrid Native Container
│   ├── src/
│   │   ├── components/         # Modular Atomic UI (Widgets, 3D Canvas, Navigation)
│   │   ├── contexts/           # AuthContext, TripContext (Dexie integrated)
│   │   ├── db/                 # Dexie.js IndexedDB schema & sync stores
│   │   ├── hooks/              # Custom reactive hooks (useLiveApis, useDestinationImage)
│   │   └── utils/              # CostEngine, currency localizers, PDFKit streaming
│   ├── public/                 # PWA icons, WebGL assets, Web Manifest
│   ├── capacitor.config.json   # Native iOS & Android runtime container config
│   └── vite.config.js          # Optimized Rollup chunking & PWA service worker
├── server/                     # Backend API & Autonomous Orchestration Gateway
│   ├── config/                 # Database, security policies, and environment config
│   ├── controllers/            # Trip, Auth, SMS, Weather, Image controllers
│   ├── middleware/             # Rate limit, JWT verification, security boundaries
│   ├── models/                 # Mongoose schemas (Trip, User, Notification)
│   ├── routes/                 # Express API REST endpoints
│   ├── services/
│   │   ├── ai/                 # AIRouter, ProviderManager, Multi-LLM failover chains
│   │   ├── token.service.js    # Dual JWT access/refresh token rotation engine
│   │   └── tripScore.service.js# Weather and contextual itinerary scoring
│   └── server.js               # Entry point with health checks and graceful shutdown
├── packwise-mobile/            # Companion React Native Expo Application
│   ├── src/
│   │   ├── app/                # Expo Router file-based screen routes
│   │   ├── components/         # Reanimated cards, glassmorphic HUDs, Holographic passes
│   │   └── store/              # Zustand state management
│   └── app.json                # Expo mobile manifest
└── .github/                    # Continuous Integration & Repository Governance
    ├── workflows/ci.yml        # Automated build & syntax validation pipeline
    ├── dependabot.yml          # Automated weekly dependency security scans
    └── assets/                 # High-resolution 3D icons, banners, and preview comps
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/packwise`) or MongoDB Atlas URI

### 1. Clone Repository
```bash
git clone https://github.com/Thranae/packwise.git
cd packwise
```

### 2. Install Monorepo Dependencies
Install all client and server dependencies with a single command:
```bash
npm run install:all
```

### 3. Environment Configuration
Set up your local environment files:

```bash
# Server configuration
cp server/.env.example server/.env

# Client configuration
cp .env.example client/.env
```

Populate the required credentials in `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/packwise
JWT_SECRET=your_super_secret_jwt_access_key
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Launch Full Stack Development Servers
Run both backend API and Vite client concurrently:
```bash
npm run dev
```

- Web Application: [http://localhost:5173](http://localhost:5173)
- API Gateway: [http://localhost:5000](http://localhost:5000)

---

## 📱 Mobile Platform Execution

### Native iOS & Android (Capacitor 8)
```bash
cd client
npm run build
npx cap sync
npx cap open android   # Launches Android Studio
npx cap open ios       # Launches Xcode (macOS required)
```

### Universal React Native (Expo)
```bash
cd packwise-mobile
npm install
npx expo start
```

---

## 📡 REST API Specification

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Registers a new traveler and issues HttpOnly refresh cookie |
| `/api/auth/login` | `POST` | Public | Authenticates credentials and returns access token |
| `/api/auth/refresh` | `POST` | Public | Rotates refresh token and returns fresh access token |
| `/api/trips` | `GET` | Bearer | Retrieves paginated user itineraries |
| `/api/trips/generate` | `POST` | Bearer | Triggers multi-LLM autonomous trip generation |
| `/api/trips/sync` | `POST` | Bearer | Batch reconciliation for offline Dexie mutation logs |
| `/api/trips/:id/export/pdf` | `GET` | Bearer | Generates brand-styled PDF itinerary document |
| `/api/weather/forecast` | `GET` | Bearer | Fetches real-time destination weather telemetry |
| `/api/flights/track` | `POST` | Bearer | Initializes AviationStack live flight price monitor |

---

## 🤝 Contributing

Contributions to PackWise AI are welcome! Please review our [CONTRIBUTING.md](CONTRIBUTING.md) guide for details on our code of conduct, branch conventions, and pull request procedures.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

<div align="center">
  <sub>Architected & Engineered with precision by <b><a href="https://github.com/Thranae">Thranaeswanth S</a></b></sub>
  <br />
  <sub>Star ⭐ this repository if you find the engineering useful!</sub>
</div>
