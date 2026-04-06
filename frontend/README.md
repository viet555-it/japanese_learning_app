# 🎌 GoJapan — Frontend

React SPA for the GoJapan Japanese learning platform, built with Vite and Tailwind CSS v4.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | v19 | UI framework |
| **Vite** | v7 | Build tool & dev server |
| **Tailwind CSS** | v4 | Utility-first styling |
| **React Router** | v7 | Client-side routing |
| **Axios** | v1 | HTTP client for API calls |
| **Lucide React** | v0.577 | Icon library |
| **@react-oauth/google** | v0.12 | Google OAuth button |
| **react-facebook-login** | v4 | Facebook OAuth button |

---

## 📁 Directory Structure

```
frontend/
├── index.html                  ← HTML entry point (viewport meta, Google Fonts)
├── vite.config.js
├── tailwind.config.js
├── .env                        ← Environment variables (not committed)
└── src/
    ├── main.jsx                ← App mount with context providers
    ├── App.jsx                 ← Root router — separates training from main layout
    ├── index.css               ← Global CSS: theme variables, base reset, animations
    │
    ├── api/
    │   ├── learningApi.js      ← Content, quiz, session, progress API calls
    │   └── feedbackApi.js      ← Feedback CRUD API calls
    │
    ├── assets/
    │   └── images/             ← logo.png, kanji-bg.png, wallpapers
    │
    ├── context/
    │   ├── AuthContext.jsx     ← Auth state: login, logout, register, token refresh
    │   └── PreferenceContext.jsx ← UI preferences: theme, wallpaper, font, sound, button color
    │
    ├── components/
    │   ├── common/
    │   │   └── ModeCard.jsx    ← Home page mode selector card (Kana/Vocab/Kanji)
    │   ├── effects/
    │   │   └── GlobalEffects.jsx ← Cursor trail, click particle effects
    │   └── layout/
    │       ├── MainLayout.jsx  ← Sidebar + main content area wrapper
    │       └── Sidebar.jsx     ← Desktop fixed sidebar + mobile hamburger drawer
    │
    └── pages/
        ├── Authentication/
        │   ├── LoginPage.jsx
        │   └── SignUpPage.jsx
        ├── Feedback/
        │   └── FeedbackPage.jsx     ← Submit form + community board tabs
        ├── Home/
        │   └── index.jsx            ← Landing page
        ├── Kana/
        │   └── index.jsx            ← Hiragana/Katakana row selector
        ├── Kanji/
        │   └── index.jsx            ← Kanji browser by JLPT level
        ├── Preferences/
        │   └── PreferencesPage.jsx  ← Theme, wallpaper, font, BGM, button color
        ├── Progress/
        │   ├── index.jsx            ← Tab container (Stats / Streak / Achievements)
        │   ├── Stats.jsx            ← Session stats with charts
        │   ├── Streak.jsx           ← Login streak calendar + stat cards
        │   └── Achievements.jsx     ← Achievement grid with XP system
        ├── Training/
        │   ├── TrainingSetup.jsx    ← Mode/difficulty/answer type configuration
        │   ├── TrainingPlay.jsx     ← Active quiz screen (no-scroll, full viewport)
        │   └── TrainingStats.jsx    ← Post-session results screen
        └── Vocab/
            └── index.jsx            ← Vocabulary browser by JLPT level
```

---

## ⚙️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

### 3. Run Development Server

```bash
npm run dev
# App available at http://localhost:5173
```

### 4. Build for Production

```bash
npm run build
# Output in dist/
```

---

## 🧭 Routing Structure

```
/                   → Home (public landing page)
/login              → Login (guest only)
/register           → Sign Up (guest only)

── Protected (requires login) ──────────────────
/kana               → Kana study page
/vocab              → Vocabulary browser
/kanji              → Kanji browser
/progress           → Progress hub (Stats / Streak / Achievements)
/preferences        → App preferences
/feedback           → Community feedback board

── Training (protected, rendered outside MainLayout) ──
/training/setup     → Training configuration
/training/play      → Active quiz (full-screen, no scroll)
/training/stats     → Session results
```

> **Note:** Training routes (`/training/*`) are intentionally rendered **outside** `MainLayout` to provide a true full-screen, no-sidebar, no-scroll quiz experience on all devices.

---

## 🎨 Theme System

Themes are managed via CSS custom properties set on `<html>` by `PreferenceContext`:

```css
--bg-color       /* Page background */
--text-color     /* Primary text */
--accent-color   /* Highlight / active color */
--button-color   /* Button accent (customizable separately) */
```

**Available themes:** Light, Dark (default), Sapphire Bloom, Monkeytype, Temple Mist, Moonlit Bay, Emerald Forest, Shrine Stone, Sakura Pink, Vending Glow.

---

## 📱 Responsive Design

| Breakpoint | Behaviour |
|---|---|
| **Mobile < 768px** | hamburger topbar, sidebar slides in as drawer overlay |
| **Tablet 768–1024px** | sidebar visible, reduced padding |
| **Desktop > 1024px** | full fixed sidebar, multi-column layouts |

Key responsive patterns used throughout:
- `px-4 md:px-8 lg:px-16` — padding scaling
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — responsive grids
- `flex-col sm:flex-row` — vertical → horizontal stacking
- `hidden sm:inline` — selective label visibility
- `h-dvh` — dynamic viewport height for quiz screen

---

## 🌐 Context Providers

### `AuthContext`
- `isAuthenticated`, `user`, `loading`
- `login(credentials)`, `register(data)`, `logout()`
- Auto-refreshes access tokens on API 401 responses

### `PreferenceContext`
- `theme`, `setTheme(name)`
- `bgWallpaper`, `setBgWallpaper(url)`
- `fontStyle`, `setFontStyle(name)`
- `buttonColor`, `setButtonColor(hex)`
- `soundEnabled`, `setSoundEnabled(bool)`
- Persisted to `localStorage`
